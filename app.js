/* ============================================================
   看得见的大模型 - interactive demos, vanilla JS
   Theme-aware: every canvas re-reads CSS tokens on themechange.
   ============================================================ */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- theme-aware palette ---------- */
const C = {};
const REDRAW = [];
function cssv(n) { return getComputedStyle(document.body).getPropertyValue(n).trim(); }
function readPalette() {
  C.light  = document.documentElement.getAttribute('data-theme') !== 'dark';
  C.bg     = cssv('--bg-2');
  C.line   = cssv('--line');
  C.soft   = cssv('--line-soft');
  C.text   = cssv('--text');
  C.read   = cssv('--read') || cssv('--text');
  C.dim    = cssv('--dim');
  C.faint  = cssv('--faint');
  C.accent = cssv('--accent');
  C.blue   = cssv('--serieB');
  C.heat   = cssv('--heat');            // "r, g, b"
}
readPalette();

/* ---------- theme toggle ---------- */
(function theme() {
  const btn = $('#themeBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    readPalette();
    REDRAW.forEach(fn => { try { fn(); } catch (e) {} });
    document.dispatchEvent(new CustomEvent('themechange'));
  });
})();

/* ---------- KaTeX ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$',  right: '$',  display: false }
      ],
      throwOnError: false,
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option']
    });
  }
});

/* ============================================================
   SCROLLSPY + PROGRESS
   ============================================================ */
(function scrollspy() {
  const links = $$('.rail-list a').filter(a => a.getAttribute('href').startsWith('#'));
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const bar = $('#progressBar');
  const chap = $('#progressChap');
  // 窄屏没有侧栏：从同一份锚点生成章节跳转，避免三页各写一份。
  let jump = null;
  if (links.length) {
    jump = document.createElement('select');
    jump.className = 'chap-jump';
    jump.setAttribute('aria-label', '跳到章节');
    links.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.getAttribute('href');
      opt.textContent = a.textContent.replace(/\s+/g, ' ').trim();
      jump.appendChild(opt);
    });
    jump.addEventListener('change', () => {
      if (jump.value) location.hash = jump.value;
    });
    const topbar = $('.topbar');
    if (topbar && topbar.parentNode) topbar.after(jump);
    else document.body.prepend(jump);
  }
  // 章节名：取每个 section 的 h2 文本
  const chapName = secs.map(s => {
    const h = s && s.querySelector('h2');
    return h ? h.textContent.trim() : '';
  });
  let cur = -1;
  if (secs.length) {
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const i = secs.indexOf(e.target);
        links.forEach((a, j) => a.classList.toggle('is-on', j === i));
        cur = i;
        if (chap && chapName[i]) chap.textContent = chapName[i];
        if (jump && links[i]) jump.value = links[i].getAttribute('href');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));
  }
  let tick = false;
  let chapTimer = null;
  document.addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    if (chap) {
      chap.classList.add('show');
      clearTimeout(chapTimer);
      chapTimer = setTimeout(() => chap.classList.remove('show'), 1600);
    }
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
      tick = false;
    });
  }, { passive: true });
})();

/* ============================================================
   HERO CANVAS
   ============================================================ */
(function hero() {
  const cv = $('#heroCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height, N = 9;
  const nodes = [];
  for (let i = 0; i < N; i++)
    nodes.push({ x: 90 + (i % 3) * 140 + (Math.floor(i / 3) % 2) * 40,
                 y: 90 + Math.floor(i / 3) * 150, p: Math.random() * 6.28 });
  const links = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++)
    if (i !== j && Math.random() < .34) links.push({ a: i, b: j, w: Math.random() });

  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    nodes.forEach(n => {
      n.cx = n.x + Math.sin(t * .0006 + n.p) * 16;
      n.cy = n.y + Math.cos(t * .0005 + n.p * 1.4) * 13;
    });
    links.forEach((l, i) => {
      const a = nodes[l.a], b = nodes[l.b];
      const pulse = (Math.sin(t * .0012 + i * .55) + 1) / 2;
      ctx.strokeStyle = `rgba(${C.heat},${(.05 + pulse * l.w * .32).toFixed(3)})`;
      ctx.lineWidth = .6 + pulse * l.w * 1.5;
      ctx.beginPath();
      ctx.moveTo(a.cx, a.cy);
      ctx.quadraticCurveTo((a.cx + b.cx) / 2, (a.cy + b.cy) / 2 - 34, b.cx, b.cy);
      ctx.stroke();
    });
    nodes.forEach((n, i) => {
      const pulse = (Math.sin(t * .0016 + i * .8) + 1) / 2;
      ctx.beginPath(); ctx.arc(n.cx, n.cy, 15 + pulse * 3.5, 0, 7);
      ctx.fillStyle = `rgba(${C.heat},${(.07 + pulse * .09).toFixed(3)})`; ctx.fill();
      ctx.beginPath(); ctx.arc(n.cx, n.cy, 4.2, 0, 7);
      ctx.fillStyle = C.accent; ctx.globalAlpha = .55 + pulse * .45; ctx.fill();
      ctx.globalAlpha = 1;
    });
    t += 16;
    if (!REDUCED && heroVisible) requestAnimationFrame(frame);
  }

  // 视口感知：hero 滚出视口时暂停绘制，省 CPU
  let heroVisible = true;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      heroVisible = es[0].isIntersecting;
      if (heroVisible && !REDUCED) frame();   // 回到视口则重启循环
    }, { threshold: 0.01 });
    io.observe(cv);
  }

  frame();
  REDRAW.push(() => { if (REDUCED || heroVisible) frame(); });
})();

/* ============================================================
   CH1 GRADIENT DESCENT
   ============================================================ */
