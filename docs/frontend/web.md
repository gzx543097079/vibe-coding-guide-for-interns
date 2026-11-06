---
title: Web 前端
description: HTML / CSS / JS、React / Vue、构建工具与 DevTools。
---

# Web 前端

::: warning 🚧 本章内容建设中
本章目前只有大纲，正文正在编写。下面是计划覆盖的要点，欢迎在 GitHub 上参与补充。
:::

## 本章计划覆盖

- HTML 语义、CSS 布局（Flex / Grid）与 JavaScript 基础
- React 与 Vue 的核心概念：组件、状态、数据流
- 构建工具：Vite、webpack 的作用
- 浏览器 DevTools：元素、网络、控制台、性能面板
- 响应式与无障碍的基本要求

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种实现写法。切换任意一处标签，同页其他控件会一起切换，并在下次访问时记住你的选择。

### 按钮 Button {#button}

<ControlDemo control="button" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/button/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/button/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/switch/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/switch/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/modal/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/modal/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/list/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/list/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/tabbar/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabbar/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

## 用 AI 做这个方向时的提示词

::: tip 本节持续补充
本方向的专用模板正在整理，先提供可直接套用的通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="frontend-ui" />

<PromptCard id="bugfix" />

## 三问

回答得出这三个问题，再把这个方向的任务交给 AI。以下为计划展开的要点。

### 必须先懂什么

- DOM、事件与浏览器渲染的基本过程
- 组件状态与 props 的区别

### 怎么验证

- 在多个浏览器与屏幕宽度下实际打开页面
- 用 DevTools 检查网络请求与控制台报错

### AI 常错在哪

- 使用已废弃或不存在的 API
- 只实现默认状态，忽略加载、错误与空数据
