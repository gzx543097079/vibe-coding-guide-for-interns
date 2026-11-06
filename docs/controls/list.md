---
title: 下拉刷新与左滑删除
description: 列表手势：下拉阈值、横向滑动露出删除按钮。
---

## 用途与适用场景

手机列表常用两个手势：顶部下拉刷新、向左滑动露出操作。手势是加速方式，不能是唯一入口。

- 消息、通知、邮件这类会更新、会删除的列表
- 同时提供按钮或菜单作为替代入口
- 网页上通常只用刷新按钮和行内菜单

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="list" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/list/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/list/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/list/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/list/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/list/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/list/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/list/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/list/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/list/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/list/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/list/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 系统组件（UIRefreshControl + trailingSwipeActions、SwiftUI .refreshable / .swipeActions、SwipeRefreshLayout + ItemTouchHelper、ArkUI Refresh + swipeAction） | 手感符合平台，边界情况处理好了 | 样式定制有限 | 原生 App 默认选它 |
| 手写指针手势（本页演示） | 网页里能做出类似效果 | 方向判断、滚动冲突、阈值都要自己调 | 网页演示、H5 |
| 第三方手势库 | 复杂手势现成 | 多一个依赖，和滚动容器配合要测试 | React Native 等系统没提供的平台 |

## 常见坑

- 横向滑动和纵向滚动没先判断方向，斜着划时两个都触发
- 只有手势入口，键盘和读屏用户删不掉
- 刷新中还能继续下拉，重复请求
- 删除动画结束前数据已经变了，下一行闪一下
