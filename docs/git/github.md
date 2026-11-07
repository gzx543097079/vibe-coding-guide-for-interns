---
title: GitHub 与 PR 协作
description: 分支策略、PR 描述、Code Review 与 Issue。
---

<RPath />

Git 管理本地历史，GitHub 托管仓库并提供 Issue、PR、审查和自动检查。**推送分支不等于批准合并**；PR 的价值是让别人看清问题、变更和验证证据。

## 从功能分支提出改动

确认本地 `main` 没有未提交改动，按团队约定同步后再建分支。以下命令包含真实推送与创建 PR，执行前确认仓库和分支；不是用来练习的无副作用查询：

```sh
git switch main
git pull --ff-only
git switch -c feat/search
```

实现后先检查差异，只暂存相关文件并提交。在该功能分支上执行 `git push -u origin feat/search`，再用 GitHub 网页或 `gh pr create` 提出 PR。不要直接把功能提交推到共享主分支。

## 描述写给没有看过对话的人

| 内容 | 应回答的问题 |
| --- | --- |
| 问题与行为变化 | 哪个操作原来怎样，现在怎样 |
| 修改范围 | 改了哪些模块，为什么需要 |
| 验证证据 | 跑了什么、结果如何、哪些没测 |
| 上线影响 | 是否需要迁移、配置或发布顺序 |

不要只写「按讨论修改」；审查者可能没参加讨论。截图适合证明视觉结果，测试输出适合证明程序行为，二者不能互相替代。

## 审查意见如何处理

先复现问题或核对依据，再修改并补上相关验证。不同意某条意见时说明场景、约束和取舍，不用无关重构把问题藏起来。新提交可能让之前的审查结论失效，重要改动要请审查者再看。

分支保护和必需检查由仓库设置控制；检查通过也不保证需求正确。只有有权限且获得授权的人才能执行最终合并。本仓库要求人工审核后采用 merge commit，其他仓库应遵循自身约定。

## 工具速查

<TechCard ids="github" />

继续查阅：[GitHub PR](https://docs.github.com/en/pull-requests)、[受保护分支](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)。
