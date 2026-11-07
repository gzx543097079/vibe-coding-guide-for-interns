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

想知道一段文字到底多少 token，用厂商提供的计数接口或工具算，不要凭字数估。例如 Anthropic 提供 [token counting API](https://platform.claude.com/docs/en/build-with-claude/token-counting)，每次调用的响应里也会在 `usage` 字段报告这次用了多少 token。

## 窗口里装了什么

拖动下面的滑块：多聊几轮、多读几个文件、多接几个工具服务，看窗口怎么被占满；超出之后切换三种结局，看分别会丢掉什么。

<AiContext />

按 Anthropic 的 [上下文窗口文档](https://platform.claude.com/docs/en/build-with-claude/context-windows)，计入窗口的有：系统提示、所有消息（包括工具结果、图片和文档）、工具定义，以及模型这一轮生成的输出。三种结局各由谁负责：

<RPoints cols="3">
<RPoint icon="cross" title="直接报错" tone="warn">输入本身就超过窗口时，API 返回 400 错误（prompt is too long），不会悄悄截断。</RPoint>
<RPoint icon="clock" title="丢掉最早的">部分聊天应用按「先进先出」丢弃早期对话。你最开始交代的需求，可能就在被丢的那部分里。</RPoint>
<RPoint icon="layers" title="压缩成摘要">Agent 工具常在快满时把历史总结成一段摘要。空间腾出来了，但原始报错、具体数值这些细节可能没保留。</RPoint>
</RPoints>

窗口有多大，各模型不同，而且变化很快。写这一章时（2026 年 11 月）Anthropic 文档列出的是 100 万和 20 万 token 两档，具体到哪个模型以 [官方模型对比表](https://platform.claude.com/docs/en/models/overview#latest-models-comparison) 为准；其他厂商的数字 <RTbd />。

## 窗口大不等于越多越好

同一份文档还提到：token 越多，模型的准确度和回忆能力会下降（他们称为 context rot）。所以重点不是塞满，而是只放需要的。

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

token 也直接决定费用：多数 API 按输入和输出的 token 数分别计费，具体单价以各厂商价格页为准 <RTbd />。

## 动手前的三问

<RAsk>
<template #know>

- token 是模型处理文字的单位，按分词器切分，和字数、词数都不一一对应。
- 上下文窗口装着规则、工具定义、历史对话、文件和正在生成的回答，是一个总量上限。
- 超出窗口时，API 会报错；丢弃或压缩是应用层做的，会丢掉信息。

</template>
<template #verify>

- 用厂商的 token 计数接口算一段文字，对比你凭感觉的估计。
- 查看 API 响应里的 `usage` 字段，确认一次请求实际用了多少 token。
- 长会话里问它「我最开始提的要求是什么」，看它还记不记得。

</template>
<template #pitfall>

- 长会话后期忘掉早先说过的约束，比如「不要改公共组件」。
- 历史被压缩后，把摘要里的模糊描述当成原始细节来用。
- 声称「已经读过整个项目」，实际上只读了其中几个文件。

</template>
</RAsk>
