---
title: 代码规范与工程素养
description: 命名、格式化、注释、提交规范与代码审查要点。
---

<RPath />

规范的目的只有一个：**让别人（包括 AI）一眼读懂你的代码。** 先找项目已有的规范照着做；能交给工具自动检查的，不靠人记。AI 生成的代码也要过同一套规范，不因为是 AI 写的就放宽。

## 先找项目已有的规范

接手一个项目，先在根目录找这几类文件。它们比任何「通用最佳实践」都优先。

<RPoints cols="3">
<RPoint icon="file" title=".editorconfig">缩进用空格还是 Tab、几个空格、文件末尾换行。多数编辑器自动识别。</RPoint>
<RPoint icon="gear" title="格式化配置">如 <code>.prettierrc</code>，决定引号、分号、换行宽度。</RPoint>
<RPoint icon="warn" title="检查配置">如 <code>eslint.config.js</code>，规定哪些写法算错误或警告。</RPoint>
<RPoint icon="script" title="package.json 的 scripts">看有没有 <code>lint</code>、<code>format</code>、<code>test</code>，提交前跑它们。</RPoint>
<RPoint icon="book" title="CONTRIBUTING.md">团队的提交、分支、审查约定，常和 README 放在一起。</RPoint>
<RPoint icon="bot" title="AI 规则文件">如 Codex 的 <code>AGENTS.md</code>，写给 Agent 的项目约定，人也该读。</RPoint>
</RPoints>

## 命名

名字说清「是什么」或「做什么」，读的人不用跳进实现就能猜到用途。具体用驼峰还是下划线，跟项目现有代码保持一致。

<RCompare>
<template #bad>

```ts
const d = 7
const data2 = list.filter((x) => x.f)
function handle(u) { /* ... */ }
```

`d` 是什么单位？`data2` 和 `data` 有什么区别？`handle` 处理什么？

</template>
<template #good>

```ts
const trialDays = 7
const activeUsers = users.filter((u) => u.isActive)
function sendWelcomeEmail(user) { /* ... */ }
```

布尔值用 `is`、`has` 开头，函数用动词开头。

</template>
</RCompare>

## 格式化和静态检查

两类工具分工不同，通常一起用：

<RPoints>
<RPoint icon="gear" title="格式化工具管「长什么样」">缩进、引号、换行。代表是 Prettier。只改排版，不改逻辑。</RPoint>
<RPoint icon="search" title="静态检查管「可能有错」">未使用的变量、可疑的比较、漏掉的 await。代表是 ESLint。</RPoint>
</RPoints>

优先运行项目自己定义的命令；没有定义时，再直接调用工具：

<RTerm
  title="提交前检查"
  :cmd='["# 项目定义了脚本时用这个", "npm run lint", "# 没有定义时直接调用", "npx prettier --check .", "npx eslint ."]'
/>

编辑器里打开「保存时格式化」，就不用每次手动跑格式化。格式化产生的改动最好单独提交，别和逻辑改动混在一个提交里，否则审查的人很难看出真正改了什么。

检查失败时先看具体原因。AI 可能用 `eslint-disable` 之类的注释让报错消失；需要修正的是问题本身，确有理由的例外再按项目约定处理。

## 注释

代码本身说明「做了什么」，注释说明「为什么这样做」。

<RCompare bad-title="复述代码" good-title="解释原因">
<template #bad>

```ts
// 循环用户列表
for (const user of users) {
  // 如果用户未激活就跳过
  if (!user.isActive) continue
```

删掉注释，信息一点没少。AI 尤其爱写这种注释。

</template>
<template #good>

```ts
// 支付网关要求金额以「分」为单位的整数，
// 浮点数相乘会有误差，所以先转成字符串再解析
const cents = toCents(amount)
```

记录的是代码里看不出来的约束。

</template>
</RCompare>

## 提交信息

很多团队采用 [Conventional Commits](https://www.conventionalcommits.org/)：`类型: 描述`。常用类型：

<RPoints cols="3">
<RPoint icon="flag" title="feat">新功能。</RPoint>
<RPoint icon="check" title="fix">修复问题。</RPoint>
<RPoint icon="book" title="docs">只改文档。</RPoint>
<RPoint icon="refactor" title="refactor">重构，不改变行为。</RPoint>
<RPoint icon="test" title="test">新增或修改测试。</RPoint>
<RPoint icon="gear" title="chore">构建、依赖、配置等杂项。</RPoint>
</RPoints>

<RCompare>
<template #bad>

```text
update
修改了一些东西
fix bug
```

三个月后没人知道这些提交改了什么。

</template>
<template #good>

```text
fix: 修复登录页在密码含空格时校验失败

trim 只应作用于账号，密码原样提交。
```

标题说清改了什么，正文说为什么改。

</template>
</RCompare>

一个提交只做一件事：能用一句话说清，就是合适的粒度。

## 审查 diff 的顺序

不管代码是谁写的，按这个顺序过一遍，比从头读到尾更容易发现问题。

<RSteps>
<RStep title="看范围" note="改了哪些文件，有没有超出需求" open>

先看文件列表。锁文件、CI 配置、和需求无关的模块出现在列表里，先问清楚为什么。

</RStep>
<RStep title="看逻辑" note="能不能用自己的话讲清楚">

逐段读改动，说不清某段为什么这样写，就问作者（或问 AI），还是说不清就不要合并。

</RStep>
<RStep title="看边界" note="空值、空列表、超长输入、网络失败">

AI 生成的代码通常能走通正常路径，边界情况最容易漏。

</RStep>
<RStep title="看风格" note="和周围代码是否一致">

命名、目录、错误处理方式和项目现有写法是否一致。格式问题交给工具，审查时不用逐个指出。

</RStep>
<RStep title="看测试" note="有没有测试，测试有没有真的跑过">

自己在本地跑一遍，或看 CI 结果。

</RStep>
</RSteps>

## 工具速查

<TechCard ids="prettier,eslint" />
