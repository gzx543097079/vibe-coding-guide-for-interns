---
title: 拖拽排序
description: 指针拖动与键盘排序，位置播报。
---

## 用途与适用场景

拖拽排序让用户直接调整顺序。只做指针拖动是不够的，必须有键盘方式，并且告诉读屏用户当前位置。

- 待办、收藏、导航菜单的自定义顺序
- 看板列内调整优先级
- 数量很多时提供「移到顶部」等快捷操作

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="sortable" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/sortable/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/sortable/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/sortable/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/sortable/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/sortable/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/sortable/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/sortable/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/sortable/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/sortable/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/sortable/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/sortable/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/sortable/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 手写指针事件（本页演示） | 不加依赖，动画可控 | 滚动容器、跨列表拖动都要自己处理 | 简单列表 |
| HTML5 拖放 API | 浏览器原生 | 触屏不支持，拖动中的样式几乎不能改 | 桌面网页、文件拖入 |
| 系统能力（UITableView 编辑模式、SwiftUI .onMove、ItemTouchHelper）或排序库 | 边界情况处理好了 | Compose、ArkUI 的内置支持随版本变化（待核实） | 原生 App、复杂场景 |

## 常见坑

- 只能用鼠标拖，键盘用户没办法排序
- 拖动时直接改数组顺序，每一帧都重排 DOM，元素闪动
- 落下后 DOM 节点移动导致焦点丢失，要手动聚焦回手柄
- 整行都能拖，和行内按钮、文字选择冲突
