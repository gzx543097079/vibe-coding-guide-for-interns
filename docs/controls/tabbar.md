---
title: 底部标签栏 TabBar
description: 应用一级导航，选中背景平移与图标回弹。
---

## 用途与适用场景

底部标签栏放应用的 3～5 个一级页面，用户随时能切换回来。二级页面一般隐藏标签栏。

- 手机 App 的一级导航
- 每个页面保留自己的状态（滚动位置、输入内容）
- 网页上通常换成顶部导航

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="tabbar" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/tabbar/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabbar/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/tabbar/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/tabbar/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/tabbar/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/tabbar/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/tabbar/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/tabbar/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/tabbar/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/tabbar/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/tabbar/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 系统标签栏（UITabBarController、TabView、BottomNavigationView / NavigationBar、ArkUI Tabs、小程序 tabBar 配置） | 符合平台习惯，页面状态由系统保留 | 自定义动画受限 | 原生 App 默认选它 |
| 自绘标签栏 | 动画和样式自由 | 页面缓存、返回键、安全区都要自己处理 | 需要特殊视觉 |
| 网页导航链接 | 可分享链接、刷新不丢页面 | 没有页面缓存 | 网页 |

## 常见坑

- 每次切换都重新创建页面，滚动位置丢了
- 标签栏被手势条或安全区挡住
- 只用颜色区分选中，色弱用户分不清；加上图标粗细或背景变化
- 小程序 tabBar 配置的页面不能用 navigateTo 跳转，要用 switchTab
