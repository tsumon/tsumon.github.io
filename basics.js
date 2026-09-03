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

/* ---------- 三个推导式 ---------- */
(function comp() {
  const stage = $('#compStage');
  if (!stage) return;
  const xs = [0, 1, 2, 3, 4];
  const kinds = {
    list: {
      code: '[x * 2 for x in range(5)]',
      note: '方括号：立刻算出整份 list，五个格子一次性出现。一百万个数就会占一百万个位置。'
    },
    dict: {
      code: '{x: x * 2 for x in range(5)}',
      note: '花括号加冒号：键值对。键必须可哈希。用来做查找表、词表 id→token。'
    },
    set: {
      code: '{x * 2 for x in range(5)}',
      note: '花括号没冒号：集合，自动去重、无下标。成员判断很快。'
    },
    gen: {
      code: '(x * 2 for x in range(5))',
      note: '圆括号：生成器表达式。现在还什么都没算。点 next()，才吐下一个。'
    }
  };
  let kind = 'list', gi = 0;

  function cells(vals, doneMax) {
    return `<div class="cells">${vals.map((v, i) => {
      const cls = doneMax == null ? '' : (i < doneMax ? ' is-done' : ' is-wait');
      const body = doneMax == null || i < doneMax ? v : '?';
      return `<span class="cell${cls}">${body}<kbd>${i}</kbd></span>`;
    }).join('')}</div>`;
  }

  function draw() {
    const d = kinds[kind];
    $('#compCode').textContent = d.code;
    $$('#compDemo .chip').forEach(c => c.classList.toggle('is-on', c.dataset.k === kind));
    const btns = $('#compBtns');
    const doubled = xs.map(x => x * 2);
    if (kind === 'list') {
      btns.hidden = true;
      stage.innerHTML = cells(doubled) + `<p class="tip">${d.note}</p>`;
    } else if (kind === 'dict') {
      btns.hidden = true;
      stage.innerHTML = `<div class="cells">${xs.map(x => `<span class="cell">${x}: ${x * 2}</span>`).join('')}</div><p class="tip">${d.note}</p>`;
    } else if (kind === 'set') {
      btns.hidden = true;
      stage.innerHTML = cells(doubled).replace(/<kbd>\d+<\/kbd>/g, '') + `<p class="tip">${d.note}</p>`;
    } else {
      btns.hidden = false;
      const exhausted = gi >= doubled.length;
      const now = exhausted ? cells(doubled, gi) : cells(doubled, gi);
      const msg = exhausted
        ? 'StopIteration。生成器取完作废，要再用得重新造一份。'
        : (gi === 0 ? d.note : `刚吐出 ${doubled[gi - 1]}。已经算过的不会再算，没算过的还不占内存。`);
      stage.innerHTML = `<p class="tip" style="margin:0 0 10px;border:0;padding:0"><b>&lt;generator&gt;</b>　已取 ${gi} / 5</p>` + now + `<p class="tip">${msg}</p>`;
    }
  }

  $$('#compDemo .chip').forEach(c => c.addEventListener('click', () => {
    kind = c.dataset.k; gi = 0; draw();
  }));
  $('#compNext').addEventListener('click', () => {
    if (kind !== 'gen') return;
    if (gi < xs.length) gi += 1;
    draw();
  });
  $('#compReset').addEventListener('click', () => { gi = 0; draw(); });
  draw();
})();

/* ---------- 闭包 ---------- */
(function close() {
  const stage = $('#closeStage');
  if (!stage) return;
  let n = 2;
  function draw() {
    $$('#closeDemo .chip').forEach(c => c.classList.toggle('is-on', Number(c.dataset.n) === n));
    const sample = 4;
    stage.innerHTML = `<div class="close-flow">
      <div class="close-box is-gone">
        <span class="close-k">外层已返回</span>
        <code>def make_mul(n=${n}):</code>
        <code>　　def inner(x): return x * n</code>
        <code>　　return inner</code>
      </div>
      <span class="close-arrow">捕获 n=${n}</span>
      <div class="close-box is-live">
        <span class="close-k">闭包还活着</span>
        <code>fn = make_mul(${n})</code>
        <code>fn(${sample}) → <b>${sample * n}</b></code>
        <p>n 跟着 inner 走，不随 make_mul 结束而销毁。</p>
      </div>
    </div>`;
  }
  $$('#closeDemo .chip').forEach(c => c.addEventListener('click', () => { n = Number(c.dataset.n); draw(); }));
  draw();
})();

