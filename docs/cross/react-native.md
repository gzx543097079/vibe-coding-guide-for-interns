---
status: draft
title: React Native
description: 用 React + TypeScript 调用原生组件。
---

## 这是什么

<TechCard ids="react-native" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/button/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/switch/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/modal/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/list/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/tabbar/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="cross" group="cross" fallback="Flutter (Dart)" />

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- RN 组件与 Web DOM 元素的区别
- 平台差异：Platform 判断

### 怎么验证

- 在 iOS 与 Android 上分别运行
- 检查第三方库是否支持当前 RN 版本

### AI 常错在哪

- 使用 Web 才有的 API 或 CSS 属性
- 推荐已停止维护的社区库
