---
title: Meta Muse 与 xAI Grok
description: Meta 现在对外的 Muse 系列，xAI 的 Grok 4.7：能确认的内容和没能确认的内容。
---

> 数据核对于 **2026-11-13**，来自 Meta 开发者站点和 xAI 官方文档。这两家的官方页面给出的细节比前面几家少，所以这一篇写明了哪些没能确认。

## Meta：入口已经从 Llama 换成 Muse

以前提到 Meta 的模型，说的是 Llama。现在的情况是：

- `llama.com` 会跳转到 Meta 的开发者站点，最终落在 `dev.meta.ai`，首页标题是「你的下一个项目从 Muse 开始」。
- 首页列出的模型是 **Muse** 系列：Muse Spark 1.3、1.2、1.1，Muse Glimmer，Muse Image，Muse Voice Transcribe；「最近的模型」里还有 Muse Wonder、Muse Ember 和 SAM 3.1。
- 首页上与 Llama 有关的只剩一个「Llama Docs」链接，核对时它返回了服务器错误（HTTP 500），所以**没能确认 Llama 现在的状态**：是否仍在更新、是否仍开放权重、许可是什么，页面都没写。

关于开放权重，首页只有两句描述：

- **Muse Spark Open**：页面称它是「迄今最强的美国开放权重模型」。
- **Muse Glimmer**：页面称它面向「常开的本地 Agent」，可以在 Hugging Face 上获取。

上下文长度、模态、知识截止、发布日期、许可名称，这些页面都没写，所以这里也不写。Muse Wonder、Muse Spark 在 Arena 榜单上的名次见 [怎么看榜单和热度](./signals)。

## xAI：Grok 4.7

xAI 的模型页列出了详情页的只有 `grok-4.7`、两个图像和视频模型，以及语音接口。

| | grok-4.7 |
|---|---|
| 官方定位 | 页面称它是 SpaceXSI 面向编程、Agent 任务和知识工作的前沿模型 |
| 上下文窗口 | 500,000 tokens |
| 最大输出 | 页面未写 |
| 输入、输出 | 文本和图片 → 文本 |
| 能力 | 函数调用、结构化输出、推理；Batch API |
| 推理强度 | low、medium、high、xhigh，默认 high |
| 知识截止 | 2026 年 5 月 |
| 开放权重、许可、发布日期 | 页面未写 |

页面还写了这个模型的部署区域：us-east-1、us-west-2、us-central-1。这说的是数据中心区域，不是「哪些国家的用户可以使用」。

**定价表里出现但没有详情页的文本模型**，页面只给了上下文窗口：grok-4.6 和 grok-4.5 是 500k，grok-4.3 是 1M，grok-4.20 的几个版本是 1M，grok-build-0.1 是 256k。它们的其他信息页面未写。

**图像和视频**：`grok-imagine-image-2.0`（文本、图片 → 图片）和 `grok-imagine-video-1.5`（文本、图片 → 视频）。页面除了模态和部署区域，没有写更多。

**弃用**：页面里唯一明确标为已弃用的是语音模型 `grok-voice-2.0`。

## 读这一篇时要知道的

- Meta 一节里「没能确认」的部分是真的没有页面依据，不是遗漏。想知道 Llama 现在怎么样，请直接看 Meta 官方站点或它的 Hugging Face 组织页。
- 在这一组笔记引用的榜单里，Meta 的 Muse 系列排名靠前，xAI 的 Grok 没有出现在引用的前几名里。这只说明榜单上的结果，不代表对 Grok 能力的判断。

## 出处

- [xAI 模型总览](https://docs.x.ai/docs/models)
- [grok-4.7](https://docs.x.ai/developers/models/grok-4.7)
- [grok-imagine-image-2.0](https://docs.x.ai/developers/models/grok-imagine-image-2.0)
- [grok-imagine-video-1.5](https://docs.x.ai/developers/models/grok-imagine-video-1.5)
- [Meta 开发者站点](https://dev.meta.ai/)
