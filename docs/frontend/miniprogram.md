---
title: 小程序
description: 微信、支付宝、抖音小程序，以及 uni-app / Taro 跨端。
---

::: info 本章还没写
下面是计划覆盖的内容。想参与编写，点页面底部的「在 GitHub 上编辑此页」。
:::

## 这是什么

<TechCard ids="wechat-mp,uni-app,taro" />

## 计划覆盖

- 小程序的运行机制：逻辑层与渲染层
- 微信、支付宝、抖音小程序的共性与差异
- WXML / WXSS 与页面配置文件
- setData 与性能注意事项
- uni-app、Taro 等跨端框架的定位

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/button/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/button/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/switch/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/switch/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/modal/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/modal/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/list/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/list/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/tabbar/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabbar/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="mini" group="mini" />

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

<PromptCard id="frontend-ui" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- 页面生命周期与 setData 的代价
- 各平台 API 前缀与能力差异

### 怎么验证

- 在开发者工具与真机预览中分别验证
- 检查包体积是否超出限制

### AI 常错在哪

- 把 Web 的 DOM 写法用在小程序中
- 混用不同平台的 API
