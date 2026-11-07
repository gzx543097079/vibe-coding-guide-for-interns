---
title: token 与上下文
description: token 怎么计数，上下文窗口装下什么、装不下会怎样。
---

<RPath />

**token 是模型读写文字的最小单位，上下文窗口是它一次能「看到」的 token 总量。** 规则文件、工具说明、聊过的每一轮、读进来的每个文件、它正在写的回答，全都挤在这一个窗口里。窗口满了，要么请求失败，要么前面的内容被丢掉或压缩。

## token 不是字，也不是词

模型先用分词器把文字切成 token，再处理。切法取决于分词器，不同模型不一样：

<RPoints cols="3">
<RPoint icon="tag" title="常见词">英文里常见的短词往往是一个 token，长词或生僻词会被拆成几段。</RPoint>
<RPoint icon="chat" title="中文">一个汉字可能是一个 token，也可能更多，取决于分词器 <RTbd tip="不同分词器差别较大，不给统一换算比例" />。</RPoint>
<RPoint icon="code" title="代码">缩进、括号、长变量名都要算 token。一个几百行的文件，很容易就是几千个 token。</RPoint>
</RPoints>

想知道一段文字到底多少 token，用对应模型的计数工具，不要凭字数估。OpenAI Responses API 提供 [输入 token 计数接口](https://developers.openai.com/api/docs/guides/token-counting)，响应的 `usage` 还会报告实际输入、输出用量。使用 Codex CLI 时可查看 `/status` 的会话用量；不需要为了读这一章额外调用付费 API。

## 窗口里装了什么

拖动下面的滑块：多聊几轮、多读几个文件、多接几个工具服务，看窗口怎么被占满；超出之后切换三种结局，看分别会丢掉什么。

<AiContext />

按 OpenAI 的 [会话状态文档](https://developers.openai.com/api/docs/guides/conversation-state)，输入、输出以及部分模型的推理 token 都要考虑在窗口预算内；读入的文件、工具定义和结果也会占空间。下面把常见处理方式分成三类；实际行为由 API 配置和应用共同决定：

<RPoints cols="3">
<RPoint icon="cross" title="直接报错" tone="warn">超过窗口且未启用截断时，请求可能直接失败。不要把所有服务的错误码和错误文案当成一样。</RPoint>
<RPoint icon="clock" title="丢掉较早内容">应用或 API 的截断配置可能移除早期内容。最开始交代的需求，也可能受到影响。</RPoint>
<RPoint icon="layers" title="压缩历史">Codex 等 Agent 可压缩历史以继续长任务。压缩后的表示不等于完整原文，要把关键约束和验证结果另行保存。</RPoint>
</RPoints>

窗口上限取决于具体模型和产品配置，变化也快。查 [OpenAI 官方模型文档](https://developers.openai.com/api/docs/models) 核对 API 模型；Codex 的可用上下文还要看当前会话和客户端设置，这里不写一个通用固定值。

## 窗口大不等于越多越好

能放进窗口，只说明长度没有超限，不保证模型会正确利用每条信息。无关文件、重复日志和过时要求都可能干扰判断，优先给与当前任务有关的内容。

<RCompare bad-title="什么都丢进去" good-title="只给这次任务需要的">
<template #bad>

- 「把整个项目读一遍，然后帮我修这个 bug。」
- 一个会话从早聊到晚，前后做了五六件不相关的事。
- 接了十几个工具服务，每次请求都带着它们的说明。

窗口很快就满，关键信息被稀释，后面还可能被压缩掉。

</template>
<template #good>

- 指明相关文件：「问题在 `src/auth/login.ts`，测试在 `tests/login.test.ts`。」
- 一件事一个会话，换任务就开新会话。
- 只启用这次要用的工具服务。

模型看到的内容少而准，你也更容易判断它是依据什么做的决定。

</template>
</RCompare>

长任务里，把关键约束和验证结果保存在项目文档中。历史压缩后若只剩模糊描述，重新读取相关文件和报错原文，不要让摘要替代原始证据。

token 也直接决定费用：多数 API 按输入和输出的 token 数分别计费，具体单价以各厂商价格页为准 <RTbd />。
