/* ============================================================
   工程基础 - interactive demos
   Theme-aware: re-reads CSS tokens on themechange.
   Relies on app.js for $, $$, C, REDRAW, theme, scrollspy.
   ============================================================ */
'use strict';

/* ---------- hero: 一条流水线 ---------- */
(function hero() {
  const cv = $('#bHero');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const labels = ['机器', '命令', 'Python', '数据', '库', '服务'];
  const N = labels.length;
  let t = 0, vis = true;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    const nodes = labels.map((_, i) => {
      const x = 70 + i * ((W - 140) / (N - 1));
      const y = H / 2 + Math.sin(t * .0011 + i * .7) * 18;
      return { x, y };
    });
    nodes.forEach((n, i) => {
      if (i === N - 1) return;
      const b = nodes[i + 1];
      const pulse = (Math.sin(t * .002 + i) + 1) / 2;
      ctx.strokeStyle = `rgba(${C.heat},${(.12 + pulse * .45).toFixed(3)})`;
      ctx.lineWidth = 1.4 + pulse * 1.8;
      ctx.beginPath(); ctx.moveTo(n.x + 22, n.y); ctx.lineTo(b.x - 22, b.y); ctx.stroke();
      const p = (t * .00035 + i * .18) % 1;
      const px = n.x + 22 + (b.x - 22 - n.x - 22) * p;
      const py = n.y + (b.y - n.y) * p;
      ctx.beginPath(); ctx.arc(px, py, 3.2, 0, 7);
      ctx.fillStyle = C.accent; ctx.fill();
    });
    nodes.forEach((n, i) => {
      const pulse = (Math.sin(t * .0018 + i * .9) + 1) / 2;
      ctx.beginPath(); ctx.arc(n.x, n.y, 20 + pulse * 3, 0, 7);
      ctx.fillStyle = `rgba(${C.heat},${(.08 + pulse * .1).toFixed(3)})`; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, 5, 0, 7);
      ctx.fillStyle = C.accent; ctx.fill();
      ctx.fillStyle = C.dim; ctx.font = '13px ' + cssv('--sans');
      ctx.textAlign = 'center'; ctx.fillText(labels[i], n.x, n.y + 42);
    });
    t += 16;
    if (!REDUCED && vis) requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      vis = es[0].isIntersecting;
      if (vis && !REDUCED) frame();
    }, { threshold: 0.01 });
    io.observe(cv);
  }
  frame();
  REDRAW.push(() => { if (REDUCED || vis) frame(); });
})();

/* ---------- Linux 目录树 ---------- */
(function tree() {
  const box = $('#fsDetail');
  if (!box) return;
  const data = {
    '/': { title: '/  根目录', body: '整棵树的起点。Linux 里「一切皆文件」：硬盘、进程、网卡，最后都能在某个路径下找到。' },
    '/home': { title: '/home  普通用户的家', body: '每个账号一个子目录，比如 /home/atguigu。日常写代码、放数据集，都从这里开始。相当于 Windows 的「用户文件夹」。' },
    '/root': { title: '/root  超管的家', body: 'root 用户的家目录，和 /home 分开。不要把自己的项目塞进这里。' },
    '/etc': { title: '/etc  配置', body: '系统级配置文件：apt 源、ssh、网络、用户表 /etc/passwd。改环境、改镜像源，十有八九在这里。' },
    '/usr': { title: '/usr  已安装的软件', body: '用户态程序、库、手册页。apt install 下来的东西大多落在 /usr/bin、/usr/lib。像 Windows 的 Program Files。' },
    '/opt': { title: '/opt  第三方软件', body: '可选、第三方的大软件。Anaconda、自编译的 CUDA、自己装的模型运行时，习惯放这里。' },
    '/var': { title: '/var  会变的数据', body: '日志 /var/log、缓存、数据库文件。容器里 MySQL 的数据目录也常挂到这里。' },
    '/tmp': { title: '/tmp  临时文件', body: '重启后可能被清掉。下载、解压的中间产物可以放这里，别当仓库用。' },
    '/bin': { title: '/bin  基本命令', body: 'ls、cp、bash 这类开机就要用的命令。现代 Ubuntu 里它是 /usr/bin 的软链接。' },
    '/proc': { title: '/proc  活着的内核', body: '不是磁盘上的真文件，是内核把进程和硬件状态映射成的目录。cat /proc/cpuinfo 就是在问 CPU。' }
  };
  function show(key) {
    const d = data[key];
    box.innerHTML = `<h4>${d.title}</h4><p>${d.body}</p>`;
    $$('.tree-item').forEach(b => b.classList.toggle('is-on', b.dataset.k === key));
  }
  $$('.tree-item').forEach(b => b.addEventListener('click', () => show(b.dataset.k)));
  show('/');
})();

