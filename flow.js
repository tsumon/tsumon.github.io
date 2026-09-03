/* ============================================================
   ch11 全链路回放 — 一个 token 从头到尾的旅程
   Canvas 纵向管线：单列方块自下而上，依次点亮并流动。
   右侧 detail 面板逐步同步说明与公式。
   纯本地计算，无依赖。
   ============================================================ */
'use strict';

(function flow() {
  const stage = document.getElementById('flowStage');
  const cv = document.getElementById('flowCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  function css(n) { return getComputedStyle(document.body).getPropertyValue(n).trim(); }

  // ---- 模型定义：y 自下而上，0 是 Token ID，往上到 Softmax ----
  const STEPS = [
    { id: 'tok',  name: 'Token ID',        tag: 'INPUT',     shape: '[8]',
      color: () => css('--serieB'),
      desc: '一句话被分词器切成 8 个 token，每个是词表里的一个整数下标。',
      math: 'x \\in \\{0,1,\\dots,V-1\\}^{8}' },
    { id: 'emb',  name: 'Token 嵌入',      tag: 'EMBEDDING', shape: '[8, 768]',
      color: () => css('--serieB'),
      desc: '用 token id 去嵌入矩阵查行，得到词向量。一张表存着全部词的坐标。',
      math: 'h^{(0)}_i = E_{x_i}' },
    { id: 'pos',  name: '位置编码',        tag: 'POSITION',  shape: '[8, 768]',
      color: () => css('--dim'),
      desc: 'RoPE 把位置编成旋转作用在 Q/K 上，让注意力只依赖相对距离。',
      math: '\\langle R_m q, R_n k \\rangle = \\text{Re}[q^*k\\,e^{i(m-n)\\theta}]' },
    { id: 'attn', name: '自注意力',        tag: 'ATTENTION', shape: '[8, 768]',
      color: () => css('--accent'),
      desc: '每个 token 对所有 token 按注意力权重加权取走信息。这是 token 交换信息的唯一地方。',
      math: '\\text{Attn}(Q,K,V)=\\text{softmax}\\big(\\tfrac{QK^{\\top}}{\\sqrt{d_k}}\\big)V' },
    { id: 'ffn',  name: '前馈网络',        tag: 'FFN',       shape: '[8, 3072] → [8, 768]',
      color: () => '#4fb8e8',
      desc: '升维、激活、降维。每个 token 独立处理、彼此不交流。参数量的大头在这。',
      math: 'F = \\text{SwiGLU}(hW_1+b_1)\\,W_2+b_2' },
    { id: 'res',  name: '残差相加',        tag: 'RESIDUAL',  shape: '[8, 768]',
      color: () => css('--dim'),
      desc: '输出 = 输入 + 子层输出。这条捷径让几十层网络训得动。',
      math: 'h \\leftarrow h + \\text{Attn}(\\text{LN}(h))' },
    { id: 'out',  name: '输出投影',        tag: 'OUTPUT',    shape: '[8, 50257]',
      color: () => css('--serieB'),
      desc: '映射到整个词表，得到每个位置上每个候选词的分数。',
      math: 'z = h^{(L)} E^{\\top}' },
    { id: 'sm',   name: 'Softmax → 下一个词', tag: 'PROB',   shape: '[8, 50257]',
      color: () => css('--accent'),
      desc: '变成概率分布。取最后一行，就是下一个词是什么的预测。',
      math: 'p(x_{t+1}\\mid x_{\\le t})=\\text{softmax}(z_t / T)' }
  ];

  // ---- 相机（二维斜投影，简单透视）----
  const cam = { yaw: -0.55, pitch: 0.18, dist: 26, f: 640, cy: 3.5 };
  let running = false, flowIdx = -1, flowT = 0, rafId = null;

  // ---- 几何 ----
  function proj(x, y, z) {
    const cyw = Math.cos(cam.yaw), syw = Math.sin(cam.yaw);
    const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw;
    const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const yy = y - cam.cy;                    // 旋转基于模型中心，保证屏幕垂直居中
    const r1 = yy * cp - z1 * sp, r2 = yy * sp + z1 * cp;
    const d = r2 + cam.dist;
    if (d < 0.4) return null;
    const f = cam.f / d;
    return { x: cv.width / 2 + x1 * f, y: cv.height / 2 - r1 * f, d };
  }

  // ---- 模型块在纵轴上的布局：y 范围 0..7，均匀分布 ----
  const BLK = { h: 0.5, d: 2.2 };
  function blockY(i) { return i; }   // 0..7

  function draw() {
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = css('--bg-2') || '#f7f3ec';
    ctx.fillRect(0, 0, W, H);

    // 画所有块（从远到近用 painter's algorithm）
    const quads = [];
    STEPS.forEach((s, i) => {
      const y = blockY(i);
      const w = (s.id === 'ffn') ? 3.4 : 2.0;
      const hw = w / 2, hh = BLK.h / 2, hd = BLK.d / 2;
      const cs = [
        proj(-hw, y - hh, -hd), proj(hw, y - hh, -hd), proj(hw, y - hh, hd), proj(-hw, y - hh, hd),
        proj(-hw, y + hh, -hd), proj(hw, y + hh, -hd), proj(hw, y + hh, hd), proj(-hw, y + hh, hd)
      ];
      if (cs.some(c => !c)) return;
      const isOn = i <= flowIdx;
      const rgb = hexToRgb(s.color());
      const FACES = [
        { i: [0,1,2,3], s: 0.5, n: 'bot' }, { i: [4,5,6,7], s: 1.0, n: 'top' },
        { i: [0,1,5,4], s: 0.78, n: 'front' }, { i: [2,3,7,6], s: 0.6, n: 'back' },
        { i: [1,2,6,5], s: 0.9, n: 'right' }, { i: [3,0,4,7], s: 0.55, n: 'left' }
      ];
      FACES.forEach(face => {
        const p = face.i.map(idx => cs[idx]);
        let area = 0;
        for (let k = 0; k < p.length; k++) { const q = p[(k+1)%p.length]; area += p[k].x*q.y - q.x*p[k].y; }
        if (area >= 0) return;
        const d = face.i.reduce((a,idx)=>a+cs[idx].d,0)/4;
        quads.push({ p, d, rgb, isOn, s: face.s, n: face.n });
      });
      // 块标签（始终显示；未点亮用灰色）
      const e = proj(hw + 0.35, y, 0);
      if (e) {
        const on = i <= flowIdx;
        ctx.fillStyle = on ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : (css('--faint') || '#b7ada2');
        ctx.font = '12px ' + (css('--sans') || 'sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText(s.name, e.x + 6, e.y + 4);
      }
    });

    quads.sort((a, z) => z.d - a.d);
    quads.forEach(q => {
      const c = q.rgb.map(v => Math.round(v * q.s));
      const a = q.isOn ? 0.94 : 0.25;
      ctx.beginPath();
      ctx.moveTo(q.p[0].x, q.p[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(q.p[i].x, q.p[i].y);
      ctx.closePath();
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
      ctx.fill();
      ctx.strokeStyle = q.isOn ? `rgba(${c[0]},${c[1]},${c[2]},1)` : 'rgba(0,0,0,.12)';
      ctx.lineWidth = q.isOn ? 1.4 : 0.6;
      ctx.stroke();
      if (q.n === 'top' && q.isOn) drawCells(q.p);
    });

    // 流动粒子（从当前块向下一个块）
    if (running && flowIdx >= 0 && flowIdx < STEPS.length - 1) {
      const from = blockY(flowIdx), to = blockY(flowIdx + 1);
      const A = proj(0, from, 0), B = proj(0, to, 0);
      if (A && B) {
        const rgb = hexToRgb(STEPS[flowIdx+1].color());
        const N = 7;
        for (let s = 0; s < N; s++) {
          let t = ((Math.min(flowT/0.8,1)*1.15) - s/N) % 1; if (t<0) t+=1;
          const x = A.x + (B.x-A.x)*t, y = A.y + (B.y-A.y)*t;
          const r = 2 + 2.4*Math.sin(t*Math.PI);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.12+0.88*Math.sin(t*Math.PI)})`;
          ctx.fill();
        }
      }
    }
  }

  function drawCells(p) {
    const [rows, cols] = [1, 3];
    ctx.save();
    ctx.beginPath(); ctx.moveTo(p[0].x,p[0].y);
    for (let i=1;i<4;i++) ctx.lineTo(p[i].x,p[i].y);
    ctx.closePath(); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 0.6;
    for (let i=1;i<cols;i++) {
      const t=i/cols;
      const A={x:p[0].x+(p[1].x-p[0].x)*t,y:p[0].y+(p[1].y-p[0].y)*t};
      const Bp={x:p[3].x+(p[2].x-p[3].x)*t,y:p[3].y+(p[2].y-p[3].y)*t};
      ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(Bp.x,Bp.y); ctx.stroke();
    }
    ctx.restore();
  }

  function hexToRgb(h) {
    const s = String(h || '#888').trim();
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);
    return m ? [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)] : [136,136,136];
  }

  // ---- detail ----
  function showDetail(idx) {
    const s = STEPS[idx];
    const el = document.getElementById('flowDetail');
    if (!el || !s) return;
    el.innerHTML = `
      <div class="flow-tag">${s.tag} · 第 ${idx+1} / ${STEPS.length} 站</div>
      <div class="flow-name">${s.name}</div>
      <div class="flow-shape">${s.shape}</div>
      <p class="flow-desc">${s.desc}</p>
      <div class="flow-step"></div>`;
    if (window.katex) {
      try { katex.render(s.math, el.querySelector('.flow-step'), { displayMode: true, throwOnError: false }); }
      catch (e) { el.querySelector('.flow-step').textContent = s.math; }
    } else el.querySelector('.flow-step').textContent = s.math;
  }

  // ---- 交互：拖拽旋转 + 滚轮缩放 ----
  let drag = null;
  stage.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, y: e.clientY, yaw: cam.yaw, pitch: cam.pitch, moved: 0 };
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('dragging');
  });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    cam.yaw = drag.yaw + dx * .008;
    cam.pitch = Math.max(-.35, Math.min(1.05, drag.pitch + dy * .006));
    draw();
  });
  stage.addEventListener('pointerup', () => {
    drag = null;
    stage.classList.remove('dragging');
  });
  stage.addEventListener('wheel', e => {
    e.preventDefault();
    cam.dist = Math.max(12, Math.min(70, cam.dist + e.deltaY * .04));
    draw();
  }, { passive: false });

  // ---- 动画 ----
  function reset() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    running = false; flowIdx = -1; flowT = 0;
    cam.yaw = -0.55; cam.pitch = 0.18;
    // 复位时重新自动取景
    autoView();
    draw();
    const el = document.getElementById('flowDetail');
    if (el) el.innerHTML = `
      <div class="flow-tag">START</div>
      <div class="flow-name">准备就绪</div>
      <div class="flow-shape">[8] → [8, 768]</div>
      <p class="flow-desc">点「重走一遍」开始。每一步都是前面某一章里见过的那块砖。</p>`;
  }

  function start() {
    if (rafId) cancelAnimationFrame(rafId);
    running = true; flowIdx = -1; flowT = 0;
    const STEP = 0.8;
    let last = performance.now();
    function frame(now) {
      const dt = (now - last) / 1000; last = now;
      if (flowIdx < STEPS.length - 1) {
        flowT += dt;
        if (flowT >= STEP) { flowT = 0; flowIdx++; showDetail(flowIdx); }
        draw();
        requestAnimationFrame(frame);
      } else { running = false; draw(); }
    }
    flowIdx = 0; showDetail(0);
    draw();
    requestAnimationFrame(frame);
  }

  const runBtn = document.getElementById('flowRun');
  const resetBtn = document.getElementById('flowReset');
  if (runBtn) runBtn.addEventListener('click', start);
  if (resetBtn) resetBtn.addEventListener('click', reset);

  // ---- responsive ----
  function resize() {
    const r = stage.getBoundingClientRect();
    const w = Math.max(340, Math.round(r.width));
    const h = Math.max(300, Math.round(r.height));
    cv.width = w; cv.height = h;
    autoView();
    draw();
  }
  function autoView() {
    // 自动取景：扫描 dist 让模型高度 ≈ 画布 78%
    const targetH = cv.height * 0.78;
    function measHeight(d) {
      cam.dist = d;
      let minY = Infinity, maxY = -Infinity;
      STEPS.forEach((s, i) => {
        const y = blockY(i);
        [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sz])=>{
          const p = proj(sx*1.2, y + BLK.h/2, sz*BLK.d/2);
          if (p){ if(p.y<minY)minY=p.y; if(p.y>maxY)maxY=p.y; }
          const p2 = proj(sx*1.2, y - BLK.h/2, sz*BLK.d/2);
          if (p2){ if(p2.y<minY)minY=p2.y; if(p2.y>maxY)maxY=p2.y; }
        });
      });
      return maxY - minY;
    }
    let best = 26, bestErr = Infinity;
    for (let d = 12; d <= 50; d += 0.5) {
      const hh = measHeight(d); const err = Math.abs(hh - targetH);
      if (err < bestErr) { bestErr = err; best = d; }
    }
    cam.dist = best;
  }
  new ResizeObserver(resize).observe(stage);
  document.addEventListener('themechange', () => draw());

  showDetail(-1);
  reset();
})();
