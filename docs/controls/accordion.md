---
title: 手风琴 Accordion
description: 一次展开一项，只用位移和透明度做展开动画。
---

## 用途与适用场景

手风琴把一组标题和内容折叠起来，用户只展开关心的那一项。适合问答、设置分组这种可以跳着看的内容。

- 常见问题、帮助文档
- 设置页里不常用的高级选项
- 不适合：用户需要对比多项内容（全部展开或改用表格）

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="accordion" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/accordion/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/accordion/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/accordion/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/accordion/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/accordion/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/accordion/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/accordion/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/accordion/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/accordion/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/accordion/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/accordion/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/accordion/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| details / summary 元素 | 零脚本，键盘和读屏现成 | 「一次只展开一项」要加脚本或用 name 属性（浏览器支持待核实）；动画难做 | 简单网页 |
| button + region（本页演示） | 完全可控，能做 FLIP 动画 | 要自己写 aria-expanded 和键盘 | 需要动画或单开模式 |
| 系统组件（SwiftUI DisclosureGroup、Compose AnimatedVisibility、UIKit 表格分区） | 符合平台习惯 | 箭头样式和动画由系统决定 | 原生 App |

## 常见坑

- 直接动画 height，每帧重排；用 FLIP 或 grid-template-rows 过渡（后者不是 transform / opacity，按项目要求取舍）
- 标题用 div 加点击事件，键盘打不开
- 收起的内容只是视觉隐藏，读屏仍会读到
- 快速连点时上一次动画没结束，位置计算错乱
