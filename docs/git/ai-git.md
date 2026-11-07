---
status: draft
title: AI 辅助下的 Git 实践
description: 小步提交、随时能回滚，不让 AI 改范围之外的文件。
---

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="git-pr" />

## 计划覆盖

- 每个提交都应该能单独解释和回滚
- revert 与 reset 的区别
- 让 AI 改动后先看 diff 再决定是否提交
- 提交前跑一遍测试
- 常见错误及排查：一次改动过多文件，难以审查；自行执行 push、force push 或删除分支。
