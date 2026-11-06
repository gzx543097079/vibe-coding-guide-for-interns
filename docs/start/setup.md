---
title: 软件与环境安装
description: 终端、包管理器、Node / Python / JDK 等运行时与 Git 的安装。
---

<RPath />

开发环境就是四样东西：**终端、包管理器、Git、项目要用的语言运行时**。编辑器放在[下一章](./editor)。每装一样，都用 `--version` 确认装上了；版本以项目要求为准，不是越新越好。

下面的命令块按系统分标签，选一次后全站记住。Windows 一律用 PowerShell。

## 先认识终端

终端是你和 AI 工具都会频繁用到的地方。记住下面几个概念，后面大部分「装了却用不了」的问题都能自己排查。

<RPoints cols="3">
<RPoint icon="folder" title="当前目录">命令都在「当前目录」下执行。不确定在哪，先看一眼再动手。</RPoint>
<RPoint icon="path" title="PATH">系统按 PATH 里列的目录去找命令。装了却提示找不到，多半是 PATH 没配好。</RPoint>
<RPoint icon="key" title="环境变量">进程能读到的键值配置，比如 PATH、代理地址。密钥也常放这里，别贴给别人。</RPoint>
</RPoints>

<RTerm
  title="看看自己在哪"
  :mac='["pwd", "ls"]'
  :win='["Get-Location", "Get-ChildItem"]'
  :mac-out='["/Users/you/projects/my-app", "README.md  package.json  src"]'
  :win-out='["Path", "----", "C:\\Users\\you\\projects\\my-app"]'
/>

改了 PATH 或装了新工具之后，**关掉终端再新开一个**，新的配置才会生效。这是最常见的「明明装了却找不到」的原因。

## 安装步骤

按顺序来，每一步最后都有验证命令。

<RSteps>
<RStep title="包管理器" note="macOS 用 Homebrew，Windows 用 winget" open>

包管理器让你用一条命令安装、升级、卸载开发工具，不用到处找安装包。

