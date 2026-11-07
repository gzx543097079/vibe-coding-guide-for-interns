---
status: draft
title: Web 前端
description: HTML / CSS / JS、React / Vue、构建工具与 DevTools。
---

## 这是什么

<TechCard ids="web-basics,typescript,react,vue,vite" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

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

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="frontend-ui" />

<PromptCard id="bugfix" />

## 计划覆盖

- DOM、事件与浏览器渲染的基本过程
- 组件状态与 props 的区别
- 在多个浏览器与屏幕宽度下实际打开页面
- 用 DevTools 检查网络请求与控制台报错
- 常见错误及排查：使用已废弃或不存在的 API；只实现默认状态，忽略加载、错误与空数据。
