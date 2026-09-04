# 手绘本重做说明

旧的「喜茶风手绘本」三页已删，换成白纸涂鸦阅读页。文件名、文案都不写喜茶官网、品牌合作或吉祥物。

**2026-09-04 本轮：全量换成喜茶带字版。橙线插画已撤。**

未 git commit / push。

## 现入口

- `doodle.html` 模型线
- `doodle-math.html` 数学
- `doodle-basics.html` 工程
- `doodle.css` 共享样式
- `doodle-illus.js` 主题切换（阅读页不做进场动画，避免正文被藏住）
- 配图：`assets/doodle/`

三页顶栏互跳，并各自链回对应互动版（`index.html` / `math.html` / `basics.html`）。主题键是 `doodle-theme`，与互动版的 `theme` 分开。

## 用了哪些 skill

配图只走一套：

1. `heytea-doodle-poster`（`/home/box/.grok/skills/heytea-style/`）
   - 全部 `cover-*` / `meta-*` / `doodle-*` 都是带字版
   - 按 skill 的**带字版三步走**：白底实物锚点 → 物件+黑线小人底图 → 标题构造板 → 标题层 → 本地合成
   - 本章没有用户照片，所以先 `image_gen` 白底单一实物，再 `image_edit` 加小人、留空标题区
   - **本轮没有调用** `orange-line-illustration`
   - 已删除 `xiao-orange-ref.jpg`

版式（2 个，不用 minimalist-ui）：

2. `design-engineering`（`/home/box/.grok/skills/design-engineering/`）
   - 当判断用，不当「再砍一刀」
   - 正文仍约 65 汉字宽（`--max-prose: 38rem`），大标题负 tracking
   - 阴影用分层低透明度，不要 Bootstrap 默认影
   - 夜间近黑 `#1c1a17`，正文 `rgba(255,255,255,0.92)`，不要纯 `#000`
   - 不对称、纸纹、印章式章节号是营销/编辑页允许的不完美
   - `prefers-reduced-motion` 去掉倾斜，保留静态排版
3. `gc-minimal-zine-poster-v0-1`（`/home/box/.grok/skills/gc-minimal-zine-poster/`）
   - 纸面节奏：大留白、标题当物件、轻微印刷缺陷感
   - 用在 CSS 版式，不生成新海报图
   - 强调色从橙线橙 `#F97316` 改成松绿 `#2F6B4F`（夜间 `#7DAA8C`），不再暗示小橙角色

没有再叠第三个版式 skill。

## 带字版怎么做的

每张封面 / 隐喻图 / `doodle-*.jpg` 都走同一条管线（参考 `heytea-style/references/style-guide.md`、`lettering-guide.md`）：

1. **无用户照片 → 白底实物锚点**  
   用 `image_gen` 生成竖构图静物。
2. **底图**  
   `image_edit` 保留照片物件，放到中下/右下，左上留空标题区，加一个原始黑线小人。参考 `private-assets/reference-cutouts/figures/`。
3. **标题构造板**  
   `scripts/build_title_reference_sheet.py`，用 `title_tiramisu_heavy_black` / `title_salty_cheese_crooked` 等 lettering cutouts。
4. **标题层**  
   只生成黑马克笔中文，再 `scripts/composite_title_layer.py` 叠回底图。

`doodle-*.jpg` 七张上一轮已是带字版，本轮未重做。封面和隐喻图本轮全量重做：

| 文件 | 标题 | 物件 |
|---|---|---|
| `cover-model.jpg` | 从输入到办事 | 木托盘 + 信封，小人递信 |
| `meta-pretrain.jpg` | 把空格填上 | 填空练习册 + 铅笔，小人往空线上写 |
| `cover-math.jpg` | 把符号捡回来 | 散落的木字母块 |
| `cover-basics.jpg` | 先把机器打通 | 旧插头，小人去接 |
| `meta-valley.jpg` | 往低处走 | 陶瓷漏斗，小人沿内壁下山 |
| `meta-attention.jpg` | 先看见谁 | 眼镜压在空白卡片上 |
| `meta-stack.jpg` | 同一间房叠起来 | 开口木盒叠成房间，小人爬梯 |
| `meta-lora.jpg` | 只动薄片 | 薄铜片，小人掀起一角 |
| `meta-agent.jpg` | 带着工具走路 | 帆布工具袋 |
| `meta-arrows.jpg` | 夹角多大 | 交叉的木箭 |
| `meta-columns.jpg` | 水往哪倒 | 三只杯子，小人倒水 |
| `meta-chain.jpg` | 一环扣一环 | 黄铜链条 |
| `meta-tree.jpg` | 树一样的目录 | 陶盆分叉枯枝 |

已有、本轮未动：

| 文件 | 标题 | 物件 |
|---|---|---|
| `doodle-layers.jpg` | 一层一层叠 | 一叠毛边纸 + 小人爬梯 |
| `doodle-cards.jpg` | 拆成小块 | 木制卡片抽屉 |
| `doodle-knobs.jpg` | 拧一拧 | 三只模拟旋钮 |
| `doodle-pipe.jpg` | 接着往下流 | 两只白搪瓷桶和软管 |
| `doodle-boxes.jpg` | 先装进盒子 | 牛皮纸盒 |
| `doodle-door.jpg` | 敲敲门 | 带投信口的木门 |
| `doodle-mold.jpg` | 同一个模子 | 玛德琳模具 |

