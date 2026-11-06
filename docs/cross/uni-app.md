---
title: uni-app
description: 基于 Vue，一套代码发布到小程序、H5 与 App。
---

# uni-app

::: warning 🚧 本章内容建设中
本章目前只有大纲，正文正在编写。下面是计划覆盖的要点，欢迎在 GitHub 上参与补充。
:::

## 本章计划覆盖

- uni-app 的定位：基于 Vue 的一套代码多端发布
- pages.json 与页面路由
- 条件编译：处理平台差异
- 常用 API 与 uni-ui 组件
- 发布到小程序、H5 与 App 的差异

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种实现写法。切换任意一处标签，同页其他控件会一起切换，并在下次访问时记住你的选择。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/button/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/switch/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/modal/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/list/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/tabbar/uniapp.md-->

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

- uni-app 组件与 HTML 标签的对应关系
- 条件编译的写法

### 怎么验证

- 在每个目标平台上分别运行
- 检查条件编译分支是否都被验证

### AI 常错在哪

- 使用某个平台不支持的 API
- 忽略不同平台的样式差异
