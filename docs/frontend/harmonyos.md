---
title: 鸿蒙 HarmonyOS
description: ArkTS / ArkUI 与 DevEco Studio 的基本工作流。
---

鸿蒙应用开发先分清 **ArkTS 的语言约束、ArkUI 的声明式界面机制，以及 DevEco Studio 和 SDK 的工程配置**。已有 JavaScript / TypeScript 经验有帮助，但不能把 Web 代码直接当作 ArkTS 使用。

## 从工程约束开始

打开项目指定的工程，确认应用模型、模块入口、SDK / API 目标和设备支持范围。编译器报错时，先判断是语言限制、API 不可用还是依赖问题，不用不断加入类型断言掩盖错误。

| 层面 | 要看什么 |
| --- | --- |
| 组件状态 | 当前工程采用哪代状态管理机制，哪些值会触发更新 |
| 页面与组件生命周期 | 何时订阅、加载和释放资源 |
| Ability 与系统能力 | 页面职责与系统交互的边界 |
| 权限与设备差异 | 声明、申请、拒绝和不支持时的退路 |

## 状态驱动界面，副作用单独管理

页面状态变化应通过工程所采用的状态机制触发；普通字段、装饰器和观察行为不能随意互换。网络结果、计时器和系统订阅要考虑页面退出及重复进入，防止后台回调继续修改已失效的界面。

AI 常把 Web 的 DOM、CSS 或其他端的控件参数套进 ArkUI。核对 API 名称时使用对应 SDK 的官方参考，不仅看方法名是否「像真的」。已有片段标注的未校对项仍需实际编译和设备验证。

## 一次可控的任务描述

```text
在现有 ArkTS / ArkUI 工程给列表加入加载、空结果和失败重试。
沿用当前状态管理方案与请求封装，不提升 API 目标。
先定位组件和生命周期，再修改；页面离开后停止不需要的订阅。
列出使用的系统 API 与最低要求，并报告实际构建结果。
```

先在模拟器验证状态与布局，再到目标设备核对权限、系统能力、大字体和性能。浏览器中的手机外框只是教学演示，不能证明 ArkUI 手势、读屏或动画在真机上表现一致。

## 工具速查

<TechCard ids="harmonyos,arkts,deveco" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="harmony" :labels="['ArkTS (ArkUI)']">
<template #t1>

<!--@include: ../snippets/button/arkts.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="harmony" :labels="['ArkTS (ArkUI)']">
<template #t1>

<!--@include: ../snippets/switch/arkts.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="harmony" :labels="['ArkTS (ArkUI)']">
<template #t1>

<!--@include: ../snippets/modal/arkts.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="harmony" :labels="['ArkTS (ArkUI)']">
<template #t1>

<!--@include: ../snippets/list/arkts.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="harmony" :labels="['ArkTS (ArkUI)']">
<template #t1>

<!--@include: ../snippets/tabbar/arkts.md-->

</template>
</CodeTabs>
</ControlDemo>

## 相关任务模板

<PromptCard id="mobile-screen" />

继续查阅：[HarmonyOS 开发文档](https://developer.huawei.com/consumer/cn/doc/)、[状态管理](/frontend/state)。
