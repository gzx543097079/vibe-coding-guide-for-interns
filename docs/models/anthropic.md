---
title: Anthropic：Claude 系列
description: Fable、Opus、Sonnet、Haiku 四档：定位、1M 上下文、自适应思考，以及几个会返回错误的用法。
---

> 数据核对于 **2026-11-13**，来自 Anthropic 官方 Claude 平台文档。过了这个日期，型号和限制可能变化，以[官方模型总览](https://platform.claude.com/docs/en/about-claude/models/overview)为准。

## 一句话

官网当前列出四个主力型号：**Fable 5.2**、**Opus 5.5**、**Sonnet 5.5**、**Haiku 5.5**。它们的上下文窗口、最大输出和模态完全相同，差别在定位和默认的思考强度。官网对怎么选的建议是：多数场景从 Opus 5.5 开始；需要长时程推理、且 Opus 5.5 在较高思考强度下评测仍不达标时，换 Fable 5.2。

## 四个主力型号

| | Fable 5.2 | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |
|---|---|---|---|---|
| API 模型 ID | `claude-fable-5-2` | `claude-opus-5-5` | `claude-sonnet-5-5` | `claude-haiku-5-5` |
| 官方定位 | 要求高的推理与长时程 Agent 工作 | 长时间运行的 Agent 式编程和知识工作 | 速度和智能的最佳结合 | 高并发、对延迟敏感的任务，如分类、抽取、路由 |
| 发布日期 | 2026-11-09 | 2026-09-22 | 2026-09-28 | 2026-10-07 |
| 上下文窗口 | 1M | 1M | 1M | 1M |
| 最大输出 | 128K | 128K | 128K | 128K |
| 输入、输出 | 文本和图片 → 文本 | 同左 | 同左 | 同左 |
| 思考 | 自适应，常开 | 自适应，常开 | 自适应 | 自适应 |
| 默认思考强度 | high | medium | high | medium |
| 知识截止 | 2026 年 6 月 | 2026 年 6 月 | 2026 年 6 月 | 2026 年 6 月 |

页面对每个型号都同时写了「可靠知识截止」和「训练数据截止」，四个型号两项都是 2026 年 6 月。四个型号的 ID 就是别名，官方说明每个 ID 都是固定快照。

## 能做什么

概览页的说法是：当前所有模型都支持文本和图片输入、文本输出、多语言、视觉和工具使用。各型号的详情页还列出：

- **思考**：Fable 5.2 的页面列出 `low`、`medium`、`high`、`xhigh`、`max` 五档；其他型号的页面提到的是 `low`、`medium`、`high`。
- **计算机使用、提示缓存、批处理、Files API、PDF 支持**：Opus 5.5 和 Sonnet 5.5 的页面都列出了。
- **Haiku 5.5**：新增浏览器使用工具；最小可缓存提示从 Haiku 4.5 的 4,096 降到 512。
- **一些测试版功能**：按需压缩上下文、对话中途换工具、按消息设置思考强度、任务预算等，页面都标注为 beta，使用前先看对应页面。

## 会返回错误的用法

这几条是详情页明确写出的，从旧型号迁移时很容易踩到：

- **不能强制调用某个工具。** Fable 5.2、Opus 5.5、Sonnet 5.5 都写明不支持 forced tool use：`tool_choice` 设为 `any` 或 `tool` 会返回 400，`auto` 和 `none` 可以用。
- **不能手动指定思考预算，也不能关掉思考。** `thinking` 设为 `disabled`，或使用 `budget_tokens`，会返回 400（Haiku 5.5 例外：在 high 及以下强度时仍可以关闭思考）。
- **采样参数要省略。** `temperature`、`top_p`、`top_k` 在这些型号上应省略；官方弃用页还写明，这三个参数将在 API 版本 `2026-10-21` 中移除，之后会返回 400。
- **Haiku 5.5 不支持 assistant 消息预填**，会返回错误。
- **数据保留。** Fable 5.2 页面写明需要 30 天数据保留，不支持零数据保留，除非 Anthropic 明确授权。

## 其他型号

官网「所有模型」表里还列有 Opus 5、Sonnet 5、Fable 5.1、Fable 5 以及 Mythos 系列。Mythos 系列页面标注为受限访问，面向经过验证的组织，这里没有逐个核对。

## 哪里能用

Anthropic 有一页「支持的地区」政策，页面标注 2026-11-12 生效。具体怎么对照，见 [大陆可用性、备案与许可](./compliance)。

## 出处

- [模型总览](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview)（[新增内容](https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2)）
- [Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview)（[新增内容](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5)）
- [Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview)（[新增内容](https://platform.claude.com/docs/en/models/sonnet-5-5/whats-new-sonnet-5-5)）
- [Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview)（[新增内容](https://platform.claude.com/docs/en/models/haiku-5-5/whats-new-haiku-5-5)）
- [弃用与退役](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [支持的地区](https://www.anthropic.com/supported-countries)
