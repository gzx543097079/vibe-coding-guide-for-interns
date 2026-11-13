---
title: OpenAI：GPT-6 系列
description: GPT-6 Astra、GPT-6.1 Sol、GPT-6 Luna 三档的定位、上下文和能支持的功能。
---

> 数据核对于 **2026-11-13**，来自 OpenAI 官方开发者文档。过了这个日期，型号和限制可能变化，以[官方模型页](https://developers.openai.com/api/docs/models)为准。

## 一句话

官网把当前模型分成三档：旗舰 **GPT-6 Astra**、均衡的 **GPT-6.1 Sol**、追求效率的 **GPT-6 Luna**。官网首页对不知道从哪开始的人的建议是：用 GPT-6 Astra。

## 三个主力型号

| | GPT-6 Astra | GPT-6.1 Sol | GPT-6 Luna |
|---|---|---|---|
| API 模型 ID | `gpt-6-astra` | `gpt-6.1-sol` | `gpt-6-luna` |
| 官方定位 | 处理最吃力的工作的最强模型 | 接近 Astra 的表现，成本更低 | 面向集中、大批量任务的最高效模型 |
| 上下文窗口 | 1,050,000 | 1,050,000 | 1,050,000 |
| 最大输入 | 922,000 | 922,000 | 922,000 |
| 最大输出 | 128,000 | 128,000 | 128,000 |
| 输入模态 | 文本、图片 | 文本、图片 | 文本、图片 |
| 输出模态 | 文本 | 文本 | 文本 |
| 推理档位 | low、medium、high、xhigh、max | 同左，默认 medium | none、low、medium、high、xhigh、max，默认 medium |
| 知识截止 | 2026-04-30 | 2026-04-30 | 2026-05-18 |

定位一栏是官方页面原文的意译。三个型号的上下文、最大输出和输入模态相同，差别在能力和成本档位。

## 能做什么

三个型号的详情页都列出同样的一组能力：

- **功能**：流式输出、结构化输出、函数调用、文件检索、图片输入、联网搜索、提示缓存。
- **内置工具**（在 Responses API 里使用）：联网搜索、文件检索、图像生成、代码解释器、托管 shell、`apply_patch`、skills、计算机使用、MCP、工具检索。
- **接口**：Chat Completions、Responses、Batch 支持；**微调不支持**。GPT-6 Astra 的页面还把 Realtime、Assistants、Embeddings、图像生成、语音、转写这几个端点标为不支持（它们有各自的专用模型）。

有几条细节很容易在接入时踩到：

- GPT-6.1 Sol 的页面写明，**工具调用需要 Responses API**。
- GPT-6 Luna 的页面写明，Chat Completions 里**只有把 `reasoning_effort` 设为 `none` 时才支持函数调用**。
- Luna 的页面写明，欧盟数据驻留可用于标准、快速、Flex 和 Batch 几种处理方式。

## 要留意的变化

- **旧型号在下线。** 官方弃用页列出：`gpt-5`、`gpt-5-mini`、`gpt-5-nano`、`gpt-5-pro`、`o3`、`o3-pro` 将于 2026-12-11 下线；`gpt-4o`（两个快照）、`gpt-4o-mini`、`gpt-4.1`、`gpt-4.1-mini` 将于 2027-01-14 下线。具体怎么迁移见 [型号更新与迁移](./lifecycle)。
- **官网不同页面对型号名的写法不完全一致。** 首页推荐的是 `gpt-6.1-sol`，而弃用页里替代型号写的是 `gpt-6-sol`、`gpt-5.6-sol` 这样的名字，页面没有说明它们的关系。写代码时，模型 ID 以对应的模型详情页为准。
- 官网首页还列出了 GPT-6.1 Terra 和 Cyber、Image、Realtime、Transcription 等专用模型，这里没有逐个核对。

## 哪里能用

OpenAI 有一页专门列出支持的国家和地区，页面写明：在名单之外的国家和地区访问或提供服务，**账号可能被封禁或暂停**。具体怎么对照，见 [大陆可用性、备案与许可](./compliance)。

## 出处

- [模型总览](https://developers.openai.com/api/docs/models)
- [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)
- [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)
- [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)
- [弃用公告](https://developers.openai.com/api/docs/deprecations)
- [支持的国家和地区](https://developers.openai.com/api/docs/supported-countries)
