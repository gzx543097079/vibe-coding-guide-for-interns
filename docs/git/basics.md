---
title: Git 基础
description: init、add、commit、branch、merge、rebase 与冲突处理。
---

Git 把一次提交保存成一个可定位的项目快照，分支则指向提交。日常开发先分清**工作区、暂存区和提交历史**：编辑文件改的是工作区，`git add` 选择下一次提交的内容，`git commit` 把暂存内容保存到当前分支。

## 在练习仓库走一遍

下面只在新建的练习目录执行；姓名和邮箱沿用你已配置的 Git 身份，不要在重要项目里重新初始化：

```sh
mkdir git-guide-demo
cd git-guide-demo
git init -b main
git switch -c feat/readme
```

创建 `README.md` 并写入一行说明后：

```sh
git status --short
git diff -- README.md
git add README.md
git diff --cached
git commit -m "docs: 添加项目说明"
git log --oneline --decorate -3
```

新文件未被跟踪时，普通 `git diff` 不显示其正文；先查看文件，再在暂存后用 `git diff --cached` 检查。看到提交成功后，`git status` 应不再列出该文件的未提交改动。

## 分支和合并解决什么问题

分支让新功能的提交沿自己的路线前进。`merge` 合并两条历史，可能产生合并提交；`rebase` 把一组提交重新应用到另一个起点，会产生新的提交身份。团队共享历史优先按团队流程合并，不因「历史更好看」擅自改写。

## 遇到冲突不要整块覆盖

先读冲突两侧分别想实现什么，再修改文件、移除冲突标记，运行相关检查，最后暂存解决结果。只删掉标记并不代表逻辑正确。不能判断时保留现场，请负责该模块的人确认。

真实项目里先看 `git status` 再切分支，避免把别人的未提交改动带进当前任务。删除文件、撤销内容和清理历史各有不同后果，不要把清空工作区当作通用排错办法。

## 工具速查

<TechCard ids="git" />

继续查阅：[Git 入门](https://git-scm.com/docs/gittutorial)、[git diff](https://git-scm.com/docs/git-diff)。