标题是可读的歪扭中文短句。模型仍偏爱把骨架画得像字体；构造板 + 单独标题层已经比全图一次生成更接近带字版。中间产物在 `/tmp/heytea-covers/`，不进仓库。

**2026-09-04 续：标题层改细。** 只重生 `titles/*`（细黑马克笔 / 细毡尖，比旧圆头马克笔细一档），底图物件和小人未动，再本地合成覆盖 `assets/doodle/`。

无官方 logo / 吉祥物，无小橙 IP，无胸口橙点角色。竖构图 3:4。

## 版式改了什么

重写 `doodle.css`，三页 HTML 只加结构 class，不改正文。

- 页面画布到 `72rem`，正文仍锁在 `38rem`，避免通栏说明书
- 封面题用系统楷体栈，`clamp` 到大约 5.4rem；节题也走楷/衬线，不要小宋标题
- 左图右文 / 右图左文（`split-end` / `split-start`），竖构图海报用 `.portrait` 悬挂，不再给橙线横图做满宽出血
- 头图倾斜约 1–2°，角上浅色胶带（松绿半透明）；夜间胶带色跟着走
- 章节号做成歪印章，顶栏短强调色线段
- 引语（`.air`）错开，不再居中一句空话
- 断网：系统中文衬线，无 Google Fonts
- 强调色松绿 `#2F6B4F` / `#1F4D38`，夜间 `#7DAA8C` / `#A8CDB6`

## 图放哪

全部相对路径，本地可打开，无外链。

带字涂鸦（物件 + 小人 + 歪扭标题）：

| 文件 | 用在 |
|---|---|
| `cover-model.jpg` | 模型封面 |
| `meta-pretrain.jpg` | 预训练（#ch7，勿再用封面信） |
| `cover-math.jpg` | 数学封面 |
| `cover-basics.jpg` | 工程封面 |
| `meta-valley.jpg` | 机器学习、梯度 |
| `meta-attention.jpg` | 注意力 |
| `meta-stack.jpg` | 架构叠层 |
| `meta-lora.jpg` | LoRA |
| `meta-agent.jpg` | Agent |
| `meta-arrows.jpg` | 向量夹角 |
| `meta-columns.jpg` | softmax / 概率 |
| `meta-chain.jpg` | 链式法则 |
| `meta-tree.jpg` | Linux 目录树 |
| `doodle-layers.jpg` | 神经网络叠纸 |
| `doodle-cards.jpg` | 分词卡片柜 |
| `doodle-knobs.jpg` | 生成旋钮 |
| `doodle-pipe.jpg` | Shell 管道 |
| `doodle-boxes.jpg` | Python 四只盒子 |
| `doodle-door.jpg` | FastAPI 门口 |
| `doodle-mold.jpg` | Docker 模具 |

已删除：`xiao-orange-ref.jpg`（橙线小橙基准图，页面本来也不引用）。

## 和旧 heytea / 混用橙线的差异

| | 旧 heytea | 混用一轮 | 现在 |
|---|---|---|---|
| 文件名 | `heytea.html` 等 | `doodle.html` 等 | 同左 |
| 插图 | `illus.js` 现场画 SVG | 橙线封面/隐喻 + 带字 `doodle-*` | **全量喜茶带字版 JPG** |
| 配色 | 米灰店墙、松绿、朱砂印 | 骨白纸 + 单点橙 | 骨白纸 + 松绿点缀 |
| 文案 | 沿用「喜茶手绘本」口吻 | 只称手绘本，不提品牌 | 图称手写海报 / 实物涂鸦 |
| 正文 | 几乎誊抄互动版 | 章节对应，段落重写 | 同左 |
| 主题键 | `heytea-theme` | `doodle-theme` | 同左 |
| 章节头图 | 无字线稿 | 两种风格混用 | 带字版：实物照片 + 小人 + 马克笔中文 |
| 版式 | 通栏说明书（minimalist-ui） | 编辑涂鸦阅读页 | 同左，不退回说明书风 |

已删除：`heytea.html`、`heytea-math.html`、`heytea-basics.html`、`heytea.css`、`illus.js`（只服务旧页）、`xiao-orange-ref.jpg`。

- 2026-09-04：砍掉手绘本深色模式（夜/日按钮、`data-theme=night`、相关 CSS/JS）。只保留浅色纸面。

- 2026-09-04：修图文排版——竖图限高、分栏 sticky 顶对齐并取消 `grid-row:1/14` 虚跨行；bleed/hang 竖图改为居中挂图，不再当横图全宽裁切。

- 2026-09-04 打磨：竖图再限高（约 52vh）；挂图轮换 tape/soft/clip/plain；`.more` 虚线只跟文字宽度；文案「宋体」改为「文楷」。图内手写短句保留作隐喻，与章节标题并存（不重生图）。

- 2026-09-04：`#ch7` 预训练不再复用封面 `cover-model.jpg`，新图 `meta-pretrain.jpg`（填空练习册 + 细毡尖「把空格填上」）。

- 2026-09-04：封面 hero 收紧——栏距 1.4rem、固定两列宽度、挂图靠左贴文，消除右边大片空白。

- 2026-09-04：再收右边空白——`--max-page` 72→52rem；封面图列顶右缘并加宽，消除文图簇左侧、版心右侧空荡。

- 2026-09-04：封面改文图成组居中（justify-content: center），不再顶右缘。
