---
title: React Native
description: 用 React + TypeScript 调用原生组件。
---

# React Native

::: warning 🚧 本章内容建设中
本章目前只有大纲，正文正在编写。下面是计划覆盖的要点，欢迎在 GitHub 上参与补充。
:::

## 本章计划覆盖

- React Native 的架构与原生组件映射
- 用 React + TypeScript 写移动端界面
- StyleSheet 与 Flexbox 布局
- 导航方案与常用社区库
- 原生模块与平台差异处理

::: info 待校对
React Native 核心库没有内置滑动删除组件，示例中只说明了常用的第三方方案。
:::

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种实现写法。切换任意一处标签，同页其他控件会一起切换，并在下次访问时记住你的选择。

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

## 用 AI 做这个方向时的提示词

::: tip 本节持续补充
本方向的专用模板正在整理，先提供可直接套用的通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

## 三问

回答得出这三个问题，再把这个方向的任务交给 AI。以下为计划展开的要点。

### 必须先懂什么

- RN 组件与 Web DOM 元素的区别
- 平台差异：Platform 判断

### 怎么验证

- 在 iOS 与 Android 上分别运行
- 检查第三方库是否支持当前 RN 版本

### AI 常错在哪

- 使用 Web 才有的 API 或 CSS 属性
- 推荐已停止维护的社区库
