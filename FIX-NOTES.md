# FIX-NOTES

对照阅读报告必改清单。未扩写教学正文，未 git commit / push，未碰 D:\。

> 手绘本已从 `heytea*.html` 迁到 `doodle*.html`（见根目录 `DOODLE-NOTES.md`）。下文里的 `heytea` 路径是当时记录，现入口以 README / CLAUDE.md 为准。
>
> 手绘本配图已全量换成喜茶带字版（实物锚点 + 黑线小人 + 歪扭手写标题）。橙线 / 小橙 IP 已撤。页面不写喜茶品牌。见 `DOODLE-NOTES.md`。

现页 `math.html`：2389 行，104K，16 个 `<section>`，15 个 `<canvas>`；可动手 3 个。

---

## 1. README.md 补手绘本与 start-here 定位

**改了什么**
- 增加手绘本入口：`heytea.html` / `heytea-math.html` / `heytea-basics.html`
- 写明 `start-here.html` 是数学 v2 快速入口，不是全书封面
- 一句说明两套主题键：`theme`（互动版）与 `heytea-theme`（手绘本）

**怎么验证**
```
rg doodle README.md
```
应看到三条手绘本链接（`doodle.html` / `doodle-math.html` / `doodle-basics.html`），以及 `doodle-theme`。打开 README 可见 start-here 定位句。

---

## 2. 数学文档与页面对齐

**改了什么**
- `README-MATH.md`：可动手演示改为 3 个（向量 / Softmax / 梯度下降）；去掉独立高斯；KaTeX 改为 `vendor/katex` 离线；不再写 1425 行 / 56KB / CDN
- `CHANGELOG-MATH.md`：文首增加 2026-09-04「文档纠偏」；v2.0 历史条目保留，并注明行数/体积/四可视化含高斯已被取代
- `FILES-SUMMARY.txt`：按现页重写；删除不存在的 `outputs/test-report.md`
- `start-here.html`：标题改为数学 v2 快速入口；统计改为 3 个可动手、KaTeX 离线；导航不再写 `#viz`

**怎么验证**
```
rg '1425|56KB|test-report|cdn' README-MATH.md FILES-SUMMARY.txt start-here.html
rg '三个可动手|vendor/katex|快速入口' README-MATH.md FILES-SUMMARY.txt start-here.html CHANGELOG-MATH.md
```
CHANGELOG 顶部日期应为 2026-09-04。v2.0 正文里的旧数字仅作历史，纠偏条已声明取代。

---

## 3. check-math.sh 按现页重写

**改了什么**
- 检查 `#primer` `#symbols` `#vectorCanvas` `#softmaxCanvas` `#gdCanvas`
- 检查 `drawVector` / `drawSoftmax` / `drawGD` 与 KEEP 三件套
- 断言旧 ID（`#viz` `#vectorViz` `#gaussViz` `#gaussCanvas`）和 `drawGaussian` 不存在
- 检查 `vendor/katex`、无 CDN、引入 `app.js`、无内联重复 scrollspy
- 缺项 `exit 1`；统计只报告、不卡死旧 1425/56KB

**怎么验证**
```
bash check-math.sh
```
本次运行：全部 OK，结尾「检查通过」，exit 0。行数 2389，大小 104K，Canvas 15。

---

## 4. 高斯死代码：删除（与 primer「每大类一个」一致）

**改了什么**
- 删除 `gaussCanvas` 整块 HTML 与 `drawGaussian` JS
- 删除运行时 `remove()` 和 `moveCard('gaussCanvas', …)`
- 文档改为三个可动手演示；P2 `varCanvas` / P4 `mleCanvas` 里的高斯曲线静图保留（不是独立高斯交互）

**怎么验证**
```
rg 'gaussCanvas|drawGaussian|gaussMu' math.html
```
应无匹配。`bash check-math.sh` 中「#gaussCanvas 已不存在」「function drawGaussian 已不存在」为 OK。

---

## 5. 删除 journey.js

**改了什么**
- 全库无 HTML/脚本引用 `journey.js`（旅程图已在 `app.js`）
- 删除死文件 `journey.js`

**怎么验证**
```
rg 'journey\.js' .
test ! -f journey.js && echo gone
```
无引用，文件不存在。

---

## 6. CLAUDE.md 改成真实图解书描述

**改了什么**
- 写明静态图解书、互动/手绘两套入口、`vendor/katex`
- 标明 `start-here.html` 定位
- 主题键一句说明
- skill 路由保留，标题改为「可选：AI 助手配置，不是书的内容大纲」
- 不再列出不存在的工程树

**怎么验证**
打开 `CLAUDE.md`：应有 `index.html` / `math.html` / `doodle.html` / `vendor/katex`；skill 一节标明可选。

---

## 7. 手绘本断网字体

**改了什么**
- `heytea.html` / `heytea-math.html` / `heytea-basics.html` 去掉 `fonts.googleapis.com`（含 preconnect）
- `heytea.css`：`--serif` 为 Noto Serif SC / Songti SC / STSong / SimSun / NSimSun / serif；`--hand` 楷体优先，Ma Shan Zheng 仅本机有才用

**怎么验证**
```
rg 'fonts\.googleapis' doodle.html doodle-math.html doodle-basics.html
```
HTML 无 Google Fonts 链接。现页用自托管霞鹜文楷。未在浏览器里做断网实点（本环境无浏览器验收工具）。

---

## 8. math.html 去掉重复滚动/进度监听

**改了什么**
- 删除页面内联「scroll progress & active link」IIFE
- 保留 `app.js` 的 `scrollspy`

**怎么验证**
```
rg "scroll progress|addEventListener\('scroll'" math.html
rg 'src="app.js"' math.html
```
math.html 无内联 scroll；有 `app.js`。`check-math.sh`「无内联重复 scrollspy」OK。

---

## 9. basics-extra.css 幽灵 _patch.py 注释

**改了什么**
- `basics-extra.css`、`style.css` 同款注释改为「copied / kept」，去掉不存在的 `_patch.py`
- 未大删教学内容

**怎么验证**
```
rg '_patch\.py'
```
无匹配。

---

## 验收命令汇总（已跑）

| 命令 | 结果 |
|------|------|
| `bash check-math.sh` | 检查通过，exit 0 |
| `rg heytea README.md` | 含手绘本三条 + 主题键 |
| `rg 'journey\.js'` | 无引用；文件已删 |
| `rg 'fonts\.googleapis' heytea*.html` | 无匹配 |
