---
title: 标签页 Tabs
description: 滑动下划线指示器与内容切换。
---

## 用途与适用场景

标签页在同一个页面里切换几组平级的内容。和底部标签栏不同，它属于页面内部，切换不改变导航层级。

- 详情页里的概览、评论、设置等分区
- 2～6 个标签；更多时让标签行可横向滚动
- 不适合：有先后顺序的步骤（用步骤条）

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="tabs" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/tabs/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabs/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabs/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/tabs/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/tabs/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/tabs/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/tabs/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/tabs/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/tabs/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/tabs/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/tabs/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/tabs/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 自绘 tablist（本页演示） | 指示器动画可控，键盘按 ARIA 规范实现 | 要处理测量和窗口变化 | 网页 |
| 系统组件（UISegmentedControl、TabRow、ArkUI Tabs、Flutter TabBar） | 滑动切换、指示器现成 | 样式按平台规范 | 原生 App |
| 组件库 Tabs | 现成的懒加载和可滚动标签 | 多一个依赖 | 项目已用组件库 |

## 常见坑

- 指示器用 left / width 做动画，频繁重排
- 选中后字重变粗，标签变宽，指示器没重新测量
- 所有标签都能 Tab 聚焦，键盘要按很多次；只让当前标签 tabindex=0
- 切换时旧内容和新内容同时占位，面板高度跳动
