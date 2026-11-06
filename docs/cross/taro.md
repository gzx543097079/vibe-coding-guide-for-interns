---
title: Taro
description: 用 React 或 Vue 开发多端小程序。
---

# Taro

::: info 本章还没写
下面是计划覆盖的内容。想参与编写，点页面底部的「在 GitHub 上编辑此页」。
:::

## 这是什么

<TechCard ids="taro" />

## 计划覆盖

- Taro 的定位：用 React 或 Vue 开发多端小程序
- 项目结构与页面配置
- Taro 组件与 API
- 多端适配与平台差异处理

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/button/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/switch/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/modal/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/list/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/tabbar/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="cross" group="taro" fallback="Taro (React)" />

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- Taro 组件与 Web 组件的区别
- 页面配置文件的作用

### 怎么验证

- 在每个目标小程序平台上预览
- 检查编译产物与包体积

### AI 常错在哪

- 使用 Web 才有的 DOM API
- 混用 Taro 不同大版本的写法
