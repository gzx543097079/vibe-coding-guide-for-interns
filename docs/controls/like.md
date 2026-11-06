---
title: 点赞爆发
description: 心形回弹、粒子飞散与数字滚动的微交互。
---

## 用途与适用场景

点赞是高频的小操作，一点动画能让反馈更明确。动画要短，取消点赞时更克制，减少动态效果时只保留颜色变化。

- 内容的点赞、收藏、关注
- 双击图片点赞（手机）
- 不适合：需要确认的操作（不要给删除加爆发动画）

## 演示、代码与提示词

演示可以直接操作，右上角切换网页或手机外框。「复制提示词」按下方当前选中的写法生成；提示词卡片上的徽标是还原验证的结果，验证方法见[控件总览](./overview#怎么验证提示词)。

<ControlDemo control="like" frames>
<CodeTabs group="ui-all" :labels="['HTML + CSS + JS', 'Vue', 'React', 'SwiftUI', 'Swift (UIKit)', 'Objective-C', 'Kotlin (Compose)', 'Kotlin (View)', 'ArkTS', 'WXML + JS', 'Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/like/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/like/vue.md-->

</template>
<template #t3>

<!--@include: ../snippets/like/react.md-->

</template>
<template #t4>

<!--@include: ../snippets/like/swiftui.md-->

</template>
<template #t5>

<!--@include: ../snippets/like/swift-uikit.md-->

</template>
<template #t6>

<!--@include: ../snippets/like/objc.md-->

</template>
<template #t7>

<!--@include: ../snippets/like/compose.md-->

</template>
<template #t8>

<!--@include: ../snippets/like/kotlin-view.md-->

</template>
<template #t9>

<!--@include: ../snippets/like/arkts.md-->

</template>
<template #t10>

<!--@include: ../snippets/like/wxml.md-->

</template>
<template #t11>

<!--@include: ../snippets/like/flutter.md-->

</template>
<template #t12>

<!--@include: ../snippets/like/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

::: info 关于代码片段
片段只展示核心写法。标了「待校对」的没有在对应平台编译运行过，用之前先在自己的工程里跑通；原生平台代码都没有在真机上验证。
:::

## 方案对比

| 方案 | 优点 | 缺点 | 适合 |
| --- | --- | --- | --- |
| CSS / 系统动画（本页演示） | 不加依赖，体积小 | 复杂粒子要手写关键帧 | 大多数场景 |
| Lottie 等矢量动画 | 设计师直接出动画文件 | 多一个运行时依赖，文件要管理 | 动画很复杂、品牌化 |
| 只切换图标颜色 | 最简单 | 反馈弱 | 减少动态效果或列表里大量出现 |

## 常见坑

- 连续点击时动画不重播，第二次点击没有反馈；每次换 key 重新挂载
- 先等接口返回再切换状态，点了半天没反应；先乐观更新，失败再回滚
- 数字滚动没有 overflow hidden，两个数字同时露出来
- 粒子用 top / left 做动画，掉帧
