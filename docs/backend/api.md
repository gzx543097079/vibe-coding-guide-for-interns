---
status: draft
title: API 设计
description: HTTP / REST、OpenAPI 接口文档、JWT / OAuth 鉴权。
---

## 这是什么

<TechCard ids="openapi" />

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="backend-api" />

## 计划覆盖

- 状态码的语义
- 鉴权与授权的区别
- 覆盖成功、参数错误、无权限三类情况的接口测试
- 对照接口文档检查字段
- 常见错误及排查：状态码使用随意，错误都返回 200；忽略参数校验与权限校验。
