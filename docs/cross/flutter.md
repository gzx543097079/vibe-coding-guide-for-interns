---
title: Flutter
description: 用 Dart 写一套 UI，自绘引擎覆盖多端。
---

<RPath />

Flutter 用 Dart 描述界面和业务，并通过自己的框架、渲染与平台集成能力构建多端应用。**界面代码可以复用，设备能力、输入方式和发布配置仍需分别处理。**

## 从现有工程开始

先读 README、`pubspec.yaml` 与锁文件，确认 Flutter / Dart 工具链和目标端。`flutter doctor` 用于检查工具环境；`flutter analyze` 运行静态分析；`flutter test` 执行工程测试。它们分别验证不同环节，不能互相替代。

不需要为检查已有页面重新创建工程。依赖或平台目录有问题时，先核对版本与错误，不让 Codex 删除整个原生工程来「重新生成」。

## Widget、状态和生命周期

Widget 描述某一时刻的配置，持久状态由合适的状态对象或应用架构管理。`build` 可能多次执行，不在其中直接发网络请求或反复创建未释放的订阅。计时器、控制器和监听器都要有相应的释放位置。

| 状态变化 | 页面应有的反馈 |
| --- | --- |
| 首次请求 | 加载与必要的占位 |
| 空数据 | 说明结果为空，不显示无限加载 |
| 请求失败 | 保留上下文，提供重试 |
| 页面退出 | 不再更新失效的界面或持有多余订阅 |

## 给 Codex 一个完整但有限的切片

```text
在现有 Flutter 列表页增加失败重试与空结果状态。
沿用当前状态管理和请求封装，不新增状态库。
不要在 build 中发请求；页面退出后处理好异步结果。
报告分析、测试和实际目标端运行结果。
```

先运行工程原有检查，再在目标平台验证布局、键盘、读屏与手势。平台插件、相机、推送和打包签名需要对应平台环境；下面控件片段保留了各自的校对说明，不能据此宣称已经通过真机验证。

## 工具速查

<TechCard ids="flutter,dart" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/button/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/switch/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/modal/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/list/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="cross" :labels="['Flutter (Dart)', 'React Native (TSX)']">
<template #t1>

<!--@include: ../snippets/tabbar/flutter.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/rn.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="cross" group="cross" />

## 相关任务模板

<PromptCard id="mobile-screen" />

继续查阅：[Flutter 入门](https://docs.flutter.dev/get-started)、[Flutter 测试](https://docs.flutter.dev/testing/overview)、[平台通道](https://docs.flutter.dev/platform-integration/platform-channels)。
