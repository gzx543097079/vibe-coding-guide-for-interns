---
status: draft
title: 鸿蒙 HarmonyOS
description: ArkTS / ArkUI 与 DevEco Studio 的基本工作流。
---

## 这是什么

<TechCard ids="harmonyos,arkts,deveco" />

## 计划覆盖

- ArkTS 语言基础与 TypeScript 的异同
- ArkUI 声明式开发：组件、状态装饰器与布局
- DevEco Studio：工程结构、预览器、模拟器与调试
- Stage 模型与应用生命周期
- 多设备适配的基本思路

::: info 待校对
鸿蒙示例按 API 10 及以上编写，部分组件参数随版本变化，标注「待校对」的示例尚未在 DevEco Studio 中验证。
:::

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

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- @State 等状态装饰器的作用
- API 版本与可用组件的对应关系

### 怎么验证

- 在预览器与模拟器中分别验证
- 对照官方文档确认组件参数

### AI 常错在哪

- 照搬 TypeScript 写法导致编译不通过
- 使用当前 API 版本不存在的组件或参数
