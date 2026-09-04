# 互动版自审自改 · 五轮记录

工作目录 `/home/box/mac/llm-guide`。本地服务 `127.0.0.1:8765`。截图在 `/workspace/doodle-iter/interactive-rN-*.png`。未 git commit / push，未同步本机。

阶段 A 已完成：`doodle.html` `#ch7` 改用 `assets/doodle/meta-pretrain.jpg`，封面 `cover-model.jpg` 未覆盖。

---

## 第 1 轮

### 看

桌面 1280×900、手机 390×844，打开 `index.html` / `math.html` / `basics.html`。截图：`interactive-r1-index-hero.png`、`interactive-r1-math-hero.png`、`interactive-r1-basics-hero.png`、`interactive-r1-index-mobile.png`、`interactive-r1-math-mobile.png`、`interactive-r1-basics-mobile.png`。对照 README、CLAUDE.md、`check-math.sh`。

### 判（按严重度）

1. **高** · `math.html` 把「手绘本」写在 `.hero-sub` 里，链接是浏览器默认蓝，和模型/工程页的酱红外观打架。
2. **中** · README / CLAUDE.md 仍写手绘本「宋体正文」，页面已改霞鹜文楷。
3. **中** · 数学 hero 没有 `.hero-quiet`，和另外两页节奏不一致。
4. **中** · 手机侧栏关掉后没有章节入口（留给第 2 轮）。
5. **低** · 侧栏序号 `--faint`，hover 颜色等于默认色，等于没 hover（留给第 2 轮）。

欠账核实：KaTeX 已是 `vendor/katex`、无 CDN；`check-math.sh` 通过；高斯独立演示已删；手绘本顶栏已指向 `doodle*`。文档里的 1425/56KB 只留在 CHANGELOG 历史条。

### 改（3 项）

1. `style.css`：`.hero-sub a` 与 `.hero-quiet a` 共用酱红。
2. `math.html`：副标题不再夹链接；补 `.hero-quiet`「公式用离线 KaTeX。另有一册手绘本」。
3. README.md / CLAUDE.md：「宋体正文」→「文楷正文」。

### 验

改后截图 `interactive-r1-math-hero-after.png`、`interactive-r1-math-mobile-after.png`。

| 问题 | 改动 | 结果 |
|---|---|---|
| 数学页手绘本默认蓝 | 链接改到 `.hero-quiet` + 共用酱红 | 桌面/手机「手绘本」与模型/工程页同色 |
| 三页 hero 节奏 | 数学补 quiet 行 | 按钮下多一行说明，不再把链接塞进副标题 |
| 文档宋体 | README / CLAUDE | 与手绘本文楷一致 |

未改：手机无章节跳转、侧栏 hover。留给后轮。

---

## 第 2 轮

### 看

深色 `interactive-r2-index-dark.png`；试图锚到章节（headless hash 截图不可靠，仍看到 hero）。手机端无侧栏已在 r1 确认。读 `app.js` scrollspy：只有一处 `scroll` 监听，数学页无内联重复。

### 判

1. **高** · `max-width: 900px` 时 `.rail { display: none }`，整章目录消失，只能靠顶栏四颗胶囊换页。
2. **中** · `.rail-list a:hover { color: var(--dim) }` 与默认相同；序号 `--faint`，对比偏弱。
3. **中** · `html` 未设 `color-scheme`，深色下系统控件/滚动条仍按浅色。
4. **低** · 工程页流水线标签用 `C.dim`，手机上「库」偏淡（留给第 4 轮）。

### 改（3 项）

1. `app.js`：从侧栏 `#` 锚点生成 `<select class="chap-jump">`，窄屏固定在顶栏下；scrollspy 同步当前章。
2. `style.css`：侧栏 hover 改为 `--text` / `--accent-ink`，序号改 `--dim`。
3. `html { color-scheme: light }`，`[data-theme="dark"] { color-scheme: dark }`。

验时发现跳转条与头图上沿相叠，随即把 jumper 底加实、hero 补 `padding-top: 18px`。

### 验

`interactive-r2-index-mobile-after.png`、`interactive-r2-math-mobile-after.png`、`interactive-r2-index-desktop-after.png`、`interactive-r2-index-dark-after.png`、`interactive-r2-index-mobile-pad.png`。DOM dump 确认 `<select class="chap-jump">` 含 `#ch1`…。`check-math.sh` 仍通过。

| 问题 | 改动 | 结果 |
|---|---|---|
| 手机无章节 | `.chap-jump` | 模型页显示「01 机器学习」，数学/工程显示「00 从这里开始」 |
| 桌面误显示跳转 | 默认 `display:none` | 1280 截图无此条 |
| 深色 | color-scheme | 深色 hero 仍完整；太阳图标在 |
| jumper 压头图 | 实底 + hero 上内边距 | pad 后图完整落在条下 |

未改：流水线标签对比、FIX-NOTES 过期验证命令。

---

## 第 3 轮

