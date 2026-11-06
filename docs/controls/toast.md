---
title: 轻提示与 Snackbar
description: 自动消失的轻提示与带撤销操作的 Snackbar。
---

## 用途与适用场景

轻提示告诉用户「操作成功了」，几秒后自己消失；Snackbar 多一个操作按钮，常用于撤销。两者都不能用来展示需要用户处理的错误。

- 复制、保存、收藏这类成功反馈
- 删除后给一次撤销机会（Snackbar）
- 不适合：表单错误、需要确认的内容

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="toast" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/toast/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/toast/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/toast/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/toast/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/toast/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/toast/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/toast/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/toast/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/toast/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/toast/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/toast/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/toast/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 系统提示（Android Toast / Snackbar、ArkUI promptAction.showToast、wx.showToast、Flutter SnackBar） | 一行代码，样式统一 | iOS 没有系统 Toast；部分平台不能带操作按钮 | Android、鸿蒙、小程序、Flutter |
| 自绘浮层 | 样式和位置自由，能带撤销 | 队列、计时、读屏播报都要自己做 | 网页和 iOS |
| 组件库（如各 UI 库的 message / notification） | 队列和堆叠现成 | 多一个依赖 | 项目已用组件库 |

## 常见坑

- 带撤销按钮的 Snackbar 时间太短，键盘用户还没 Tab 到按钮就消失了；悬停和聚焦时要暂停
- 没有 aria-live，读屏完全不知道出现过提示
- 多个提示叠在一起互相遮挡，没有替换或排队
- 用 Toast 显示错误，用户没看清就消失了
