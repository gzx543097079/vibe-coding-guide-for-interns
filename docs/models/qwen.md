---
title: 阿里通义千问 Qwen
description: 百炼上的 Qwen3.8 与 Qwen4 预览，开放权重的 27B、2.4T 和代码模型，以及全模态模型。
---

> 数据核对于 **2026-11-13**。API 型号来自阿里云百炼的官方文档，开放权重型号来自 Qwen 在 Hugging Face 上的官方模型卡。Qwen 官网 `qwen.ai` 和它的博客页面只返回一个词，内容需要浏览器渲染，没能读取，所以官网博客对 Qwen3.8 的说明没有核实。百炼页面的「更新时间」字段是空的，下面凡是日期都写「页面未写」。

## 一句话

Qwen 分成两条线：**百炼上的托管 API**（旗舰、均衡、低成本三档）和**开放权重**（从 27B 到 2.4T，加上代码模型）。API 这条线的主力型号上下文都是 1M，输入可以是文本、图片和视频。

## 百炼上的 API 型号

| 型号 ID | 页面上的定位 | 上下文 | 最大输出 |
|---|---|---|---|
| `qwen4-max-preview` | 复杂推理与编程；页面注明仅 Token Plan 可用 | 1M | 393,216（思考加输出） |
| `qwen3.8-max` | 页面未单独写定位 | 1M | 128k |
| `qwen3.8-flash` | 快速且低成本，「成本优先」 | 1M | 128k |
| `qwen3.7-plus` | 性能、速度与成本均衡，「均衡之选」 | 1M | 128k |

这四个型号在文本页的功能表里都写：支持思考模式、函数调用、内置工具、结构化输出；输入为文本、图片、视频，输出为文本。文本页还写明：同一个模型可以直接理解图片和视频，**不需要因为输入里有图片就改选 VL 模型**。

## 开放权重的型号

| 型号 | 规模与形态 | 上下文 | 许可（页面标注） |
|---|---|---|---|
| `Qwen/Qwen3.8-27B` | 27B，稠密，视觉语言模型 | 原生 262,144，可扩展到 1,000,000 | Apache-2.0 |
| `Qwen/Qwen3.8-2.4T-A95B` | 总参数 2.4T，激活 95B，**仅文本** | 原生 262,144，可扩展到 1,010,000 | 页面头部写 `qwen3.8-max` |
| `Qwen/Qwen3.8-Flash-Next` | 总参数 125B，激活 6B，视觉语言；官方称它是支撑 Qwen4 的新架构的实验性预览 | 原生 262,144，可扩展到 1,000,000 | `qwen-community-1.0` |
| `Qwen/Qwen3-Coder-Next` | 总参数 80B，激活 3B，面向代码 Agent | 原生 262,144 | Apache-2.0 |

模型卡上的几个要点：

- **Qwen3.8-2.4T-A95B**：模型卡写明它是纯文本模型，**所有交互都要开启思考模式，不能关闭**；卡片称这是 Qwen 第一次把 Max 级别的模型开放发布。
- **Qwen3.8-27B 和 Flash-Next**：思考默认开启，可以按请求关闭；支持 `reasoning_effort`。
- **Qwen3-Coder-Next**：只支持非思考模式；模型卡展示了工具调用的用法。
- 模型卡提到的「官方内置工具」是托管版才有的，卡片写明托管版「即将推出」。

模型卡上的时间只有「2026 年 8 月」这样的引用格式日期，Qwen3.8 合集的更新日期分别显示为 8 月 13 日和 8 月 26 日，**不一定是发布日**。

## 全模态模型

| 型号 | 输入 | 输出 | 说明 |
|---|---|---|---|
| `qwen3.8-omni-flash` | 文本、图片、音频、视频 | 文本 | 1M 上下文；支持思考、联网搜索、函数调用；页面建议音视频理解、会议纪要、字幕生成优先用它 |
| `qwen3.8-omni-flash-realtime` | 页面未写 | 页面未写 | 实时音视频对话，列表页标为全模态，详情页没读 |
| `qwen3.5-omni-plus` | 文本与图片、音频、视频的任意组合 | 文本和语音 | 页面写明支持声音复刻和可选音色；不支持深度思考 |

## 入口

- 网页聊天：`chat.qwen.ai`。
- 阿里云百炼的模型广场：`bailian.console.aliyun.com`。
- 千问 App：所读的页面里没有出现，页面未写。

## 出处

- [百炼模型列表](https://help.aliyun.com/zh/model-studio/models)
- [百炼文本生成模型](https://help.aliyun.com/zh/model-studio/text-generation-model)
- [百炼全模态模型](https://help.aliyun.com/zh/model-studio/qwen-omni)
- [Qwen 在 Hugging Face 的组织页](https://huggingface.co/Qwen)
- [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)
- [Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)
- [Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [Qwen3-Coder-Next](https://huggingface.co/Qwen/Qwen3-Coder-Next)
