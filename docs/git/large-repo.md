---
title: 大仓库与 monorepo
description: 子模块、稀疏检出、Git LFS 与 monorepo 协作。
---

大仓库的慢可能来自**网络传输、历史对象、工作区文件数量或构建依赖**，应先测清哪个阶段耗时。缩小工作区不一定缩小下载历史，拆仓库也不自动解决依赖治理。

## 几种机制不要混为一谈

| 机制 | 主要用途 | 没有自动解决什么 |
| --- | --- | --- |
| sparse-checkout | 只把部分路径展开到工作区 | 不等于只下载这些路径的全部历史 |
| partial clone | 按过滤条件延迟获取部分对象 | 后续命令仍可能需要网络 |
| Git LFS | 把大文件内容放到专门存储 | 不能消除大文件传输与配额成本 |
| submodule | 引用另一个仓库的指定提交 | 需要额外初始化和版本同步 |
| worktree | 同仓库的多个独立工作区 | 仍共享部分 Git 元数据与外部服务 |

## 从新 clone 中尝试稀疏检出

以下使用本指南的路径作示意，只在可重新创建的练习 clone 中操作：

```sh
git sparse-checkout set docs/ai docs/git
git sparse-checkout list
```

确认所需构建配置仍存在，再运行任务。依赖文件不在所选目录内时，要把必要路径纳入范围，而不是让 Codex 补造一份配置。

## monorepo 需要清楚的依赖方向

共享代码放在哪里、谁能引用谁、改公共包后触发哪些构建和测试，都要有明确约定。缓存必须以源码、依赖和相关配置为输入；只按分支名缓存，可能复用不属于当前代码的产物。

大资源频繁更新时，先评估是否应该放对象存储或制品库。已经进入 Git 历史的文件，删除当前副本并不会自动缩小历史；清理共享历史涉及协作和备份，不交给 Agent 自行决定。

继续查阅：[稀疏检出](https://git-scm.com/docs/git-sparse-checkout)、[Git LFS](https://git-lfs.com/)、[Git worktree](https://git-scm.com/docs/git-worktree)。
