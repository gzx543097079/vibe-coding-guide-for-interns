# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

VitePress + 自定义主题，部署到 GitHub Pages 子路径 /vibe-coding-guide-for-interns/（用户已确认）。

## Users

在团队里借助 AI 编码助手做日常开发的开发者，技术基础参差，需要规范、判断力与避坑指引。

## Product Purpose

一份 Vibe Coding 开发指南网站：先讲前置准备（通用、前端、后端等），再讲任务拆解、验证审查、Git/PR 协作、安全规范，让读者会用 AI 且能判断 AI 对不对。

## Positioning

不是 AI 工具教程，而是「带着判断力使用 AI」的实践手册：每个方向统一以「必须先懂什么 / 怎么验证 / AI 常错在哪」三问收尾。

## Capabilities and Constraints

- 内容用 Markdown 维护，开源（MIT），欢迎 PR 共建。
- 当前只有骨架：章节为占位文案，须明确标注，不得编造案例、数据或用户评价。
- 简体中文为主，中英文混排需精致。
- 内容规划：8 个模块（起步、AI 与 Agent、Git 与协作、前端与客户端、大前端 / 跨端、后端与数据、质量与交付、提升），模块内按「基础 / 进阶 / 精通」分级；章节数据统一维护在 `docs/.vitepress/theme/data/modules.ts`。
- 占位章节用 frontmatter `status: draft` 标注，不确定的内容写「待核实」。

## Brand Commitments

仓库名 vibe-coding-guide-for-interns；标题「Vibe Coding 开发指南」。

## Evidence on Hand

无真实案例、数据或评价；不得虚构。

## Product Principles

1. 基础不够就没法判断 AI 对不对，先懂再用。
2. 验证先于信任。
3. 小步、可回滚、可解释。
4. 对初学者友好，不吓人也不糊弄。
