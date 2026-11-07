---
title: 入门须知
description: 什么是 Vibe Coding，AI 能帮你做什么、哪些事必须你自己判断。
---

<RPath />

Vibe Coding 是用自然语言描述需求，让 AI 写出大部分代码，你来定方向、查结果、决定要不要合并。AI 写得再快，提交记录上写的是你的名字：**合并之前，你要能讲清楚每一处改动为什么这样写。**

## AI 擅长的事

这些事交给 AI 通常又快又稳，前提是你给了足够的上下文，并且会检查结果。

<RPoints>
<RPoint icon="code" title="样板代码">表单、接口调用、增删改查这类结构固定的代码，几秒钟就能起草出来。</RPoint>
<RPoint icon="search" title="读懂陌生代码">让它解释一个函数做了什么、一个模块依赖了谁，比自己从头翻快得多。</RPoint>
<RPoint icon="chat" title="解释报错">把完整报错和相关代码贴给它，它通常能指出最可能的原因和排查方向。</RPoint>
<RPoint icon="test" title="起草测试">根据函数签名和需求列出边界情况，写出测试初稿，再由你补漏。</RPoint>
<RPoint icon="refactor" title="机械式重构">改名、拆函数、统一写法这类改动量大但规则清楚的工作。</RPoint>
<RPoint icon="script" title="一次性脚本">批量改文件、整理数据、写个小工具，用完即弃的代码最适合交给它。</RPoint>
</RPoints>

## 必须你自己判断的事

AI 不知道你的业务，也不对结果负责。下面这些事，它可以给建议，但拍板的只能是你。

<RPoints>
<RPoint icon="target" title="需求对不对" tone="warn">AI 只会照你说的做。需求本身理解错了，代码写得再漂亮也是错的。</RPoint>
<RPoint icon="flag" title="业务规则" tone="warn">金额怎么算、权限怎么分、状态能不能回退，这些规则只有你和团队清楚。</RPoint>
<RPoint icon="shield" title="安全与数据" tone="warn">密钥、用户数据、对外接口的鉴权，AI 很少主动替你考虑。</RPoint>
<RPoint icon="license" title="依赖与许可证" tone="warn">它推荐的包可能已停止维护、版本不对，甚至根本不存在。</RPoint>
<RPoint icon="merge" title="能不能合并" tone="warn">测试有没有真的跑过、diff 有没有改到范围之外，最后由你确认。</RPoint>
</RPoints>

## 一次正常的协作

不管用哪个工具，稳妥的流程大致是这六步。前两步最容易被跳过，也最值钱。

<RSteps>
<RStep title="说清目标和边界" note="要做什么、不能动什么、怎样算完成" open>

写清楚三件事：目标（做成什么样）、范围（只改哪些文件或模块）、验收标准（怎么判断做完了）。说不清这三件事，说明你自己还没想好，先别急着让 AI 动手。

</RStep>
<RStep title="让 AI 先给方案" note="先看思路，再看代码">

先让它列出打算改哪些文件、每处改什么，你确认方向对了再动手。方案阶段改主意几乎没有成本，写完代码再推翻就贵了。

</RStep>
<RStep title="小步改动" note="一次只做一件能单独验证的事">

大需求拆成小步，每步都能单独运行、单独回滚。一次让 AI 改十个文件，出了问题很难定位是哪一处。

</RStep>
<RStep title="自己跑起来" note="不信「应该没问题」">

自己运行、点一遍、跑测试，覆盖正常情况和至少一个异常情况。AI 说「已经测试过」不代表真的跑过，以你亲眼看到的结果为准。

</RStep>
<RStep title="逐行看 diff" note="看懂每一处改动">

用 `git diff` 或编辑器的对比视图逐行看。看不懂的地方就问 AI 为什么这样写，还是说不清的，就不要合并。

</RStep>
<RStep title="提交并写清说明" note="写给三个月后的同事">

提交信息写清改了什么、为什么改。提交规范见[代码规范与工程素养](./conventions)。

</RStep>
</RSteps>

## 交代任务的写法

同一个需求，交代方式不同，AI 的产出差别很大。

<RCompare bad-title="只说一句话" good-title="写清目标、范围和验收">
<template #bad>

> 帮我做个登录页。

AI 只能猜：用什么框架、要不要记住密码、错误怎么提示、接口地址在哪。猜错的每一处，都要你回头再改。

</template>
<template #good>

> 在 `src/pages/` 下新增登录页，沿用现有的 `Form` 组件和 `api/auth.ts` 里的 `login` 方法。需要：账号密码校验、错误提示、登录成功跳转首页。不要改路由以外的公共文件。先列出你打算改的文件，我确认后再写。

范围、可复用的代码、验收点都写出来了，AI 不用猜，你也好检查。

</template>
</RCompare>

## 这份指南怎么读

<RPoints cols="3">
<RPoint icon="layers" title="模块与级别">9 个模块，每个模块内按基础、进阶、精通分级。先读基础，遇到需要再往下。</RPoint>
<RPoint icon="path" title="学习路径">每章开头的路径条标出前置章节和下一步，按顺序读最省力。</RPoint>
<RPoint icon="check" title="边读边试">验证方法和常见错误放在对应示例旁边。结合你手上的项目运行，看看结果是否符合预期。</RPoint>
</RPoints>

文中标着 <RTbd /> 的地方，是还没对照官方资料核实的命令、版本或价格，使用前请以官网为准。
