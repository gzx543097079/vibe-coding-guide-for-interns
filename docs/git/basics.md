---
title: Git 基础
description: init、add、commit、branch、merge、rebase 与冲突处理。
---

# Git 基础

::: warning 🚧 本章内容建设中
本章目前只有大纲，正文正在编写。下面是计划覆盖的要点，欢迎在 GitHub 上参与补充。
:::

## 本章计划覆盖

- 工作区、暂存区、本地仓库与远程仓库
- init / clone / add / commit / log / diff
- 分支：branch / switch / merge
- rebase 的作用与使用边界
- 冲突是怎么产生的，如何读懂冲突标记并解决

## 三问

回答得出这三个问题，再把这个方向的任务交给 AI。以下为计划展开的要点。

### 必须先懂什么

- commit 是快照，分支是指向 commit 的指针
- merge 与 rebase 的区别

### 怎么验证

- 每次提交前用 git status 和 git diff 确认改动
- 解决冲突后运行测试再提交

### AI 常错在哪

- 建议使用 reset --hard、push --force 等破坏性命令
- 解决冲突时直接丢弃一方的改动