(function gd() {
  const fit = $('#gdFit'), loss = $('#gdLoss');
  if (!fit) return;
  const fc = fit.getContext('2d'), lc = loss.getContext('2d');
  const TW = 1.9, TB = 0.6;
  const pts = [];
  for (let i = 0; i < 26; i++) {
    const x = i / 25 * 4;
    pts.push({ x, y: TW * x + TB + (Math.random() - .5) * 1.5 });
  }
  let w = -0.6, b = 4.2, steps = 0, running = false;
  const mse = (W, B) => pts.reduce((s, p) => s + (W * p.x + B - p.y) ** 2, 0) / pts.length;

  function drawFit() {
    const W = fit.width, H = fit.height, pad = 34;
    fc.clearRect(0, 0, W, H); fc.fillStyle = C.bg; fc.fillRect(0, 0, W, H);
    const X = x => pad + x / 4 * (W - pad * 2), Y = y => H - pad - (y + 1) / 10 * (H - pad * 2);
    fc.strokeStyle = C.soft; fc.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { fc.beginPath(); fc.moveTo(X(i), pad - 8); fc.lineTo(X(i), H - pad); fc.stroke(); }
    for (let i = 0; i <= 9; i += 3) { fc.beginPath(); fc.moveTo(pad, Y(i)); fc.lineTo(W - pad + 8, Y(i)); fc.stroke(); }
    fc.strokeStyle = `rgba(${C.heat},.25)`;
    pts.forEach(p => { fc.beginPath(); fc.moveTo(X(p.x), Y(p.y)); fc.lineTo(X(p.x), Y(w * p.x + b)); fc.stroke(); });
    fc.strokeStyle = C.accent; fc.lineWidth = 2;
    fc.beginPath(); fc.moveTo(X(0), Y(b)); fc.lineTo(X(4), Y(w * 4 + b)); fc.stroke();
    pts.forEach(p => { fc.beginPath(); fc.arc(X(p.x), Y(p.y), 3.4, 0, 7); fc.fillStyle = C.blue; fc.fill(); });
    fc.fillStyle = C.faint; fc.font = '10px ui-monospace, monospace';
    fc.fillText('x', W - pad + 10, H - pad + 4); fc.fillText('y', pad - 22, pad - 2);
  }

  function drawLoss() {
    const W = loss.width, H = loss.height, pad = 30;
    lc.clearRect(0, 0, W, H); lc.fillStyle = C.bg; lc.fillRect(0, 0, W, H);
    const wr = [-2, 4], br = [-3, 5];
    const X = v => pad + (v - wr[0]) / 6 * (W - pad * 2), Y = v => H - pad - (v - br[0]) / 8 * (H - pad * 2);
    const res = 26; let mx = 0; const grid = [];
    for (let i = 0; i < res; i++) { grid[i] = [];
      for (let j = 0; j < res; j++) {
        const v = mse(lerp(wr[0], wr[1], i / (res - 1)), lerp(br[0], br[1], j / (res - 1)));
        grid[i][j] = v; if (v > mx) mx = v;
      } }
    const cw = (W - pad * 2) / (res - 1), ch = (H - pad * 2) / (res - 1);
    for (let i = 0; i < res; i++) for (let j = 0; j < res; j++) {
      const n = Math.pow(grid[i][j] / mx, .32);
      lc.fillStyle = `rgba(${C.heat},${((1 - n) * (C.light ? .42 : .5)).toFixed(3)})`;
      lc.fillRect(pad + i * cw - cw / 2, H - pad - j * ch - ch / 2, cw + 1, ch + 1);
    }
    lc.strokeStyle = C.blue; lc.lineWidth = 1;
    lc.beginPath(); lc.arc(X(TW), Y(TB), 5, 0, 7); lc.stroke();
    lc.beginPath(); lc.arc(X(w), Y(b), 5, 0, 7);
    lc.fillStyle = C.accent; lc.fill();
    lc.strokeStyle = cssv('--bg'); lc.lineWidth = 1.6; lc.stroke();
    lc.fillStyle = C.faint; lc.font = '10px ui-monospace, monospace';
    lc.fillText('w →', W - pad - 4, H - pad + 15); lc.fillText('b ↑', 6, pad - 10);
  }

  function sync() {
    $('#gdW').value = w; $('#gdB').value = b;
    $('#gdWv').textContent = w.toFixed(2); $('#gdBv').textContent = b.toFixed(2);
    $('#gdLossVal').textContent = mse(w, b).toFixed(2); $('#gdSteps').textContent = steps;
    drawFit(); drawLoss();
  }
  function step() {
    let gw = 0, gb = 0;
    pts.forEach(p => { const e = w * p.x + b - p.y; gw += 2 * p.x * e; gb += 2 * e; });
    w -= 0.02 * gw / pts.length; b -= 0.02 * gb / pts.length; steps++; sync();
  }
  $('#gdW').addEventListener('input', e => { w = +e.target.value; sync(); });
  $('#gdB').addEventListener('input', e => { b = +e.target.value; sync(); });
  $('#gdStep').addEventListener('click', step);
  $('#gdReset').addEventListener('click', () => { w = -0.6; b = 4.2; steps = 0; running = false; $('#gdRun').textContent = '自动训练'; sync(); });
  $('#gdRun').addEventListener('click', e => {
    running = !running; e.target.textContent = running ? '暂停' : '自动训练';
    (function loop() { if (!running) return; step(); setTimeout(() => requestAnimationFrame(loop), 55); })();
  });
  sync();
  REDRAW.push(sync);
})();

/* ============================================================
   CH2 TINY MLP
   ============================================================ */
(function mlp() {
  const cv = $('#mlpCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d'), S = cv.width;
  let H = 8, shape = 'circle', data = [], net = null, epoch = 0, running = false, raf = 0;

  function makeData(kind) {
    const d = [];
    if (kind === 'circle') for (let i = 0; i < 200; i++) {
      const r = Math.random() < .5 ? Math.random() * .38 : .6 + Math.random() * .32, a = Math.random() * 6.28;
      d.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, l: r < .5 ? 0 : 1 });
    } else if (kind === 'xor') for (let i = 0; i < 200; i++) {
      const x = (Math.random() - .5) * 1.8, y = (Math.random() - .5) * 1.8;
      d.push({ x, y, l: (x > 0) === (y > 0) ? 0 : 1 });
    } else for (let i = 0; i < 110; i++) for (const s of [0, 1]) {
      const t = i / 110 * 3.2, a = t * 2.4 + s * Math.PI, r = t * .28 + .06;
      d.push({ x: Math.cos(a) * r + (Math.random() - .5) * .07, y: Math.sin(a) * r + (Math.random() - .5) * .07, l: s });
    }
    return d;
  }
  const initNet = h => { const rnd = () => (Math.random() - .5) * 1.6;
    return { w1: Array.from({ length: h }, () => [rnd(), rnd()]), b1: Array(h).fill(0),
             w2: Array.from({ length: h }, rnd), b2: 0, h }; };
  function fwd(n, x, y) {
    const a = [];
    for (let i = 0; i < n.h; i++) a[i] = Math.tanh(n.w1[i][0] * x + n.w1[i][1] * y + n.b1[i]);
    let s = n.b2; for (let i = 0; i < n.h; i++) s += n.w2[i] * a[i];
    return { a, out: 1 / (1 + Math.exp(-s)) };
  }
  function train(n, d, lr = .08) {
    const gw1 = n.w1.map(() => [0, 0]), gb1 = n.b1.map(() => 0), gw2 = n.w2.map(() => 0);
    let gb2 = 0, L = 0, ok = 0;
    d.forEach(p => {
      const { a, out } = fwd(n, p.x, p.y), e = out - p.l;
      L += -(p.l * Math.log(out + 1e-9) + (1 - p.l) * Math.log(1 - out + 1e-9));
      if ((out > .5 ? 1 : 0) === p.l) ok++;
      for (let i = 0; i < n.h; i++) {
        gw2[i] += e * a[i];
        const da = e * n.w2[i] * (1 - a[i] * a[i]);
        gw1[i][0] += da * p.x; gw1[i][1] += da * p.y; gb1[i] += da;
      }
      gb2 += e;
    });
    const m = d.length;
    for (let i = 0; i < n.h; i++) {
      n.w1[i][0] -= lr * gw1[i][0] / m; n.w1[i][1] -= lr * gw1[i][1] / m;
      n.b1[i] -= lr * gb1[i] / m; n.w2[i] -= lr * gw2[i] / m;
    }
    n.b2 -= lr * gb2 / m;
    return { loss: L / m, acc: ok / m };
  }
  function draw() {
    const px = 4, res = S / px, img = ctx.createImageData(S, S);
    const A = C.light ? [232, 240, 248] : [18, 34, 52];
    const Bc = C.light ? [252, 232, 200] : [66, 46, 12];
    for (let i = 0; i < res; i++) for (let j = 0; j < res; j++) {
      const o = fwd(net, (i / res) * 2.2 - 1.1, 1.1 - (j / res) * 2.2).out;
      const r = Math.round(lerp(A[0], Bc[0], o)), g = Math.round(lerp(A[1], Bc[1], o)), bl = Math.round(lerp(A[2], Bc[2], o));
      for (let dx = 0; dx < px; dx++) for (let dy = 0; dy < px; dy++) {
        const k = ((j * px + dy) * S + i * px + dx) * 4;
        img.data[k] = r; img.data[k + 1] = g; img.data[k + 2] = bl; img.data[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    data.forEach(p => {
      ctx.beginPath(); ctx.arc((p.x + 1.1) / 2.2 * S, (1.1 - p.y) / 2.2 * S, 3.1, 0, 7);
      ctx.fillStyle = p.l ? C.accent : C.blue; ctx.fill();
      ctx.strokeStyle = C.light ? 'rgba(255,255,255,.75)' : 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.stroke();
    });
  }
  function reset() {
    running = false; cancelAnimationFrame(raf); $('#mlpRun').textContent = '开始训练';
    data = makeData(shape); net = initNet(H); epoch = 0;
    $('#mlpEpoch').textContent = 0; $('#mlpLoss').textContent = '0.693'; $('#mlpAcc').textContent = '50.0%';
    draw();
  }
  function loop() {
    if (!running) return;
    let r; for (let k = 0; k < 6; k++) { r = train(net, data); epoch++; }
    $('#mlpEpoch').textContent = epoch; $('#mlpLoss').textContent = r.loss.toFixed(3);
    $('#mlpAcc').textContent = (r.acc * 100).toFixed(1) + '%';
    draw(); raf = requestAnimationFrame(loop);
  }
  $('#mlpH').addEventListener('input', e => { H = +e.target.value; $('#mlpHv').textContent = H; reset(); });
  $('#mlpData').addEventListener('change', e => { shape = e.target.value; reset(); });
  $('#mlpReset').addEventListener('click', reset);
  $('#mlpRun').addEventListener('click', e => {
    running = !running; e.target.textContent = running ? '暂停' : '开始训练'; if (running) loop();
  });
  reset();
  REDRAW.push(draw);
})();

/* ============================================================
   CH3 TOKENIZER
   ============================================================ */
(function tok() {
  const inp = $('#tokInput'), out = $('#tokOut');
  if (!inp) return;
  const VOCAB = ['注意力', '机制', 'Transformer', '核心', '模型', '神经', '网络', '训练', '语言', '生成'];
  const SUB = { unbelievable: ['un', 'believ', 'able'], attention: ['atten', 'tion'],
                transformer: ['Trans', 'former'], embedding: ['embed', 'ding'], tokenizer: ['token', 'izer'] };
  const PAL = ['#e0910f', '#2f8fc4', '#3fa07a', '#c4628f', '#7b73c9', '#c2911f'];

  function split(text) {
    const res = []; let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (/[a-zA-Z]/.test(ch)) {
        let j = i; while (j < text.length && /[a-zA-Z]/.test(text[j])) j++;
        const word = text.slice(i, j), low = word.toLowerCase();
        if (SUB[low]) res.push(...SUB[low]);
        else if (word.length > 6) res.push(word.slice(0, 4), word.slice(4));
        else res.push(word);
        i = j; continue;
      }
      if (/[0-9]/.test(ch)) { let j = i; while (j < text.length && /[0-9]/.test(text[j])) j++; res.push(text.slice(i, j)); i = j; continue; }
      let hit = null;
      for (const v of VOCAB) if (text.startsWith(v, i)) { hit = v; break; }
      if (hit) { res.push(hit); i += hit.length; continue; }
      res.push(ch); i++;
    }
    return res;
  }
  const hash = s => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 99991; return h; };

  function render() {
    const toks = split(inp.value);
    out.innerHTML = toks.map((t, i) => {
      const col = PAL[i % PAL.length];
      return `<span class="tok" style="background:${col}22;border-color:${col}55;color:${col}">` +
             `${t.replace(/</g, '&lt;')}<i>${hash(t)}</i></span>`;
    }).join('');
    $('#tokCount').textContent = toks.length;
    $('#charCount').textContent = [...inp.value].length;
  }
  inp.addEventListener('input', render);
  render();
})();

