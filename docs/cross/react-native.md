---
title: React Native
description: 用 React + TypeScript 调用原生组件。
---

React Native 用 React 组织界面与状态，并接入原生平台的组件和能力。它不是在 App 里运行普通 DOM 页面；**React 的思路可以复用，Web 的元素、CSS 和浏览器 API 不一定可用。**

## 先确认工程路线

读 `package.json`、锁文件、README 和原生目录，确认项目采用的工具链、原生构建方式与架构版本。使用 Expo 的项目与直接维护原生工程的项目，接入插件和构建的流程可能不同，不混用网络教程中的安装步骤。

## 列表与状态先正确

长列表优先使用工程已经选择的列表组件，保持条目标识稳定，避免每次渲染都触发昂贵处理。请求、订阅和清理放在合适的生命周期位置；页面失焦、销毁和重新进入都需要纳入设计。

| 常见误用 | 应怎样检查 |
| --- | --- |
| 把 div、document 写进原生页面 | 确认使用平台支持的组件与 API |
| 只在 JavaScript 侧看性能 | 同时观察 UI、原生调用与设备负载 |
| 插件只装依赖不构建原生端 | 按插件要求确认原生配置和构建 |
| 认为两个端外观行为必然一致 | 分别验证输入、滚动、权限和布局 |

## 原生能力要有边界

新架构相关机制与旧资料可能不同，不应把所有调用一概解释为固定的异步桥。根据项目版本阅读官方架构文档，再选择原生模块、组件或现有插件。错误、取消和权限拒绝要能返回业务层。

```text
修复当前 React Native 列表快速切换筛选时的旧结果覆盖。
沿用现有数据层和导航；不切换架构，不升级原生依赖。
补充可控制返回顺序的测试，并分别说明 iOS、Android 的运行结果。
```

开发工具中的预览和热更新不能证明发布包可用。修改原生依赖、构建配置或权限后，应重新构建对应目标，验证真实签名与环境配置。

## 工具速查

<TechCard ids="react-native" />

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

<ApproachCompare stack="cross" group="cross" fallback="Flutter (Dart)" />

## 相关任务模板

<PromptCard id="mobile-screen" />

继续查阅：[React Native 入门](https://reactnative.dev/docs/environment-setup)、[架构文档](https://reactnative.dev/architecture/landing-page)。
