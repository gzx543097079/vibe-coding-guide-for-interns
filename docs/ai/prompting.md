---
title: 提示词基础
description: 把目标、上下文、约束和验收标准写清楚。
---

提示词没有咒语。好的提示词就是一份**写清楚的任务说明**：要做成什么样（目标）、相关代码在哪（上下文）、不能动什么（约束）、怎样算完成（验收）。少写一项，模型就得猜一项；猜错的每一处，都要你回头返工。

## 写清四项，减少模型要猜的事

勾选下面四项，看提示词怎么变，右边「要猜的事」怎么变少。

<AiPromptBuilder />

<RPoints>
<RPoint icon="target" title="目标">描述结果，而不是动作。「7 天内免登录」比「做个记住我」清楚得多。</RPoint>
<RPoint icon="folder" title="上下文">指出文件路径、现有函数、相关报错原文。它没读到的东西，它就不知道。</RPoint>
<RPoint icon="shield" title="约束">不能改的文件、不能加的依赖、必须沿用的组件。不说，它可能「顺手」都改了。</RPoint>
<RPoint icon="check" title="验收">怎样算做完、要不要先给方案、怎么验证。这也是你之后检查的标准。</RPoint>
</RPoints>

交付时按验收标准逐项检查，再用 `git diff` 确认实际修改范围。「代码能编译」只覆盖其中一部分，不等于需求已经完成。

## 几种常见场景

<RCompare bad-title="只描述现象" good-title="给出复现条件和原文">
<template #bad>

> 登录有 bug，帮我修一下。

哪个页面、什么操作、报什么错，全靠它猜。它很可能挑一个「看起来像 bug」的地方改掉，然后说修好了。

</template>
<template #good>

> 账号密码正确时，点登录后页面白屏；密码错误时提示正常。控制台报错：
> `TypeError: Cannot read properties of undefined (reading 'token')`
> 相关代码在 `src/pages/Login.vue` 的 `onSubmit`。先分析原因，不要直接改。

复现条件、报错原文、代码位置都有，还要求先分析，你能先判断它找的原因对不对。

</template>
</RCompare>

<RCompare bad-title="一次交代一整个需求" good-title="拆成能单独验证的小步">
<template #bad>

> 做一个完整的用户管理模块，包括列表、搜索、新增、编辑、删除、权限控制。

一次改十几个文件，出了问题很难定位，你也没法逐行审完。

</template>
<template #good>

> 先只做用户列表页：调用 `api/users.ts` 的 `listUsers`，表格用现有的 `DataTable`，支持分页。做完我确认，再加搜索。

每一步都能运行、能看完 diff。拆分方法见 [任务拆解](./decomposition)。

</template>
</RCompare>

## 写提示词的几个习惯

<RSteps>
<RStep title="先要方案，再要代码" note="方案阶段改主意几乎没有成本" open>

结尾加一句「先列出你打算改哪些文件、每处改什么，我确认后再写」。看方案时就能发现它理解偏了，比写完再推翻省事得多。

</RStep>
<RStep title="贴原文，不转述" note="报错、日志、需求原话">

报错信息完整复制，不要概括成「报了个空指针」。转述会丢掉文件名、行号这些最关键的线索。

</RStep>
<RStep title="给例子" note="一个例子胜过三句描述">

想要的输出格式、命名风格、测试写法，直接给一个现有的例子：「照着 `tests/user.test.ts` 的写法」。

</RStep>
<RStep title="说不知道就问" note="允许它提问">

加一句「信息不够就先问我，不要猜」。模型默认倾向于直接给答案，你明确允许，它才更可能停下来问。

</RStep>
<RStep title="反复用的写进规则文件" note="不用每次都重复">

测试命令、目录约定、代码风格这类每次都要交代的，写进项目的规则文件，见 [规则文件与 Skills](./rules-files)。

</RStep>
</RSteps>
