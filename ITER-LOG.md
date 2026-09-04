# 手绘本自审自改 · 五轮记录

工作目录 `/home/box/mac/llm-guide`。本地服务复用 `127.0.0.1:8765`。截图在 `/workspace/doodle-iter/`。未 git commit / push，未同步本机。

---

## 第 1 轮

### 看

桌面 1280 与移动端 390，打开 `doodle.html` / `doodle-math.html` / `doodle-basics.html`。截图：`r1-model-hero.png`、`r1-model-ch1.png`、`r1-model-ch2.png`、`r1-model-ch3.png`、`r1-model-ch7.png`、`r1-model-mobile.png`、`r1-math-hero.png`、`r1-math-la1.png`、`r1-math-prob1.png`、`r1-math-mobile.png`、`r1-basics-hero.png`、`r1-basics-ch3.png`、`r1-basics-ch8.png`、`r1-basics-mobile.png`。

### 判（按严重度）

1. **高** · `doodle.css` `.leaf.split-end > .more` / `.leaf.split-start > .more`（`#ch2` `#ch3` `#ch8` 等）：网格默认 stretch，虚线「去互动版」被拉成整栏横线（量到宽 608px）。
2. **高** · `.draw.portrait img` `max-height: min(52vh, 26rem)`：竖图约 407px，短章（`doodle-basics.html #ch8` 只有一段 lead）和图几乎一样高；封面 `.hero` `grid-row: 1 / span 6` 在副标题下空出一截，目录被顶出首屏。
3. **中** · 分栏章 h2 与图内手写短句同一条视线（`doodle.html #ch2`「把直线叠起来」对「一层一层叠」；`#ch3`「抽一张卡片」对「拆成小块」）。
4. **中** · `.leaf.hang` 竖图一律居中、尺寸相同（`#ch1` `#ch7`、`doodle-math.html #la1` `#prob1`），节奏单调；「去互动版」被压在大图底下。
5. **低** · `.bar-back`「回互动版」一条浅虚线，移动端折行后像残线。

### 改（3 项）

1. `.more { width: fit-content; justify-self: start; margin-top: 18px; }` — 虚线只跟字走。
2. 竖图限高改为 `min(42vh, 21rem)`；封面/挂图 `max-width` 收到约 18–19rem。分栏图 `margin-top: 2.8rem`，错开 h2。
3. 三页封面文案包进 `.hero-copy`，取消 `span 6` 空行；hero 下边距 88px → 56px。

### 验

改后截图 `r1v-*.png`。

| 问题 | 改动 | 结果 |
|---|---|---|
| 分栏「去互动版」整栏虚线 | `.more` fit-content | `#ch2` `#ch8` 下划线回到字宽（149 / 122px），不再拉满栏 |
| 竖图压短文、封面死区 | 限高 + hero-copy | 封面图 407→342px，目录 01–11 进首屏；`#ch8` 图 416→336px，下一章 Docker 能看见 |
| 图内手写抢 h2 | 分栏图下移 2.8rem | `#ch2` 标题单独一行，「一层一层叠」落到正文齐平处 |

未改：挂图居中节奏、顶栏「回互动版」、章间 `.air` 空隙。留给后轮。

---

## 第 2 轮

### 看

在第 1 轮改后的页面上继续看挂图章、公式章、顶栏。截图：`r2-*.png`，回归修复后再拍 `r2v-*.png`。

### 判（按严重度）

1. **高** · `.leaf.hang` / `.hang-alt` / `.bleed` 设了 `max-width: none`，但竖图并不宽，于是 `.aside` / `.eq` 被拉成通栏白条（`doodle.html #ch1`、`doodle-math.html #la1` `#prob1`），读起来像说明书。
2. **中** · 挂图变体（`soft` / `clip` / `hung`）有了，但 `.hang` 与 `.hang-alt` 的竖图都居中、同宽，左右节奏仍一样。
3. **中** · 挂图章 DOM 顺序是「大图 → 去互动版」，链接掉在海报底下（`#ch1` `#ch7` `#la1`）。
4. **中** · `.bar-back` 底边浅虚线，移动端折行后像残线。
5. **低** · `.leaf` 底 104px + `.air` 底 88px，章与章之间空一截。

