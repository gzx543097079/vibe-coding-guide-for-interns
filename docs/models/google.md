---
title: Google：Gemini 系列
description: Gemini 4 的三个型号和 3.x 的 Flash 档：多模态输入、思考档位与稳定、预览状态。
---

> 数据核对于 **2026-11-13**，来自 Google 官方 Gemini API 文档（文档入口现已跳转到 `aistudio.google.com/docs`）。过了这个日期，型号和状态可能变化，以[官方模型页](https://aistudio.google.com/docs/models)为准。

## 一句话

当前最新的是 **Gemini 4** 系列的三个型号：Carbon、Argon、Hydrogen。同时在售的还有 3.x 的 Flash 档型号。页面里的一句话提示是：新项目请使用最新模型，Gemini 4 Hydrogen 或 3.5 Flash-Lite。

## 已核对的五个型号

| 型号 | API 模型 ID | 官方定位 | 页面标注的最近更新 |
|---|---|---|---|
| Gemini 4 Carbon | `gemini-4-carbon` | 最强的推理模型 | 2026 年 11 月 |
| Gemini 4 Argon | `gemini-4-argon` | 高效的 Gemini 4 前沿推理模型，响应更快、每轮 token 花费更少 | 2026 年 10 月 |
| Gemini 4 Hydrogen | `gemini-4-hydrogen` | 把前沿智能带给所有人 | 2026 年 11 月 |
| Gemini 3.8 Flash | `gemini-3.8-flash` | 最智能的 Flash 模型 | 2026 年 9 月 |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | 低延迟、高性价比的多模态模型 | 2026 年 7 月 |

页面对这五个型号的「版本」一栏都写 Stable；页面没有写发布日期，这里的日期是页面的「最近更新」。Arena 榜单上，Gemini 4 的几个型号被标为「初步」数据，见 [怎么看榜单和热度](./signals)。

## 共同的规格

这五个型号的详情页写的规格很接近：

- **上下文窗口**：输入 1,048,576 tokens。Gemini 4 三个型号的上下文和输出共用同一个上限。
- **最大输出**：默认 65,536；Gemini 4 三个型号在使用「long decode」时，页面写最高可到 1,048,576。
- **输入模态**：文本、图片、视频、音频、PDF。**输出**：文本。
- **思考档位**：Carbon 和 Argon 是 low、medium、high；Hydrogen 是 low、medium、high、xhigh；3.8 Flash 是 low、medium、high，并写明 `minimal` 不支持、会返回错误；3.5 Flash-Lite 页面支持思考，没有写档位。

## 能做什么

这五个型号的能力表都列为支持：代码执行、计算机使用、上下文缓存、文件检索、函数调用、Google 地图接地、Google 搜索接地、结构化输出、URL 上下文，以及 Batch、Flex、Priority 三种推理方式。都列为不支持：音频生成、图像生成、Live API（实时接口有专门的 Live 型号）。

几个差别：

- Gemini 4 Carbon 的上下文缓存**只支持隐式缓存**，页面写明不支持显式缓存。
- Gemini 4 三个型号的能力表里有「智能体式视频理解」，默认是静态的；3.8 Flash 的能力表里没有这一项。

## 其他型号

模型总览页还列出 Gemini 3.6 Flash、3.1 Flash-Lite、3.1 Pro（预览）、3 Flash（预览），多个 Live 和语音合成型号，Nano Banana 系列图像模型、Omni Flash、Deep Research、嵌入模型、机器人模型和 Lyria 音乐模型。这里只核对了上面五个型号的详情页。

## 要留意的变化

- Gemini 2.5 Flash 和 2.5 Pro 已弃用，不能在 AI Studio 中选择。页面写明自 **2026-12-01** 起，对它们的 API 请求会**自动路由**到 `gemini-3.5-flash-lite` 和 `gemini-3.8-flash`。也就是说，你的代码没改，背后换了模型。
- Gemini 2.0 Flash、2.0 Flash-Lite、3 Pro Preview、3.1 Flash-Lite Preview 等已经关闭。

## 哪里能用

Google 有一页「可用地区」。具体怎么对照，见 [大陆可用性、备案与许可](./compliance)。

## 出处

- [模型总览](https://aistudio.google.com/docs/models)
- [Gemini 4 Carbon](https://aistudio.google.com/docs/models/gemini-4-carbon)
- [Gemini 4 Argon](https://aistudio.google.com/docs/models/gemini-4-argon)
- [Gemini 4 Hydrogen](https://aistudio.google.com/docs/models/gemini-4-hydrogen)
- [Gemini 3.8 Flash](https://aistudio.google.com/docs/models/gemini-3.8-flash)
- [Gemini 3.5 Flash-Lite](https://aistudio.google.com/docs/models/gemini-3.5-flash-lite)
- [可用地区](https://aistudio.google.com/docs/available-regions)
