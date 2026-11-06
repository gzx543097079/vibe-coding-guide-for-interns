---
title: iOS
description: Swift / SwiftUI 与 Xcode 的基本工作流。
---

# iOS

::: warning 🚧 本章内容建设中
本章目前只有大纲，正文正在编写。下面是计划覆盖的要点，欢迎在 GitHub 上参与补充。
:::

## 本章计划覆盖

- Swift 语言基础与 Objective-C 的关系
- UIKit 与 SwiftUI 的定位与选择
- Xcode：工程结构、模拟器、调试器与 Instruments
- 应用生命周期与常见目录结构
- 证书、签名与真机调试的基本概念

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种实现写法。切换任意一处标签，同页其他控件会一起切换，并在下次访问时记住你的选择。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="ios" :labels="['Objective-C', 'Swift (UIKit)', 'SwiftUI']">
<template #t1>

<!--@include: ../snippets/button/objc.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/swift-uikit.md-->

</template>
<template #t3>

<!--@include: ../snippets/button/swiftui.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="ios" :labels="['Objective-C', 'Swift (UIKit)', 'SwiftUI']">
<template #t1>

<!--@include: ../snippets/switch/objc.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/swift-uikit.md-->

</template>
<template #t3>

<!--@include: ../snippets/switch/swiftui.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="ios" :labels="['Objective-C', 'Swift (UIKit)', 'SwiftUI']">
<template #t1>

<!--@include: ../snippets/modal/objc.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/swift-uikit.md-->

</template>
<template #t3>

<!--@include: ../snippets/modal/swiftui.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="ios" :labels="['Objective-C', 'Swift (UIKit)', 'SwiftUI']">
<template #t1>

<!--@include: ../snippets/list/objc.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/swift-uikit.md-->

</template>
<template #t3>

<!--@include: ../snippets/list/swiftui.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="ios" :labels="['Objective-C', 'Swift (UIKit)', 'SwiftUI']">
<template #t1>

<!--@include: ../snippets/tabbar/objc.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/swift-uikit.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabbar/swiftui.md-->

</template>
</CodeTabs>
</ControlDemo>

## 用 AI 做这个方向时的提示词

::: tip 本节持续补充
本方向的专用模板正在整理，先提供可直接套用的通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

## 三问

回答得出这三个问题，再把这个方向的任务交给 AI。以下为计划展开的要点。

### 必须先懂什么

- UIKit 与 SwiftUI 的写法不能随意混用
- 最低支持系统版本决定了可用 API

### 怎么验证

- 在模拟器与真机上实际运行
- 检查深色模式与不同屏幕尺寸

### AI 常错在哪

- 给出高于最低支持版本的 API
- 在主线程执行耗时操作
