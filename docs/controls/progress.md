---
title: 进度条与环形进度
description: 确定与不确定进度、环形进度和加载指示器。
---

## 用途与适用场景

知道总量时用确定进度（显示百分比），不知道时用不确定进度或旋转圈。等待超过 1 秒就该给反馈。

- 上传、下载、批量处理这类能算出百分比的任务
- 等待接口返回这类不知道多久的任务（不确定进度）
- 空间小的地方用环形或旋转圈

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="progress" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/progress/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/progress/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/progress/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/progress/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/progress/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/progress/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/progress/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/progress/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/progress/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/progress/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/progress/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/progress/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| 原生 progress 元素 / 系统组件（UIProgressView、LinearProgressIndicator、ArkUI Progress、小程序 progress） | 语义和读屏现成 | 样式能改的有限，网页的 progress 跨浏览器样式不一致 | 大多数场景 |
| 自绘 + scaleX | 样式自由，动画只用 transform 不触发重排 | 要补 role="progressbar" 和数值属性 | 需要统一视觉 |
| SVG 描边动画（stroke-dashoffset）画环形 | 写法简单 | 不是 transform / opacity，严格只用合成属性时不合要求 | 对动画属性没有硬性限制的项目 |

## 常见坑

- 用 width 做进度动画，每一帧都触发布局
- 进度只有视觉，读屏读不到数值
- 不确定进度在减少动态效果下直接停住，看起来像卡死；改成静态提示文字
- 进度从 99% 卡很久，用户以为失败了；把最后一步的耗时算进去