/* ---------- 迭代器 next() ---------- */
(function iter() {
  const stage = $('#iterStage');
  if (!stage) return;
  const tokens = ['你', '好', '世', '界'];
  let i = 0;
  function draw() {
    const done = i >= tokens.length;
    stage.innerHTML = `<div class="cells">${tokens.map((t, k) => {
      const cls = k < i ? ' is-done' : (k === i ? ' is-now' : ' is-wait');
      return `<span class="cell${cls}">${t}<kbd>${k}</kbd></span>`;
    }).join('')}</div>`;
    const tip = $('#iterTip');
    if (i === 0) tip.textContent = '刚 iter(tokens)。还一个都没取。for 循环背后就是反复调 next()。';
    else if (!done) tip.textContent = `next() → '${tokens[i - 1]}'。游标已经越过它，回不去。`;
    else tip.textContent = 'StopIteration。迭代器用尽。重新 iter() 才能再走一遍。';
    $('#iterNext').disabled = done;
  }
  $('#iterNext').addEventListener('click', () => { if (i < tokens.length) { i += 1; draw(); } });
  $('#iterReset').addEventListener('click', () => { i = 0; draw(); });
  draw();
})();

/* ---------- 装饰器叠层 ---------- */
(function deco() {
  const stage = $('#decoStage');
  if (!stage) return;
  const all = ['log', 'timer', 'retry'];
  const label = { log: '@log 记一笔', timer: '@timer 计时', retry: '@retry 失败重试' };
  const on = new Set(['log']);

  function draw() {
    $$('#decoDemo .chip').forEach(c => c.classList.toggle('is-on', on.has(c.dataset.k)));
    const stack = all.filter(k => on.has(k));
    const enter = stack.slice();
    const leave = stack.slice().reverse();
    const layers = enter.map(k => `<div class="deco-layer">${label[k]} 进入</div>`).join('')
      + `<div class="deco-core">chat("你好") → 原函数，没被改过</div>`
      + leave.map(k => `<div class="deco-layer is-out">${label[k]} 离开</div>`).join('');
    const sugar = stack.length
      ? stack.map(k => '@' + k).join('\\n') + '\\ndef chat(): ...'
      : 'def chat(): ...   # 没有装饰器，直接调用';
    const eq = stack.length
      ? 'chat = ' + stack.slice().reverse().reduce((acc, k) => `${k}(${acc})`, 'chat')
      : 'chat 就是它自己';
    stage.innerHTML = `<pre>${sugar.replace(/\\n/g, '\n')}</pre>
      <div class="deco-stack">${layers}</div>
      <p class="tip">${eq}。先写的装饰器在最外层，进得最早、出得最晚。</p>`;
  }

  $$('#decoDemo .chip').forEach(c => c.addEventListener('click', () => {
    const k = c.dataset.k;
    if (on.has(k)) on.delete(k); else on.add(k);
    draw();
  }));
  draw();
})();

/* ---------- 三程工位 ---------- */
(function conc() {
  const stage = $('#concStage');
  if (!stage) return;
  const copy = {
    proc: {
      title: '两个进程 = 两间独立的房间',
      body: '各有自己的内存。一个崩了不影响另一个。GIL 管不到隔壁房间，所以 CPU 密集用它来真并行。代价是造得贵，数据要靠队列或管道搬。',
      lanes: [
        { name: '进程 A', items: ['代码', '数据', 'CPU ✓'] },
        { name: '进程 B', items: ['代码', '数据', 'CPU ✓'] }
      ]
    },
    th: {
      title: '两个线程 = 同一房间里的两双手',
      body: '共享地址空间，传递数据便宜。但 CPython 有 GIL：同一时刻只有一只手能跑字节码。等 I/O 时会放手，所以读文件、调接口仍然划算；算矩阵就不划算。',
      lanes: [
        { name: '线程 1', items: ['跑字节码', 'GIL 钥匙'] },
        { name: '线程 2', items: ['在等钥匙', '共享内存'] }
      ]
    },
    co: {
      title: '两个协程 = 一只手自己排队',
      body: '不劳操作系统调度。碰到 await（等网络、等磁盘）就让位，事件循环去跑下一个。一个协程只要几 KB。CPU 密集的活会堵住整条循环，别往里塞。',
      lanes: [
        { name: '协程 retrieve', items: ['await 检索', '让出'] },
        { name: '协程 call_llm', items: ['await 模型', '让出'] }
      ]
    }
  };
  function draw(k) {
    $$('#concDemo .chip').forEach(c => c.classList.toggle('is-on', c.dataset.k === k));
    const d = copy[k];
    const lanes = d.lanes.map(l => `<div class="conc-lane ${k}">
      <h4>${l.name}</h4>
      <div class="cells">${l.items.map(x => `<span class="cell">${x}</span>`).join('')}</div>
    </div>`).join('');
    const wall = k === 'proc'
      ? '<div class="conc-wall">内存墙<br>互不看见</div>'
      : (k === 'th' ? '<div class="conc-wall is-soft">GIL<br>同一时刻一把钥匙</div>' : '<div class="conc-wall is-soft">事件循环<br>await 就换人</div>');
    stage.innerHTML = `<div class="conc-board">${lanes}${wall}</div><p class="tip"><b>${d.title}</b>　${d.body}</p>`;
  }
  $$('#concDemo .chip').forEach(c => c.addEventListener('click', () => draw(c.dataset.k)));
  draw('proc');
})();
