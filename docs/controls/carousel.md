---
title: 轮播 Carousel
description: 拖动翻页、自动播放与暂停、圆点指示器。
---

## 用途与适用场景

轮播在有限空间里轮流展示几张卡片。自动播放会抢注意力，必须能暂停，悬停和聚焦时也要停下。

- 首页的几张推荐卡片
- 商品图、引导页
- 不适合：重要信息（很多用户不会翻到第二张）

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="carousel" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/carousel/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/carousel/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/carousel/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/carousel/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/carousel/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/carousel/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/carousel/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/carousel/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/carousel/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/carousel/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/carousel/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/carousel/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 系统组件（UICollectionView 分页、TabView .page、HorizontalPager、ArkUI Swiper、小程序 swiper） | 惯性和手势现成 | 自动播放暂停逻辑要自己补 | 原生 App 与小程序 |
| CSS scroll-snap | 原生滚动手感，代码少 | 自动播放、当前页同步要额外写 | 网页里简单的横滑 |
| transform 轨道 + 指针拖动（本页演示） | 完全可控 | 惯性、边界阻尼都要自己调 | 需要精确动画 |

## 常见坑

- 自动播放没有暂停按钮，不符合 WCAG 2.2.2（超过 5 秒自动移动的内容需可暂停）
- 非当前页没有 aria-hidden，读屏把四张都读一遍
- 在按钮上按下也开始拖动，点按钮变成翻页
- 减少动态效果时仍自动翻页
