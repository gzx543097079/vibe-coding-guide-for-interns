---
title: uni-app
description: 基于 Vue，一套代码发布到小程序、H5 与 App。
---

<RPath />

uni-app 基于 Vue 生态提供多目标开发方式。**共享页面代码与发布到不同端，是两个需要分别验证的环节**。浏览器里的 H5 页面成功，不代表小程序或 App 已经支持同一能力。

## 先确认目标与项目配置

阅读项目使用的 Vue 版本、构建工具、依赖、页面路由和平台配置。页面、组件和系统 API 要按 uni-app 的支持范围使用；DOM 操作和仅浏览器支持的依赖不能不加判断地引入。

| 功能 | 多端实现前的检查 |
| --- | --- |
| 网络与登录 | 域名、Cookie / 会话、平台登录凭据和后端交换 |
| 存储 | 数据作用域、容量、过期与清除策略 |
| 上传和媒体 | 文件路径、权限、取消和失败反馈 |
| 页面导航 | 路由配置、返回行为和标签栏限制 |
| 系统插件 | 各平台是否有实现，构建方式是否匹配 |

## 平台差异集中管理

确有差异时使用项目约定的条件编译或适配层，把差异放到明确位置。不要在每个页面零散判断平台，也不要为了复用强行抹掉系统交互习惯。

共享接口统一业务含义，适配层处理不同平台的数据形状和错误。这样当某端 API 改变时，只需检查边界，而不是搜索所有页面。

```text
给现有 uni-app 上传页面补取消和失败重试。
目标是当前配置的小程序端与 H5，沿用现有上传封装。
先列出平台差异，不引入浏览器专用 API 到共享组件。
分别提供两个目标的构建与操作验证结果。
```

## 每个目标都有自己的完成标准

至少分别构建并打开目标产物，检查网络配置、授权拒绝、分享和返回流程。原生插件、打包签名与商店发布仍有平台要求；下面演示只用于理解控件，不替代目标端运行。

## 工具速查

<TechCard ids="uni-app" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/button/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/switch/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/modal/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/list/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="uniapp" :labels="['uni-app (Vue)']">
<template #t1>

<!--@include: ../snippets/tabbar/uniapp.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="cross" group="uniapp" fallback="uni-app (Vue)" />

## 相关任务模板

<PromptCard id="mobile-screen" />

继续查阅：[uni-app 官方文档](https://uniapp.dcloud.net.cn/)、[平台适配](https://uniapp.dcloud.net.cn/tutorial/platform.html)。
