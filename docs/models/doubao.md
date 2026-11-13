---
title: 字节豆包 Seed
description: Seed2.1 的 Pro、Turbo、Lite，以及视频、图像、实时语音和音频模型。
---

> 数据核对于 **2026-11-13**，来自火山引擎方舟的模型列表文档和字节 Seed 官网。方舟的页面很长，核对时读到「结构化输出」等章节后被截断，**列表末尾可能还有模型没有看到**。Seed 官网的正文没有标日期。

## 一句话

豆包大模型现在以 **Seed2.1** 为文本、推理和代码的主力，在方舟上分 Pro、Turbo、Lite 三个尺寸；另外还有视频、图像、实时语音和音频几个独立模型。核对到的页面里没有任何 Seed 模型开放权重的说法。

## Seed2.1 文本与推理模型

| 型号 | 方舟上的模型 ID | 上下文窗口 | 说明 |
|---|---|---|---|
| Seed2.1 Pro | `doubao-seed-2-1-pro-260915`、`doubao-seed-2-1-pro-260628` | 前者 1024K，后者 256K | Seed 官网称它是「面向真实生产力场景的全新智能体」 |
| Seed2.1 Turbo | `doubao-seed-2-1-turbo-260628` | 256K | 页面未写单独的定位 |
| Seed2.1 Lite | `doubao-seed-2-1-lite-260915` | 1024K | Seed 官网未提及，方舟页面未写定位 |
| doubao-seed-evolving | 方舟标为「快速迭代模型」 | 1024K | 方舟卡片写它是 Seed 最新的 Coding 与 Agent 模型，「周级迭代」 |

这几个型号在方舟上的写法一致：默认最大回答 4K，上限 256K，最大思维链 256K；能力标注为深度思考、文本生成、多模态理解、GUI 任务处理、工具调用、结构化输出；联网搜索在方舟的工具表里标为支持。

ID 末尾的六位数字页面没有解释，从排列看像是日期（如 `260915`），这只是推测，不是官方说法。同一系列会同时存在多个这样的版本，Seed2.1 Pro 的两个版本上下文差别很大，接入时要看清楚是哪一个。

**即将下线**：`doubao-seed-2-0-code-preview-260215` 和 Seed 2.0 系列的 `-260215` 版本在方舟页面上标为「即将下线」。

## 多模态模型

| 模型 | 页面上的说法 | 页面标注的日期 |
|---|---|---|
| Seedance 2.5（视频） | 4 到 30 秒视频生成，全模态参考输入；支持参考与编辑、视频延长 | 2026-07-31 正式发布 |
| Seedream 5.5（图像） | 文生图与图像编辑，多轮编辑，原生透明背景与 RGBA 输出 | 2026-11-09 发布 |
| SeedRealtime | 原生音视频全双工大模型，边看、边听、边说 | 2026-08-05 发布 |
| Seed Audio 1.0 | 面向完整声音场景的音频创作模型 | 2026-07-20 发布 |

这四个模型的上下文长度不适用或页面未写，Seedream 5.5 和 SeedRealtime 的模型 ID 页面也没有给出。

视觉理解没有单独的模型：方舟把图片、视频、文档理解归为 Seed2.1 等模型的「多模态理解」能力。

## 入口

- 豆包 App 和网页：`doubao.com/chat`。
- Seed 官网：`seed.bytedance.com`。
- 火山方舟的模型文档：`docs.volcengine.com/docs/82379/1330310`。
- 火山引擎的体验中心：`exp.volcengine.com`。

## 出处

- [方舟模型列表](https://docs.volcengine.com/docs/82379/1330310)
- [Seed2.1](https://seed.bytedance.com/zh/seed2_1)
- [Seedance 2.5](https://seed.bytedance.com/zh/seedance2_5)
- [Seedream 5.5](https://seed.bytedance.com/zh/seedream5_5)
- [Seed Audio 1.0](https://seed.bytedance.com/zh/seedaudio1_0)
- [Seed 模型页](https://seed.bytedance.com/zh/models)
