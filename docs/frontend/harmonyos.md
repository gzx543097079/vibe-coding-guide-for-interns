---
status: draft
title: 鸿蒙 HarmonyOS
description: ArkTS / ArkUI 与 DevEco Studio 的基本工作流。
---

## 这是什么

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

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

## 计划覆盖

- @State 等状态装饰器的作用
- API 版本与可用组件的对应关系
- 在预览器与模拟器中分别验证
- 对照官方文档确认组件参数
- 常见错误及排查：照搬 TypeScript 写法导致编译不通过；使用当前 API 版本不存在的组件或参数。