macOS 安装 Homebrew（命令来自 [brew.sh](https://brew.sh)），装完按终端最后的提示把 `brew` 加入 PATH：

<RTerm
  :mac='["/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"", "brew --version"]'
  :win='["winget --version"]'
  :mac-out='["Homebrew 4.x.x"]'
  :win-out='["v1.x.xxxx"]'
  note="版本号仅作示意，以你本机输出为准。"
/>

Windows 10 / 11 一般自带 winget（随「应用安装程序」提供）<RTbd />。如果提示找不到 `winget`，到 Microsoft Store 更新「应用安装程序」。

</RStep>
<RStep title="Git" note="版本控制，几乎所有项目都要用">

macOS 自带的 Git 可能比较旧，用 Homebrew 装一份新的；Windows 的命令来自 [Git 官网](https://git-scm.com/install/windows)。

<RTerm
  :mac='["brew install git", "git --version"]'
  :win='["winget install --id Git.Git -e --source winget", "# 装完新开一个终端窗口再验证", "git --version"]'
  :mac-out='["git version 2.x.x"]'
  :win-out='["git version 2.x.x.windows.1"]'
/>

</RStep>
<RStep title="Git 首次配置" note="姓名、邮箱、默认分支名">

提交记录里会写上这里的姓名和邮箱。公司项目用公司邮箱。

<RTerm
  :cmd='["git config --global user.name \"你的名字\"", "git config --global user.email \"you@example.com\"", "git config --global init.defaultBranch main", "git config --global --list"]'
  :out='["user.name=你的名字", "user.email=you@example.com", "init.defaultbranch=main"]'
/>

</RStep>
<RStep title="Node.js（用 fnm 管版本）" note="前端项目和很多工具都依赖它">

不要直接装一个全局 Node 了事。不同项目要求的版本不同，用版本管理器切换。这里用 [fnm](https://github.com/Schniz/fnm)，安装命令和配置行来自它的 README。

第一步，安装 fnm：

<RTerm
  :mac='["brew install fnm"]'
  :win='["winget install Schniz.fnm"]'
/>

第二步，让终端每次启动时加载 fnm。macOS 默认 shell 是 zsh，把下面这行加到 `~/.zshrc` 末尾；Windows 加到 PowerShell 的配置文件（`$PROFILE`）末尾：

<RTerm
  :mac='["echo &apos;eval \"$(fnm env --use-on-cd --shell zsh)\"&apos; >> ~/.zshrc"]'
  :win='["if (!(Test-Path $PROFILE)) { New-Item $PROFILE -Force }", "Add-Content $PROFILE &apos;fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression&apos;"]'
/>

第三步，新开一个终端，装 LTS 版本并验证：

<RTerm
  :cmd='["fnm install --lts", "node --version", "npm --version"]'
  :out='["v2x.x.x", "1x.x.x"]'
  note="fnm install --lts 的写法待核实；项目里有 .nvmrc 或 .node-version 时，进入目录后执行 fnm use 即可切到项目要求的版本。"
/>

</RStep>
<RStep title="Python（按需）" note="做数据、脚本或 Python 后端时再装">

推荐用 uv 管理 Python 版本和依赖。下面的命令写法 <RTbd />，以 [uv 官方文档](https://docs.astral.sh/uv/) 为准。

<RTerm
  :mac='["brew install uv", "uv python install", "uv --version"]'
  :win='["winget install --id=astral-sh.uv -e", "uv python install", "uv --version"]'
/>

</RStep>
<RStep title="JDK（按需）" note="Java、Kotlin、Android 项目需要">

JDK 有多个发行版，选哪个、装哪个大版本，**先问团队**。下面以 Eclipse Temurin 为例，包名和版本号 <RTbd />。

<RTerm
  :mac='["brew install --cask temurin", "java -version"]'
  :win='["winget install EclipseAdoptium.Temurin.21.JDK", "java -version"]'
/>

</RStep>
</RSteps>

## 版本对不上时

「我这能跑，你那跑不了」，十有八九是版本不一致。

<RCompare>
<template #bad>

- 全局装一个最新版，所有项目共用。
- 同一种语言混用多个版本管理器（比如 nvm、fnm、官网安装包都装了）。
- 照着 AI 给的命令装，没看它是不是你的操作系统。

</template>
<template #good>

- 用版本管理器，按项目里的 `.nvmrc`、`.node-version` 或 `package.json` 的 `engines` 切换。
- 一种语言只留一个版本管理器，其他的卸干净。
- 每装一样都用 `--version` 确认，再新开终端确认一次。

</template>
</RCompare>

## 装了却找不到命令

提示 `command not found` 或「无法将 xxx 识别为 cmdlet」时，先看系统到底能不能找到这个命令、找到的是哪一个：

<RTerm
  title="排查 PATH"
  :mac='["which node", "echo $PATH | tr \":\" \"\\n\""]'
  :win='["Get-Command node", "$env:Path -split \";\""]'
  :mac-out='["/Users/you/.local/state/fnm_multishells/xxxx/bin/node", "/opt/homebrew/bin", "/usr/local/bin", "/usr/bin"]'
/>

找不到：说明安装目录不在 PATH 里，回到安装步骤看提示，或新开终端。找到的路径不是你预期的：说明装了不止一份，卸掉多余的那份。

## 动手前的三问

<RAsk>
<template #know>

- 终端的当前目录、PATH 和环境变量分别是什么。
- 项目要求的运行时版本写在哪：`.nvmrc`、`package.json` 的 `engines`、README。
- 你的系统和 shell：macOS 用 zsh，Windows 用 PowerShell，命令写法不通用。

</template>
<template #verify>

- 每装一个工具，用 `--version` 确认版本。
- 关掉终端再新开一个，确认配置在新窗口里仍然生效。
- 用 `which`（macOS）或 `Get-Command`（Windows）确认找到的是你装的那一份。

</template>
<template #pitfall>

- 给出别的操作系统的命令，比如在 Windows 上让你用 `brew`、`sudo`。
- 让你同时装多个版本管理器，导致 PATH 冲突、版本来回跳。
- 编造包名或安装地址。照做之前，对照官网核对一遍。

</template>
</RAsk>
