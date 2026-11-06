---
title: API 设计
description: HTTP / REST、OpenAPI 接口文档、JWT / OAuth 鉴权。
---

# API 设计

::: info 本章还没写
下面是计划覆盖的内容。想参与编写，点页面底部的「在 GitHub 上编辑此页」。
:::

## 这是什么

<TechCard ids="openapi" />

## 计划覆盖

- HTTP 方法、状态码与 REST 风格
- 请求与响应格式、统一错误码
- 接口文档：OpenAPI / Swagger
- 鉴权：Session、JWT、OAuth 的区别
- 版本管理与向后兼容

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="backend-api" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- 状态码的语义
- 鉴权与授权的区别

### 怎么验证

- 覆盖成功、参数错误、无权限三类情况的接口测试
- 对照接口文档检查字段

### AI 常错在哪

- 状态码使用随意，错误都返回 200
- 忽略参数校验与权限校验
