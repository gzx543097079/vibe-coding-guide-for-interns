# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

VitePress + 自定义主题，部署到 GitHub Pages 子路径 /vibe-coding-guide-for-interns/（用户已确认）。

## Users

在团队里借助 AI 编码助手做日常开发的开发者，技术基础参差，需要规范、判断力与避坑指引。

## Product Purpose

一个结合学习平台与工具实验室的 Vibe Coding 开发网站。读者可以发现课程、选择学习路线、动手体验组件，再进入章节理解概念、实现与验证。

## Positioning

「带着判断力使用 AI」的学习平台：围绕实际任务组织课程，连接阅读、交互体验、提示词与实现，帮助读者自己判断结果。

## Capabilities and Constraints

- 内容用 Markdown 维护，开源（MIT），欢迎 PR 共建。
- 首页、课程中心、模块课程页、学习路线、组件实验室各有独立入口；章节页只显示当前课程的导航。
- 完成标记和最近阅读记录保存在当前浏览器，不提供账号、跨设备同步或证书。
- 当前重设计优先桌面端，按用户要求暂不进行手机端专项设计与验收。
- 已覆盖 108 篇登记章节正文与既有交互演示；原生片段保留待校对状态，不得编造案例、数据或用户评价。
- 简体中文为主，中英文混排需精致。
- 内容规划：9 个模块（起步、AI 与 Agent、Git 与协作、前端与客户端、UI 控件与提示词、大前端 / 跨端、后端与数据、质量与交付、提升），模块内按「基础 / 进阶 / 精通」分级；章节数据统一维护在 `docs/.vitepress/theme/data/modules.ts`。
- 控件页的提示词要经过还原验证（独立 agent 只看提示词写实现，再与站内演示逐状态截图对比），验证状态与日期记在 `docs/.vitepress/theme/data/controlPrompts.ts`；没验证的不得标「已验证」。
- 占位章节用 frontmatter `status: draft` 标注，不确定的内容写「待核实」。
- 正文按主题组织，不使用统一的结尾问答模板；前置知识按需交代，验证方法紧跟示例，风险就地提醒。草稿可用「计划覆盖」保留写作要点。

## Brand Commitments

仓库名 vibe-coding-guide-for-interns；标题「Vibe Coding 开发指南」。

## Evidence on Hand

`growth/cases` 采用本仓库 commit `a8a0324` 的真实结构调整作为案例。无企业生产数据或用户评价；不得虚构。

## Product Principles

1. 基础不够就没法判断 AI 对不对，先懂再用。
2. 验证先于信任。
3. 小步、可回滚、可解释。
4. 对初学者友好，不吓人也不糊弄。
