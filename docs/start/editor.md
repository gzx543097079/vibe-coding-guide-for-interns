---
title: 编辑器与 AI 工具
description: VS Code、JetBrains、Cursor、Codex 的安装、插件与 AI 配置文件。
---

<RPath />

编辑器是你读代码、改代码的地方；AI 工具（Agent）是一个**会读文件、改文件、跑命令的助手**，它住在编辑器里（插件）或旁边的终端里（命令行工具），真正「想」下一步的是云端的模型服务。弄清这三者的关系，就知道该在哪一环把关。

<REditorAgent />

## 选哪个编辑器

团队有统一要求就按团队的来。没有的话，按项目类型选：

<RPoints>
<RPoint icon="code" title="VS Code">前端、Node、Python、脚本类项目的通用选择，靠插件支持各种语言。免费。</RPoint>
<RPoint icon="layers" title="JetBrains 系列">IntelliJ IDEA、WebStorm、PyCharm 等，重构和代码分析更强，适合 Java / Kotlin 大型项目。部分产品收费 <RTbd />。</RPoint>
<RPoint icon="cursor" title="Cursor">基于 VS Code 的 AI 编辑器，插件和快捷键基本通用。收费方案 <RTbd />。</RPoint>
<RPoint icon="terminal" title="Codex">OpenAI 的编码 Agent，可从 CLI、IDE 扩展或桌面应用使用。登录方式、可用功能和额度以账号与官方文档为准。</RPoint>
</RPoints>

iOS 用 Xcode，Android 用 Android Studio，鸿蒙用 DevEco Studio，这些平台专用 IDE 在[前端与客户端](/frontend/ios)模块里介绍。

## 安装

<RSteps>
<RStep title="安装 VS Code" note="或团队指定的编辑器" open>