/* ============================================================
   CH3 EMBEDDING MAP
   ============================================================ */
(function emb() {
  const cv = $('#embCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d'), W = cv.width, Hh = cv.height;
  const WORDS = [
    ['国王', .72, .78], ['王后', .60, .86], ['男人', .74, .58], ['女人', .62, .66],
    ['王子', .80, .72], ['公主', .68, .80], ['父亲', .78, .50], ['母亲', .66, .56],
    ['猫', .22, .70], ['狗', .28, .76], ['老虎', .14, .62], ['兔子', .24, .84],
    ['跑', .34, .26], ['跳', .40, .32], ['走', .30, .20], ['飞', .44, .38],
    ['北京', .82, .22], ['上海', .88, .28], ['东京', .90, .16], ['巴黎', .84, .12],
    ['开心', .52, .92], ['难过', .46, .12], ['愤怒', .38, .06], ['平静', .56, .46],
    ['代码', .10, .38], ['算法', .06, .44], ['程序', .12, .32], ['电脑', .16, .48]
  ];
  let sel = 0, anim = null;
  const X = x => 32 + x * (W - 64), Y = y => Hh - 30 - y * (Hh - 60);
  const dist = (a, b) => Math.hypot(a[1] - b[1], a[2] - b[2]);

  function draw() {
    ctx.clearRect(0, 0, W, Hh); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, Hh);
    ctx.strokeStyle = C.soft; ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(X(i / 5), 18); ctx.lineTo(X(i / 5), Hh - 18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(24, Y(i / 5)); ctx.lineTo(W - 24, Y(i / 5)); ctx.stroke();
    }
    const s = WORDS[sel];
    const near = WORDS.map((w, i) => ({ i, d: dist(s, w) })).filter(o => o.i !== sel).sort((a, b) => a.d - b.d).slice(0, 4);
    near.forEach(o => {
      const t = WORDS[o.i];
      ctx.strokeStyle = `rgba(${C.heat},${(.55 - o.d * .5).toFixed(3)})`; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(X(s[1]), Y(s[2])); ctx.lineTo(X(t[1]), Y(t[2])); ctx.stroke();
    });
    if (anim) {
      const p = anim.map(i => WORDS[i]);
      ctx.setLineDash([4, 4]); ctx.lineWidth = 1.4; ctx.strokeStyle = C.blue;
      ctx.beginPath(); ctx.moveTo(X(p[0][1]), Y(p[0][2]));
      for (let i = 1; i < 4; i++) ctx.lineTo(X(p[i][1]), Y(p[i][2]));
      ctx.stroke(); ctx.setLineDash([]);
    }
    WORDS.forEach((w, i) => {
      const isSel = i === sel, isNear = near.some(o => o.i === i);
      ctx.beginPath(); ctx.arc(X(w[1]), Y(w[2]), isSel ? 5.5 : isNear ? 4 : 2.8, 0, 7);
      ctx.fillStyle = isSel ? C.accent : isNear ? `rgba(${C.heat},.65)` : C.faint;
      ctx.fill();
      ctx.font = (isSel ? '600 12.5px ' : '11.5px ') + 'system-ui,"PingFang SC",sans-serif';
      ctx.fillStyle = isSel ? C.accent : isNear ? C.dim : C.faint;
      ctx.textAlign = 'center';
      ctx.fillText(w[0], X(w[1]), Y(w[2]) - (isSel ? 11 : 8));
    });
  }
  function pick(i) {
    sel = i;
    $('#embWord').textContent = WORDS[i][0];
    const near = WORDS.map((w, j) => ({ j, d: dist(WORDS[i], w) })).filter(o => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 5);
    $('#embNear').innerHTML = near.map(o => `<div><span>${WORDS[o.j][0]}</span><em>${(1 - o.d).toFixed(3)}</em></div>`).join('');
    draw();
  }
  cv.addEventListener('click', e => {
    const r = cv.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width * W, my = (e.clientY - r.top) / r.height * Hh;
    let best = 0, bd = 1e9;
    WORDS.forEach((w, i) => { const d = Math.hypot(X(w[1]) - mx, Y(w[2]) - my); if (d < bd) { bd = d; best = i; } });
    if (bd < 40) { anim = null; pick(best); }
  });
  $('#vecRun').addEventListener('click', () => {
    const idx = n => WORDS.findIndex(w => w[0] === n);
    anim = [idx('国王'), idx('男人'), idx('女人'), idx('王后')];
    pick(idx('王后'));
    setTimeout(() => { anim = null; draw(); }, 3600);
  });
  pick(0);
  REDRAW.push(draw);
})();

