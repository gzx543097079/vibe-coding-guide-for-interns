---
title: Web 前端
description: HTML / CSS / JS、React / Vue、构建工具与 DevTools。
---

Web 页面由 **HTML 表达结构，CSS 安排样式，JavaScript 处理行为**。React、Vue 和构建工具建立在这些基础之上；框架能帮助组织代码，不能替你决定按钮是否可操作、失败时显示什么。

## 先看一次交互经过哪里

用户点击按钮，事件处理函数修改状态，界面根据状态更新。涉及网络时，还要处理加载、成功、空结果和失败。先画出这些状态，再让 Codex 实现，往往比只给一张正常状态的截图更有效。

下面保存成 `index.html` 后可以直接在浏览器打开：

```html
<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<title>计数练习</title>
<button type="button" id="increment">增加一次</button>
<output id="count" aria-live="polite">0</output>
<script>
  let count = 0
  document.querySelector('#increment').addEventListener('click', () => {
    document.querySelector('#count').textContent = String(++count)
  })
</script>
</html>
```

点击和聚焦后按空格，都应让数字增加。原生按钮已经提供键盘行为，不需要用 `div` 再实现一遍。

## 进入 React 或 Vue 项目

先读 `package.json` 的 scripts、应用入口、路由和同类组件。沿用现有状态管理和请求层，不要因为页面简单就引入第二套框架。包管理器与锁文件要对应，启动和构建是不同检查：开发服务能跑，不表示生产构建已经通过。

## 排错时使用 DevTools

Elements 看实际结构和样式覆盖；Console 看错误；Network 看请求、状态和响应；Performance 看耗时。接口成功而页面空白时，继续查数据字段和渲染条件，不要立即换接口地址。

给 Codex 复现步骤、控制台原文和相关文件路径。改完按手机宽度、键盘操作、请求失败等场景检查；下面的控件演示可以用来比较各框架写法，代码片段不等于完整业务页面。

## 工具速查

<TechCard ids="web-basics,typescript,react,vue,vite" />

## 常用控件：演示与实现

上方是可以直接操作的演示，下方是同一控件的几种写法。切换任意一处标签，本页其他控件会一起切换，下次打开也会记住。每个演示都能「复制提示词」，复制后补全占位符就能交给 AI。

### 按钮 Button {#button}

<ControlDemo control="button" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/button/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/button/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/button/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

### 开关 Switch {#switch}

<ControlDemo control="switch" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/switch/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/switch/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/switch/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

### 弹窗 Modal / Sheet {#modal}

<ControlDemo control="modal" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/modal/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/modal/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/modal/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

### 列表 List {#list}

<ControlDemo control="list" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/list/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/list/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/list/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

### 标签栏 TabBar {#tabbar}

<ControlDemo control="tabbar" frame="browser">
<CodeTabs group="web" :labels="['HTML + CSS + JS', 'React', 'Vue']">
<template #t1>

<!--@include: ../snippets/tabbar/html.md-->

</template>
<template #t2>

<!--@include: ../snippets/tabbar/react.md-->

</template>
<template #t3>

<!--@include: ../snippets/tabbar/vue.md-->

</template>
</CodeTabs>
</ControlDemo>

## 相关任务模板

<PromptCard id="frontend-ui" />

<PromptCard id="bugfix" />

继续查阅：[MDN Web 学习路径](https://developer.mozilla.org/en-US/docs/Learn_web_development)、[React](https://react.dev/learn)、[Vue](https://vuejs.org/guide/introduction.html)。
