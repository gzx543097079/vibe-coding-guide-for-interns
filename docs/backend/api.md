---
title: API 设计
description: HTTP / REST、OpenAPI 接口文档、JWT / OAuth 鉴权。
---

API 是调用方和服务方的契约，包含**字段、错误、授权、分页、超时与重试语义**。返回一段 JSON 只是其中一部分；接口能在手动请求中成功，不代表客户端可以稳定依赖它。

## 先定义资源与行为

下面是列表接口的协议示意，并没有在本指南部署对应服务：

```http
GET /api/orders?cursor=next-page&limit=20
Accept: application/json
```

| 需要约定 | 具体例子 |
| --- | --- |
| 字段 | 金额的单位与币种，时间格式和时区 |
| 空值 | 字段缺失、null 与空字符串是否不同 |
| 分页 | cursor 是否不透明，排序是否稳定 |
| 错误 | 错误码、可展示信息和请求关联 ID |
| 权限 | 当前用户可以看到哪些订单和字段 |

HTTP 状态码要与结果一致：输入错误、未认证、无权限和服务端异常不能全部当作成功。具体使用哪些状态和错误结构，应在团队契约中写明。

## 身份与授权分开处理

认证说明「你是谁」，授权说明「你能对这条资源做什么」。JWT 是一种令牌格式，不会自动完成资源归属检查；OAuth 解决授权流程，也不等于所有登录和会话问题都已解决。不要在客户端保存服务端密钥，或把用户传入的 owner_id 直接当作可信身份。

## 接口变更先考虑兼容

新增可选字段通常比改变旧字段含义容易兼容。服务端、客户端和存储迁移需要按顺序发布，旧客户端可能长期存在。OpenAPI 可描述结构并生成部分工具，但仍要覆盖业务规则与权限测试。

```text
为订单列表加入可选状态过滤，先确认现有契约。
保留旧请求行为，沿用当前鉴权和错误格式。
验证正常、空结果、非法状态、未登录及跨用户访问。
不通过修改测试预期掩盖兼容性变化。
```

写入接口还要说明重复请求是否安全。网络超时可能发生在服务端已经提交之后，不能让调用方看到超时就无条件再创建一次订单。

## 工具速查

<TechCard ids="openapi" />

## 相关任务模板

<PromptCard id="backend-api" />

继续查阅：[HTTP 状态码](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)、[OpenAPI](https://spec.openapis.org/oas/latest.html)、[授权检查](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)。
