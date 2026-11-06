---
title: 骨架屏 Skeleton
description: 与真实布局一致的占位块、光泽扫过与内容淡入。
---

## 用途与适用场景

骨架屏在内容到达前先画出页面的大致结构，减少空白和跳动。它只在布局可预测时有用。

- 列表、卡片、详情页这类结构固定的内容
- 首屏加载、下拉刷新后的重新加载
- 不适合：很快就能返回（< 300ms）的请求，闪一下反而更乱

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="skeleton" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/skeleton/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/skeleton/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/skeleton/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/skeleton/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/skeleton/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/skeleton/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/skeleton/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/skeleton/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/skeleton/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/skeleton/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/skeleton/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/skeleton/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 按真实布局手写骨架（本页演示） | 替换时不跳动 | 布局一改骨架也要改 | 核心页面 |
| 通用灰块 | 写一次到处用 | 和真实内容对不上，替换时跳动 | 次要页面 |
| 旋转圈 | 最简单 | 看不出要加载什么 | 区域很小或结构不确定 |

## 常见坑

- 骨架高度和真实内容不一致，内容出来时整页跳一下
- 光泽动画用 background-position，不走合成层，低端机掉帧
- 读屏把每个灰块都读一遍；骨架要 aria-hidden，用 aria-busy 表示加载中
- 请求很快时骨架一闪而过；可以延迟 200ms 再显示
