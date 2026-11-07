---
status: draft
title: Git 内部原理
description: 对象、引用、暂存区与打包文件。
---

## 计划覆盖

- commit 记录的是快照，不是差异
- 用 git cat-file 查看对象内容
- 常见错误及排查：解释原理时混淆 merge 和 rebase 的结果。
