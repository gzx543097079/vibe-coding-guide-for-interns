---
title: UI 控件与组件
description: 控件的状态、组件化思想与各平台控件的对应关系。
---

<RPath />

组件是**带输入、输出和状态约定的界面单元**。一个按钮不只是颜色和圆角，还包括加载、禁用、焦点与键盘反馈；一张截图只能表达其中一个时刻。

## 先写状态，再选控件

| 场景 | 要讲清的行为 | 更合适的基本控件 |
| --- | --- | --- |
| 执行保存 | 防止重复提交，说明失败 | button 与状态提示 |
| 立即改变设置 | 开关后是否立即生效 | switch 或原生 checkbox |
| 多项选择 | 单项、全选和半选关系 | checkbox 组 |
| 从列表挑一个值 | 可否清空、搜索和禁用 | select 或可访问的组合控件 |
| 重要确认 | 焦点进入、取消和返回位置 | dialog 或平台弹窗 |

能使用语义控件时先用语义控件。自绘组件自由度更大，但需要补齐焦点、键盘、读屏和触摸行为；只让鼠标点得动不是完整实现。

## 组件边界怎样划

输入描述外部传入的数据和选项，输出描述发生的事件。临时展开状态通常由组件自己维护；业务提交、权限判断和持久化由上层负责。不要让通用按钮直接知道某个订单接口的地址。

```text
为现有保存按钮补加载和失败状态。
沿用当前组件库；加载中不能再次提交，失败后可重试。
按钮文字改变时保持布局稳定，保留键盘焦点。
说明状态由谁持有，并展示正常、加载、失败、禁用四种结果。
```

## 在真实状态中检查复用价值

同一个组件放进长文本、多语言、深色模式和窄屏里试用，再决定哪些差异值得做成参数。为每个页面都增加一个布尔参数，会让组合状态难以理解；相近功能可以共享基础组件，业务差异保留在业务层。

具体控件的可操作演示与平台代码放在下面的导航中。各平台 API 不互换，复制片段前先确认当前选中的框架、版本和无障碍要求。

## 常用控件：演示与实现

具体控件的演示、12 种写法的代码和经过还原验证的提示词，放在独立的「UI 控件与提示词」模块：

- [控件总览](/controls/overview)：全部控件和验证状态
- 基础输入：[按钮](/controls/button)、[开关](/controls/switch)、[复选框与单选](/controls/checkbox)、[输入框](/controls/input)、[下拉选择](/controls/select)
- 反馈与浮层：[弹窗与底部抽屉](/controls/modal)、[轻提示](/controls/toast)、[进度](/controls/progress)、[骨架屏](/controls/skeleton)
- 导航与切换：[底部标签栏](/controls/tabbar)、[标签页](/controls/tabs)、[手风琴](/controls/accordion)
- 列表与手势：[下拉刷新与左滑删除](/controls/list)、[轮播](/controls/carousel)、[搜索联想](/controls/search)、[拖拽排序](/controls/sortable)
- 动效与微交互：[点赞爆发](/controls/like)

## 相关任务模板

<PromptCard id="frontend-ui" />

继续查阅：[原生控件与可访问性](https://www.w3.org/WAI/ARIA/apg/)、[Web 语义](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content)。