/* ---------- chmod ---------- */
(function chmod() {
  const out = $('#permOut');
  if (!out) return;
  const bits = $$('.perm-bit');
  const meaning = [
    ['读文件内容', '列出目录'],
    ['改文件内容', '在目录里增删文件'],
    ['当程序跑', 'cd 进这个目录']
  ];
  function draw() {
    let oct = 0, sym = '';
    for (let g = 0; g < 3; g++) {
      let n = 0;
      for (let i = 0; i < 3; i++) {
        const on = bits[g * 3 + i].classList.contains('is-on');
        if (on) n += [4, 2, 1][i];
        sym += on ? 'rwx'[i] : '-';
      }
      oct = oct * 10 + n;
    }
    const who = ['属主', '属组', '其他人'];
    const lines = who.map((w, g) => {
      const r = bits[g * 3].classList.contains('is-on');
      const x = bits[g * 3 + 2].classList.contains('is-on');
      return `${w}：${r ? '能读' : '不能读'} / ${x ? '能进目录' : '不能进目录'}`;
    });
    out.innerHTML = `<b>chmod ${oct}</b>　　<span class="mono">${sym}</span>\n${lines.join('\n')}\n\n对文件：r 读内容，w 改内容，x 当程序执行。\n对目录：r 列出名字，w 增删，x 才能 cd 进去。`;
  }
  bits.forEach(b => b.addEventListener('click', () => { b.classList.toggle('is-on'); draw(); }));
  draw();
  $$('[data-perm]').forEach(btn => btn.addEventListener('click', () => {
    const v = btn.dataset.perm.split('').map(Number);
    bits.forEach((b, i) => {
      const g = Math.floor(i / 3), k = i % 3;
      const on = (v[g] & [4, 2, 1][k]) !== 0;
      b.classList.toggle('is-on', on);
    });
    draw();
  }));
})();

/* ---------- Shell 引号 ---------- */
(function quotes() {
  const out = $('#shOut');
  if (!out) return;
  const name = 'atguigu';
  const files = ['a.txt', 'b.txt', 'my file.txt'];
  function run() {
    const mode = ($('.chip.is-on', $('#shDemo')) || {}).dataset.mode || 'double';
    const cmd = {
      double: 'echo "HOME=$HOME user=$USER"',
      single: "echo 'HOME=$HOME user=$USER'",
      none: 'echo HOME=$HOME user=$USER',
      star: 'echo *.txt',
      qstar: 'echo "*.txt"'
    }[mode];
    const result = {
      double: `HOME=/home/${name} user=${name}`,
      single: 'HOME=$HOME user=$USER',
      none: `HOME=/home/${name} user=${name}`,
      star: files.join(' '),
      qstar: '*.txt'
    }[mode];
    const why = {
      double: '双引号会展开变量，空格仍被当成「这一串」。日常拼路径用它。',
      single: '单引号是「平权符号」：里面写什么就输出什么，$HOME 不会被替换。',
      none: '不打引号也会展开变量，但遇到空格会拆成多个参数。文件名有空格就会踩坑。',
      star: '没有引号时 * 是通配符，Shell 先展开成当前目录下所有 .txt，再交给 echo。',
      qstar: '加了引号，* 只是普通字符，所以原样打印 *.txt。'
    }[mode];
    out.innerHTML = `<b>$ ${cmd}</b>\n${result}\n\n${why}`;
  }
  $$('#shDemo .chip').forEach(c => c.addEventListener('click', () => {
    $$('#shDemo .chip').forEach(x => x.classList.remove('is-on'));
    c.classList.add('is-on'); run();
  }));
  run();
})();

