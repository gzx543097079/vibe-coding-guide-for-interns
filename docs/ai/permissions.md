---
title: 权限与安全
description: 用 Codex 的沙箱、审批策略与命令规则限制文件访问和命令执行。
---

<RPath />

**沙箱决定命令能碰到哪里，审批决定什么时候需要批准，命令规则决定某类调用应如何处理。** 这三件事要分开看。AGENTS.md 里的约定可以指导 Codex，但不能替代操作系统和执行程序施加的限制。

## 先分清三个层面

<RPoints cols="3">
<RPoint icon="folder" title="沙箱边界">限制本地命令的文件写入、网络等能力。工作区可写，不代表系统其他目录也可写；只读也不等于隐藏所有敏感文件。</RPoint>
<RPoint icon="chat" title="审批策略">决定何时提出批准请求、由谁处理。没有弹窗，可能是操作已获准，也可能是当前策略不允许申请升级。</RPoint>
<RPoint icon="terminal" title="命令规则">对匹配的命令前缀作 allow、prompt 或 forbidden 决策。它不是按文件内容判断安全，也不替代沙箱。</RPoint>
</RPoints>

具体边界受客户端、平台和组织策略影响，先查看当前会话的权限设置。入口和配置见 [Codex 官方安全文档](https://developers.openai.com/codex/security) 与 [配置参考](https://developers.openai.com/codex/config-reference)。

## 用受限的 CLI 会话起步

先理解项目，可以从只读沙箱开始；准备修改时，再选择工作区可写：

<RTerm
  title="两种启动方式，按任务选一种"
  :cmd='["codex --sandbox read-only --ask-for-approval on-request", "codex --sandbox workspace-write --ask-for-approval on-request"]'
  note="第一条适合先读代码、讨论方案；第二条允许在工作区修改。on-request 表示模型可提出审批请求，不保证每条命令都弹窗。组织限制仍然有效。"
/>

CLI 的用户配置通常放在 `~/.codex/config.toml`；受信任项目可使用 `.codex/config.toml`。采用传统沙箱配置的环境可写成：

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"

[sandbox_workspace_write]
network_access = false
```

这里限制的是沙箱命令的网络，不代表浏览器、连接器和 MCP Server 也一并断网。使用命名 permission profile 的环境，应按当前配置参考设置；不要把不同配置方案混用。CLI 中可用 `/permissions` 检查权限选择，用 `/status` 查看会话状态。

`approval_policy = "never"` 的意思是不能请求审批，失败会返回给模型；它本身不代表解除沙箱。不要把「少弹窗」和「权限更小」画等号。

## 命令规则怎样匹配

Codex 的 `.rules` 文件使用 `prefix_rule`。下面只演示命令前缀决策，**不会执行输入的命令，也不模拟整套沙箱和审批流程**：

<AiPermEval />

同一命令命中多条规则时，取更严格的决策：`forbidden` > `prompt` > `allow`。未命中则继续由其他权限配置处理，不能当成允许。机制见 [官方 Rules 文档](https://developers.openai.com/codex/rules)。

下面是一份练习用规则文件，可保存为独立的 `example.rules`：

```python
prefix_rule(pattern=["rm"], decision="forbidden")
prefix_rule(pattern=["git", "push"], decision="prompt")
prefix_rule(pattern=["npm", "install"], decision="prompt")
prefix_rule(pattern=["npm", "run", "build"], decision="allow")
```

只检查规则、不执行命令：

<RTerm
  :cmd='["codex execpolicy check --pretty --rules ./example.rules -- npm run build", "codex execpolicy check --pretty --rules ./example.rules -- git push origin main"]'
  note="第二条只是检查 git push 的规则决策，不会推送代码。规则文件会运行在受限的规则解释器里，不要当作普通 Python 脚本执行。"
/>

`allow` 只说明前缀匹配，不证明命令安全。先审查 `package.json` 的 scripts：build 脚本同样能写文件或联网。需要持久使用时，按官方文档把规则放入相应的 `rules/` 目录，并检查实际生效的来源。

## 批准前看清什么

<RSteps>
<RStep title="看实际命令和参数" note="不要只看模型给的解释" open>

确认操作对象、路径、目标仓库和网络地址。批准一个宽前缀，可能把后续不同参数的命令一起放行；优先批准当前动作所需的范围。

</RStep>
<RStep title="检查是否要越过沙箱" note="升级后的能力可能更大">

在沙箱内失败，不代表应该直接升级权限。先查失败原因：路径写错、依赖缺失和网络限制，需要的处理不同。

</RStep>
<RStep title="单独检查外部工具" note="MCP 和连接器有自己的授权">

本地命令的沙箱不替远程服务限制账号权限。只读任务就给只读凭据；外部写入、发消息等动作，还要检查具体工具和参数。

</RStep>
<RStep title="用无敏感信息的目录练习" note="不要拿真实凭据测试">

测试权限时使用假文件和独立练习目录，先做规则检查，再按需要验证沙箱行为。不要为了确认「读不到」，把真实密钥送进模型上下文。

</RStep>
</RSteps>

## 动手前的三问

<RAsk>
<template #know>

- 沙箱、审批策略和命令规则各自管哪一层。
- AGENTS.md 是行为约定，不能替代系统限制。
- 本地命令、MCP、浏览器和连接器的权限边界需要分别检查。

</template>
<template #verify>

- 用 `/permissions`、`/status` 和配置文件核对当前会话设置。
- 用 `codex execpolicy check` 检查允许、询问、禁止三类命令。
- 在无敏感信息的练习目录验证实际边界，保留失败与成功的输出。

</template>
<template #pitfall>

- 把 never 审批策略误解成无沙箱、无限权限。
- 规则只按命令前缀匹配，却把它解释成完整安全保证。
- 命令失败后建议关闭限制，或者换脚本绕开已经拒绝的动作。

</template>
</RAsk>
