# SKILL-PLAN

任务：把《看得见的大模型》水墨本从**页面到画图**整套换成宣纸册页/线装 + 焦墨淡墨飞白配图。文件只动 `ink.html` / `ink-math.html` / `ink-basics.html` / `ink.css`，新建 `assets/ink/`。不动 doodle 四件套、不动互动版。

索引：`/home/box/agent-data/skill-index.md`（2026-09-04 11:09，349 条，未过期）。候选 SKILL.md 均已打开核对，不靠名字猜。

UI 任务：仓库根仍没有 `DESIGN.md`。现有 `ink.css` / `INK-NOTES.md` 是上一阶段「HTML-only 试印」，**不是**本轮权威。doodle 的松绿/胶带/歪扭图框更不是。DESIGN.md 与 skill 冲突时 DESIGN.md 赢——本轮落地后由成品反写 ink 自己的设计记录。

Joe 2026-09-04：走 Build 的 `grok --agent`，不叫醒侧边栏 Bot。本文件只路由，不写业务代码、不出设计稿、不出图。

相对上一份（HTML-only：`impeccable` + `design-engineering`）：**两个都留，加 `mono-color`。** 不加第四个。不把 heytea / 橙线 / zine 顶掉出图位。

---

## 该用的 skill（3 个）

没有现成「水墨生成」skill。页面半边仍要排版判断，出图半边只剩单墨印刷系统可借。三件各管一块，不重叠。

### 1. `impeccable`（build）— 页面世界

路径：`/home/box/.grok/skills/impeccable/SKILL.md`

**为什么用（读过 SKILL.md）**

- 触发就是设计 / 重做前端界面。本轮是**替换视觉世界**，不是给 doodle 抛光：用户钉死宣纸册页/线装，并点名禁止 hero 双栏、五站、胶带 tilt 图框。
- 访客模式 **Read**（docs / articles / guides）。三页是长文导读，不是落地转化。
- 「The brief wins」：水墨、宣纸、册页、静态、另开 ink 文件、新图进 `assets/ink/`。skill 不得改成通用编辑杂志或 doodle 2.0。
- 命令：`typeset`（字阶、行宽、文楷角色）+ `layout`（册页、线装订口、目录、章节 leaf）。现稿 `ink.html` 仍是 `.hero` 双栏 + `ol.stations` 五站，必须拆掉重排，不是换皮。
- 仓库无 DESIGN.md。impeccable 写明：缺 DESIGN.md 不回 `init`；新世界在成品上由 documenter 从实作反写。执行方给 **ink 皮肤**留设计记录（建议 `ink-DESIGN.md` 或 DESIGN.md 只写 ink）。

**怎么用（约束）**

- **不要**跑 `new-work.md` 的 `concept-seed` 多方向掷骰。用户已钉死视觉世界。new-work 原文：*a user- or brief-pinned direction beats the roll*。这是 precisely specified 请求。
- **走 code-led**。不要为了选方向去出四张营销 comp。插图由下面的 `mono-color` 出，不当 impeccable 的 plate 流水线。
- **不要** `colorize`（往单色里加色）、**不要** `bolder`、**不要** `animate`、**不要**开 design hook。
- 现稿是反面教材：hero 双栏、五站、立轴图框、`assets/doodle/*.jpg` + `grayscale` +「待水墨图」角标。本轮要换成册页/线装结构，图 `src` 改到 `assets/ink/`，拿掉灰度假装和水印。
- 内容对齐 doodle 分册（模型 / 数学 / 工程）和章节，文案可略改。主题键：互动版 `theme`、手绘本 `doodle-theme`；ink 若做深浅，用自己的 key。
- 不动 `doodle.html` / `doodle-math.html` / `doodle-basics.html` / `doodle.css` / `doodle-illus.js`。

### 2. `design-engineering`（build）— 版式判断

路径：`/home/box/.grok/skills/design-engineering/SKILL.md`

**为什么留（上一阶段就对，本轮版式要求更硬）**

- 管判断，不抢视觉世界：字体与行宽、表面、何时**不要**动效、反 AI 默认。
- 用户本轮点名的是**版式**（册页/线装 vs doodle/heytea 骨架）。这正是 layout / typography / surface 节点，不是出图 skill 能代劳的。
- 对得上的节点（只读这些，不要灌整张 graph）：
  - `color-monochromatic`：焦墨 / 浓淡 / 宣纸底。插图本身不要第三种高饱和强调色。
  - `visual-imperfection`：纸纹、墨晕是材料，不是噪声滤镜铺满屏。
  - `typography-humanity` + `line-length-tracking`：中文长文行长、行高、字重。
  - `animation-decision-framework`：静态阅读页默认不动。
  - `ai-default-tells`：避开 Inter、紫雾、卡片网格、居中 Hero 模板。
