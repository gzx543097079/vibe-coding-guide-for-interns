---
status: draft
title: UI 控件与组件
description: 常见控件的行为与组件化思想，附各平台实现对照。
---

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="ui-cross" :labels="['SwiftUI', 'Kotlin (Compose)', 'ArkTS', 'Flutter (Dart)', 'React']">
<template #t1>

<!--@include: ../snippets/button/swiftui.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/compose.md-->

</template>
<template #t3>

<!--@include: ../snippets/button/arkts.md-->

</template>
<template #t4>

<!--@include: ../snippets/button/flutter.md-->

</template>
<template #t5>

<!--@include: ../snippets/button/react.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="ui-cross" :labels="['SwiftUI', 'Kotlin (Compose)', 'ArkTS', 'Flutter (Dart)', 'React']">
<template #t1>

<!--@include: ../snippets/switch/swiftui.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/compose.md-->

</template>
<template #t3>

<!--@include: ../snippets/switch/arkts.md-->

</template>
<template #t4>

<!--@include: ../snippets/switch/flutter.md-->

</template>
<template #t5>

<!--@include: ../snippets/switch/react.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="ui-cross" :labels="['SwiftUI', 'Kotlin (Compose)', 'ArkTS', 'Flutter (Dart)', 'React']">
<template #t1>

<!--@include: ../snippets/modal/swiftui.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/compose.md-->

</template>
<template #t3>

<!--@include: ../snippets/modal/arkts.md-->

</template>
<template #t4>

<!--@include: ../snippets/modal/flutter.md-->

</template>
<template #t5>

<!--@include: ../snippets/modal/react.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="ui-cross" :labels="['SwiftUI', 'Kotlin (Compose)', 'ArkTS', 'Flutter (Dart)', 'React']">
<template #t1>

<!--@include: ../snippets/list/swiftui.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/compose.md-->

</template>
<template #t3>

<!--@include: ../snippets/list/arkts.md-->

</template>
<template #t4>

<!--@include: ../snippets/list/flutter.md-->

</template>
<template #t5>

<!--@include: ../snippets/list/react.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="ui-cross" :labels="['SwiftUI', 'Kotlin (Compose)', 'ArkTS', 'Flutter (Dart)', 'React']">
<template #t1>

<!--@include: ../snippets/tabbar/swiftui.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/compose.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabbar/arkts.md-->

</template>
<template #t4>

<!--@include: ../snippets/tabbar/flutter.md-->

</template>
<template #t5>

<!--@include: ../snippets/tabbar/react.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="pending" />

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="frontend-ui" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- 控件的交互状态与反馈
- 组件的输入（props）与输出（事件）

### 怎么验证

- 逐个检查控件的每种状态
- 只用键盘完成一遍操作

### AI 常错在哪

- 跨平台混用控件 API
- 用 div 模拟按钮却不处理键盘与读屏