/* ---------- Python 容器 ---------- */
(function boxes() {
  const stage = $('#boxStage');
  if (!stage) return;
  const kinds = {
    list:  { title: 'list  有序可变 []', items: ['"a"', '1', '[2, 3]'], note: '可增删改。同一个 list 被多个变量引用时，改一处全看见。' },
    tuple: { title: 'tuple  有序不可变 ()', items: ['"a"', '1', '(2, 3)'], note: '一旦造好就不能改。可做字典的键。里面如果嵌了 list，那个 list 仍可变。' },
    dict:  { title: 'dict  键值对 {}', items: ['name: "李"', 'age: 20'], note: '用键查找，平均 O(1)。键必须可哈希：str / int / tuple，不能是 list。' },
    set:   { title: 'set  无序不重复 {}', items: ['"a"', '1', '3'], note: '自动去重，成员判断极快。没有下标，不能切片。' }
  };
  function show(k) {
    const d = kinds[k];
    stage.innerHTML = `<div class="cells">${d.items.map((x, i) => `<span class="cell">${x}<kbd>${k === 'dict' ? '' : i}</kbd></span>`).join('')}</div>
      <p class="tip" style="margin-top:12px;border:0;padding:0"><b>${d.title}</b>　${d.note}</p>`;
    $$('#boxDemo .chip').forEach(c => c.classList.toggle('is-on', c.dataset.k === k));
  }
  $$('#boxDemo .chip').forEach(c => c.addEventListener('click', () => show(c.dataset.k)));
  show('list');
})();

/* ---------- NumPy 广播 ---------- */
(function broadcast() {
  const wrap = $('#bcWrap');
  if (!wrap) return;
  const shapes = ['(3,)', '(3,1)', '(1,3)', '(3,3)', '(2,)'];
  let a = '(3,1)', b = '(1,3)';

  function parse(s) {
    return s.slice(1, -1).split(',').map(x => x.trim()).filter(Boolean).map(Number);
  }
  function align(sa, sb) {
    const n = Math.max(sa.length, sb.length);
    const A = Array(n - sa.length).fill(1).concat(sa);
    const B = Array(n - sb.length).fill(1).concat(sb);
    const R = [];
    for (let i = 0; i < n; i++) {
      if (A[i] === B[i]) R.push(A[i]);
      else if (A[i] === 1) R.push(B[i]);
      else if (B[i] === 1) R.push(A[i]);
      else return null;
    }
    return { A, B, R };
  }
  function grid(shape, kind) {
    const r = shape.length === 1 ? 1 : shape[0];
    const c = shape.length === 1 ? shape[0] : shape[shape.length - 1];
    const rows = r > 4 ? 3 : r, cols = c > 4 ? 3 : c;
    const cells = [];
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const ghost = (kind === 'A' && shape[0] === 1 && i > 0) || (kind === 'B' && shape[shape.length - 1] === 1 && j > 0);
      cells.push(`<span class="bc-cell${ghost ? ' ghost' : ''}">${kind === 'R' ? i * cols + j + 1 : (kind === 'A' ? i + 1 : j + 1)}</span>`);
    }
    return `<div class="bc-grid" style="grid-template-columns:repeat(${cols},36px)">${cells.join('')}</div>
      <div style="text-align:center;font-family:var(--mono);font-size:12px;color:var(--faint);margin-top:6px">${kind} ${shape.length ? '(' + shape.join(',') + ')' : ''}</div>`;
  }
  function draw() {
    $$('#bcA .chip').forEach(c => c.classList.toggle('is-on', c.dataset.s === a));
    $$('#bcB .chip').forEach(c => c.classList.toggle('is-on', c.dataset.s === b));
    const res = align(parse(a), parse(b));
    const el = $('#bcViz');
    if (!res) {
      el.innerHTML = `<p class="bc-err">形状 ${a} 和 ${b} 对不齐：某个维度既不相等，也没有 1，广播失败。</p>`;
      return;
    }
    el.innerHTML = `<div class="bc-row">
      ${grid(res.A, 'A')}
      <div class="bc-op">+</div>
      ${grid(res.B, 'B')}
      <div class="bc-op">→</div>
      ${grid(res.R, 'R')}
    </div>
    <p class="tip">规则：从右边对齐；维数不够就在左边补 1；某一维是 1 就「拉长」成另一边的长度。浅色格子是被广播出来的重复值。</p>`;
  }
  $$('#bcA .chip').forEach(c => c.addEventListener('click', () => { a = c.dataset.s; draw(); }));
  $$('#bcB .chip').forEach(c => c.addEventListener('click', () => { b = c.dataset.s; draw(); }));
  draw();
})();