### 改（3 项）

1. 挂图章改为纵向 flex；正文/aside/公式锁回 `--max-prose`；`.more` `order:1`、图 `order:2`（链接回到文下、图上）。验时发现 `:not(.draw)` 的 `width:100%` 又把虚线拉满，随即把 `.more` 排除并 `fit-content`。
2. `.hang` 竖图靠左，`.hang-alt` 靠右，`.bleed` 仍居中。
3. `.bar-back` 改成左侧虚线分隔；`.leaf` 底 104→72px，`.air` 底 88→56px。

### 验

| 问题 | 改动 | 结果 |
|---|---|---|
| 通栏 aside/公式 | 非图元素锁 38rem | `#la1` 公式条回到正文宽，不再拉满 72rem |
| 挂图左右无区别 | hang 左 / hang-alt 右 | `#ch1` 图 left≈130，`#prob1` 图 left≈866 |
| 链接在大图下 | flex order | `#ch1` `#la1`「去互动版」出现在图前，下划线保持字宽 |
| 顶栏残线 | 左分隔 | 桌面「回互动版」与导航用一条竖虚线分开；390 宽去掉左边线，不再折出残底线 |

回归：挂图章 `.more` 曾被 `width:100%` 再次拉满，已在本轮内修掉（`r2v-model-ch1.png`）。

---

## 第 3 轮

### 看

补看路线条、后半章、对照表。截图：`r3l-model-stations.png`、`r3l-model-ch4.png`、`r3l-model-ch5.png`、`r3l-model-ch8.png`、`r3l-model-ch10.png`、`r3l-math-calc2.png`，改后 `r3-*.png`。

### 判（按严重度）

1. **高** · `.stations` 五张白底描边卡片（`doodle.html` / 数学 / 工程封面下）是产品仪表盘，和纸面涂鸦打架，也和上面的 `.toc` 叠成两份目录。
2. **中** · `.aside` / `.eq` / `.pair div` 白底 + `box-shadow-sm` + 1px 边框，短章里像说明书模块（`#ch8` 微调对照、`#ch10` 链/图、`#la1` 公式条）。
3. **中** · `doodle.html #ch7` 复用 `cover-model.jpg`，图内大字「从输入到办事」和标题「预训练：把空格填上」对不上。本轮不重生图。
4. **低** · `.clip` / `.soft` 底垫 36–40px 是给绝对定位说明留的，现在说明在文档流里，框底会多一截白。

### 改（3 项）

1. `.stations` 去掉卡片：上下虚线、栏间虚线、第一站一截松绿短线；保留轻微旋转。
2. `.aside` / `.eq` 去阴影、底改半透明纸；`.pair` 改成顶上一根松绿线，不再围框。
3. `#ch7` 图说改成「还是这封信。下一格填什么，它写了万亿次。」——用说明把复用封面圆过去。

### 验

| 问题 | 改动 | 结果 |
|---|---|---|
| 五张白卡片 | 站点改成纸面路线 | `r3-model-stations.png` 不再是卡片行，01 上有松绿短线 |
| aside/pair/eq 说明书模块 | 去阴影、去围框 | `#ch8` 对照表变成两条顶线笔记；`#la1` 公式条轻了 |
| 预训练图文打架 | 改图说 | 大字仍是「从输入到办事」，图说点明「还是这封信」；图本身留给后轮，不重生 |

第 4 项（clip/soft 底垫）未改，下一轮处理。

---

## 第 4 轮

### 看

封面目录、夹子图、软挂图、390 宽路线条。截图：`r4-model-hero.png`、`r4-model-ch2.png`、`r4-model-ch7.png`、`r4-model-ch1.png`、`r4-model-mobile-stations.png`、`r4-math-hero.png`、`r4-basics-ch8.png`。