/* ============================================================
   CH4 ATTENTION
   ============================================================ */
(function attention() {
  const grid = $('#attnGrid');
  if (!grid) return;
  const TOK = ['小猫', '追', '老鼠', '因为', '它', '饿', '了'], n = TOK.length, dk = 64;
  const HEADS = [
    { name: '头 1', tag: '看前一个词', build: (i, j) => (j === i - 1 ? 6.5 : j === i ? 2.4 : 0.3) },
    { name: '头 2', tag: '指代消解', build: (i, j) => {
        if (i === 4 && j === 0) return 7.2;
        if (i === 5 && j === 4) return 5.4;
        if (i === 6 && j === 5) return 4.6;
        return j === i ? 2.2 : 0.5; } },
    { name: '头 3', tag: '动词与宾语', build: (i, j) => {
        if (i === 2 && j === 1) return 6.8;
        if (i === 1 && j === 0) return 5.6;
        if (i === 5 && j === 2) return 3.4;
        return j === i ? 1.8 : 0.4; } },
    { name: '头 4', tag: '句首锚点', build: (i, j) => (j === 0 ? 5.8 : j === i ? 2.6 : 0.6) }
  ];
  let head = 0, hotR = -1;

  const scores = h => Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => j <= i ? HEADS[h].build(i, j) : -Infinity));
  const softmaxRows = S => S.map(row => {
    const mx = Math.max(...row.filter(isFinite));
    const ex = row.map(v => isFinite(v) ? Math.exp(v - mx) : 0);
    const s = ex.reduce((a, b) => a + b, 0);
    return ex.map(v => v / s);
  });
  let S = scores(0), A = softmaxRows(S);

  $('#headTabs').innerHTML = HEADS.map((h, i) =>
    `<button class="head-tab${i === 0 ? ' is-on' : ''}" data-h="${i}">${h.name}<em>${h.tag}</em></button>`).join('');
  $$('#headTabs .head-tab').forEach(b => b.addEventListener('click', () => {
    head = +b.dataset.h;
    $$('#headTabs .head-tab').forEach(x => x.classList.toggle('is-on', x === b));
    S = scores(head); A = softmaxRows(S);
    renderGrid(); renderArcs(hotR);
  }));

  function renderGrid() {
    grid.style.gridTemplateColumns = `56px repeat(${n}, 1fr)`;
    let html = '<div></div>';
    for (let j = 0; j < n; j++) html += `<div class="ag-lab col" data-c="${j}">${TOK[j]}</div>`;
    for (let i = 0; i < n; i++) {
      html += `<div class="ag-lab" data-r="${i}">${TOK[i]}</div>`;
      for (let j = 0; j < n; j++) {
        if (j > i) { html += `<div class="ag-cell is-masked"></div>`; continue; }
        html += `<div class="ag-cell" data-i="${i}" data-j="${j}"
          style="background:rgba(${C.heat},${(0.06 + A[i][j] * 0.94).toFixed(3)})"></div>`;
      }
    }
    grid.innerHTML = html;
    $$('.ag-cell[data-i]', grid).forEach(c =>
      c.addEventListener('mouseenter', () => detail(+c.dataset.i, +c.dataset.j)));
  }

  function detail(i, j) {
    hotR = i;
    $$('.ag-cell', grid).forEach(c => c.classList.toggle('is-hot', +c.dataset.i === i));
    $$('.ag-lab', grid).forEach(l => l.classList.toggle('is-hot',
      (l.dataset.r !== undefined && +l.dataset.r === i) || (l.dataset.c !== undefined && +l.dataset.c === j)));
    // S holds the already-scaled logit consumed by softmax, so the raw dot
    // product is S * sqrt(dk). Keep both numbers consistent.
    const scaled = S[i][j], dot = scaled * Math.sqrt(dk), a = A[i][j];
    $('#attnDetail').innerHTML = `
      <div class="ad-title"><span>${TOK[i]}</span> 在看 <span>${TOK[j]}</span></div>
      <div class="ad-row"><span>q·k 点积</span><b>${dot.toFixed(2)}</b></div>
      <div class="ad-row"><span>除以 √d<sub>k</sub> = 8</span><b>${scaled.toFixed(3)}</b></div>
      <div class="ad-row"><span>softmax 后权重</span><b>${a.toFixed(4)}</b></div>
      <div class="ad-bar"><i style="width:${(a * 100).toFixed(1)}%"></i></div>
      <div class="ad-note">这一行的所有权重加起来等于 1。权重越大，${TOK[j]} 的 value 向量在 ${TOK[i]} 的新表示里占比越高。</div>`;
    renderArcs(i);
  }

  function renderArcs(row) {
    const svg = $('#attnArcs'), W = 760, pad = 60, gap = (W - pad * 2) / (n - 1);
    let h = '';
    if (row >= 0) for (let j = 0; j <= row; j++) {
      const a = A[row][j];
      if (a < 0.012) continue;
      const x1 = pad + row * gap, x2 = pad + j * gap;
      h += `<path d="M${x1} 86 Q ${(x1 + x2) / 2} ${86 - (82 - Math.abs(row - j) * 4)} ${x2} 86"
             fill="none" stroke="${C.accent}" stroke-opacity="${(a * .9 + .08).toFixed(3)}"
             stroke-width="${(a * 6 + .7).toFixed(2)}" stroke-linecap="round"/>`;
    }
    TOK.forEach((t, i) => {
      const x = pad + i * gap, on = i === row;
      h += `<circle cx="${x}" cy="92" r="3.4" fill="${on ? C.accent : C.faint}"/>`;
      h += `<text x="${x}" y="114" text-anchor="middle" font-size="12.5" fill="${on ? C.accent : C.faint}"
             font-family="system-ui,'PingFang SC',sans-serif">${t}</text>`;
    });
    svg.innerHTML = h;
  }

  const STEPS = [
    { k: '投影出 Q K V', p: '每个词的嵌入向量分别乘上三个不同的权重矩阵，得到查询、键、值三份表示。这三个矩阵是训练学出来的，决定了这个头关注什么。',
      shape: 'X [7, 512] × W_q [512, 64] → Q [7, 64]', f: 'Q = X·W_q    K = X·W_k    V = X·W_v' },
    { k: '两两打分', p: '把每个查询和所有键做点积。点积越大说明这两个词在这个头看来越相关。7 个词两两相比，得到一个 7×7 的分数矩阵。',
      shape: 'Q [7, 64] × Kᵀ [64, 7] → scores [7, 7]', f: 'scores = Q · Kᵀ' },
    { k: '缩放', p: '除以 √d_k。维度越高，点积的数值波动越大，不缩放会让接下来的 softmax 变得极端，梯度几乎传不回去。',
      shape: 'scores [7, 7] ÷ 8.0', f: 'scaled = scores / √d_k    （d_k = 64，√d_k = 8）' },
    { k: '因果掩码', p: '生成模型不能看未来。把矩阵右上三角全部设成负无穷，这样 softmax 之后它们的权重就是 0。上面矩阵里的灰色区域就是被掩掉的部分。',
      shape: 'scaled [7, 7] + mask [7, 7]', f: 'masked[i][j] = j <= i ? scaled[i][j] : -inf' },
    { k: 'Softmax', p: '逐行归一化，把分数变成加起来等于 1 的概率分布。现在每一行都是一份「注意力预算」，规定了这个词的信息从哪些词身上取、各取多少。',
      shape: 'masked [7, 7] → weights [7, 7]', f: 'weights[i] = exp(masked[i]) / Σ exp(masked[i])' },
    { k: '加权求和', p: '用权重去加权所有的 value 向量。每个词得到一个融合了上下文的新表示。这就是注意力层的输出。',
      shape: 'weights [7, 7] × V [7, 64] → out [7, 64]', f: 'output = weights · V' },
    { k: '多头拼接', p: '上面整套流程有 8 到 128 份在并行跑，每份关注不同的模式。最后把它们的输出拼起来，过一个输出投影矩阵，融合成最终结果。',
      shape: 'concat(head₁..head_h) [7, 512] × W_o [512, 512]', f: 'MultiHead = Concat(head₁, ..., head_h) · W_o' }
  ];
  function renderSteps(idx) {
    $('#attnSteps').innerHTML = STEPS.map((s, i) =>
      `<button class="step-btn${i === idx ? ' is-on' : ''}" data-s="${i}"><u>${i + 1}</u>${s.k}</button>`).join('');
    const s = STEPS[idx];
    $('#attnStepPanel').innerHTML = `<h4 class="sp-h">${s.k}</h4><p class="sp-p">${s.p}</p>
      <div class="sp-shape">形状 <b>${s.shape}</b></div><div class="sp-formula">${s.f}</div>`;
    $$('#attnSteps .step-btn').forEach(b => b.addEventListener('click', () => renderSteps(+b.dataset.s)));
  }

  renderGrid(); renderArcs(-1); renderSteps(0);
  REDRAW.push(() => { renderGrid(); renderArcs(hotR); });
})();