也可以直接到 [code.visualstudio.com](https://code.visualstudio.com) 下载安装包。用包管理器安装：

<RTerm
  :mac='["brew install --cask visual-studio-code"]'
  :win='["winget install Microsoft.VisualStudioCode"]'
  note="Homebrew cask 名与 winget 包 ID 待核实。"
/>

</RStep>
<RStep title="在终端里用 code 命令打开项目" note="以后 code . 就能打开当前目录">

macOS：打开 VS Code，按 <kbd>Cmd</kbd> <kbd>Shift</kbd> <kbd>P</kbd> 打开命令面板，输入 `shell command`，选「Install 'code' command in PATH」。Windows 安装时默认已加入 PATH。

<RTerm
  :cmd='["cd ~/projects/my-app", "code ."]'
/>

</RStep>
<RStep title="装几个必备插件" note="格式化、检查、语言支持">

先装项目在用的：项目里有 `.prettierrc` 就装 Prettier 插件，有 `eslint.config.js` 就装 ESLint 插件，再加上你所用语言的官方插件。项目根目录的 `.vscode/extensions.json` 如果存在，VS Code 会提示你安装推荐插件。

</RStep>
<RStep title="安装 Codex CLI" note="需要先安装 Node.js 与 npm">

本章沿用前一章装好的 Node.js，通过 npm 安装 Codex CLI。其他安装方式与平台说明见 [Codex CLI 官方文档](https://developers.openai.com/codex/cli)。

<RTerm
  :cmd='["npm install -g @openai/codex", "codex --version"]'
  note="版本输出以本机为准。提示找不到 codex 时先新开终端，检查 npm 全局命令目录是否在 PATH；不要为了修复路径问题直接使用 sudo 安装。"
/>

Windows 可按 [官方 Windows 指南](https://developers.openai.com/codex/windows) 选择原生环境或 WSL；在 WSL 内开发时，也在同一环境内安装 Node.js、Git 和 Codex，避免混用两边的路径。

</RStep>
<RStep title="登录并在项目里启动" note="第一次运行会打开浏览器登录">

进入项目目录再启动，Agent 默认以这个目录为工作范围：

<RTerm
  :cmd='["cd ~/projects/my-app", "codex"]'
/>

用公司账号还是个人账号、代码能不能发给第三方服务，**先确认公司规定**。

</RStep>
</RSteps>

## 每天都会用的操作

下面是 VS Code 的默认快捷键，左边 macOS，右边 Windows。Cursor 基本相同。

<RPoints>
<RPoint icon="keyboard" title="命令面板" meta="⌘⇧P / Ctrl+Shift+P">所有功能的入口，忘了快捷键就在这里搜。</RPoint>
<RPoint icon="file" title="按文件名打开" meta="⌘P / Ctrl+P">输入文件名的一部分就能跳过去，比在文件树里翻快。</RPoint>
<RPoint icon="search" title="全局搜索" meta="⌘⇧F / Ctrl+Shift+F">在整个项目里搜文字，看 AI 改的函数还有谁在用。</RPoint>
<RPoint icon="path" title="跳到定义" meta="F12">在函数或变量上按一下，看它是怎么写的。</RPoint>
<RPoint icon="cursor" title="多光标" meta="⌥ 点击 / Alt 点击">同时在多处输入，适合批量改相似的几行。</RPoint>
<RPoint icon="terminal" title="内置终端" meta="Ctrl+`">在编辑器里开终端，跑命令不用切窗口。</RPoint>
</RPoints>

## AI 配置文件

在项目根目录用 `AGENTS.md` 告诉 Codex：怎么运行、怎么测试、哪些目录不能动、代码风格是什么。本仓库现有的 `AGENT.md` 是单数，需要显式读取或配置备用文件名；加载顺序与 Skills 用法见 [规则文件与 Skills](/ai/rules-files)。

<RCompare bad-title="写成长篇说明书" good-title="短、具体、能执行">
<template #bad>

- 几百行，从项目历史讲起。
- 「代码要优雅」「注意性能」这类无法检查的话。
- 写进了密钥、内网地址。

越长，关键约定越容易被忽略。

</template>
<template #good>

```md
# AGENTS.md
- 安装：npm ci；启动：npm run dev
- 提交前必须通过：npm run lint && npm test
- 只改 src/ 下的文件，不动 scripts/ 与 CI 配置
- 组件放 src/components/，一个组件一个文件
- 不读取、不输出 .env
```

</template>
</RCompare>

## 让 AI 只在该改的地方改

<RPoints>
<RPoint icon="folder" title="在项目目录启动">在实际项目目录启动，检查沙箱、可写目录和连接的数据源。启动目录不是唯一的权限边界。</RPoint>
<RPoint icon="git" title="先开新分支">在独立分支上让 AI 改，改坏了切回去就行。分支操作见 Git 模块。</RPoint>
<RPoint icon="eye" title="先计划后动手">让它先列出要改的文件和步骤，你确认后再执行。</RPoint>
<RPoint icon="shield" title="命令要你批准" tone="warn">删除文件、改配置、安装依赖、推送代码这类命令，逐条看清再允许。</RPoint>
</RPoints>

## 工具速查

<TechCard ids="vscode,jetbrains,cursor,codex" />

## 动手前的三问

<RAsk>
<template #know>

- 编辑器工作区、项目根目录和沙箱边界各是什么，当前会话允许访问哪些目录。
- Agent 会读哪些文件：规则文件、你提到的文件，以及它自己搜到的文件。
- 读到的内容会发送到模型服务，公司代码能不能外发要先确认。

</template>
<template #verify>

- 保存文件时格式化是否生效：故意把缩进弄乱，保存后看是否恢复。
- 问 Agent「你读到了哪些项目规则」，看它的回答和规则文件是否一致。
- 每次改动后用 `git diff` 或编辑器的源代码管理面板查看改了哪些文件。

</template>
<template #pitfall>

- 读取或修改了你没让它碰的文件，比如锁文件、CI 配置。
- 规则文件写得太长或太空，关键约定没被遵守。
- 给出别的编辑器的设置项或快捷键，或者编造不存在的插件。

</template>
</RAsk>
