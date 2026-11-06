---
status: draft
title: GitHub 与 PR 协作
description: 分支策略、PR 描述、Code Review 与 Issue。
---

## 这是什么

<TechCard ids="github" />

## 计划覆盖

- 分支策略：功能分支、main 保护与命名约定
- 如何写一份好的 PR 描述：背景、改动、验证方式
- Code Review：如何请求审查、如何回应评论
- Issue 的写法与关联 PR
- Fork 与上游同步（参与开源项目时）

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- PR 是讨论改动的地方，不只是合并按钮
- 团队的分支保护与审查规则

### 怎么验证

- 在 PR 页面检查 Files changed 是否只包含相关改动
- 确认 CI 检查全部通过

### AI 常错在哪

- PR 描述与实际改动不符
- 把多个不相关的改动塞进同一个 PR