/* ---------- MySQL JOIN ---------- */
(function join() {
  const out = $('#joinOut');
  if (!out) return;
  const emp = [
    { id: 1, name: '李冰冰', did: 1 },
    { id: 2, name: '周旭飞', did: 2 },
    { id: 3, name: '王五', did: null }
  ];
  const dept = [
    { id: 1, name: '研发' },
    { id: 2, name: '市场' },
    { id: 3, name: '财务' }
  ];
  function rows(mode) {
    if (mode === 'inner') return emp.filter(e => dept.some(d => d.id === e.did)).map(e => ({ e, d: dept.find(d => d.id === e.did) }));
    if (mode === 'left') return emp.map(e => ({ e, d: dept.find(d => d.id === e.did) || null }));
    if (mode === 'right') return dept.map(d => ({ e: emp.find(e => e.did === d.id) || null, d }));
  }
  function table(title, cols, data, hit) {
    return `<table class="mini-table"><caption>${title}</caption><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${data.map((r, i) => `<tr class="${hit(r, i) ? 'is-hit' : 'is-miss'}">${r.map(c => `<td>${c ?? '<span style="opacity:.45">NULL</span>'}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function draw(mode) {
    $$('#joinDemo .chip').forEach(c => c.classList.toggle('is-on', c.dataset.m === mode));
    const rs = rows(mode);
    const why = {
      inner: 'INNER JOIN 只留两边都匹配上的行。王五没有部门，财务没有员工，都被丢掉。',
      left: 'LEFT JOIN 左表全留。王五留下了，部门那一侧是 NULL。财务部因为不在左表，不会出现。',
      right: 'RIGHT JOIN 右表全留。财务部留下了，员工那一侧是 NULL。王五因为部门是 NULL，对不上右表。'
    }[mode];
    const result = rs.map(x => [x.e ? x.e.name : null, x.d ? x.d.name : null]);
    out.innerHTML = `<div class="join-wrap">
      ${table('t_employee', ['id', 'name', 'did'], emp.map(e => [e.id, e.name, e.did]), e => mode !== 'right' ? (mode === 'inner' ? e[2] != null : true) : emp.some((row, i) => row.name === e[1] && rs.some(r => r.e && r.e.name === row.name)))}
      ${table('t_department', ['id', 'name'], dept.map(d => [d.id, d.name]), d => mode !== 'left' ? (mode === 'inner' ? emp.some(e => e.did === d[0]) : true) : dept.some(x => x.name === d[1] && rs.some(r => r.d && r.d.name === x.name)))}
    </div>
    ${table('结果', ['员工', '部门'], result, () => true)}
    <p class="tip">${why}</p>`;
  }
  $$('#joinDemo .chip').forEach(c => c.addEventListener('click', () => draw(c.dataset.m)));
  draw('inner');
})();

/* ---------- 协程事件循环 ---------- */
(function loop() {
  const aBar = $('#loopA'), bBar = $('#loopB');
  if (!aBar) return;
  const status = $('#loopStatus');
  let timer = null, t = 0, mode = 'par';
  const dur = { A: 1000, B: 2000 };

  function setMode(m) {
    mode = m;
    $$('#loopDemo .chip').forEach(c => c.classList.toggle('is-on', c.dataset.m === m));
    reset();
  }
  function reset() {
    clearInterval(timer); timer = null; t = 0;
    aBar.style.width = '0%'; bBar.style.width = '0%';
    $('#loopAt').textContent = '待命';
    $('#loopBt').textContent = '待命';
    status.textContent = mode === 'par' ? '并发：两个 await 一起等，总时间 ≈ 最慢的那个 2s。' : '串行：先等 A 的 1s，再等 B 的 2s，总共 3s。';
    $('#loopRun').textContent = '跑一次';
  }
  function tick() {
    t += 40;
    if (mode === 'par') {
      const pa = Math.min(1, t / dur.A), pb = Math.min(1, t / dur.B);
      aBar.style.width = (pa * 100) + '%';
      bBar.style.width = (pb * 100) + '%';
      $('#loopAt').textContent = pa < 1 ? 'await 中' : '完成';
      $('#loopBt').textContent = pb < 1 ? 'await 中' : '完成';
      if (pb >= 1) { clearInterval(timer); timer = null; status.textContent = '并发完成，墙钟时间 2.0s。事件循环在 A 睡着时去跑 B。'; $('#loopRun').textContent = '跑一次'; }
    } else {
      if (t <= dur.A) {
        aBar.style.width = (t / dur.A * 100) + '%';
        $('#loopAt').textContent = 'await 中';
        $('#loopBt').textContent = '还没开始';
      } else {
        aBar.style.width = '100%'; $('#loopAt').textContent = '完成';
        const tb = t - dur.A;
        bBar.style.width = Math.min(100, tb / dur.B * 100) + '%';
        $('#loopBt').textContent = tb < dur.B ? 'await 中' : '完成';
        if (tb >= dur.B) { clearInterval(timer); timer = null; status.textContent = '串行完成，墙钟时间 3.0s。await A 不返回，B 根本进不去。'; $('#loopRun').textContent = '跑一次'; }
      }
    }
  }
  $$('#loopDemo .chip').forEach(c => c.addEventListener('click', () => setMode(c.dataset.m)));
  $('#loopRun').addEventListener('click', () => {
    if (timer) { reset(); return; }
    reset();
    $('#loopRun').textContent = '停止';
    timer = setInterval(tick, 40);
  });
  $('#loopReset').addEventListener('click', reset);
  setMode('par');
})();

/* ---------- Docker 三层 ---------- */
(function dock() {
  const detail = $('#dockDetail');
  if (!detail) return;
  const info = {
    image: { title: '镜像 Image = 只读安装包', body: 'mysql:8.0、python:3.12-slim 都是模板。里面装着操作系统精简层、依赖、配置。只读，所以同一份镜像可以开出无数个容器。docker pull 就是从仓库把这个安装包拉下来。' },
    container: { title: '容器 Container = 正在跑的进程', body: 'docker run 在镜像上面盖一层可写层，于是有了一个隔离的进程。停掉、删掉，可写层一起没。所以「容器里的数据默认会丢」——这不是 bug，是设计。' },
    volume: { title: '数据卷 Volume = 专门存数据的盘', body: '把 /var/lib/mysql 挂到命名卷 mysql-data 上。容器删了，卷还在。下次用同一卷再 run，库表都还在。移植环境时，代码走镜像，数据走卷。' }
  };
  function show(k) {
    $$('#dockDemo .dock-layer').forEach(el => el.classList.toggle('is-on', el.dataset.k === k));
    const d = info[k];
    detail.innerHTML = `<b>${d.title}</b>${d.body}`;
  }
  $$('#dockDemo .dock-layer').forEach(el => el.addEventListener('click', () => show(el.dataset.k)));
  show('image');
})();
