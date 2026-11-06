---
title: 移动端性能
description: iOS、Android、鸿蒙、小程序与跨端框架的性能排查。
---

# 移动端性能

::: warning 🚧 本章内容建设中
本章目前只有大纲，正文正在编写。下面是计划覆盖的要点，欢迎在 GitHub 上参与补充。
:::

## 本章计划覆盖

- iOS：Instruments 常用模板
- Android：Android Studio Profiler
- 鸿蒙：DevEco Studio 中的性能分析工具
- 小程序：包体积、首屏时间与 setData
- Flutter / React Native 常见卡顿原因

## 三问

回答得出这三个问题，再把这个方向的任务交给 AI。以下为计划展开的要点。

### 必须先懂什么

- 主线程与渲染线程的分工
- 真机与模拟器测量的差异

### 怎么验证

- 在中低端真机上测量
- 对比优化前后的帧率与内存曲线

### AI 常错在哪

- 在模拟器上得出性能结论
- 忽略不同平台工具的差异
