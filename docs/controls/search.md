---
title: 搜索联想
description: 防抖联想、匹配高亮、方向键选择与空结果。
---

## 用途与适用场景

搜索联想在用户输入时给出候选项，减少打字。核心是防抖、键盘导航和清楚的空状态。

- 站内搜索、命令面板
- 选项很多的选择（城市、成员）
- 空查询时显示最近搜索或热门

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="search" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/search/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/search/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/search/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/search/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/search/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/search/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/search/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/search/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/search/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/search/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/search/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/search/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 自绘 combobox（本页演示） | 高亮、分组、空状态完全可控 | ARIA combobox 模式细节多 | 网页 |
| datalist 元素 | 零脚本 | 样式不能改，不能高亮匹配 | 简单表单 |
| 系统搜索（UISearchController、.searchable + .searchSuggestions、Compose SearchBar、ArkUI Search） | 符合平台习惯 | 部分 API 需要较新的系统版本（待核实） | 原生 App |

## 常见坑

- 每输入一个字就请求一次接口，没有防抖
- 旧请求比新请求晚返回，覆盖了新结果；要丢弃过期响应
- 方向键移动高亮时页面也在滚动，忘了 preventDefault
- 点建议时输入框先失焦、面板先关了，点击落空