/* ============================================================
   CH6 SAMPLING
   ============================================================ */
(function sampling() {
  const wrap = $('#sampBars');
  if (!wrap) return;
  const CAND = [['好', 4.2], ['不错', 3.6], ['冷', 3.1], ['热', 2.9], ['棒', 2.4], ['糟糕', 1.8],
                ['蓝', 1.5], ['安静', 1.1], ['奇怪', .7], ['贵', .3], ['圆', -.4], ['紫色', -1.1]];
  function compute() {
    const T = +$('#sampT').value, K = +$('#sampK').value, P = +$('#sampP').value;
    const lg = CAND.map(c => c[1] / T), mx = Math.max(...lg);
    const ex = lg.map(v => Math.exp(v - mx)), sum = ex.reduce((a, b) => a + b, 0);
    const probs = ex.map(v => v / sum);
    const order = probs.map((p, i) => ({ i, p })).sort((a, b) => b.p - a.p);
    const cut = new Set();
    order.forEach((o, rk) => { if (rk >= K) cut.add(o.i); });
    let acc = 0;
    for (const o of order) {
      if (cut.has(o.i)) continue;
      if (acc >= P) { cut.add(o.i); continue; }
      acc += o.p;
    }
    return { probs, cut };
  }
  function render(picked = -1) {
    const { probs, cut } = compute(), mx = Math.max(...probs);
    wrap.innerHTML = CAND.map((c, i) => `
      <div class="sb-row${cut.has(i) ? ' is-cut' : ''}${i === picked ? ' is-picked' : ''}">
        <div class="sb-word">${c[0]}</div>
        <div class="sb-track"><div class="sb-fill" style="width:${(probs[i] / mx * 100).toFixed(1)}%"></div></div>
        <div class="sb-pct">${(probs[i] * 100).toFixed(1)}%</div></div>`).join('');
  }
  ['sampT', 'sampK', 'sampP'].forEach(id => $('#' + id).addEventListener('input', e => {
    const v = +e.target.value;
    $('#' + id + 'v').textContent = id === 'sampK' ? v : v.toFixed(2);
    render();
  }));
  $('#sampRoll').addEventListener('click', () => {
    const { probs, cut } = compute();
    let tot = 0; probs.forEach((p, i) => { if (!cut.has(i)) tot += p; });
    let r = Math.random() * tot, pick = 0;
    for (let i = 0; i < probs.length; i++) {
      if (cut.has(i)) continue;
      r -= probs[i]; if (r <= 0) { pick = i; break; }
    }
    render(pick);
    $('#sampResult').innerHTML = `今天天气真<b>${CAND[pick][0]}</b>`;
  });
  render();
})();

/* ============================================================
   CH7 LORA
   ============================================================ */
