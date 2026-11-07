---
title: 弹窗与底部抽屉
description: 底部分享面板与确认对话框，焦点管理。
---

## 用途与适用场景

弹窗打断当前操作，要求用户先处理它。只有确实需要打断（确认删除、选择分享方式）时才用。

- 不可撤销操作前的确认
- 手机上的操作菜单、分享面板（底部抽屉）
- 不适合：提示信息（用轻提示）、长表单（用新页面）

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="modal" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/modal/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/modal/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/modal/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/modal/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/modal/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/modal/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/modal/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/modal/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/modal/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/modal/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/modal/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 原生 dialog 元素（网页） | showModal() 自带遮挡背景和 Esc 关闭 | 进出场动画要自己处理，旧浏览器支持要核实 | 网页 |
| 自绘遮罩加面板 | 动画和布局完全可控 | 焦点限制、背景 inert、滚动锁定都要自己做 | 需要复杂动画的场景 |
| 系统弹窗（UIAlertController、AlertDialog、ArkUI AlertDialog、wx.showModal） | 一行代码，读屏和返回键都处理好了 | 样式固定 | 简单确认 |

## 常见坑

- 关闭后焦点没回到触发按钮
- 背后的内容仍能被 Tab 聚焦
- 底部抽屉没考虑安全区，被手势条挡住
- 打开时没锁背景滚动，手指一滑背后的页面跟着动
