---
name: "Vibe Coding 开发指南"
description: "章节表设计系统：108 篇 = 9 个方向 × 3 个级别，色相区分方向，深浅区分级别。"
colors:
  paper: "#ffffff"
  paper-2: "#f4f5f6"
  paper-3: "#eceef0"
  ink: "#14161a"
  ink-2: "#4a5058"
  ink-3: "#6f7680"
  rule: "#dfe2e6"
  rule-strong: "#c4c9cf"
  accent: "#14161a"
  on-accent: "#ffffff"
  accent-soft: "#eceef0"
  tip: "#15803d"
  warn: "#b45309"
  danger: "#b91c1c"
  code-bg: "#1f2430"
  dark-paper: "#121417"
  dark-paper-2: "#1b1e23"
  dark-ink: "#eceef1"
  dark-ink-2: "#b6bcc5"
  dark-ink-3: "#8a919c"
  dark-rule: "#2c3037"
  fam-1-start: "oklch(0.5 0.15 25)"
  fam-2-ai: "oklch(0.5 0.15 62)"
  fam-3-git: "oklch(0.5 0.15 100)"
  fam-4-frontend: "oklch(0.5 0.15 148)"
  fam-5-controls: "oklch(0.5 0.15 190)"
  fam-6-cross: "oklch(0.5 0.15 232)"
  fam-7-backend: "oklch(0.5 0.15 268)"
  fam-8-quality: "oklch(0.5 0.15 305)"
  fam-9-growth: "oklch(0.5 0.15 350)"
typography:
  page-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  home-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  card-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  section-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  group-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.9
  row-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.45
  ui:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  cell:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  cell-number:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "9.5px"
    fontWeight: 600
    lineHeight: 1
  code:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  none: "0px"
  control: "4px"
spacing:
  3: "3px"
  5: "5px"
  6: "6px"
  12: "12px"
  16: "16px"
  20: "20px"
  24: "24px"
  28: "28px"
  36: "36px"
  44: "44px"
  48: "48px"
components:
  chapter-cell:
    backgroundColor: "{colors.fam-1-start}"
    textColor: "{colors.ink}"
    typography: "{typography.cell}"
    rounded: "{rounded.none}"
    height: "30px"
    padding: "0 5px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    height: "40px"
    padding: "0 18px"
  search-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 12px"
  level-filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "32px"
---

# Design System: Vibe Coding 开发指南

## Overview

**Creative North Star：一张表看全。** 站点内容是 108 篇笔记，正好是 9 个方向 × 3 个级别。设计只做一件事：把这个结构原样摆出来。全站只有一种基本单元「章节格」，它带三位编号和短标题，用色相表示属于哪个方向，用深浅表示级别。首页是 9 列 108 格的整张表，章节页左栏是其中一列，方向页、路线页、列表页都是这些格子的不同排法。

白底、墨色文字、2px 墨色粗线，系统无衬线字，方角。除了九个方向的色相，页面上没有别的装饰色。

## Colors

### Neutral
- **paper `#ffffff` / ink `#14161a`**：页面与文字。深色模式为 `#121417` / `#eceef1`。
- **ink-2、ink-3**：摘要与辅助信息。**rule `#dfe2e6`**：细分隔线。
- 全站强调色 `--accent` 就是墨色：主按钮、选中的筛选项、顶栏当前项都是墨底或墨线。

### 方向色（九个色相）
每个方向一个色相，写在 `[data-fam='1'..'9']` 上：25、62、100、148、190、232、268、305、350。

### 级别（三档，全站不出现第四档）
| 级别 | 浅色模式 | 深色模式 | 文字 |
|---|---|---|---|
| 基础：浅底 | `oklch(0.955 0.03 h)` | `oklch(0.27 0.035 h)` | 墨色 |
| 进阶：中间色 | `oklch(0.87 0.075 h)` | `oklch(0.4 0.085 h)` | 墨色 |
| 精通：实心 | `oklch(0.5 0.15 h)` | `oklch(0.74 0.13 h)` | 白 / 深色模式下近黑 |

