---
title: 输入框 Input
description: 浮动标签、失焦校验与错误抖动、清除按钮。
---

## 用途与适用场景

输入框收集文字。浮动标签在空间紧张时很省地方，但校验时机和错误提示决定了它好不好用。

- 注册、登录、个人资料这类表单
- 需要格式校验的字段：邮箱、手机号、验证码
- 有字数上限的昵称、标题

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="input" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/input/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/input/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/input/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/input/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/input/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/input/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/input/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/input/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/input/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/input/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/input/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/input/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 浮动标签 | 省一行高度，聚焦后仍能看到字段名 | 实现细节多，标签缩小后对比度要够 | 移动端、紧凑表单 |
| 标签在输入框上方 | 最稳，读屏和翻译都没问题 | 多占一行 | 大多数网页表单 |
| 只用占位文字当标签 | 最省空间 | 一输入就看不到字段名，不推荐 | 搜索框这种单字段场景 |

## 常见坑

- 每输入一个字就报错，用户还没打完就看到红字；失焦或提交时再校验
- 错误改正后要等再次失焦才消失，应该输入时立即清除
- 清除按钮一按输入框就失焦，触发了一次多余的校验
- 抖动动画用 Vue / React 的 class 绑定加上，被下一次渲染冲掉，只播放第一次
