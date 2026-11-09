---
title: iOS
description: Swift / SwiftUI 与 Xcode 的基本工作流。
---

iOS 开发先分清 **Swift 是语言，SwiftUI / UIKit 是界面框架，Xcode 是构建、调试和签名工具**。现有工程用哪种界面方案，就先沿用；不要让 Codex 把一个局部修复变成整页框架迁移。

## 从工程运行起来

<RSteps>
<RStep title="确认目标与依赖" note="打开仓库指定的工程入口" open>

阅读 README，确认应打开工程还是工作区，检查最低部署版本、构建 scheme、依赖和所需配置。不要把依赖安装失败误当作页面代码错误。

</RStep>
<RStep title="先在模拟器运行" note="选择实际支持的设备与系统">

构建并运行原有页面，记录复现路径。模拟器可快速查布局与逻辑，但相机、推送、性能和部分设备能力仍需真机核对。

</RStep>
<RStep title="修改后检查线程与生命周期" note="状态、异步结果和页面退出">

界面更新应遵守框架的线程隔离要求；长时间计算、网络和文件处理不能阻塞界面。页面退出后，异步结果是否仍会回写状态，也要检查。

</RStep>
</RSteps>

## SwiftUI 与 UIKit 怎样协作

SwiftUI 根据状态描述视图，UIKit 常通过控制器、视图对象和委托组织更新。桥接有明确机制，但不能把两者的属性、生命周期和布局写法直接混合。AI 生成的 modifier 或系统控件，需要对照项目 SDK 和最低系统版本核实可用性。

## 给 Codex 一次具体的页面任务

```text
在当前 iOS 工程修复列表请求失败后无法重试的问题。
沿用已有 SwiftUI 或 UIKit 架构，不修改部署目标和签名配置。
保留输入，展示失败原因和重试入口，避免页面退出后继续更新界面。
说明改动位置，并报告实际使用的构建目标与验证结果。
```

验证时检查大字体、深色模式、横竖屏及不同尺寸。能构建不代表权限、登录和设备能力都已验证。下方代码用于比较控件写法，原生片段仍需在你的目标工程编译；本指南没有把浏览器演示当作真机证据。

## 工具速查

<TechCard ids="swift,swiftui,uikit,xcode" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

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

## 方案对比

<ApproachCompare stack="ios" group="ios" />

## 相关任务模板

<PromptCard id="mobile-screen" />

继续查阅：[SwiftUI 教程](https://developer.apple.com/tutorials/swiftui)、[Xcode 文档](https://developer.apple.com/documentation/xcode)。
