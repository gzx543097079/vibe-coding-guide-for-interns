---
status: draft
title: Git 内部原理
description: 对象、引用、暂存区与打包文件。
---

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- commit 记录的是快照，不是差异

### 怎么验证

- 用 git cat-file 查看对象内容

### AI 常错在哪

- 解释原理时混淆 merge 和 rebase 的结果
