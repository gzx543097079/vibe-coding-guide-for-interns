---
status: draft
title: 改写历史
description: rebase -i、cherry-pick、reflog：整理提交、找回丢失的改动。
---

## 计划覆盖

- 交互式 rebase：合并、拆分、改写提交
- cherry-pick 挑选单个提交
- 用 reflog 找回误删的分支和提交
- 已推送的公共分支不要改写历史

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- 本地历史和远程历史的区别

### 怎么验证

- 改写前先建一个备份分支

### AI 常错在哪

- 建议用 push --force 覆盖别人的提交
