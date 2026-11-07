---
status: draft
title: Git 基础
description: init、add、commit、branch、merge、rebase 与冲突处理。
---

## 这是什么

<TechCard ids="git" />

## 计划覆盖

- commit 是快照，分支是指向 commit 的指针
- merge 与 rebase 的区别
- 每次提交前用 git status 和 git diff 确认改动
- 解决冲突后运行测试再提交
- 常见错误及排查：建议使用 reset --hard、push --force 等破坏性命令；解决冲突时直接丢弃一方的改动。