### 看

章节正文 CSS：`.ch > p` / `.lead` 用 `--dim` `#8b8177`。按钮、顶栏、主题键几乎没有 `:focus-visible`。`html { scroll-behavior: smooth }` 无 reduced-motion 例外。

### 判

1. **高** · 长文用暖灰，长时间阅读对比不够。
2. **中** · 键盘用户看不出焦点。
3. **中** · `prefers-reduced-motion` 时仍平滑滚动。
4. **低** · 未用 `*` 一刀切禁掉过渡（会伤主题切换）。

### 改（3 项）

1. 新增 `--read`（浅 `#4e463e` / 深 `#e6dfd6`），`.lead` 与 `.ch > p` 改用它。
2. `.theme-btn` / `.pagelink` / `.chap-jump` / `.btn` / `.rail-list a` 加 `:focus-visible` 酱红描边。
3. `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`。

### 验

`interactive-r3-index-hero.png` 确认 hero 浅色语言未变。焦点环无法在无头截图里点出来，CSS 选择器已写入。画布动画仍走 `app.js` 的 `REDUCED` 开关。

未改：公式说明 `.eq-why` 仍是 `--dim`（第 5 轮）、`start-here.html` 无手绘本链接。

---

## 第 4 轮

### 看

FIX-NOTES 验证命令仍 `rg heytea README.md`、CLAUDE 应含 `heytea.html`——按今天的文件会失败。`math.html` / `basics.html` 侧栏分组用内联 `style="margin-top:12px"`。工程 hero 标签 `C.dim`。

### 判

1. **中** · 文档验证路径和现入口不一致。
2. **中** · 内联样式盖掉 `.rail-sep` 的 22px，分组间距不在 CSS 里。
3. **低** · 流水线六字偏淡。

### 改（3 项）

1. FIX-NOTES §1 / §6 验证改为 `doodle.html` 三件套和 `doodle-theme`。
2. `.rail-sep-tight` 替换两处内联 style。
3. `app.js` 读 `--read`；`basics.js` 流水线标签用 `C.read`。

### 验

`interactive-r4-basics-hero.png` / `interactive-r4-basics-mobile.png`：标签比 r1 略实。`grep rail-sep.*style` 无匹配。CLAUDE.md 含 `doodle.html`。

未改：`theme-btn` 缺 `type="button"`、start-here 无 `doodle-math.html`、`.eq-why` 对比。

---

## 第 5 轮

### 看

三页主题按钮无 `type="button"`。`start-here.html` 自称数学跳转页，却不链手绘本。`.eq-why` 仍 `--dim`。FIX-NOTES §7 还在 `rg heytea.html`。

### 判

1. **中** · 数学快速入口漏手绘本（欠账：入口要指向 `doodle*`）。
2. **低** · 主题按钮补 `type="button"`。
3. **低** · 公式下的说明应跟正文同一档阅读色。
4. **低** · FIX-NOTES §7 验证命令过期。

### 改（3 项）

1. `start-here.html` 副标题加 `doodle-math.html`。
2. 三页 `theme-btn` 加 `type="button"`；`.eq-why` 改 `--read`。
3. FIX-NOTES §7 验证改为 `doodle.html` 三页、无 Google Fonts。

### 验

`interactive-r5-index.png`、`interactive-r5-math.png`、`interactive-r5-basics.png` 及对应 `*-mobile.png`、`interactive-r5-start-here.png`。`bash check-math.sh` 通过（2390 行，104K，16 section，15 canvas）。`doodle.html` `#ch7` 的 src 是 `meta-pretrain.jpg`，封面仍是 `cover-model.jpg`。无 `fonts.googleapis`。截图用的临时 `_shot-*.html` 已删，不进仓库。

| 问题 | 改动 | 结果 |
|---|---|---|
| start-here 漏手绘本 | 副标题加链 | 截图可见 doodle-math.html |
| 主题按钮 | type=button | 三页各 1 处 |
| 公式说明过淡 | `--read` | 与正文同一档，不改公式本身 |

---

## 五轮主线

1. 数学页链接/文档和另外两页对齐。  
2. 手机补章节跳转，侧栏 hover/深色 `color-scheme`。  
3. 正文对比 + 键盘焦点 + reduced-motion。  
4. 过期验证命令、侧栏内联样式、工程流水线字。  
5. 数学入口补手绘本、按钮类型、公式说明色。

未动教学正文。未重写整本。`math-backup.html` 与 `basics-extra.css` 和 `style.css` 的重复块仍在。`start-here.html` 仍是另一套跳转页视觉，只补了链接。

## 是否接近定稿

互动版浅色喜茶语言还在，和手绘本纸面区分清楚。手机能跳章，文档入口已指向 `doodle*`，KaTeX 离线检查通过。剩下的是备份页、重复 CSS、start-here 的独立皮肤——不挡阅读。可以当一版可读定稿；若再打磨，优先收 start-here 视觉、删备份或标明过期。
