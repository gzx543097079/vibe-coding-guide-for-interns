---
title: DeepSeek
description: V4.1 Flash 与 V4 Pro：开放权重、1M 上下文、思考模式，以及兼容 OpenAI 和 Anthropic 的接口。
---

> 数据核对于 **2026-11-13**，来自 DeepSeek 官方 API 文档和它在 Hugging Face 上的官方模型卡。过了这个日期，型号和限制可能变化，以[官方文档](https://api-docs.deepseek.com/zh-cn/)为准。

## 一句话

官方文档当前列出两个 API 模型名：**`deepseek-flash`** 和 **`deepseek-v4-pro`**。两者都是开放权重，许可为 MIT，上下文 1M。区别是 Flash 支持图片输入并且带联网搜索等一组「全家桶」能力，Pro 只处理文本。

## 两个型号

| | deepseek-flash | deepseek-v4-pro |
|---|---|---|
| 当前指向的版本 | DeepSeek-V4.1-Flash-1017 | DeepSeek-V4-Pro-0813 |
| 上下文长度 | 1M | 1M |
| 最大输出 | 最大 384K | 最大 384K |
| 输入模态 | 文本、图片 | 文本（页面写明不支持图像理解） |
| 思考模式 | 支持；默认开启，强度默认 high | 支持 |
| 思考强度 | low、high、max | low、high、max |
| 开放权重与许可 | 开放，MIT；参数 763B（HF 元数据） | 开放，MIT；参数 1.7T（HF 元数据） |
| 页面标注的日期 | 2026-10-17 更新；2026-09-10 首次发布 | 2026-08-13 正式版上线 |

最大输出在价格表里只有一格，页面没有分别标注两个模型。「激活参数」页面没有给出。

## 能做什么

文档列出的能力，两个型号大体相同：

- **JSON 输出、工具调用**：支持，思考模式下也支持；工具调用的 `strict` 模式是 Beta，需要使用 `https://api.deepseek.com/beta`。
- **对话前缀续写**（Beta）；**FIM 补全**（Beta，仅非思考模式）。
- **缓存**：价格表有「输入（缓存命中）」，文档有「上下文硬盘缓存」。
- **仅 `deepseek-flash`**：联网搜索、阅读链接、文件输入、模型安全，也就是 2026-11-13 发布的「全家桶应用 API」，工具名 `deepseek_web_search`、`deepseek_read_url`。

## 兼容的接口格式

文档的快速开始页给出了两个 base URL：

- `https://api.deepseek.com`：OpenAI 格式。
- `https://api.deepseek.com/anthropic`：Anthropic 格式。

页面还写明两个型号都支持 Responses API 和 Anthropic API。这意味着不少原本写给别家的客户端，换 base URL 和模型名就能试。

## 容易踩的细节

- 思考模式下，`temperature`、`presence_penalty`、`frequency_penalty` 不生效。
- 带 `tools` 的请求，**必须把上一轮的 `reasoning_content` 回传**，否则返回 400。
- JSON 输出要设置 `response_format` 为 `{'type': 'json_object'}`，提示词里要包含 "json" 字样，并合理设置 `max_tokens`。

## 最近半年的发布（来自官方更新日志）

| 日期 | 内容 |
|---|---|
| 2026-11-13 | 全家桶应用 API，`deepseek-flash` 可开启联网搜索、文件输入、阅读链接、模型安全 |
| 2026-10-17 | V4.1-Flash-1017 更新，API 名称不变；同日开放自研搜索 API |
| 2026-09-10 | V4.1-Flash 发布，原生多模态视觉理解 |
| 2026-08-13 | V4-Pro 正式版上线，支持 Responses API 与三档思考强度 |
| 2026-07-31 | V4-Flash 正式版 API 公测上线 |

另外，更新日志在 2026-04-24 写明旧名称 `deepseek-chat`、`deepseek-reasoner` 将于 2026-07-24 停止使用，当时它们分别指向 `deepseek-v4-flash` 的非思考与思考模式。页面没有写实际停用的结果。**同一个名字指向的版本会变**，这一点见 [型号更新与迁移](./lifecycle)。

## 哪里能用

DeepSeek 的 App 和网页端入口是 `chat.deepseek.com`，开放平台是 `platform.deepseek.com`，这两个地址来自官方文档和模型卡里的链接。

## 出处

- [API 文档首页（快速开始）](https://api-docs.deepseek.com/zh-cn/)
- [模型与价格](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)
- [更新日志](https://api-docs.deepseek.com/zh-cn/updates)
- [DeepSeek-V4.1-Flash-1017 模型卡](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017)
- [DeepSeek-V4-Pro-0813 模型卡](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813)
