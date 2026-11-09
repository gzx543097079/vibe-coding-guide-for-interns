---
title: Taro
description: 用 React 或 Vue 开发多端小程序。
---

Taro 为 React 等开发方式提供多端应用开发能力。它的组件、编译链和目标端约束共同决定代码能运行在哪里。**语法像 React，不代表宿主环境就是浏览器。**

## 开始前看清四件事

确认项目框架与 Taro 版本、目标平台、构建脚本和已有平台适配。沿用项目锁文件与脚本启动，不把其他版本教程中的配置直接覆盖到工程中。

| 层面 | 需要避免的混淆 |
| --- | --- |
| 组件 | Web DOM 元素与目标端组件不是任意互换 |
| 路由 | 页面声明、跳转与宿主返回行为需匹配 |
| 生命周期 | React 组件生命周期与平台页面生命周期各有职责 |
| 依赖 | 包能被 npm 安装，不代表能在小程序运行 |

## 一次只引入可验证的变化

新增页面时，先接通最小流程：入口、数据获取、加载和失败反馈，再处理平台特性。跨端问题出现时，区分共享业务错误、编译转换问题和宿主 API 限制，不通过同时改多个配置试运气。

```text
为当前 Taro 页面补空结果和网络失败状态。
目标是仓库配置的微信小程序端，沿用现有组件和请求层。
不使用 document、window 等浏览器对象实现共享逻辑。
检查切换页面后的异步回调，报告目标构建和真机未覆盖项。
```

## 多端测试按能力组织

让共享逻辑的单元测试尽量不依赖宿主；平台调用通过适配层测试参数和错误。真正的授权、分享、支付或文件选择仍需开发者工具与设备联调。

每增加一个发布目标，就增加一组需要持续维护的检查。不要用「编译器支持这个平台」代替团队已在这个平台验证过业务行为；已有控件示例也要结合当前依赖和基础库重新检查。

## 工具速查

<TechCard ids="taro" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/button/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/switch/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/modal/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/list/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="phone">
<CodeTabs group="taro" :labels="['Taro (React)']">
<template #t1>

<!--@include: ../snippets/tabbar/taro.md-->

</template>
</CodeTabs>
</ControlDemo>

## 方案对比

<ApproachCompare stack="cross" group="taro" fallback="Taro (React)" />

## 相关任务模板

<PromptCard id="mobile-screen" />

继续查阅：[Taro 官方文档](https://docs.taro.zone/docs/)、[环境与平台差异](/cross/maintenance)。
