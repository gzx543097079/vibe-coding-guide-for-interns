---
title: Android
description: Kotlin / Compose 与 Android Studio 的基本工作流。
---

::: info 本章还没写
下面是计划覆盖的内容。想参与编写，点页面底部的「在 GitHub 上编辑此页」。
:::

## 这是什么

<TechCard ids="kotlin,compose,android-studio,java" />

## 计划覆盖

- Kotlin 语言基础与 Java 的关系
- View 体系与 Jetpack Compose 的定位与选择
- Android Studio：Gradle、模拟器、Logcat 与 Profiler
- Activity / Fragment 生命周期
- 权限、签名与多机型适配

::: info 待校对
Compose 的滑动删除写法在不同 Material3 版本间变化较大，相关示例待校对。
:::

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

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="mobile-screen" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- View 与 Compose 是两套 UI 体系
- Gradle 依赖与版本管理方式

### 怎么验证

- 在不同系统版本的模拟器上运行
- 用 Logcat 查看运行时报错

### AI 常错在哪

- 依赖版本与项目不匹配
- Compose 实验性 API 在不同版本间变化
