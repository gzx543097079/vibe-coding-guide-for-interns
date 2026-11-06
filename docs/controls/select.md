---
title: 下拉选择 Select
description: 自绘列表框的键盘操作、禁用项与系统选择器。
---

## 用途与适用场景

下拉选择从一组选项里选一个。能用系统选择器就用系统的，自绘时键盘操作是最容易漏的部分。

- 选项在 5～15 个之间，单选
- 表单里空间有限，不适合把选项平铺
- 选项更多时加搜索，改用搜索联想

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="select" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/select/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/select/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/select/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/select/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/select/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/select/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/select/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/select/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/select/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/select/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/select/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/select/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 原生 select 元素 | 键盘、读屏、手机上的系统滚轮都是现成的 | 展开后的列表几乎不能改样式 | 大多数网页表单 |
| 自绘列表框（本页演示） | 样式和选项内容自由 | 键盘、焦点、点击外部关闭都要自己做 | 需要图标、说明或禁用说明的选项 |
| 系统选择器（UIMenu / UIPickerView、ExposedDropdownMenu、ArkUI Select、小程序 picker） | 符合平台习惯 | 单个选项禁用在部分平台不支持（待核实） | 原生 App 与小程序 |

## 常见坑

- 打开后焦点没进列表，方向键在滚动页面
- Esc 关闭后焦点丢了，键盘用户要从头 Tab
- 列表贴着画布底部被裁掉，需要检测空间向上展开
- 禁用项能被键盘选中，或者高亮时没有跳过它
