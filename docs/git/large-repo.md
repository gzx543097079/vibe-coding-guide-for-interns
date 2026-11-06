---
status: draft
title: 大仓库与 monorepo
description: 子模块、稀疏检出、Git LFS 与 monorepo 协作。
---

## 计划覆盖

- submodule 与 subtree
- 稀疏检出与浅克隆
- 大文件与 Git LFS
- monorepo 的代码归属与 CI 范围

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- 仓库变大后哪些操作会变慢

### 怎么验证

- 在 CI 上验证稀疏检出和缓存配置

### AI 常错在哪

- 把大文件直接提交进仓库