- Joe 的 UI 工作流允许的判断 skill 就是它（和 Impeccable 命令并列）。本轮仍不需要 GSAP / transitions。

**怎么用（约束）**

- 当判断层，不当第二套视觉模板。与即将写下的 ink 设计记录冲突时，**ink 的设计记录赢**。
- 现成霞鹜文楷在 `vendor/fonts/`。继续自托管（断网可读），用字重和墨色分层，不要为了「每次换字体」去拉 Google Fonts。
- 上一阶段 `INK-NOTES.md` 借过 zine 的「朱砂锚」和立轴图框。本轮用户禁止 doodle/heytea 那套框，也禁止把喜茶图灰度当水墨。页面上传统方印可以极少量朱砂；**插图必须是焦墨淡墨飞白，不要把朱砂洒进图里，也不要立轴/胶带 tilt。**

### 3. `mono-color`（build）— 插图

路径：`/home/box/.grok/skills/mono-color-skill/SKILL.md`

**为什么现在才进名单**

- 上一阶段交付是 HTML，它的默认产物是印刷海报栅格图，所以当时明确「下阶段候选」。本轮用户把出图放进范围：全新水墨感配图，写入 `assets/ink/`，页面引用新图，禁止再用 `assets/doodle` 当主视觉。
- 读过 SKILL.md：有 **pure one-ink** 模式（用户显式要求单墨 / monochrome / 只点一色时切换）；有 Charcoal `#30343A`（architecture / photography / research）；有 Pale Beige `#F5F1E8` 底（tactile / archive）；有 `abstract symbol extraction`（2–4 个身份锚，纸面切开画面）；飞白可对「clipped highlights / paper knockouts / 密度变化不是第三色」。
- 索引里没有更近的水墨生成 skill。剩下的出图包（heytea、橙线、小黑、zine）风格核和水墨相反，见下表。

**必须覆盖的默认（不覆盖就会画出当代双色海报，不是水墨）**

SKILL.md 默认是 **controlled two-ink**、Cobalt+Terracotta、3:4 封面、英文 2–8 词标题撞图、网点/孔版、当代干净纸。用户要的是焦墨淡墨飞白、书里配图。执行时配方钉死：

| 字段 | 本任务取值 | 不要用 skill 默认 |
| --- | --- | --- |
| `mode` | **pure one-ink** | complementary duotone / 第二色 15–30% |
| `inks` | Charcoal `#30343A`（焦墨）；淡墨用同一墨的密度，不算第二色 | Cobalt `#2148B8`、Terracotta、Signal Red |
| `substrate` | Pale Beige `#F5F1E8`（宣纸）。用户点了宣纸/册页，属于 archive / tactile，允许纸纤维，不要发黄做旧滤镜堆满 | Neutral White 当代杂志默认 |
| `representation` | **abstract symbol extraction** | 写实网点照片 |
| `exact_text` | **none**（图内不要大标题；中文说明写在 HTML `figcaption`） | 发明英文 display phrase |
| `layout` | archival plate / specimen annotation / 单物件局部；**图是正文插图** | editorial cover、type-led、headline 压图 |
| `ratio` | 封面可 3:4；章图优先横幅（约 3:2 或 16:9），服务册页栏宽 | 每张都做成 3:4 海报 |
| `image_treatment` | 焦墨、淡墨、飞白、笔锋、纸上洇开 | 粗网点、risograph、cyanotype、双色叠印 |
| 保存 | `assets/ink/`，文件名对章节（见 `INK-NOTES.md` 待图题） | `~/Desktop/Claude skills/mono-color/` |

出图后：`ink*.html` 的 `img src` 全部改到 `assets/ink/`；删灰度滤镜、「待水墨图」角标、doodle 路径。主视觉零引用 `assets/doodle`。

Grok 实际调用 `image_gen` / `image_edit` 时，bundled `imagine` 是工具说明书（精确字/数/结构用代码，装饰插图才生图）。**不占本轮 3 个名额。** 配方听 `mono-color` + 上表覆盖，不要另开 imagine 当风格源。

---

## 为什么不用别的

都读过 SKILL.md（或索引 description + 触发边界）。不进 3 个名额。

