---
title: Kimi、智谱 GLM 与腾讯 Hy4
description: Kimi K3.1 Pro、GLM-5.3 系列和腾讯 Hy4 preview：定位、上下文与开放权重。
---

> 数据核对于 **2026-11-13**。Kimi 来自月之暗面开放平台文档和 Hugging Face 模型卡；GLM 来自智谱开放平台文档和 Hugging Face 模型卡；腾讯 Hy4 **只在 Hugging Face 上找到**，腾讯云的产品文档和混元官网都没有它的条目。Hugging Face 页面上「几天前更新」这类相对时间不能当作发布日期，下面没有采用。

## Kimi（月之暗面）

官方文档的入口是 `platform.kimi.com/docs`（旧地址 `platform.moonshot.cn` 会跳转过来）。

| 型号 | 官方定位 | 上下文 | 输入 |
|---|---|---|---|
| `kimi-k3.1-pro` | Kimi K3.1 系列的首个模型，Kimi 迄今能力最强的旗舰模型 | 1M | 文本、图片、视频 |
| `kimi-k3.1-pro-highspeed` | K3.1 Pro 的高速版，约为它的 2 到 3 倍速度，页面称能力相同 | 页面未写 | 页面未单独写 |
| `kimi-k3` | 上一代旗舰，页面称是全球首个开源的 3 万亿级模型（2.8 万亿参数） | 1M | 文本、图片、视频 |

K3.1 Pro 的文档要点：

- **思考始终开启**，`reasoning_effort` 取 `low`、`high`、`max`，默认 `max`。
- **工具调用**支持；**结构化输出**支持 `json_schema` 且 `strict: true`；还有流式输出、Partial Mode 和上下文缓存。
- 最大输出：页面没有单独写，只写 `max_completion_tokens` 默认 131072，最大可设为 1048576。
- **联网搜索**：页面写「正在更新，近期不建议用于生产流程」。
- 开放权重：模型卡称它是开放权重，许可名称为「Kimi K3.1 Pro License」，总参数 2.8T，激活参数 104B。快速开始页写明完整权重「将于 11 月 4 日前发布」，核对时没有逐一确认权重是否已经发布。

**下线**：`kimi-k2.7-code`、`kimi-k2.7-code-highspeed`、`kimi-k2.6` 已停止向新注册用户提供，11 月 1 日前注册的用户仍可使用，页面写预计 2026 年 12 月底全面下线。`kimi-k2.5` 和多个 `moonshot-v1-*`、`kimi-k2-*` 已下线。

## GLM（智谱 AI）

模型总览页是 `docs.bigmodel.cn/cn/guide/start/model-overview`。

| 型号 | 官方定位 | 上下文 / 最大输出 | 输入 |
|---|---|---|---|
| `glm-5.3` | 智谱最新旗舰模型 | 1M / 128K | 仅文本 |
| `glm-5.3-flash` | 普惠的全球前沿模型，原生理解图片视频，能生成可交互代码 | 1M / 128K | 视频、图片、文本、文件 |
| `glm-5.3-flashx` | 更快更流畅的 Flash，推理速度达 200 tokens/s | 1M / 128K | 页面未单独写 |
| `glm-5.3-flashx-legal` | 面向法律专业场景优化的模型 | 1M / 128K | 页面未单独写 |

GLM-5.3 和 GLM-5.3-Flash 的文档要点：

- **思考始终开启**，`thinking.type` 只支持 `enabled`；`reasoning_effort` 取 `low`、`high`、`max`，默认 `max`。
- 工具调用、流式输出、上下文缓存、结构化输出：都列为支持。
- **开放权重**：GLM-5.3 的 HF 页面称它是「编程方向能力最强的开放权重模型」，参数规模 753B，许可标签 `glm-5.3`；GLM-5.3-Flash 的许可标签是 MIT，页面正文写总参数 320B、激活 18B，HF 元数据写 321B，两处不一致，按原文记录。
- 总览页还列出 GLM-5.2、GLM-5.1、GLM-5、GLM-4.x 系列、视觉模型 GLM-5V-Turbo 和 GLM-4.6V 等，这里没有逐个核对。

## 腾讯 Hy4 preview

| | |
|---|---|
| 仓库 | `tencent/Hy4-preview`（另有 `tencent/Hy4-preview-FP8`） |
| 官方一句话 | 腾讯 Hy 团队开发的新一代混合专家（MoE）旗舰模型 |
| 上下文长度 | 1M，页面没有精确 token 数 |
| 输入、输出模态 | 页面未写；模型卡只标了文本生成和对话 |
| 思考 | 默认 high，可用 `reasoning_effort: "no_think"` 关闭 |
| 工具调用 | 模型卡没有文字说明，但部署命令里带了工具调用解析器的参数 |
| 开放权重与许可 | 开放，Apache License 2.0 |
| 参数规模 | 模型卡正文写总参数 770B、每个 token 激活 49B；组织页列的是 780B，两处不一致 |

要留意的是：模型卡里的 `hy4-preview` 是本地部署用的服务名，**不是腾讯云 API 的调用名**。腾讯云产品概述页（页面标注最近更新 2026-06-22）没有 Hy4，只列出 `hunyuan-a13b`、`hunyuan-translation` 等，并写明混元的相关功能将逐步迁移到 TokenHub。混元官网的正文需要脚本渲染，没能读取。

Hy4 在 OpenRouter 周榜上排名很靠前，见 [怎么看榜单和热度](./signals)。但从官方页面看，它目前是 preview，且只能确认开放权重，不能确认云上 API 的状态。

## 出处

- [Kimi 开放平台文档](https://platform.kimi.com/docs/models.md)
- [Kimi K3.1 Pro 快速开始](https://platform.kimi.com/docs/guide/kimi-k3-1-pro-quickstart.md)
- [Kimi-K3.1-Pro 模型卡](https://huggingface.co/moonshotai/Kimi-K3.1-Pro)
- [智谱模型总览](https://docs.bigmodel.cn/cn/guide/start/model-overview)
- [GLM-5.3](https://docs.bigmodel.cn/cn/guide/models/text/glm-5.3.md)（[模型卡](https://huggingface.co/zai-org/GLM-5.3)）
- [GLM-5.3-Flash](https://docs.bigmodel.cn/cn/guide/models/vlm/glm-5.3-flash.md)（[模型卡](https://huggingface.co/zai-org/GLM-5.3-Flash)）
- [腾讯 Hy4 preview 模型卡](https://huggingface.co/tencent/Hy4-preview)
- [腾讯混元产品概述](https://cloud.tencent.com/document/product/1729/104753)