章节页把 `--accent` 系列变量指向当前方向色，正文里的组件（提示卡、步骤、对比块）因此跟随方向变色。

### 语义色
提示绿、注意黄、危险红只用于正文提示块，不参与方向和级别编码。

## Typography

系统无衬线字一套到底，不加载网络字体。标题一律 800 字重、负字距；正文 16.5px / 1.9，列宽 700px。编号用等宽数字（`tabular-nums`），不用等宽字体。具体字号见文件头的 `typography`。

## Layout

- **顶栏**：56px 高，底边 2px 墨线；左侧站名和五个入口（目录、阅读路线、组件演示、需求模板、名词解释），右侧搜索、深浅色、GitHub。
- **首页**：左边 9 列章节表，右边 244px 详情栏（详情卡、图例、上次读到）。1440 宽下 108 格一屏看全。
- **章节页**：240px 左栏（1–9 方向方块 + 当前方向那一列）、700px 正文、200px 本页目录。
- **目录列表 / 方向页**：220px 方向索引 + 820px 章节行。
- **路线页**：每条路线左边说明、右边按步骤排开各方向的章节格。
- 断点：1340px 以下首页格内编号收起；1180px 以下详情栏和本页目录下移或折叠；900px 以下单列，表格变成按方向堆叠的两列格子。

## Elevation & Depth

没有阴影，没有圆角卡片。层次只靠三种线：2px 墨线（页面级分隔、详情卡边框）、4px 方向色线（一列或一组的顶边）、1px 细线（行与行之间）。

## Shapes

章节格、色块、按钮、卡片都是直角。只有输入框、分段筛选和顶栏小按钮用 4px 圆角，表示「这是可以输入或切换的控件」。

## Components

### 章节格 `.at-cell`
30px 高（左栏 32px、窄屏 38px），三位编号 + 短标题。`lv1 / lv2 / lv3` 对应三档填充。当前篇或悬停选中：1.5px 墨色边框加同色外描边。读过：行尾一个 ✓。筛选不匹配：透明度降到 0.16，位置不变。

### 详情卡 `.at-card`
2px 墨框。编号、级别标签、标题、方向与分组、摘要、墨底「开始阅读」按钮。悬停或键盘聚焦任一格时更新。

### 章节头 `.at-head`
92px 色块（编号 + 级别，填充跟随级别）加标题与摘要，底边 2px 墨线。方向页、404 页复用同一结构；没有色块时加 `plain`。

### 章节行 `.at-rows`
44px 编号色块 + 完整标题 + 摘要，行尾显示级别或「✓ 读过」。用在目录列表和方向页。

### 方向索引 `.at-famindex`
九行，每行左端是实心编号块，后面是方向名和篇数。当前方向加墨框。

### 按钮与控件
主按钮墨底白字、直角、40px 高；次按钮透明底墨框。分段筛选选中项墨底。搜索框 1.5px 墨框。

### 沿用的旧组件
名词解释、组件演示、快速跳转、正文富组件沿用原实现，通过令牌换色，并把标题和筛选控件统一到上面的规格。组件演示里的参考画布保留自己的暖色配色：那组色值写在已验证的提示词里，改了会让验证结论失效。

## Do's and Don'ts

### Do:
- 新页面先问「能不能用章节格排出来」，能就不要另造卡片。
- 颜色只表达方向，深浅只表达级别，状态用记号（✓、边框、透明度）。
- 编号始终用全站三位编号（001–108），和首页表格一致。
- 筛选时保持表的形状，只改变透明度。

### Don't:
- 不加第四档填充，不给某一篇单独配色。
- 不用阴影、渐变、圆角卡片、图标方块做装饰。
- 不在章节页放全站目录树；左栏只放当前方向。
- 不把读过、当前、筛选这些状态换成另一种颜色来表达。
- 不改组件演示参考画布的色值。
