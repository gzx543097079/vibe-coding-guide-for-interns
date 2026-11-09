---
title: 其他跨端方案
description: Kotlin Multiplatform、Electron / Tauri、Capacitor 简述。
---

跨端方案不只有移动 UI 框架。选择前先明确**要共享界面、业务逻辑，还是把已有 Web 应用带到桌面或手机**，这些目标对应不同的工程路线。

## 按复用层比较

| 方案 | 常见用途 | 需要继续维护的边界 |
| --- | --- | --- |
| Kotlin Multiplatform | 共享部分领域、网络和数据逻辑，也有相关 UI 方案 | 平台互操作、构建和各端能力 |
| Electron | 用 Web 技术交付桌面应用 | 主进程 / 渲染进程隔离、更新与包体 |
| Tauri | Web 前端配合原生后端能力 | WebView 差异、命令权限与插件 |
| Capacitor | 把 Web 应用接入原生容器与插件 | 原生工程、权限、导航和设备行为 |

不能只根据使用的语言推断包体、性能或安全性。依赖、资源、设备和实际业务路径都会改变结果，应做同任务的原型验证。

## 桌面容器的安全边界

不可信网页内容不应直接获得任意文件或命令执行能力。Electron 中需要关注进程隔离和可暴露的接口，Tauri 等方案同样需要明确命令权限。不要因为前端和后端都在本机，就取消输入校验。

## 从已有业务选最小试验

挑一个必须访问本地文件、离线工作或调用系统能力的场景，检查权限拒绝、路径处理、编码、更新和卸载。只打开一个网页，无法验证这些边界。

```text
比较把当前 Web 应用交付到桌面的两条路线。
先列出必须调用的系统能力、目标系统与更新要求。
用同一个文件读取流程做原型，限制可访问目录。
记录实际测量和维护成本，不根据框架宣传给出绝对排名。
```

如果团队已经有原生工程和发布流程，新的共享方案还要解释迁移与回退。维护者能否持续升级，通常比首个演示能否快速跑起来更重要。

## 工具速查

<TechCard ids="kmp,electron,tauri,capacitor" />

## 相关任务模板

<PromptCard id="plan-first" />

继续查阅：[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform.html)、[Electron 安全](https://www.electronjs.org/docs/latest/tutorial/security)、[Tauri](https://v2.tauri.app/concept/)、[Capacitor](https://capacitorjs.com/docs)。
