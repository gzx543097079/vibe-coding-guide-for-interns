---
title: 怎么看榜单和热度
description: OpenRouter 的调用量和 Arena 的排名各衡量什么，附带日期的前几名，以及不能拿它们推出什么。
---

> 这一篇的两张榜单是**某一天的快照**：OpenRouter 的数据截至 **2026-11-12**，Arena 的数据更新于 **2026-11-11**，抓取于 2026-11-13。过几天就会不一样，所以重点不是名次，而是它们各自衡量什么。

## 两个信号分别是什么

| | OpenRouter 排名 | Arena 排名 |
|---|---|---|
| 页面自己的说明 | 按通过 OpenRouter API 处理的 token 数（提示加输出）排名，按日汇总，同一模型的不同变体分开算 | 文本榜是数学、编程、创意写作等开放式领域的总排名；WebDev 榜是前端网页开发任务的排名，包括需要多步推理和工具调用的 Agent 式编程 |
| 衡量的是 | 这个平台上**流过多少 token** | 用户盲测对比时**选哪个** |
| 页面明确说不是 | 用户数、花费、准确率、基准表现 | — |
| 盲区 | 只覆盖通过这个平台调用的流量；国内平台直接提供的服务，不一定经过这个平台 | 分数带误差范围；标为「初步」的数据还不稳定 |

## OpenRouter 的调用量

**每周前 10**（页面标题「Weekly usage of models across OpenRouter」，数据截至 2026-11-12）：

| 排名 | 模型 | 厂商 | 周 token 量 |
|---|---|---|---|
| 1 | DeepSeek V4.1 Flash 1017 | DeepSeek | 55.8T |
| 2 | Hy4 | 腾讯 | 20.3T（环比 +405%） |
| 3 | DeepSeek V4.1 Flash | DeepSeek | 16T |
| 4 | GLM 5.3 Flash | 智谱 | 12T |
| 5 | GPT-6 Luna | OpenAI | 7.43T |
| 6 | Claude Opus 5.5 | Anthropic | 6.79T |
| 7 | Step 5 Preview | 阶跃星辰 | 6.73T |
| 8 | Kimi K3.1 Pro | 月之暗面 | 4.38T |
| 9 | GPT-6.1 Sol | OpenAI | 4.23T |
| 10 | GLM 5.3 | 智谱 | 3.88T |

**本月（滚动 30 天）前 10**：DeepSeek V4.1 Flash 1017（176T）、DeepSeek V4.1 Flash（81.5T）、GLM 5.3 Flash（57.6T）、GPT-6 Luna（34.2T）、Claude Opus 5.5（30.5T）、Hy4 preview（27.1T）、Step 5 Preview（26T）、Hy4（24.3T）、MiMo-V2.6-Flash（小米，20.6T）、GLM 5.3（19.2T）。

编程类别的榜单没有拿到：页面静态内容里只有按任务分类的列表，没有编程榜的前十。

## Arena 的排名

**文本总榜**（更新于 2026-11-11，9,122,174 票，421 个模型）前 15 名：

| 名次 | 模型 | 厂商 |
|---|---|---|
| 1 | Gemini 4 Carbon (High)，初步 | Google |
| 2 | Gemini 4 Argon (High) | Google |
| 3 | Muse Wonder (Max) | Meta |
| 4 | Claude Opus 5.5 (High) | Anthropic |
| 5 | Claude Fable 5 (High) | Anthropic |
| 6 | Claude Opus 4.6 (High) | Anthropic |
| 7 | Claude Fable 5.1 (Max) | Anthropic |
| 8 | Claude Opus 4.7 (High) | Anthropic |
| 9 | Gemini 3.8 Flash (High)，初步 | Google |
| 10 | Muse Spark 1.3 (Max) | Meta |
| 11 | Claude Opus 4.6 | Anthropic |
| 12 | Claude Opus 4.7 | Anthropic |
| 13 | Muse Spark 1.2 (xHigh) | Meta |
| 14 | Muse Spark 1.1 | Meta |
| 15 | Gemini 4 Hydrogen (High)，初步 | Google |

括号里的 High、Max 等是页面上的配置标签。前 15 名全部来自美国厂商；榜上最靠前的中国大陆厂商模型是第 20 名的 Kimi K3 (Max)，其后是第 24 名的 Kimi K3.1 Pro (Max)、第 25 名的 Qwen3.8-Max、第 28 名的 GLM-5.3 (Max)、第 31 名的 MiMo-V2.6-Pro、第 38 名的 DeepSeek-V4.1-Flash。国别是按厂商归类的，页面本身没有标注。

**WebDev 榜**（更新于 2026-11-11，158 个模型）前 10 名：Claude Fable 5.2 (xHigh)、Claude Opus 5.5 (Max)、Claude Sonnet 5.5 (xHigh)、Gemini 4 Carbon (High)、GPT-6 Astra (Max)、GPT-6.1 Sol (Max)、Claude Fable 5.1 (Max)、Muse Wonder Full (Max)、Claude Sonnet 5.5 (High)、Gemini 4 Hydrogen (High)。榜上最靠前的中国大陆厂商模型是第 12 名的 Kimi K3.1 Pro (Max)，其后是第 18 名的 DeepSeek-V4.1-Flash。

## 两个榜单放在一起看，会发现什么

- **「用得多」和「排名高」几乎是两个名单。** OpenRouter 上流量最大的是 DeepSeek、GLM 的 Flash 档这类低成本型号，Arena 前十几名多数是各家的旗舰档。前者反映的是「大量、便宜、够用」的使用，后者反映的是盲测里的偏好。
- **榜单覆盖的范围有限。** 这两个榜单都是海外平台的数据，国内平台直接提供的服务（比如豆包在火山方舟上的调用）不一定会反映在里面，所以「没上榜」不等于「没人用」。这一点这篇没有逐家核实。
- **同一厂商的多个版本会分开出现。** 比如榜上同时有 V4.1 Flash 和 V4.1 Flash 1017，前一个周榜第 3、后一个第 1，是不同的变体。

## 上了榜但这里没有介绍的

阶跃星辰的 Step 5 Preview（OpenRouter 周榜第 7）和小米的 MiMo 系列（月榜前 10，Arena 榜上也有）出现在上面的榜单里，但这一轮没有核对它们的官方页面，所以没有单独成篇。想了解，请直接看它们的官方文档。

## 能用它们做什么，不能做什么

<RCompare bad-title="不要这样用" good-title="可以这样用">
<template #bad>

- 用名次当「这个模型一定适合我的任务」的依据。
- 把某一天的快照当成长期结论，几个月后还照着选。
- 看到某个模型调用量大，就认为它质量最好。

</template>
<template #good>

- 用它们**缩小候选范围**：最近大家在用什么，偏好测试里表现如何。
- 记下查看的日期，隔一阵再看一次，看趋势而不是名次。
- 最终用自己的评测集决定，做法见 [怎么选模型](./choose)。

</template>
</RCompare>

## 出处

- [OpenRouter 排名](https://openrouter.ai/rankings)
- [Arena 文本榜](https://arena.ai/leaderboard/chat/text)
- [Arena WebDev 榜](https://arena.ai/leaderboard/code/webdev)
