---
title: 小程序
description: 微信、支付宝、抖音小程序，以及 uni-app / Taro 跨端。
---

<RPath />

小程序运行在**平台提供的宿主与 API 环境**中。页面结构、样式、逻辑和配置共同构成一个页面；它不是把普通网页缩小，也不等于所有平台都实现同一套浏览器能力。

## 以微信小程序理解基本组成

WXML 表达结构，WXSS 表达样式，JavaScript 处理页面逻辑，JSON 配置页面与应用能力。页面和组件的生命周期不同，数据更新也要遵守平台机制；直接操作 DOM 的网页代码不能原样复制。

| 常见任务 | 先确认的约束 |
| --- | --- |
| 网络请求 | 域名配置、环境、超时、登录状态与错误处理 |
| 登录 | 临时凭据交换由服务端完成，不把服务端密钥放客户端 |
| 位置、相机等能力 | 声明、用户同意、拒绝后的替代入口 |
| 列表更新 | 更新数据量、稳定标识与滚动行为 |
| 发布 | 开发、体验与正式环境的配置差异 |

## 不把前端登录态当成授权

小程序拿到登录结果，不代表它可以访问任何用户的数据。后端仍需验证会话、资源归属和操作权限。开发者工具中能请求成功，也不能证明正式环境的域名、审核和权限配置已经正确。

## 交代任务时写明平台

```text
修改微信小程序的订单列表，沿用当前基础库和组件方案。
增加加载、空结果和失败重试，不修改登录协议。
保留现有分页，避免重复请求；检查页面退出后的回调。
分别说明开发者工具和真机验证了什么。
```

支付宝、抖音等平台有各自的 API、组件与发布要求；相似名称不代表行为相同。使用 uni-app 或 Taro 时，也要根据目标平台验证编译结果与原生能力。

先用开发者工具复现，再在真机检查网络切换、分享、授权、大字体和长列表。下方 WXML 等片段是核心写法，平台差异和待校对项不能靠网页模拟验证。

## 工具速查

<TechCard ids="wechat-mp,uni-app,taro" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/button/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/button/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/switch/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/switch/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/modal/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/modal/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/list/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/list/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="mini" :labels="['WXML + JS', 'uni-app (Vue)', 'Taro (React)']">
<template #t1>

<!--@include: ../snippets/tabbar/wxml.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/uniapp.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabbar/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="mini" group="mini" />

## 相关任务模板

<PromptCard id="mobile-screen" />

<PromptCard id="frontend-ui" />

继续查阅：[微信小程序框架](https://developers.weixin.qq.com/miniprogram/dev/framework/)、[uni-app](/cross/uni-app)、[Taro](/cross/taro)。
