---
status: draft
title: UI 控件与组件
description: 控件的状态、组件化思想与各平台控件的对应关系。
---

## 常用控件：演示与实现

具体控件的演示、12 种写法的代码和经过还原验证的提示词，放在独立的「UI 控件与提示词」模块：

- [控件总览](/controls/overview)：全部控件和验证状态
- 基础输入：[按钮](/controls/button)、[开关](/controls/switch)、[复选框与单选](/controls/checkbox)、[输入框](/controls/input)、[下拉选择](/controls/select)
- 反馈与浮层：[弹窗与底部抽屉](/controls/modal)、[轻提示](/controls/toast)、[进度](/controls/progress)、[骨架屏](/controls/skeleton)
- 导航与切换：[底部标签栏](/controls/tabbar)、[标签页](/controls/tabs)、[手风琴](/controls/accordion)
- 列表与手势：[下拉刷新与左滑删除](/controls/list)、[轮播](/controls/carousel)、[搜索联想](/controls/search)、[拖拽排序](/controls/sortable)
- 动效与微交互：[点赞爆发](/controls/like)

## 方案对比

<ApproachCompare stack="pending" />

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="frontend-ui" />

## 计划覆盖

- 控件的交互状态与反馈
- 组件的输入（props）与输出（事件）
- 逐个检查控件的每种状态
- 只用键盘完成一遍操作
- 常见错误及排查：跨平台混用控件 API；用 div 模拟按钮却不处理键盘与读屏。