### 判（按严重度）

1. **中** · `.draw.clip` / `.draw.soft` 底垫 36–40px 是给绝对定位说明留的，说明已在文档流，夹子卡底部多一截白（`#ch7` `#ch2`）。
2. **中** · `.toc a` 每条底虚线，11–13 行像表格；和 `.stations` 顶虚线叠在一起，封面下半段横线太多。
3. **低** · `.draw.plain img` 1px 实线边，偏 UI。
4. **低** · 图说 12.5px 在窄竖图里易折行（`#ch7`「亿次。」单独一行）。
5. **低** · 移动端 `.stations li:last-child` 通栏，05「办事」被拉成一条。

### 改（3 项）

1. `.clip` padding 收到 10px；`.soft` 去掉底垫。
2. `.toc` 去掉行底虚线，改成栏间 `column-rule`；目录下边距 56→8px，和路线条收成一块封面后记。
3. 图说 12px；`.plain img` 去边改轻阴影。

### 验

| 问题 | 改动 | 结果 |
|---|---|---|
| 夹子卡底多白 | 收 padding | `#ch2` 说明贴在照片下沿，卡不再垫一截空 |
| 目录横线密 | 栏间虚线 + 贴路线条 | `r4-model-hero.png` 目录和 01–05 路线连成一段，无行线 |
| plain 实线框 | 轻阴影 | `#ch8` FastAPI 门图不再描边 |

未改：`#ch7` 图说仍在卡内折行；移动端 05 通栏。第 5 轮收。

---

## 第 5 轮

### 看

夹子图说明、预训练图说、390 宽路线条、页脚。截图：`r5-model-ch7.png`、`r5-model-ch2.png`、`r5-model-mobile-stations.png`、`r5-model-foot.png`、`r5-math-calc2.png`、`r5-basics-mobile.png`、`r5-model-hero.png`。

### 判（按严重度）

1. **中** · `.draw.clip` 白底包住 figcaption，窄竖图里说明折进卡内（`doodle.html #ch7`）。
2. **低** · `#ch7` 图说仍偏长。
3. **低** · 移动端 `.stations li:last-child { grid-column: 1 / -1 }` 把 05 拉成通栏。
4. **低** · `.foot` 跟上章贴太近。

### 改（3 项）

1. `.clip` 的纸面和阴影改到 `img` 上，说明落到卡外当博物馆标签；夹子仍钉在图顶。
2. `#ch7` 图说收成「还是这封信。下一格，写了万亿次。」
3. 移动端最后一站不再通栏；`.foot` 上边距 24→48px。

### 验

| 问题 | 改动 | 结果 |
|---|---|---|
| 说明印在夹子卡里 | 纸面只包照片 | `#ch7` `#ch2` 图说在卡下，一行排完；夹子还在 |
| 05 通栏 | last-child 不跨列 | `r5-model-mobile-stations.png` 05 落在左格，不再拉满 |
| 页脚贴章 | 加大上边距 | `r5-model-foot.png`「回头看」和页脚之间有虚线呼吸 |

五轮结束。未再改配图文件。

---

## 五轮之后还剩什么

接近定稿，版式可以停。还欠的是图，不是格子：

- `doodle.html #ch7` 仍用封面 `cover-model.jpg`，图内大字「从输入到办事」。图说已经圆过，但要彻底不抢戏，得单独做一张「填空」图。
- 喜茶带字竖图本身会和 h2 抢标题，排版只能错开、缩小，不能取消。
- 短章（工程 `#ch8` FastAPI）图仍比一段 lead 高一截，再砍会伤海报。
- `.hang-alt` 右置竖图中间空白大，是有意的纸面节奏，不是没对齐。

三页可本地打开（已有 `python3 -m http.server 8765`）。无 git commit / push，无同步本机。