(function lora() {
  const cv = $('#loraCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  const fmt = n => n >= 1e9 ? (n / 1e9).toFixed(1) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(1) + 'M'
                 : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : '' + n;
  function draw() {
    const r = +$('#loraR').value, d = +$('#loraD').value;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    const box = 150, cy = H / 2 - 12;
    ctx.fillStyle = C.light ? 'rgba(86,96,109,.10)' : 'rgba(152,162,176,.13)';
    ctx.strokeStyle = C.faint; ctx.lineWidth = 1;
    ctx.fillRect(40, cy - box / 2, box, box); ctx.strokeRect(40, cy - box / 2, box, box);
    ctx.fillStyle = C.dim; ctx.font = '600 15px system-ui,"PingFang SC",sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('W', 40 + box / 2, cy + 4);
    ctx.font = '11px ui-monospace,monospace'; ctx.fillStyle = C.faint;
    ctx.fillText(`${d} × ${d}`, 40 + box / 2, cy + 24);
    ctx.fillText('冻结', 40 + box / 2, cy - box / 2 - 10);
    ctx.fillStyle = C.dim; ctx.font = '22px system-ui,sans-serif';
    ctx.fillText('+', 40 + box + 26, cy + 8);

    const bw = Math.max(9, box * r / 64 * .55), x0 = 40 + box + 52;
    ctx.fillStyle = `rgba(${C.heat},.22)`; ctx.strokeStyle = C.accent;
    ctx.fillRect(x0, cy - box / 2, bw, box); ctx.strokeRect(x0, cy - box / 2, bw, box);
    ctx.fillStyle = C.accent; ctx.font = '600 13px system-ui,sans-serif';
    ctx.fillText('B', x0 + bw / 2, cy + 4);
    ctx.font = '10px ui-monospace,monospace'; ctx.fillText(`${d}×${r}`, x0 + bw / 2, cy + box / 2 + 16);

    const x1 = x0 + bw + 16;
    ctx.fillStyle = `rgba(${C.heat},.22)`; ctx.strokeStyle = C.accent;
    ctx.fillRect(x1, cy - bw / 2, box, bw); ctx.strokeRect(x1, cy - bw / 2, box, bw);
    ctx.fillStyle = C.accent; ctx.font = '600 13px system-ui,sans-serif';
    ctx.fillText('A', x1 + box / 2, cy + 4);
    ctx.font = '10px ui-monospace,monospace'; ctx.fillText(`${r}×${d}`, x1 + box / 2, cy + bw / 2 + 16);
    ctx.fillStyle = C.faint; ctx.font = '11px ui-monospace,monospace';
    ctx.fillText('只训练这两个', (x0 + x1 + box) / 2, cy - box / 2 - 10);

    const full = d * d, low = 2 * d * r;
    $('#loraFull').textContent = fmt(full);
    $('#loraLow').textContent = fmt(low);
    $('#loraPct').textContent = (low / full * 100).toFixed(2) + '%';
  }
  $('#loraR').addEventListener('input', e => { $('#loraRv').textContent = e.target.value; draw(); });
  $('#loraD').addEventListener('input', e => { $('#loraDv').textContent = e.target.value; draw(); });
  draw();
  REDRAW.push(draw);
})();

/* ============================================================
   CH8 RLHF
   ============================================================ */
(function rlhf() {
  const flow = $('#rlhfFlow');
  if (!flow) return;
  const STAGES = [
    { s: 'STAGE 1', n: '监督微调 SFT', d: '用人写的高质量问答对做标准微调，让基座模型先学会「按指令回答」这件事。',
      inp: '几万条人工编写的「问题 + 理想回答」', out: '一个会听指令、但品味还很粗糙的模型' },
    { s: 'STAGE 2', n: '训练奖励模型 RM', d: '同一个问题让模型生成多个回答，请人来排序。用这些比较数据训练一个专门给回答打分的模型。',
      inp: '大量「回答 A 比回答 B 好」的偏好对', out: '一个能给任意回答打出分数的奖励模型', interactive: true },
    { s: 'STAGE 3', n: '策略优化 PPO / DPO', d: '用奖励模型的打分作为信号继续优化主模型，同时用 KL 惩罚拴住它，不让它为了刷分而胡言乱语。',
      inp: 'SFT 模型 + 奖励模型', out: '对齐后的模型，也就是你在用的那个' }
  ];
  let sel = 0, picked = -1;
  function render() {
    flow.innerHTML = STAGES.map((s, i) =>
      `<div class="rf-card${i === sel ? ' is-on' : ''}" data-i="${i}">
        <div class="rf-stage">${s.s}</div><div class="rf-name">${s.n}</div>
        <div class="rf-desc">${s.d}</div></div>`).join('');
    $$('.rf-card', flow).forEach(c => c.addEventListener('click', () => { sel = +c.dataset.i; picked = -1; render(); }));
    const s = STAGES[sel];
    let extra = '';
    if (s.interactive) extra = `
      <div class="pref-pair">
        <div class="pref-opt${picked === 0 ? ' picked' : ''}" data-p="0">
          <p>「这个问题很复杂，建议你咨询专业人士。」</p>
          <div class="pref-score">${picked === 0 ? 'r = +1.8　已选为更优' : '点击选为更优回答'}</div></div>
        <div class="pref-opt${picked === 1 ? ' picked' : ''}" data-p="1">
          <p>「分三步看：先确认数据来源，再检查口径是否一致，最后核对时间范围。」</p>
          <div class="pref-score">${picked === 1 ? 'r = +2.6　已选为更优' : '点击选为更优回答'}</div></div>
      </div>
      <div class="pref-fb">${picked === -1 ? '' : picked === 1
        ? '奖励模型会学到：具体、可执行的回答应该得高分。这一条偏好会被折进它的参数里。'
        : '你选了回避型回答。如果标注数据里这类选择占多数，模型就会学得越来越谨慎、越来越不敢给建议。标注质量直接决定模型性格。'}</div>`;
    $('#rlhfPanel').innerHTML = `<h4 class="rp-h">${s.n}</h4><p class="rp-p">${s.d}</p>
      <div class="rp-io"><div class="rp-box"><span>输入</span><p>${s.inp}</p></div>
      <div class="rp-box"><span>产出</span><p>${s.out}</p></div></div>${extra}`;
    $$('.pref-opt').forEach(o => o.addEventListener('click', () => { picked = +o.dataset.p; render(); }));
  }
  render();
})();

/* ============================================================
   CH9 LANGCHAIN / LANGGRAPH
   ============================================================ */
(function graphs() {
  const chainSvg = $('#chainSvg'), graphSvg = $('#graphSvg');
  if (!chainSvg) return;
  const CHAIN = [
    { id: 'in', t: '接收问题', x: 60, y: 20 }, { id: 'ret', t: '检索文档', x: 60, y: 100 },
    { id: 'gen', t: '生成回答', x: 60, y: 180 }, { id: 'out', t: '返回', x: 60, y: 260 }];
  const GRAPH = [
    { id: 'in', t: '接收问题', x: 90, y: 16 }, { id: 'ret', t: '检索文档', x: 90, y: 90 },
    { id: 'gen', t: '生成回答', x: 90, y: 164 }, { id: 'chk', t: '自检质量', x: 90, y: 238 },
    { id: 'out', t: '返回', x: 30, y: 312 }, { id: 'esc', t: '转人工', x: 170, y: 312 }];

  // Both SVGs share node names, so every id is prefixed per pane. Without this
  // getElementById resolves the graph's nodes to the chain's.
  function paint(svg, nodes, edges, vb, pfx) {
    svg.setAttribute('viewBox', vb);
    let h = `<defs><marker id="ah-${pfx}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" fill="${C.line}"/></marker></defs>`;
    edges.forEach(e => {
      h += `<path class="gedge" id="${pfx}-e-${e.f}-${e.t}" d="${e.d}" marker-end="url(#ah-${pfx})"/>`;
      if (e.lab) h += `<text class="gedge-lab" x="${e.lx}" y="${e.ly}">${e.lab}</text>`;
    });
    nodes.forEach(n => {
      h += `<g class="gnode" id="${pfx}-n-${n.id}"><rect x="${n.x}" y="${n.y}" width="120" height="34" rx="6"/>
        <text x="${n.x + 60}" y="${n.y + 21}" text-anchor="middle">${n.t}</text></g>`;
    });
    svg.innerHTML = h;
  }
  function paintAll() {
    paint(chainSvg, CHAIN, [
      { f: 'in', t: 'ret', d: 'M120 54 L120 96' }, { f: 'ret', t: 'gen', d: 'M120 134 L120 176' },
      { f: 'gen', t: 'out', d: 'M120 214 L120 256' }], '0 0 300 320', 'c');
    paint(graphSvg, GRAPH, [
      { f: 'in', t: 'ret', d: 'M150 50 L150 86' }, { f: 'ret', t: 'gen', d: 'M150 124 L150 160' },
      { f: 'gen', t: 'chk', d: 'M150 198 L150 234' },
      { f: 'chk', t: 'ret', d: 'M90 255 Q 40 200 40 130 Q 40 100 84 100', lab: '不合格', lx: 6, ly: 190 },
      { f: 'chk', t: 'out', d: 'M130 272 L100 308', lab: '通过', lx: 76, ly: 296 },
      { f: 'chk', t: 'esc', d: 'M180 272 L212 308', lab: '超限', lx: 196, ly: 296 }], '0 0 340 360', 'g');
  }
  paintAll();

  const log = $('#graphLog'), stateEl = $('#graphState');
  let timers = [];
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    $$('.gnode').forEach(n => n.classList.remove('active', 'done'));
    $$('.gedge').forEach(e => e.classList.remove('active'));
    log.innerHTML = '';
    stateEl.textContent = `{\n  "question": "",\n  "docs": [],\n  "answer": "",\n  "attempts": 0\n}`;
  }
  function run() {
    reset();
    const st = { question: '季度营收为什么下降', docs: [], answer: '', attempts: 0 };
    const seq = [
      { n: 'in', c: () => log.innerHTML += '<div><b>in</b> 收到问题</div>', e: null },
      { n: 'ret', c: () => { st.docs = ['财报Q3.pdf', '销售周报.csv']; log.innerHTML += '<div><b>ret</b> 检索到 2 篇</div>'; }, e: 'g-e-in-ret' },
      { n: 'gen', c: () => { st.answer = '初稿'; st.attempts = 1; log.innerHTML += '<div><b>gen</b> 生成初稿</div>'; }, e: 'g-e-ret-gen' },
      { n: 'chk', c: () => log.innerHTML += '<div><b>chk</b> 缺少数据支撑，不合格</div>', e: 'g-e-gen-chk' },
      { n: 'ret', c: () => { st.docs.push('对比数据.xlsx'); log.innerHTML += '<div><b>ret</b> 补充检索</div>'; }, e: 'g-e-chk-ret' },
      { n: 'gen', c: () => { st.answer = '含数据的回答'; st.attempts = 2; log.innerHTML += '<div><b>gen</b> 重新生成</div>'; }, e: 'g-e-ret-gen' },
      { n: 'chk', c: () => log.innerHTML += '<div><b>chk</b> 通过</div>', e: 'g-e-gen-chk' },
      { n: 'out', c: () => log.innerHTML += '<div><b>out</b> 返回结果</div>', e: 'g-e-chk-out' }
    ];
    seq.forEach((s, i) => timers.push(setTimeout(() => {
      $$('.gnode').forEach(n => n.classList.remove('active'));
      $$('.gedge').forEach(e => e.classList.remove('active'));
      if (s.e) { const el = document.getElementById(s.e); if (el) el.classList.add('active'); }
      const nd = document.getElementById('g-n-' + s.n);
      if (nd) nd.classList.add('active', 'done');
      s.c();
      stateEl.textContent = JSON.stringify(st, null, 2);
      log.scrollTop = log.scrollHeight;
    }, i * 780)));
    ['in', 'ret', 'gen', 'out'].forEach((id, i) => timers.push(setTimeout(() => {
      const nd = chainSvg.querySelector('#c-n-' + id);
      if (nd) nd.classList.add('active', 'done');
    }, i * 780)));
  }
  $('#graphRun').addEventListener('click', run);
  $('#graphReset').addEventListener('click', reset);
  reset();
  REDRAW.push(() => { paintAll(); reset(); });
})();

