---
title: Android
description: Kotlin / Compose 与 Android Studio 的基本工作流。
---

Android 开发中，**Kotlin 是语言，Compose 或 View 系统负责界面，Android Studio 与 Gradle 负责开发和构建流程**。先认识现有工程的模块、入口 Activity 和依赖配置，再让 Codex 修改页面。

## 一次页面改动的工作流

先按 README 同步工程，选择项目支持的设备或模拟器，运行修改前的页面。检查 `minSdk`、目标 SDK 和 Compose / Android Gradle Plugin 等依赖的实际配置；它们解决不同问题，不能为了使用一个新 API 全部升级。

| 需要确认的点 | 为什么影响实现 |
| --- | --- |
| 状态归属 | 重组或重建时是否保留数据 |
| 生命周期 | 页面离开后是否继续收集数据或更新 UI |
| 主线程 | 网络与重计算是否造成卡顿 |
| 权限 | 拒绝、再次询问和设置页返回如何处理 |
| 资源 | 不同尺寸、语言和深色模式如何适配 |

## Compose 不是每次重画整棵树

Compose 根据状态变化执行重组。需要观察的状态要放在合适的持有者中，避免在组合过程中直接发请求、产生外部副作用或创建不可控的订阅。临时界面状态、跨界面状态和业务数据应有清楚分工。

View 工程则沿用已有布局、适配器和生命周期机制；将一个 XML 属性直接换成同名 Compose 参数通常不可行。与状态管理相关的跨页问题，继续看 [状态管理](./state)。

## 可以直接交给 Codex 的说明

```text
为当前 Android 列表补空结果和失败重试，不替换界面框架。
沿用现有 ViewModel、仓库层和网络库。
避免重组或屏幕旋转造成重复请求，保留搜索输入。
报告实际构建变体、设备环境，以及尚未验证的权限场景。
```

验证不只点一次正常路径：尝试旋转屏幕、后台返回、快速切换查询和断网。检查 TalkBack、大字体和手势导航下的触达区域。下面片段用于控件对比，不代表已经在你的 Gradle 依赖组合中编译通过。

## 工具速查

<TechCard ids="kotlin,compose,android-studio,java" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="android" :labels="['Java', 'Kotlin (View)', 'Kotlin (Compose)']">
<template #t1>

<!--@include: ../snippets/button/java.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/kotlin-view.md-->

</template>
<template #t3>

<!--@include: ../snippets/button/compose.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="android" :labels="['Java', 'Kotlin (View)', 'Kotlin (Compose)']">
<template #t1>

<!--@include: ../snippets/switch/java.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/kotlin-view.md-->

</template>
<template #t3>

<!--@include: ../snippets/switch/compose.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="android" :labels="['Java', 'Kotlin (View)', 'Kotlin (Compose)']">
<template #t1>

<!--@include: ../snippets/modal/java.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/kotlin-view.md-->

</template>
<template #t3>

<!--@include: ../snippets/modal/compose.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="android" :labels="['Java', 'Kotlin (View)', 'Kotlin (Compose)']">
<template #t1>

<!--@include: ../snippets/list/java.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/kotlin-view.md-->

</template>
<template #t3>

<!--@include: ../snippets/list/compose.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="android" :labels="['Java', 'Kotlin (View)', 'Kotlin (Compose)']">
<template #t1>

<!--@include: ../snippets/tabbar/java.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/kotlin-view.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabbar/compose.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="android" group="android" />

## 相关任务模板

<PromptCard id="mobile-screen" />

继续查阅：[Compose 状态](https://developer.android.com/jetpack/compose/state)、[Android 架构建议](https://developer.android.com/topic/architecture/recommendations)。
