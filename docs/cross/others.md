---
title: 其他跨端方案
description: Kotlin Multiplatform、Electron / Tauri、Capacitor 简述。
---

# 其他跨端方案

::: warning 🚧 本章内容建设中
本章目前只有大纲，正文正在编写。下面是计划覆盖的要点，欢迎在 GitHub 上参与补充。
:::

## 本章计划覆盖

- Kotlin Multiplatform：共享业务逻辑
- Electron 与 Tauri：桌面应用
- Capacitor：把 Web 应用打包成移动应用
- 何时考虑这些方案

## 用 AI 做这个方向时的提示词

::: tip 本节持续补充
本方向的专用模板正在整理，先提供可直接套用的通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="plan-first" />

## 三问

回答得出这三个问题，再把这个方向的任务交给 AI。以下为计划展开的要点。

### 必须先懂什么

- 各方案共享的是哪一层（UI 还是逻辑）
- 包体积与性能的取舍

### 怎么验证

- 用最小示例在目标平台上跑通
- 确认所需原生能力是否有成熟插件

### AI 常错在哪

- 混淆相似方案的能力边界
- 给出过时的配置写法
