---
title: 按钮 Button
description: 按压反馈、加载与成功状态、防重复提交。
---

## 用途与适用场景

按钮触发一个动作。用户点下去之后要立刻看到反馈，请求没回来之前不能再提交一次。

- 表单提交、保存、支付这类会发请求的主操作
- 同一屏里区分主次：一个主按钮，其余用次要样式
- 暂时不能操作时用禁用态，并在旁边说明原因

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="button" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/button/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/button/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/button/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/button/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/button/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/button/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/button/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/button/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/button/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/button/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/button/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 系统按钮（button 元素、UIButton、Material Button） | 自带键盘、读屏和按下态 | 样式定制有上限 | 大多数场景 |
| 自绘可点击区域（div + 点击事件） | 样式完全自由 | 要自己补键盘、焦点和读屏，容易漏 | 不建议，除非系统按钮确实做不到 |
| 组件库按钮 | 加载态、尺寸规范现成 | 多一个依赖，升级时要跟着改 | 项目已经在用组件库 |

## 常见坑

- 只改了文字没禁用按钮，加载中还能连点，导致重复提交
- 加载态换了文字长度，按钮宽度跳动；固定宽度或让按钮占满一行
- 按下缩放写在 hover 上，触屏设备上会卡在缩放状态
- 禁用按钮只降了透明度，读屏仍读成可用；要用 disabled 或 aria-disabled
