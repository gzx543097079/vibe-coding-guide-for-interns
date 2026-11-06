---
title: 开关 Switch
description: 即时生效的二元设置，滑块位移与禁用说明。
---

## 用途与适用场景

开关表示一个立即生效的开/关设置。需要点「保存」才生效的选项用复选框，不要用开关。

- 系统设置、通知开关这类改了马上生效的选项
- 一行一个设置，名称写在左边，说明写在下面
- 被管理员或权限锁住时用禁用态，并写清原因

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="switch" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/switch/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/switch/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/switch/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/switch/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/switch/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/switch/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/switch/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/switch/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/switch/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/switch/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/switch/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 系统开关（UISwitch、Toggle、SwitchCompat、ArkUI Toggle、小程序 switch） | 外观和手感符合平台习惯 | 颜色、尺寸能改的有限 | 原生 App 默认选它 |
| 网页 button + role="switch" | 能读出开/关状态，样式自由 | 要自己画滑块、处理键盘 | 网页 |
| 网页 checkbox 改样式 | 表单提交天然带值 | 读屏读成「复选框」而不是「开关」 | 表单里需要提交值的场景 |

## 常见坑

- 切换后先改界面、请求失败却不回滚，界面和真实状态不一致
- 整行可点和开关可点混用，用户点了说明文字没反应
- 滑块动画改的是 left，掉帧；用 transform
- 禁用时只改颜色，键盘空格仍能切换
