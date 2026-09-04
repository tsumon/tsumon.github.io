# 水墨本说明 · V3

另开一套静态页。**没有改** `doodle.*` / `index.html` / `math.html` / `basics.html`。

用户口径（2026-09-04）：从页面到画图一整套水墨；禁止喜茶/doodle 骨架；知识密度低，讲故事，说人话。

## 入口

- `ink.html` 模型一册（七个故事）
- `ink-math.html` 数学一册（四个故事）
- `ink-basics.html` 工程一册（五个故事）
- `ink.css` 共享册页样式
- `assets/ink/` 焦墨淡墨飞白配图
- 本笔记 `INK-NOTES.md`
- 成品设计记录 `ink-DESIGN.md`（只写 ink 皮肤）

分册用右侧书耳方印互跳：模 / 数 / 工。互动版与手绘本只在卷末跋里给链。主题键未做；若以后做深浅，用 `ink-theme`，不碰 `theme` / `doodle-theme`。

没有 `doodle-illus.js`。数学册不再引 KaTeX。公式在互动版。

## skill

按 `SKILL-PLAN.md` 绑定三个，不多加：

| skill | 管什么 |
|---|---|
| `impeccable` | 页面世界。访客模式 Read。命令 typeset + layout。code-led。不跑 concept-seed（用户已钉宣纸册页）。不 colorize / bolder / animate。 |
| `design-engineering` | 判断层：单墨、纸纹、中文行长、默认不动效、反 AI 默认。 |
| `mono-color` | 插图。覆盖为 **pure one-ink**，Charcoal `#30343A`，Pale Beige `#F5F1E8`，abstract symbol extraction，图内无大标题。 |

没有用 heytea / 橙线 / zine / 小黑。

## 版式（相对 V2 拆掉的）

V2 试印仍是 `.hero` 双栏 + `ol.stations` 五站 + sticky 顶栏胶囊 + 立轴图框套 `assets/doodle` 灰度。V3 拆掉重排。

现在是线装册页：

- 左订口四眼一线，不是顶栏
- 右书耳三方印，不是胶囊
- 卷首竖排题签 + 朱砂方印，左大留白
- 目次「一、二、三」，不是横向 sticky 数字条
- 正文一篇一叶，通栏窄栏居中；引语作匾额；边注竖排
- 插页立轴（天杆地杆），无 tilt、无胶带
- 卷末短跋，链互动版与 doodle
- 字体：LXGW WenKai（`vendor/fonts`）

## 故事站

结构统一：起一个场景 → 出一件怪事 → 用一个生活动作解决 → 轻轻点一下和模型的关系。短句，口语。不搬互动版知识点。

### 模型 `ink.html`（7）

| 站 | 故事 | 图 |
|---|---|---|
| 封面 | 从输入到办事 | `assets/ink/cover-model.jpg` |
| 一 | 蒙眼下山 | `story-valley.jpg` |
| 二 | 抽屉里的卡片 | `story-cards.jpg` |
| 三 | 先看见谁 | `story-gaze.jpg` |
| 四 | 同一间屋子 | `story-rooms.jpg` |
| 五 | 把空格填上 | `story-blank.jpg` |
| 六 | 只动薄片 | `story-foil.jpg` |
| 七 | 带着工具出门 | `story-walk.jpg` |

### 数学 `ink-math.html`（4）

| 站 | 故事 | 图 |
|---|---|---|
| 封面 | 把符号捡回来 | `cover-math.jpg` |
| 一 | 两支箭 | `story-arrows.jpg` |
| 二 | 三根柱子 | `story-pillars.jpg` |
| 三 | 脚下哪边更陡 | `story-valley.jpg`（与模型「下山」同稿） |
| 四 | 一环扣一环 | `story-chain.jpg` |

### 工程 `ink-basics.html`（5）

| 站 | 故事 | 图 |
|---|---|---|
| 封面 | 先把机器打通 | `cover-basics.jpg` |
| 一 | 一棵树 | `story-tree.jpg` |
| 二 | 接着往下流 | `story-pipe.jpg` |
| 三 | 四只盒子 | `story-boxes.jpg` |
| 四 | 信封推进门缝 | `story-door.jpg` |
| 五 | 模子可以复印 | `story-mold.jpg` |

## 出图配方（mono-color 覆盖）

- mode: pure one-ink
- ink: Charcoal `#30343A`（焦墨；淡墨是同一墨的密度）
- substrate: Pale Beige `#F5F1E8`
- representation: abstract symbol extraction
- exact_text: none（中文说明在 `figcaption`）
- 封面 3:4；章图约 3:2
- 焦墨 / 淡墨 / 飞白 / 笔锋 / 纸上洇开
- 图内不要朱砂，不要喜茶粗马克笔儿童字
- 主视觉零引用 `assets/doodle`

## 未做

- 没有改 CLAUDE.md 入口（等你决定这套要不要公开）
- 没有深色模式、没有构建步骤
- 没有替换 doodle
