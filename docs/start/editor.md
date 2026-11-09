---
title: 编辑器与 AI 工具
description: Codex CLI 的安装、AI 配置文件，以及编辑器与 AI 工具的分工。
---

**编辑器**：读代码、改代码、看 diff 的地方。具体用哪个按团队要求来。

**AI 工具（Agent）**：在授权范围内读文件、改文件、跑命令的助手，可以做成编辑器插件，也可以是终端里的命令行工具。

**模型服务**：在云端，根据上下文生成下一步。要不要接受改动，由你决定。

<REditorAgent />

## 安装 Codex CLI

本章沿用前一章装好的 Node.js，通过 npm 安装 Codex CLI。其他安装方式与平台说明见 [Codex CLI 官方文档](https://developers.openai.com/codex/cli)。

<RSteps>
<RStep title="安装 Codex CLI" note="需要先安装 Node.js 与 npm" open>

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

装好项目在用的格式化、检查和语言插件。项目里通常会有推荐插件配置，按提示安装即可；保存文件后确认格式化确实生效。

## 编辑器里常做的几件事

以下操作多数编辑器都有，具体键位以你用的编辑器为准。

<RPoints>
<RPoint icon="keyboard" title="命令面板">所有功能的入口，忘了快捷键就在这里搜。</RPoint>
<RPoint icon="file" title="按文件名打开">输入文件名的一部分就能跳过去，比在文件树里翻快。</RPoint>
<RPoint icon="search" title="全局搜索">在整个项目里搜文字，看 AI 改的函数还有谁在用。</RPoint>
<RPoint icon="path" title="跳到定义">在函数或变量上按一下，看它是怎么写的。</RPoint>
<RPoint icon="cursor" title="多光标">同时在多处输入，适合批量改相似的几行。</RPoint>
<RPoint icon="terminal" title="内置终端">在编辑器里开终端，跑命令不用切窗口。</RPoint>
</RPoints>

## AI 配置文件

在项目根目录用 `AGENTS.md` 告诉 Codex：怎么运行、怎么测试、哪些目录不能动、代码风格是什么。本仓库现有的 `AGENT.md` 是单数，需要显式读取或配置备用文件名；加载顺序与 Skills 用法见 [规则文件与 Skills](/ai/rules-files)。

新会话里让 Codex 列出收到的规则来源，再对照实际文件核查。模型的复述只能辅助确认，完成任务后仍要查看 `git diff`，检查实际改动是否遵守约定。

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

<TechCard ids="codex" />
