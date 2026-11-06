---
status: draft
title: uni-app
description: 基于 Vue，一套代码发布到小程序、H5 与 App。
---

## 这是什么

<TechCard ids="uni-app" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

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

## 方案对比

<ApproachCompare stack="cross" group="uniapp" fallback="uni-app (Vue)" />

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- uni-app 组件与 HTML 标签的对应关系
- 条件编译的写法

### 怎么验证

- 在每个目标平台上分别运行
- 检查条件编译分支是否都被验证

### AI 常错在哪

- 使用某个平台不支持的 API
- 忽略不同平台的样式差异
