---
title: 语言基础
description: JS / TS、Dart、Kotlin、Swift、ArkTS 的定位与上手路径。
---

跨端开发会遇到多种语言，但不必先全部学完。先选择任务所在的一条技术栈，掌握**类型、数据结构、异步、错误和模块边界**，再读其他语言的差异。

## 不同语言在项目里做什么

| 语言 | 常见位置 | 需要特别注意 |
| --- | --- | --- |
| JavaScript / TypeScript | Web、React Native、小程序工具链 | TypeScript 类型不会自动验证网络数据 |
| Dart | Flutter 的业务与界面描述 | 空安全、异步、组件与状态生命周期 |
| Kotlin | Android 与部分共享业务代码 | 可空类型、协程与平台生命周期 |
| Swift | Apple 平台应用 | 值与引用、并发隔离和可选值 |
| ArkTS | HarmonyOS 应用 | 与一般 TypeScript 不同的语言和平台约束 |

语法相似不代表运行机制相同。例如 `async` 并不等于把工作自动移到后台线程；可空类型也不意味着业务数据一定满足约束。

## 用同一件小事练习

分别实现「读取一组记录、过滤无效项、处理请求失败、显示结果」。关注调用方如何知道成功或失败、空值怎样表示、资源何时释放，而不是先背完整语法表。

```text
解释当前文件中异步结果和错误怎样传回调用方。
指出哪些类型是编译期约束，哪些输入还需要运行时校验。
沿用本项目风格写最小修改，不把另一种语言的习惯照搬过来。
```

## 让编译器参与反馈

先使用工程现有的类型检查、编译或静态分析，再跑实际路径。模型可以解释错误，但不能通过随意加入 `any`、强制解包或类型断言来证明正确。

阅读 API 文档时同时看参数、返回类型、异常和调用线程要求。跨语言插件还要说明数值范围、字符串编码和可空值如何转换；这些边界比方法名是否相同更容易造成难查的问题。

## 工具速查

<TechCard ids="typescript,dart,kotlin,swift,arkts" />

继续查阅：[TypeScript 手册](https://www.typescriptlang.org/docs/handbook/intro.html)、[Dart 语言](https://dart.dev/language)、[Kotlin](https://kotlinlang.org/docs/home.html)、[Swift](https://www.swift.org/documentation/)。
