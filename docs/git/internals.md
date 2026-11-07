---
title: Git 内部原理
description: 对象、引用、暂存区与打包文件。
---

<RPath />

理解 Git 内部结构，能解释为什么提交可以恢复、为什么移动分支不等于删除文件，以及为什么大文件会让仓库历史膨胀。核心是**内容对象与指向对象的引用**。

## 对象怎样组成一次提交

| 对象 | 保存什么 |
| --- | --- |
| blob | 文件内容，不负责保存文件名 |
| tree | 名称、模式及指向子目录或文件对象的关系 |
| commit | 根 tree、父提交、作者信息和提交说明 |
| tag 对象 | 附注 tag 的目标与说明等元数据 |

分支是指向提交的引用；`HEAD` 通常指向当前分支，也可能直接指向一个提交，形成 detached HEAD。对象标识的算法与仓库格式有关，不应在脚本里假定永远固定一种长度。

## 用只读命令看实际对象

在有提交的仓库中运行：

```sh
git rev-parse HEAD
git cat-file -t HEAD
git cat-file -p HEAD
git ls-tree HEAD
git show --stat HEAD
```

`cat-file -t HEAD` 应显示 `commit`；`cat-file -p HEAD` 可看到它引用的 tree 和父提交。根提交没有父提交，不能据此判断仓库损坏。输出可能包含作者信息，分享日志前要按需要处理。

## 暂存区不是一个普通文件夹

暂存区记录下一次提交准备保存的路径和对象。工作区文件可以继续修改，而已暂存的版本保持不同内容，所以普通 diff 和 cached diff 会给出不同结果。理解这个区别，比把 `add` 看成「把文件搬进仓库」更准确。

## 垃圾回收不是恢复机制

打包对象可以减少存储成本；不可达对象在一定条件下可能被清理。暂时能用 reflog 找到某次提交，不代表它永远存在。重要工作应及时创建分支、提交并按团队策略备份，不手动修改 `.git` 内部文件来修问题。

继续查阅：[Git 对象](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)、[git cat-file](https://git-scm.com/docs/git-cat-file)。
