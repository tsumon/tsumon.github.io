/* ============================================================
   3D Transformer walkthrough
   Custom perspective renderer on canvas 2D. No dependencies.
   Painter's algorithm + screen-space backface culling.
   ============================================================ */
'use strict';

(function viz3d() {
  const stage = document.getElementById('v3stage');
  const cv = document.getElementById('v3canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  /* ---------- theme-aware palette ---------- */
  function css(v) { return getComputedStyle(document.body).getPropertyValue(v).trim(); }
  let P = {};
  function readTheme() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    P = {
      bg: css('--bg-2'),
      line: css('--line'),
      text: css('--text'),
      dim: css('--dim'),
      faint: css('--faint'),
      light,
      groups: {
        io:    light ? [180, 170, 154] : [150, 138, 120],   // 暖灰 · 输入输出
        attn:  light ? [156, 74, 47]   : [199, 134, 74],    // 茶红 · 注意力
        ffn:   light ? [68, 148, 174]  : [79, 184, 232],    // 蓝 · 前馈
        norm:  light ? [190, 183, 172] : [120, 111, 99]     // 中性 · 归一化残差
      }
    };
  }
  readTheme();

  /* ---------- model definition ---------- */
  const SEQ = 8;
  const B = (id, y, w, opt = {}) => Object.assign({
    id, y, w, d: 2.6, h: 0.4, x: 0, g: 'io', cells: [SEQ, 8]
  }, opt);

  const BLOCKS = [
    B('tok', 0, 1.1, { g: 'io', d: 2.6, h: 0.5, cells: [SEQ, 1],
      name: 'Token ID', tag: 'INPUT', shape: '[8]',
      desc: '一句话被分词器切成 8 个 token，每个 token 是词表里的一个整数下标。这是模型唯一的输入。',
      math: 'x \\in \\{0,1,\\dots,V-1\\}^{8}' }),

    B('emb', 1.5, 7.0, { g: 'io',
      name: 'Token 嵌入', tag: 'EMBEDDING', shape: '[8, 768]',
      desc: '拿 token id 去嵌入矩阵里查行。50257 × 768 的大表，每一行就是那个词的向量。这张表是训练出来的参数。',
      math: 'E \\in \\mathbb{R}^{V \\times d},\\quad h^{(0)}_i = E_{x_i}' }),

    B('pos', 2.6, 7.0, { g: 'io',
      name: '位置编码', tag: 'POSITION', shape: '[8, 768]',
      desc: '注意力本身对顺序无感。RoPE 把位置编成旋转矩阵作用在 Q 和 K 上，让点积只依赖相对距离 m-n。',
      math: '\\langle R_m q, R_n k \\rangle = \\text{Re}\\big[q^{*} k\\, e^{i(m-n)\\theta}\\big]' }),

    B('ln1', 4.2, 7.0, { g: 'norm', h: 0.28,
      name: 'LayerNorm', tag: 'NORM', shape: '[8, 768]',
      desc: '对每个 token 的 768 个数做归一化，均值 0 方差 1，再用可学习的 γ 和 β 缩放回来。Pre-LN 放在子层之前，训练更稳。',
      math: '\\text{LN}(h)=\\gamma \\odot \\frac{h-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta' }),

    B('q', 5.5, 2.0, { g: 'attn', x: -2.7, d: 2.6,
      name: 'Query', tag: 'ATTENTION', shape: '[8, 64] × 12 头',
      desc: '「我在找什么」。每个头有自己的 W_q，把 768 维投影到 64 维。12 个头并行，各自关注不同模式。',
      math: 'Q = h W_q,\\quad W_q \\in \\mathbb{R}^{768 \\times 64}' }),
    B('k', 5.5, 2.0, { g: 'attn', x: 0, d: 2.6,
      name: 'Key', tag: 'ATTENTION', shape: '[8, 64] × 12 头',
      desc: '「我能提供什么」。和 Query 做点积决定匹配度。',
      math: 'K = h W_k' }),
    B('v', 5.5, 2.0, { g: 'attn', x: 2.7, d: 2.6,
      name: 'Value', tag: 'ATTENTION', shape: '[8, 64] × 12 头',
      desc: '「我携带的实际内容」。最后按注意力权重被加权取走的就是它。',
      math: 'V = h W_v' }),

    B('score', 6.9, 2.6, { g: 'attn', d: 2.6, cells: [SEQ, SEQ],
      name: 'QKᵀ 打分', tag: 'ATTENTION', shape: '[8, 8]',
      desc: '每个 Query 和所有 Key 做点积，得到方阵。除以 √d_k 防止维度变大时点积方差爆炸、把 softmax 推进饱和区。',
      math: 'S = \\frac{QK^{\\top}}{\\sqrt{d_k}},\\quad d_k = 64' }),

    B('mask', 7.9, 2.6, { g: 'attn', d: 2.6, cells: [SEQ, SEQ], tri: true,
      name: '因果掩码 + Softmax', tag: 'ATTENTION', shape: '[8, 8]',
      desc: '右上三角置成负无穷，softmax 后变 0，保证第 i 个 token 看不到未来。逐行归一化后每行加起来等于 1。',
      math: 'A_{ij}=\\frac{\\exp(S_{ij})}{\\sum_{j\\le i}\\exp(S_{ij})},\\ \\ A_{ij}=0\\ (j>i)' }),

    B('av', 9.1, 2.0, { g: 'attn', d: 2.6,
      name: '加权求和 A·V', tag: 'ATTENTION', shape: '[8, 64] × 12 头',
      desc: '用权重矩阵去加权所有 Value。每个 token 得到一个融合了上下文的新表示。这是注意力唯一让 token 之间交换信息的地方。',
      math: '\\text{head}_h = A_h V_h' }),

    B('wo', 10.2, 7.0, { g: 'attn',
      name: '多头拼接 + W_o', tag: 'ATTENTION', shape: '[8, 768]',
      desc: '12 个头各 64 维拼回 768 维，再过一个输出投影矩阵融合。至此注意力子层结束。',
      math: '\\text{MHA}=\\text{Concat}(\\text{head}_1,\\dots,\\text{head}_{12})\\,W_o' }),

    B('res1', 11.3, 7.0, { g: 'norm', h: 0.24,
      name: '残差相加', tag: 'RESIDUAL', shape: '[8, 768]',
      desc: '输出 = 输入 + 子层输出。这条捷径让梯度能跨层直达，是几十层网络训得动的关键。求导时 ∂(x+F)/∂x = 1 + ∂F/∂x，那个 1 保证梯度不会连乘衰减到 0。',
      math: 'h \\leftarrow h + \\text{MHA}(\\text{LN}(h))' }),

    B('ln2', 12.6, 7.0, { g: 'norm', h: 0.28,
      name: 'LayerNorm', tag: 'NORM', shape: '[8, 768]',
      desc: '进入前馈层前再归一化一次。',
      math: '\\text{LN}(h)' }),

    B('ffup', 13.8, 11.0, { g: 'ffn', cells: [SEQ, 14],
      name: '前馈升维', tag: 'FFN', shape: '[8, 3072]',
      desc: '升到 4 倍宽。每个 token 独立处理，彼此不交流。参数量的大头在这里，通常占全模型约三分之二。',
      math: 'u = h W_1 + b_1,\\quad W_1 \\in \\mathbb{R}^{768 \\times 3072}' }),

    B('act', 14.9, 11.0, { g: 'ffn', h: 0.24, cells: [SEQ, 14],
      name: 'SwiGLU 激活', tag: 'FFN', shape: '[8, 3072]',
      desc: '非线性弯折。现代模型用 SwiGLU 取代 ReLU，用一个门控分支乘上主分支，实测收敛更快。',
      math: '\\text{SwiGLU}(u)=\\big(u W_a \\odot \\sigma(u W_a)\\big) \\odot u W_b' }),

    B('ffdown', 16.0, 7.0, { g: 'ffn',
      name: '前馈降维', tag: 'FFN', shape: '[8, 768]',
      desc: '压回 768 维，和残差流对齐。',
      math: 'F = \\text{SwiGLU}(u)\\,W_2 + b_2' }),

    B('res2', 17.1, 7.0, { g: 'norm', h: 0.24,
      name: '残差相加', tag: 'RESIDUAL', shape: '[8, 768]',
      desc: '再次加回输入。到这里一个完整的 Transformer Block 结束，输出形状和输入完全一样，所以可以无限堆叠。',
      math: 'h \\leftarrow h + \\text{FFN}(\\text{LN}(h))' }),

    B('lnf', 19.2, 7.0, { g: 'norm', h: 0.28, repeatAfter: true,
      name: '最终 LayerNorm', tag: 'NORM', shape: '[8, 768]',
      desc: '所有层跑完后的最后一次归一化。',
      math: '\\text{LN}(h^{(L)})' }),

    B('unemb', 20.4, 13.0, { g: 'io', cells: [SEQ, 18],
      name: '输出投影', tag: 'OUTPUT', shape: '[8, 50257]',
      desc: '把 768 维映射到整个词表，得到每个位置上每个候选词的分数。通常和输入嵌入共享权重以省参数。',
      math: 'z = h^{(L)} E^{\\top},\\quad z \\in \\mathbb{R}^{8 \\times V}' }),

    B('sm', 21.6, 13.0, { g: 'io', h: 0.26, cells: [SEQ, 18],
      name: 'Softmax → 下一个词', tag: 'OUTPUT', shape: '[8, 50257]',
      desc: '变成概率分布。只取最后一个位置的那一行，就是「下一个词是什么」的预测。第 06 章讲怎么从中采样。',
      math: 'p(x_{t+1}\\mid x_{\\le t}) = \\text{softmax}(z_t / T)' })
  ];

  /* ---------- camera ---------- */
  const cam = { yaw: -0.62, pitch: 0.26, dist: 32, f: 700, cy: 10.8 };
  let sel = 'mask', flowIdx = -1, flowTimer = null, nLayer = 12;
  /* flow particles: 数据在相邻块之间流动的光点 */
  let flowPts = [], flowT = 0, flowPhase = 0, running = false;

  /* ---------- math ---------- */
  function rot(x, y, z) {
    const cyw = Math.cos(cam.yaw), syw = Math.sin(cam.yaw);
    const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw;
    const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
  }
  function proj(x, y, z) {
    const r = rot(x, y - cam.cy, z);
    const d = r[2] + cam.dist;
    if (d < 0.4) return null;
    const f = cam.f / d;
    return { x: cv.width / 2 + r[0] * f, y: cv.height / 2 - r[1] * f, d };
  }

  const FACES = [
    { i: [4, 5, 6, 7], n: 'top',   s: 1.00 },
    { i: [0, 1, 2, 3], n: 'bot',   s: 0.45 },
    { i: [0, 1, 5, 4], n: 'front', s: 0.74 },
    { i: [2, 3, 7, 6], n: 'back',  s: 0.62 },
    { i: [1, 2, 6, 5], n: 'right', s: 0.86 },
    { i: [3, 0, 4, 7], n: 'left',  s: 0.55 }
  ];

  function corners(b) {
    const hw = b.w / 2, hh = b.h / 2, hd = b.d / 2;
    return [
      [b.x - hw, b.y - hh, -hd], [b.x + hw, b.y - hh, -hd],
      [b.x + hw, b.y - hh,  hd], [b.x - hw, b.y - hh,  hd],
      [b.x - hw, b.y + hh, -hd], [b.x + hw, b.y + hh, -hd],
      [b.x + hw, b.y + hh,  hd], [b.x - hw, b.y + hh,  hd]
    ];
  }

  function area2(p) {
    let a = 0;
    for (let i = 0; i < p.length; i++) {
      const q = p[(i + 1) % p.length];
      a += p[i].x * q.y - q.x * p[i].y;
    }
    return a / 2;
  }
  function inPoly(pt, p) {
    let c = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      if ((p[i].y > pt.y) !== (p[j].y > pt.y) &&
          pt.x < (p[j].x - p[i].x) * (pt.y - p[i].y) / (p[j].y - p[i].y) + p[i].x) c = !c;
    }
    return c;
  }

  /* ---------- render ---------- */
  let picked = [];

  function draw() {
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);

    const quads = [];
    picked = [];

    BLOCKS.forEach((b, bi) => {
      const cs = corners(b).map(c => proj(c[0], c[1], c[2]));
      if (cs.some(c => !c)) return;
      const isSel = b.id === sel;
      const isFlow = flowIdx >= 0 && bi === flowIdx;
      const rgb = P.groups[b.g];
      const hitFaces = [];

      FACES.forEach(f => {
        const p = f.i.map(i => cs[i]);
        if (area2(p) >= 0) return;                       // backface cull
        const d = f.i.reduce((s, i) => s + cs[i].d, 0) / 4;
        quads.push({ p, d, b, f, rgb, isSel, isFlow, bi });
        hitFaces.push(p);
      });
      picked.push({ b, faces: hitFaces, d: cs.reduce((s, c) => s + c.d, 0) / 8 });
    });

    quads.sort((a, z) => z.d - a.d);

    quads.forEach(q => {
      const { p, rgb, f, isSel, isFlow, b } = q;
      let s = f.s;
      if (isSel) s = Math.min(1, s * 1.25);
      const a = isFlow ? 1 : isSel ? .96 : .8;
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(p[i].x, p[i].y);
      ctx.closePath();
      const c = rgb.map(v => Math.round(v * s));
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
      ctx.fill();

      ctx.strokeStyle = isSel || isFlow
        ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`
        : P.light ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.10)';
      ctx.lineWidth = isSel || isFlow ? 1.6 : .7;
      ctx.stroke();

      if (f.n === 'top' && b.cells) drawCells(p, b, c);
    });

    // labels
    // ---- data flow particles: 数据从一层流向下一层 ----
    if (running) {
      const fromB = BLOCKS[flowIdx - 1];
      const toB   = BLOCKS[flowIdx];
      if (fromB && toB) {
        const A = proj(fromB.x, fromB.y, 0);
        const B = proj(toB.x,   toB.y,   0);
        if (A && B) {
          // 沿路径绘制一串流动的圆点（用正弦产生拖尾感）
          const rgb = P.groups[toB.g];
          const N = 7;
          for (let s = 0; s < N; s++) {
            let t = ((Math.min(flowT / 0.9, 1) * 1.15) - s / N) % 1;
            if (t < 0) t += 1;
            const eaze = t;                       // 线性
            const x = A.x + (B.x - A.x) * eaze;
            const y = A.y + (B.y - A.y) * eaze;
            const r = 2 + 2.4 * Math.sin(t * Math.PI);   // 中间大两头小
            const alpha = 0.12 + 0.88 * Math.sin(t * Math.PI);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
            ctx.fill();
          }
          // 路径中线（细的发光引导线）
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},.28)`;
          ctx.lineWidth = 1.4;
          ctx.setLineDash([2, 6]);
          ctx.beginPath();
          ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // labels
    ctx.font = '11.5px ' + css('--mono');
    ctx.textAlign = 'left';
    BLOCKS.forEach(b => {
      const e = proj(b.x + b.w / 2 + 0.35, b.y, 0);
      if (!e) return;
      const on = b.id === sel;
      ctx.fillStyle = on ? `rgb(${P.groups[b.g].join(',')})` : P.faint;
      ctx.fillText(b.name + (on ? '' : ''), e.x + 6, e.y + 4);
    });

    // repeat bracket
    const r0 = BLOCKS.find(b => b.id === 'ln1'), r1 = BLOCKS.find(b => b.id === 'res2');
    const a0 = proj(-r0.w / 2 - 1.1, r0.y, 0), a1 = proj(-r1.w / 2 - 1.1, r1.y, 0);
    if (a0 && a1) {
      ctx.strokeStyle = P.line; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(a0.x + 12, a0.y); ctx.lineTo(a0.x, a0.y);
      ctx.lineTo(a1.x, a1.y); ctx.lineTo(a1.x + 12, a1.y);
      ctx.stroke();
      ctx.save();
      ctx.translate((a0.x + a1.x) / 2 - 8, (a0.y + a1.y) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = P.dim;
      ctx.font = '11px ' + css('--mono');
      ctx.fillText(`× ${nLayer} 层`, 0, 0);
      ctx.restore();
    }
  }

  function drawCells(p, b, c) {
    const [rows, cols] = b.cells;
    if (rows * cols > 400) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(p[i].x, p[i].y);
    ctx.closePath(); ctx.clip();
    ctx.strokeStyle = P.light ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.3)';
    ctx.lineWidth = .55;
    // p[0..3] = top face corners in order
    for (let i = 1; i < cols; i++) {
      const t = i / cols;
      const A = { x: p[0].x + (p[1].x - p[0].x) * t, y: p[0].y + (p[1].y - p[0].y) * t };
      const Bp = { x: p[3].x + (p[2].x - p[3].x) * t, y: p[3].y + (p[2].y - p[3].y) * t };
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(Bp.x, Bp.y); ctx.stroke();
    }
    for (let i = 1; i < rows; i++) {
      const t = i / rows;
      const A = { x: p[0].x + (p[3].x - p[0].x) * t, y: p[0].y + (p[3].y - p[0].y) * t };
      const Bp = { x: p[1].x + (p[2].x - p[1].x) * t, y: p[1].y + (p[2].y - p[1].y) * t };
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(Bp.x, Bp.y); ctx.stroke();
    }
    if (b.tri) {                                  // causal mask shading
      ctx.fillStyle = P.light ? 'rgba(255,255,255,.62)' : 'rgba(0,0,0,.55)';
      for (let r = 0; r < rows; r++) for (let cc = r + 1; cc < cols; cc++) {
        const u0 = cc / cols, u1 = (cc + 1) / cols, v0 = r / rows, v1 = (r + 1) / rows;
        const pt = (u, v) => ({
          x: p[0].x + (p[1].x - p[0].x) * u + (p[3].x - p[0].x) * v,
          y: p[0].y + (p[1].y - p[0].y) * u + (p[3].y - p[0].y) * v
        });
        const a = pt(u0, v0), bb = pt(u1, v0), c2 = pt(u1, v1), d2 = pt(u0, v1);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bb.x, bb.y);
        ctx.lineTo(c2.x, c2.y); ctx.lineTo(d2.x, d2.y); ctx.closePath(); ctx.fill();
      }
    }
    ctx.restore();
  }

  /* ---------- detail panel ---------- */
  function showDetail(id) {
    const b = BLOCKS.find(x => x.id === id);
    if (!b) return;
    const el = document.getElementById('v3detail');
    el.innerHTML = `
      <div class="v3-tag">${b.tag}</div>
      <div class="v3-name">${b.name}</div>
      <div class="v3-shape">${b.shape}</div>
      <p class="v3-desc">${b.desc}</p>
      <div class="v3-math" id="v3math"></div>`;
    if (window.katex) {
      try { katex.render(b.math, document.getElementById('v3math'), { displayMode: true, throwOnError: false }); }
      catch (e) { document.getElementById('v3math').textContent = b.math; }
    } else document.getElementById('v3math').textContent = b.math;
  }

  /* ---------- interaction ---------- */
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
  stage.addEventListener('pointerup', e => {
    const wasClick = drag && drag.moved < 6;
    drag = null;
    stage.classList.remove('dragging');
    if (!wasClick) return;
    const r = cv.getBoundingClientRect();
    const pt = { x: (e.clientX - r.left) / r.width * cv.width, y: (e.clientY - r.top) / r.height * cv.height };
    let best = null;
    picked.forEach(o => {
      if (o.faces.some(f => inPoly(pt, f)) && (!best || o.d < best.d)) best = o;
    });
    if (best) { sel = best.b.id; showDetail(sel); draw(); }
  });
  stage.addEventListener('wheel', e => {
    e.preventDefault();
    cam.dist = Math.max(16, Math.min(90, cam.dist + e.deltaY * .045));
    draw();
  }, { passive: false });

  document.getElementById('v3run').addEventListener('click', () => {
    clearInterval(flowTimer);
    running = true;
    flowIdx = 0;
    flowPhase = 0;
    flowT = 0;
    // 逐层点亮：每一帧推进 flowT，到达阈值后进入下一块
    const STEP = 0.9;   // 每块停留时长（秒）
    let last = performance.now();
    function frame(now) {
      const dt = (now - last) / 1000; last = now;
      if (flowIdx < BLOCKS.length) {
        flowT += dt;
        if (flowIdx > 0) {
          sel = BLOCKS[flowIdx].id;
          showDetail(sel);
          draw();
        } else {
          draw();
        }
        if (flowT >= STEP) {
          flowT = 0;
          flowIdx++;
          if (flowIdx >= BLOCKS.length) {
            running = false;
            draw();
            return;
          }
        }
      }
      if (running) requestAnimationFrame(frame);
      else draw();
    }
    sel = BLOCKS[0].id;
    showDetail(sel);
    draw();
    requestAnimationFrame(frame);
  });
  document.getElementById('v3reset').addEventListener('click', () => {
    clearInterval(flowTimer); flowIdx = -1; running = false;
    cam.yaw = -0.62; cam.pitch = 0.26;
    autoZoom();
    draw();
  });
  document.getElementById('v3layers').addEventListener('input', e => {
    nLayer = +e.target.value;
    document.getElementById('v3layersV').textContent = nLayer;
    draw();
  });

  /* ---------- responsive + theme ---------- */
  function measureHeight(d) {
    // 用给定 dist 计算所有块的角点投影 y 范围（模型实际屏幕高度）
    cam.dist = d;
    let minY = Infinity, maxY = -Infinity;
    BLOCKS.forEach(b => corners(b).forEach(c => {
      const p = proj(c[0], c[1], c[2]);
      if (p) { if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; }
    }));
    return maxY - minY;
  }
  function modelCenterY() {
    let minY = Infinity, maxY = -Infinity;
    BLOCKS.forEach(b => corners(b).forEach(c => {
      const p = proj(c[0], c[1], c[2]);
      if (p) { if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; }
    }));
    return (minY + maxY) / 2;
  }
  function autoZoom() {
    // ① 扫描 dist，让模型投影高度≈画布 82%（避免太大裁切/太小留白）
    const targetH = cv.height * 0.82;
    let best = 32, bestErr = Infinity;
    for (let d = 14; d <= 60; d += 0.5) {
      const h = measureHeight(d);
      const err = Math.abs(h - targetH);
      if (err < bestErr) { bestErr = err; best = d; }
    }
    cam.dist = best;
    // ② 垂直居中：迭代校正 cy，让模型投影中心落在画布中央
    const cp = Math.cos(cam.pitch);
    for (let it = 0; it < 4; it++) {
      const center = modelCenterY();
      const frac = cp * (cam.f / cam.dist);   // 每单位 cy 对应屏幕像素
      const delta = (center - cv.height / 2) / frac;
      cam.cy -= delta;
      if (Math.abs(center - cv.height / 2) < 2) break;
    }
  }
  function resize() {
    const r = stage.getBoundingClientRect();
    const w = Math.max(340, Math.round(r.width));
    const h = Math.max(300, Math.round(r.height));
    cv.width = w; cv.height = h;
    autoZoom();
    draw();
  }
  new ResizeObserver(resize).observe(stage);
  document.addEventListener('themechange', () => { readTheme(); draw(); });

  showDetail(sel);
  resize();
})();
