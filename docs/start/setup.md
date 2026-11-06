---
title: 软件与环境安装
description: 终端、包管理器、Node / Python / JDK 等运行时与 Git 的安装。
---

::: info 本章还没写
下面是计划覆盖的内容。想参与编写，点页面底部的「在 GitHub 上编辑此页」。
:::

## 这是什么

<TechCard ids="homebrew,nodejs,git" />

## 计划覆盖

- 终端基础：macOS Terminal / iTerm2、Windows Terminal、常用命令
- 包管理器：Homebrew、winget、Scoop 的定位与安装
- 运行时版本管理：nvm / fnm（Node）、pyenv / uv（Python）、SDKMAN!（JDK）
- Git 的安装与首次配置（用户名、邮箱、默认分支）
- 环境变量与 PATH：为什么装了命令却找不到

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- 终端里的当前目录、PATH 与环境变量
- 运行时版本与项目要求的版本是否一致

### 怎么验证

- 用 --version 确认每个工具已安装且版本正确
- 新开一个终端窗口验证配置是否生效

### AI 常错在哪

- 给出与你操作系统不符的安装命令
- 混用多个版本管理器，导致 PATH 冲突