/* ============================================================
   Scroll reveal — 章节/卡片进入视口时淡入上移 (沉浸式)
   ============================================================ */
(function reveal() {
  if (REDUCED) return;
  const init = () => {
    const els = $$('.ch, .demo, .math-viz, .eq, .note, .compare, .cards');
    if (!els.length) return;

    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
      el.style.transition = 'opacity .7s ease, transform .7s cubic-bezier(.22,.61,.36,1)';
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ============================================================
   Journey map — 大站展开 + 滚动高亮当前枢纽
   ============================================================ */
(function journey() {
  const hubs = $$('.journey-hub');
  if (!hubs.length) return;
  const substops = $$('.journey-substop');

  hubs.forEach(h => {
    const btn = h.querySelector('.journey-hub-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = h.classList.contains('is-open');
      hubs.forEach(x => x.classList.remove('is-open'));
      if (!open) h.classList.add('is-open');
    });
  });

  substops.forEach(s => s.addEventListener('click', () => {
    const t = document.getElementById(s.dataset.sec);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  const secToHub = {};
  substops.forEach(s => {
    const hub = s.closest('.journey-hub');
    if (hub) secToHub[s.dataset.sec] = hub;
  });
  const secs = substops.map(s => document.getElementById(s.dataset.sec)).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const hub = secToHub[e.target.id];
      hubs.forEach(h => h.classList.toggle('is-on', h === hub));
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  secs.forEach(sec => io.observe(sec));
})();

/* ============================================================
   Chapter bridges — 每章开头的承上启下 + 具象类比
   ============================================================ */
(function bridges() {
  // 模型页专用。工程基础 / 数学基础也用 ch1..ch10，不能套模型页的承上启下。
  const page = document.body.getAttribute('data-page')
    || (/basics\.html/i.test(location.pathname + location.href) ? 'basics'
        : /math\.html/i.test(location.pathname + location.href) ? 'math'
        : 'model');
  if (page !== 'model') return;
  const BRIDGES = [
    { sec: 'ch1',  from: '这是什么',            to: '规律怎么试出来',  note: '模型是一堆能调的数字，「猜错就改一点」循环反复。',
      analogy: '像蒙眼下山——看不见路，但能感觉到脚下哪边是下坡，朝那迈一小步，再感觉一次。',
      ahead: '这一章学的是「怎么学」的通用规律。第 02 章会把这一条直线叠起来——规律一样，只是从 2 个参数变几十亿个。',
      points: ['损失函数：错多少', '梯度下降：往谷底走', '一次训练循环'] },
    { sec: 'ch2',  from: '一条直线',            to: '叠成网络',        note: '一条直线不够？把很多「线性变换 + 一次弯折」串起来。',
      analogy: '像搭积木——单块只能堆高高的塔，但把不同的连接搭在一起，就能拼出任意形状。',
      ahead: '这个网络的输入目前还是坐标点。第 03 章会解决最关键的问题：把一句话变成网络能啃的向量。',
      points: ['激活函数：为什么需要弯折', '多层叠加：拟合任意边界', '反向传播：错误往回传'] },
    { sec: 'ch3',  from: '文字的困惑',          to: '把字变成数',      note: '网络只认数字。这一步把词变成向量，满嘴话化作一列坐标。',
      analogy: '像给每个词发一张「语义地图上的坐标」——意思相近的词，坐标也靠得近。',
      ahead: '有了词向量，词之间还互相孤立、没交流。第 04 章学注意力——让每个 token 看得见其他 token。',
      points: ['分词：字 → token', '嵌入：token → 向量', '位置编码：顺序去哪了'] },
    { sec: 'ch4',  from: '每个词孤零零',        to: '让词彼此看见',    note: '注意力是唯一让 token 交换信息的地方——「I」在谁的语境里被点亮。',
      analogy: '像图书馆查资料——你提一个问题（Q），去翻每本书的标签（K），按匹配度取走内容（V）。',
      ahead: '注意力是模型的心脏，但只是一块砖。第 05 章把它嵌进残差流、再接前馈，拼成能无限堆叠的完整 Block。',
      points: ['Q / K / V 三件套', 'Softmax 打分', '多头注意力'] },
    { sec: 'ch5',  from: '注意力一块砖',        to: '拼成整栋楼',      note: '注意力只是模型心脏。把它嵌进残差流、再接前馈，才成为可堆叠的 Block。',
      analogy: '像流水线的一道工序——每个 token 进来，过一遍注意力、过一遍前馈、加回原样，就能交给下一层重复。',
      ahead: '模型跑完一整栋楼，吐出的是一堆 logits。第 06 章回答：怎么从这堆分数里，真的写下一个词。',
      points: ['残差连接：梯度直通', '前馈网络：升维再降维', 'LayerNorm：稳住分布'] },
    { sec: 'ch6',  from: '算完一堆向量',        to: '真的写下一个字',  note: '模型吐的不是词，是下一个词概率分布；要从分布里采一个。',
      analogy: '像掷骰子——但骰子被调过，有的面更重更可能朝上。温度就是控制「更随机还是更死板」。',
      ahead: '能写下一个词，是因为它已经「见过世面」。第 07 章讲预训练——模型怎么从海量文本里零基础学会语言。',
      points: ['logits → 概率', '温度：软硬之分', '自回归：一个词接一个词'] },
    { sec: 'ch7', from: '会写一个词',          to: '学会说话',        note: '预训练就是在海量文本上反复做「预测下一个词」，语言能力从这件最简单的事里涌现。',
      analogy: '像小孩学说话——不是先背语法书，而是听了几万亿句「下一句最可能是什么」，慢慢把世界规律摸透。',
      ahead: '它已经懂语言了。第 08 章讲怎么用你的数据，把它从「什么都会一点」改造成只懂你业务的专才。',
      points: ['预测下一个词', '交叉熵最小化', '涌现：语法、常识、推理'] },
    { sec: 'ch8',  from: '已经会说话',          to: '专才',            note: '想让它写诗、写代码？冻结大部分权重，只训练小块适配器。',
      analogy: '像给一个博学的老师傅配几块「专用插件」——底座不变，换上插件它就懂你的领域。',
      ahead: '会生成、也会微调，但说出的话未必合人心意。第 09 章用强化学习，把行为往「更像人」的方向掰。',
      points: ['全量微调 vs 冻结', 'LoRA 低秩适配', '提示工程 vs 微调'] },
    { sec: 'ch9',  from: '会生成',              to: '说得合人心意',    note: '让它对齐人类偏好，靠奖励信号把行为往「更像人」的方向掰。',
      analogy: '像教小孩——不是直接灌规则，而是「说对了就奖励」，慢慢把行为往合心意的方向塑造。',
      ahead: '单次问答已经合心意，但复杂任务办不了。第 10 章让模型查资料、调工具、判断重试——升级成会办事的 Agent。',
      points: ['奖励模型', 'PPO 裁剪', 'DPO 简化为偏好'] },
    { sec: 'ch10',  from: '单次问答',            to: '会办事',          note: '复杂任务要查资料、调工具、判断重试——把步骤串成链、环成图。',
      analogy: '像派一个助理去办事——查资料、打电话、看结果不行就换方案。链是流程单，图是能转圈的决策书。',
      ahead: '恭喜走到这。回头看看——一条 token 的旅程，其实第 11 章能带你完整重走一遍、一以贯之。',
      points: ['链：固定顺序', '图：分支与循环', '状态：记忆哪里来'] }
  ];

  function bridgeHTML(b) {
    return `<p class="bridge"><span class="bridge-from">${b.from}</span><span class="bridge-arrow">→</span><span class="bridge-to">${b.to}</span> <span class="bridge-note">${b.note}</span></p>`;
  }

  BRIDGES.forEach(b => {
    const sec = document.getElementById(b.sec);
    if (!sec) return;
    const head = sec.querySelector('.ch-head');
    const lead = sec.querySelector('.lead');
    if (!head || !lead) return;
    head.insertAdjacentHTML('afterend', bridgeHTML(b));
  });
})();

/* ============================================================
   CH7 PRETRAIN — 看着它学会预测下一个词
   ============================================================ */
(function pretrain() {
  const bars = $('#ptCanvas'), lossCv = $('#ptLoss');
  if (!bars) return;
  const bc = bars.getContext('2d'), lc = lossCv.getContext('2d');

  // 候选词：真实下一个词是「好」
  const WORDS = ['好', '差', '不错', '冷', '热', '晴', '阴', '棒', '糟', '美'];
  const TRUE = 0;  // 真实标签
  // 初始 logits：几乎均匀；训练后「好」越来越尖
  const initLogits = WORDS.map((_, i) => (Math.random() - 0.5) * 1.4);

  let step = 0, running = false, timer = null;
  const MAX = 100;
  const hist = [];  // loss 历史

  function logitsAt(s) {
    const t = s / MAX;                    // 0..1
    return initLogits.map((z, i) => {
      if (i === TRUE) return z + t * 6;   // 真实词分数抬高
      return z - t * 1.8;                 // 其他词压低
    });
  }
  function softmax(zs) {
    const m = Math.max(...zs);
    const e = zs.map(z => Math.exp(z - m));
    const s = e.reduce((a, b) => a + b, 0);
    return e.map(v => v / s);
  }
  function nll(ps) { return -Math.log(Math.max(ps[TRUE], 1e-12)); }

  function drawBars() {
    const W = bars.width, H = bars.height;
    const zs = logitsAt(step);
    const ps = softmax(zs);
    const padL = 48, padB = 28, padT = 18, padR = 12;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const bw = plotW / WORDS.length;

    bc.clearRect(0, 0, W, H);
    bc.fillStyle = C.bg; bc.fillRect(0, 0, W, H);

    WORDS.forEach((w, i) => {
      const h = ps[i] * plotH;
      const x = padL + i * bw + 4;
      const y = padT + plotH - h;
      bc.fillStyle = i === TRUE ? C.accent : (C.light ? 'rgba(156,74,47,.28)' : 'rgba(199,134,74,.35)');
      bc.fillRect(x, y, bw - 8, h);
      bc.fillStyle = C.dim;
      bc.font = '12px ' + cssv('--sans');
      bc.textAlign = 'center';
      bc.fillText(w, x + (bw - 8) / 2, H - 10);
    });

    bc.fillStyle = C.faint;
    bc.font = '11px ' + cssv('--mono');
    bc.textAlign = 'left';
    bc.fillText('P(下一个词 | 「今天天气真」)', padL, 14);

    const ppl = Math.exp(nll(ps));
    const pplEl = $('#ptPpl');
    if (pplEl) pplEl.textContent = ppl > 99 ? '∞' : ppl.toFixed(2);
  }

  function drawLoss() {
    const W = lossCv.width, H = lossCv.height;
    const padL = 36, padB = 24, padT = 16, padR = 12;
    const plotW = W - padL - padR, plotH = H - padT - padB;

    lc.clearRect(0, 0, W, H);
    lc.fillStyle = C.bg; lc.fillRect(0, 0, W, H);

    lc.strokeStyle = C.line; lc.lineWidth = 1;
    lc.beginPath(); lc.moveTo(padL, padT); lc.lineTo(padL, padT + plotH); lc.lineTo(padL + plotW, padT + plotH); lc.stroke();

    if (hist.length < 2) {
      lc.fillStyle = C.faint; lc.font = '12px ' + cssv('--sans'); lc.textAlign = 'center';
      lc.fillText('loss 曲线会随训练出现', padL + plotW / 2, padT + plotH / 2);
      return;
    }
    const maxL = Math.max(...hist, 0.1);
    lc.strokeStyle = C.accent; lc.lineWidth = 2.2;
    lc.beginPath();
    hist.forEach((v, i) => {
      const x = padL + (i / (MAX - 1)) * plotW;
      const y = padT + plotH - (v / maxL) * plotH;
      if (i === 0) lc.moveTo(x, y); else lc.lineTo(x, y);
    });
    lc.stroke();

    lc.fillStyle = C.faint; lc.font = '11px ' + cssv('--mono'); lc.textAlign = 'left';
    lc.fillText('loss', 8, padT + 4);
    lc.textAlign = 'right';
    lc.fillText('步数 →', W - padR, H - 8);
  }

  function apply(s) {
    step = Math.max(0, Math.min(MAX, s));
    $('#ptStep').value = step;
    $('#ptStepv').textContent = step;
    const ps = softmax(logitsAt(step));
    hist[step] = nll(ps);
    // 填中间空档
    if (step > 0 && hist[step - 1] == null) {
      for (let i = 0; i <= step; i++) if (hist[i] == null) hist[i] = nll(softmax(logitsAt(i)));
    }
    drawBars(); drawLoss();
  }

  $('#ptStep').addEventListener('input', e => apply(+e.target.value));
  $('#ptRun').addEventListener('click', () => {
    if (running) { clearInterval(timer); running = false; $('#ptRun').textContent = '自动训练'; return; }
    running = true; $('#ptRun').textContent = '暂停';
    timer = setInterval(() => {
      if (step >= MAX) { clearInterval(timer); running = false; $('#ptRun').textContent = '自动训练'; return; }
      apply(step + 1);
    }, 40);
  });
  $('#ptReset').addEventListener('click', () => {
    clearInterval(timer); running = false; $('#ptRun').textContent = '自动训练';
    hist.length = 0; apply(0);
  });

  apply(0);
  REDRAW.push(() => apply(step));
})();

/* ============================================================
   JOURNEY MAP  (index.html / basics.html)
   ============================================================ */
(function journey() {
  const hubs = $$('.journey-hub');
  if (!hubs.length) return;
  $$('.journey-hub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const hub = btn.closest('.journey-hub');
      const open = hub.classList.contains('is-open');
      hubs.forEach(h => h.classList.remove('is-open'));
      if (!open) hub.classList.add('is-open');
    });
  });
  $$('.journey-substop').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.sec);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
