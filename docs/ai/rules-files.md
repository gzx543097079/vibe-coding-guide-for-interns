---
title: 规则文件与 Skills
description: 用 AGENTS.md 和 Skills 把项目约定与操作流程交给 Codex。
---

<RPath />

Codex 用 **AGENTS.md 保存项目约定，用 SKILL.md 保存具体工作流程**。前者告诉它项目怎么构建、怎样验证、哪些不能碰；后者描述一类任务应该怎样做。两者会影响模型的判断，真正的文件与命令边界仍要靠权限设置。

## 文件名先说清楚

Codex 的规则文件有明确的发现顺序：

<RPoints cols="3">
<RPoint icon="file" title="AGENTS.md">通常使用的规则文件名，注意是复数。全局约定放在 Codex 配置目录，项目约定放在仓库及相关子目录。</RPoint>
<RPoint icon="file" title="AGENTS.override.md">同一目录下优先于 AGENTS.md，适合临时替换该层约定；不是把两个文件合并加载。</RPoint>
<RPoint icon="file" title="备用文件名">本仓库的 AGENT.md 是单数。需要显式让 Codex 读取，或在 project_doc_fallback_filenames 里登记，不应假定自动识别。</RPoint>
</RPoints>

发现顺序、大小限制和备用名配置以 [Codex 官方 AGENTS.md 指南](https://developers.openai.com/codex/guides/agents-md) 为准：先读全局约定，再从项目根目录走到启动目录，每层最多取一个文件。不要假定运行中打开某个子目录，就会自动补载那个目录的规则；需要该目录的规则时，从那里启动并检查加载结果。

## 哪些文件会被读、什么时候读

点每一层看它管什么；切换启动目录和 Skill 开关，看加载的内容怎样变化。图中是简化后的目录关系。

<AiRulesLayers />

## 写什么、不写什么

把规则写短，写到**具体、能检查**。项目说明受配置的加载大小上限约束，关键规则不要埋在长篇历史里。

<RCompare bad-title="空泛、冗长" good-title="具体、能执行">
<template #bad>

```md
# 项目说明
本项目始于 2021 年，经历了三次重构……（省略 300 行）
- 代码要写得优雅
- 注意性能
- 测试要充分
```

「优雅」「充分」没法检查，模型也没法照做。

</template>
<template #good>

```md
# AGENTS.md
- 安装：npm ci；启动：npm run dev
- 提交前必须通过：npm run lint && npm test
- API 处理函数放在 src/api/handlers/
- 用 2 空格缩进，不用分号
- 不改 scripts/ 和 .github/ 下的文件
- 发布任务开始前先阅读 docs/release.md
```

</template>
</RCompare>

<RPoints>
<RPoint icon="check" title="适合写进去">构建和测试命令、目录约定、命名风格、「总是这样做」的规则。同一个错误它犯了第二次，就该写进去。</RPoint>
<RPoint icon="layers" title="适合拆出去">子项目约定放进对应目录的 AGENTS.md；多步骤且只在特定任务中使用的流程写成 Skill。</RPoint>
<RPoint icon="key" title="绝对不写" tone="warn">密钥、令牌和不应公开的内部信息。项目规则会随仓库共享，也会进入模型上下文。</RPoint>
<RPoint icon="shield" title="写了也不保证" tone="warn">敏感数据要靠实际访问边界隔离，不能只写一句「不要读」。命令前缀规则也不能覆盖所有读文件方式，详见 [权限与安全](./permissions)。</RPoint>
</RPoints>

## 从零开始写一份

<RSteps>
<RStep title="用 /init 起草" note="在正确的项目目录启动 Codex" open>

在项目里启动 `codex`，输入 `/init` 起草 AGENTS.md。已有规则时先看文件和 diff，避免丢掉团队手写的约定；生成的命令仍要核对。

</RStep>
<RStep title="删掉显而易见的，补上它发现不了的" note="比如团队约定、禁区">

`/init` 能从代码里看出的东西，它下次也能自己看出来。真正有价值的是代码里看不出的：不能动的目录、必须走的流程、踩过的坑。

</RStep>
<RStep title="确认真的加载了" note="从要工作的目录启动，再核对来源">

让 Codex 列出收到的规则来源和关键约束，逐项对照文件。改了规则后，新开会话验证；子目录规则用 `codex --cd packages/web` 启动后检查。模型的复述只是辅助，实际改动还要看 diff。

</RStep>
<RStep title="和代码一起审查" note="规则文件也会过时">

项目级 AGENTS.md 跟代码一样提交、一样审查。命令改了、目录挪了，规则文件要同步更新，否则它会照着过时的说明做。

</RStep>
</RSteps>

## Skill：用到时才加载的做法

一个 Skill 是一个文件夹，核心是 `SKILL.md`，frontmatter 的 `name` 和 `description` 用于发现和选择。选中后才读取完整说明；说明仍应简洁。Codex CLI 可用 `/skills` 选择，也可在消息里用 `$api-conventions` 显式调用，或让 Codex 按任务匹配。

```md
---
name: api-conventions
description: 本项目编写 API 接口时的约定。新增或修改接口时使用。
---

编写接口时：
- 路径用 RESTful 命名
- 错误统一返回 { code, message }
- 必须校验请求参数
```

按 [官方 Skills 文档](https://learn.chatgpt.com/docs/build-skills)，项目共享的可放在 `.agents/skills/<名字>/SKILL.md`，个人使用的可放在 `~/.agents/skills/<名字>/SKILL.md`。系统内置和插件另有加载位置；以当前客户端实际发现的目录为准。

## 动手前的三问

<RAsk>
<template #know>

- Codex 按目录发现 AGENTS.md，同层有 AGENTS.override.md 时优先取后者。
- 规则文件是上下文，不是强制配置；要强制就用权限规则或 hook。
- 项目级规则会提交进仓库，团队共享，不能写任何秘密。

</template>
<template #verify>

- 新会话里检查规则来源，再用无副作用的小任务确认它遵守关键约定。
- 用 `/skills` 检查 Skill 是否可发现，显式调用后检查执行结果。
- 每条规则问自己：别人能不能检查它有没有被遵守。

</template>
<template #pitfall>

- 把不同工具的规则文件名和目录混为一谈。
- 规则太长或互相矛盾时，随意挑一条执行，或者都没执行。
- 会话进行久了，渐渐不再遵守开头读到的规则。

</template>
</RAsk>
