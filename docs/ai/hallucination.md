---
title: 幻觉与局限
description: 模型为什么会编造 API、版本和引用，以及怎么发现。
---

<RPath />

幻觉是指模型**一本正经地给出错误内容**：不存在的函数、编出来的版本号、打不开的链接。它不是故障，而是生成方式的副作用：模型总会接出「最像答案」的下一段文字，哪怕它其实不知道。对付幻觉的办法只有一个：**凡是能查证的，都查证。**

## 它知道和它在猜，看起来一样

切换下面两个例子，看候选选择怎样影响句子。概率是手写示意，不是模型测量值；真实模型也可能高概率地答错，不能根据候选是否集中来判断事实真假。

<AiNextToken preset="facts" />

## 最常见的几种编造

<RPoints>
<RPoint icon="code" title="不存在的 API" tone="warn">把 A 库的方法安到 B 库上，或者按命名习惯「推理」出一个看起来合理、实际没有的参数。</RPoint>
<RPoint icon="tag" title="过时或编造的版本" tone="warn">训练数据有截止时间，它给的「最新版本」可能早就过时，也可能根本不存在。</RPoint>
<RPoint icon="package" title="不存在的包" tone="warn">推荐一个名字很合理的包。有人专门抢注这类常被编造的包名，装上就可能执行恶意代码。</RPoint>
<RPoint icon="book" title="打不开的出处" tone="warn">给出的文档链接、论文、issue 编号是拼出来的，点开是 404 或内容对不上。</RPoint>
<RPoint icon="test" title="声称做过的事" tone="warn">说「已经测试通过」「已经修复」，其实没有运行过，或者运行失败了。</RPoint>
<RPoint icon="search" title="没读就下结论" tone="warn">没打开文件就描述文件内容，按文件名猜里面写了什么。</RPoint>
</RPoints>

## 为什么会这样

<RSteps>
<RStep title="训练目标是「像」，不是「对」" note="根本原因" open>

预训练让模型学会写出合理的下一段文字。「合理」和「正确」大部分时候重合，冷门、新近、细节性的内容上就会分开。

</RStep>
<RStep title="不知道也会接着写" note="很少主动说「不确定」">

生成过程里没有「查不到就停下」这一步。概率再分散，也会抽出一个候选接上去，语气照样肯定。

</RStep>
<RStep title="知识有截止时间" note="新版本、新 API 它没见过">

训练之后发布的版本、改名的配置项、废弃的接口，它只能按旧印象写。

</RStep>
<RStep title="上下文里缺信息" note="没给它，它就补">

你没提供文件内容、报错原文、项目用的版本，它就按「一般情况」补全。这一类最好避免：把相关内容放进上下文，或者让 Agent 自己去读。

</RStep>
</RSteps>

## 拿出来就能用的核查办法

包和版本，直接问包管理器。下面第二条命令故意查一个不存在的包，返回 404 就说明是编的：

查到的最新版本不一定是项目使用的版本。核对 API 写法时，要以 `package.json` 和锁文件中的实际依赖为准。

<RTerm
  title="核对包是否存在、最新版本是多少"
  :cmd='["npm view react version", "npm view this-package-should-not-exist-42"]'
  :out='["19.x.x", "npm error code E404", "npm error 404 Not Found - GET https://registry.npmjs.org/this-package-should-not-exist-42"]'
  note="版本号仅作示意，错误信息的具体措辞以本机 npm 版本为准。Python 包可以到 pypi.org 搜索包名核对。"
/>

<RCompare bad-title="接过答案就用" good-title="先用一条命令或一个链接确认">
<template #bad>

> AI：用 `dayjs().toFormat('YYYY-MM-DD')` 格式化日期。

直接抄进代码，运行时报 `toFormat is not a function`。`toFormat` 是另一个日期库的写法。

</template>
<template #good>

> 你：这个方法在哪个版本的官方文档里？给我链接。

再打开链接或在终端里试一行：

```js
console.log(typeof dayjs().format) // 'function'
console.log(typeof dayjs().toFormat) // 'undefined'
```

一行就分出真假。

</template>
</RCompare>

## 让它少编一点

<RPoints cols="3">
<RPoint icon="file" title="把文档给它">把官方文档的相关段落或 `package.json` 里的版本贴进对话，它就不用凭记忆写。</RPoint>
<RPoint icon="chat" title="允许说不知道">加一句「不确定就说不确定，不要猜」。</RPoint>
<RPoint icon="terminal" title="让它自己验证">用 Agent 时要求「改完运行 `npm test` 并贴出输出」，再自己看一眼输出。</RPoint>
</RPoints>
