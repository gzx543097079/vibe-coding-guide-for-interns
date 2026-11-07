---
title: 常用 AI 工具选择
description: 对话助手、编辑器补全、命令行 Agent 各适合什么场景。
---

<RPath />

AI 编程工具按**它能看到多少、能做多少**分成三类：对话助手只看你贴的内容；编辑器补全看光标附近的代码；Agent 能读整个项目、改文件、跑命令。能做的越多，你要把关的也越多。选哪个先看公司规定，再看任务类型。

## 按场景选

选一个场景，看三类工具哪个合适。

<AiToolPicker />

## 三类工具的边界

<RCompare neutral bad-title="对话助手与补全" good-title="Agent">
<template #bad>

**对话助手**（网页或桌面聊天，如 ChatGPT、Claude、Gemini，以及国内的通义、Kimi、DeepSeek 等）：只能看到你粘贴的内容，不会碰你的文件。适合问概念、解释报错、起草独立的代码片段。

**编辑器补全**（如 GitHub Copilot、Cursor 的补全）：边写边给建议，按 <kbd>Tab</kbd> 接受。上下文以当前文件和打开的文件为主，适合你已经知道要写什么的时候。

</template>
<template #good>

**Agent**（如 Claude Code、Cursor 的 Agent 模式、各家命令行 Agent）：在项目目录里自己搜文件、读代码、改文件、跑测试，循环直到做完。适合跨文件的改动和需要验证的任务。

能力越大，越需要你限定范围、审批命令、逐行看 diff。工作原理见 [Agent 循环](./agent-loop)。

</template>
</RCompare>

各产品的具体功能、可用模型和收费方案变化很快，这里不做横向对比，使用前以官网为准 <RTbd />。

## 选工具时先确认的事

<RPoints>
<RPoint icon="shield" title="公司允不允许" tone="warn">代码能不能发给第三方服务、能用哪些工具、用公司账号还是个人账号。这一条优先于一切。</RPoint>
<RPoint icon="eye" title="它能看到什么">对话助手只看你贴的；Agent 能读工作目录里的文件，读到的内容会发给模型服务。</RPoint>
<RPoint icon="terminal" title="它能做什么">能不能改文件、跑命令、联网、访问外部服务，默认需不需要你批准。</RPoint>
<RPoint icon="layers" title="团队在用什么">和团队用同一套工具，规则文件、权限配置能共享，遇到问题也有人能问。</RPoint>
</RPoints>

## 工具速查

<TechCard ids="cursor,claude-code" />

## 用得顺手的几个习惯

<RSteps>
<RStep title="一件事选一种工具" note="不要在几个工具之间来回贴" open>

在对话助手里讨论方案、在 Agent 里实现，中间来回复制，很容易漏掉上下文。一件事尽量在一个工具里做完。

</RStep>
<RStep title="补全建议逐条看" note="Tab 之前看清楚">

补全很容易让人连按 <kbd>Tab</kbd>。每一条建议都是一次没审过的改动，尤其是条件判断、边界值和变量名。

</RStep>
<RStep title="Agent 先计划后动手" note="确认方案再放它改">

让它先列出要改的文件和步骤。多数 Agent 工具有只读的计划模式 <RTbd tip="各工具名称与入口不同" />，Claude Code 里叫 plan 模式。

</RStep>
</RSteps>

## 动手前的三问

<RAsk>
<template #know>

- 公司对 AI 工具和代码外发的规定。
- 三类工具各自看得到什么、能做什么，以及读到的内容会发往哪里。
- 你选的工具默认有哪些权限，哪些操作会先问你。

</template>
<template #verify>

- 问工具「你现在能看到哪些文件」，和你的预期对比。
- 用 Agent 改完代码后，用 `git status` 看实际动了哪些文件。
- 产品功能和价格以官网当前页面为准，不以 AI 的回答为准。

</template>
<template #pitfall>

- 介绍别的工具的功能、快捷键或设置项，张冠李戴。
- 给出过时的价格、套餐和模型名称。
- 用 Agent 时读取了任务范围之外的文件，或执行了你没预料到的命令。

</template>
</RAsk>
