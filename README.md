<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="看得见的大模型：可交互的大语言模型图解书。按工程、数学、模型三册，从输入读到办事。">
</p>

一本图解书。先把机器打通，再把符号捡回来，最后看字怎么变成事。

阅读顺序固定：**工程 → 数学 → 模型**。互动版和水墨本走同一条线。

<p align="center">
  <img src="./assets/ink/cover-basics.jpg" width="250" alt="工程一册封面：焦墨插头插入圆孔，电线写成一笔书法。">
  <img src="./assets/ink/cover-math.jpg" width="250" alt="数学一册封面：焦墨手拾起散落的石块与算筹。">
  <img src="./assets/ink/cover-model.jpg" width="250" alt="模型一册封面：焦墨信封，口沿化作一行淡墨脚印。">
</p>

<p align="center"><sub>工程 · 先接通  数学 · 符号是路标  模型 · 信封进来，事情出去</sub></p>

<p align="center">
  <img src="./assets/readme/editions.svg" width="100%" alt="同一条阅读顺序，两套本子：互动版可点滑块、看公式和 3D 架构；水墨本一篇一叶讲故事，宣纸静态。">
</p>

## 从输入到办事

<p align="center">
  <img src="./assets/readme/journey.svg" width="100%" alt="先读工程、再读数学、最后读模型。模型主线：输入、看见、生成、对齐、办事。">
</p>

互动版把模型主线拆成可动手的演示：训练一条直线、词向量、注意力、3D 架构、采样、预训练、微调与 LoRA、Agent。水墨本用七个故事讲同一件事，公式都留在互动版。

## 打开

线上从工程页起读：

**https://tsumon.github.io/basics.html**

GitHub Pages 根目录是模型页 [`index.html`](index.html)。顶栏已按工程 → 数学 → 模型排列。

本地把仓库打开即可，不需要服务器或 CDN。KaTeX 在 `vendor/katex`。

| 本子 | 工程（先读） | 数学 | 模型 |
| --- | --- | --- | --- |
| 互动版 | [basics.html](basics.html) | [math.html](math.html) | [index.html](index.html) |
| 水墨本 | [ink-basics.html](ink-basics.html) | [ink-math.html](ink-math.html) | [ink.html](ink.html) |

## 备忘

- [`start-here.html`](start-here.html) 是数学 v2 的快速入口，不是全书封面。
- 旧地址 `doodle.html` / `doodle-math.html` / `doodle-basics.html` 会跳到对应水墨本。
- 互动版用 localStorage 键 `theme` 记深浅色。水墨本是宣纸静态页，没有主题切换。