| 候选 | 来源 | 为什么不用 |
| --- | --- | --- |
| `heytea-style` | build | 读过：要生活实拍锚 + 白底小人 + 歪扭儿童字。用户原话禁止「喜茶图灰度假装水墨」，也禁止 doodle/heytea 的 hero 双栏、五站、胶带 tilt。和宣纸册页相反。 |
| `orange-line-illustration` | build | 读过：纽约客细黑线、纯白底、唯一强调色 `#F97316`、小人物。无浓淡、无飞白、无宣纸。橙线 ≠ 水墨。 |
| `gc-minimal-zine-poster` | build | 读过：3:5 竖海报，70–90% 纸面，**强制高饱和色锚**（钴/柠檬黄/番茄红），禁止 `near-monochrome`。纸感相邻，色法和水墨焦墨冲突。上一阶段 `INK-NOTES` 只借过留白，本轮不要再借色锚。 |
| `ian-xiaohei-illustrations` | build | 读过：小黑 IP、纯白 16:9、红橙蓝批注。配图 skill，但不是水墨。 |
| `imagine` | bundled | 工具协议，不是视觉世界。出图时 coding 会用 `image_gen`；风格源是 `mono-color` 的覆盖配方。占名额会挤掉页面判断。 |
| `yingzao` | build | 真实建筑/在地文化**照片**转译。没有建筑照片，也不是阅读页 HTML。 |
| `photo-revival` / `photo-abstract-editorial` | build | 要上传实拍。本任务是概念配图，无生活照片。 |
| `punk-cover` / `punk-avatar` | build | 封面风格库 / 头像，不是册页插图。 |
| `tait-crt-interface-skill` | build | 1980s CRT 位图，和水墨无关。 |
| `design-md-workflow` | **bot** | 原则对（先读 DESIGN.md，再用 Impeccable / design-engineering）。仓库无 DESIGN.md。Joe 不叫醒侧边栏；允许的页面 skill 已在上面。 |
| `qiaomu-design` | build | 读过：融合 Taste / Frontend Design / UI/UX Pro Max，强制四方向预览和问询。会把已钉死的水墨拆成四个无关方向。Joe：不用 Taste 那一套。 |
| `design-taste-frontend` / v1、`stitch-design-taste`、`minimalist-ui`、`high-end-visual-design`、`gpt-taste` | build / 仓库 `.agents` | Taste / 落地页模板包。会覆盖字体、圆角、配色。Joe：不用。 |
| `image-to-code` / `imagegen-frontend-web` / `brandkit` | 仓库 `.agents` | 先出营销分镜再写落地页。本任务是书页 + 章图，不是 section 海报板。 |
| `gsap-*` / `transitions-dev` / `transitions-polish` | build / bot | 静态阅读页。不加滚动动画。 |
| `full-output-enforcement` | 仓库 `.agents` | 防截断，不是设计。 |
| `create-plan` / `grilling` / `tdd` / `diagnosing-bugs` | bot | 不是实现阅读页。 |
| 架构审计 / 安全 / 面试 / 调研 | — | 不对题。 |

---

## 交给谁

**`grok --agent coding`**（本仓库直接改文件）

绑定 skill：`impeccable`、`design-engineering`、`mono-color`。

交付：

1. **版式**：重写 `ink.html` / `ink-math.html` / `ink-basics.html` / `ink.css` 为宣纸册页/线装阅读页。禁止套 doodle/heytea 的 hero 双栏、五站、胶带 tilt 图框。结构仍分三册、章节可对齐，但第一屏和插图容器必须是册页语言。
2. **插图**：按 `INK-NOTES.md` 待图题（及数学/工程对应表）用 `mono-color` **one-ink 覆盖配方**出焦墨淡墨飞白图，写入 `assets/ink/`。页面 `src` 全部改过去。主视觉禁止 `assets/doodle`。
3. **不动** doodle 四件套、互动版、`app.js` / `style.css`。
4. 成品反写 ink 设计记录。不要凭空先写一本和页面无关的 DESIGN.md。

不要交给：

- **design**：可走查、可定方向，**不写业务代码**。本轮交付就是三页 HTML/CSS + `assets/ink/` 新图。视觉世界用户已钉，不需要先出四方向稿。
- **head**：只分派。
- 侧边栏 Bot / `design-md-workflow` 的 bot 副本。
- 调研、面试、架构师、调试。

落地后若要视觉走查，再另开 `grok --agent design`，仍只用上面三个 skill 看 ink 页和 `assets/ink/`。本阶段不先叫醒。
