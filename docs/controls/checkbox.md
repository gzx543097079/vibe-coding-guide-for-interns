---
title: 复选框与单选
description: 全选与半选、对勾缩放、单选圆点。
---

## 用途与适用场景

复选框用于多选、彼此独立的选项；单选用于互斥的几个选项。带「全部」的复选组要正确显示半选状态。

- 通知类型、筛选条件这类可以多选的设置
- 主题、排序方式这类只能选一个的设置（选项不超过 5 个，多了改用下拉选择）
- 批量操作前的「全选」

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="checkbox" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/checkbox/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/checkbox/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/checkbox/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/checkbox/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/checkbox/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/checkbox/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/checkbox/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/checkbox/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/checkbox/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/checkbox/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/checkbox/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/checkbox/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 原生 input 加自绘外观 | 键盘、读屏、表单提交都是现成的 | 要把原生元素视觉隐藏，外观和状态同步 | 网页 |
| 系统控件（UIKit 没有原生复选框、SwiftUI Toggle 的 checkbox 样式只在 macOS、Material CheckBox、ArkUI Checkbox、小程序 checkbox） | 符合平台习惯 | iOS 没有原生复选框，要用勾选行或自己画（待核实各版本差异） | Android、鸿蒙、小程序 |
| 列表行打勾（iOS 设置页风格） | 触控区大，符合 iOS 习惯 | 多选时不如复选框一眼看清 | iOS 列表里的单选和多选 |

## 常见坑

- 半选只是视觉，没设置 indeterminate，读屏仍读「未选中」
- 「全部」把禁用项也勾掉了
- 用 display: none 隐藏原生 input，键盘和读屏都用不了
- 单选组没有共同的 name，方向键不能在组内切换
