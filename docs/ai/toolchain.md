---
title: 自建工具链
description: 为团队编写 MCP 服务、skills 和 hooks。
---

<RPath />

自建工具链的起点是**一个重复出现、边界清楚的工作**，例如读取内部接口文档或检查某类迁移。先证明脚本能可靠解决问题，再考虑接入 Codex；不要为了接入 Agent 先搭一套复杂平台。

## 选对扩展层

| 需求 | 优先考虑 | 作用 |
| --- | --- | --- |
| 固定流程和领域约定 | Skill | 教 Codex 如何完成一类任务 |
| 调用外部数据与操作 | MCP 工具 | 提供结构化能力 |
| 生命周期自动检查 | Hook | 在事件发生时触发程序 |
| 独立数据转换 | 普通脚本 | 可以手动和 CI 重复运行 |

同一流程可组合这些能力，但每层都要说明失败如何回传，避免脚本失败后仍由模型总结成成功。

## 工具接口先做窄

以下是 MCP 工具定义的结构示意，并不包含服务实现：

```json
{
  "name": "lookup_order",
  "description": "按订单号读取订单状态。只读，不返回个人联系方式。",
  "inputSchema": {
    "type": "object",
    "properties": { "order_id": { "type": "string" } },
    "required": ["order_id"],
    "additionalProperties": false
  }
}
```

工具名和说明不能替代授权。服务端要验证调用身份、订单归属和参数，不能相信模型填入的用户 ID。写入工具还需要幂等、审计和合理超时；能提供只读查询时，不要暴露任意 SQL 或任意 shell。

## 接入之前先验证失败路径

用无敏感信息的测试环境检查参数错误、找不到数据、权限不足、超时和重复请求。返回可理解的错误，不把内部堆栈、凭据或整条数据库记录直接交给模型。

发布时给工具与 Skill 版本化，保留契约测试和回滚办法。先在少量授权任务中试用，再决定是否推广；验证依据是任务能否完成且不越界，而不是工具是否出现在列表中。

继续查阅：[MCP 工具规范](https://modelcontextprotocol.io/specification/latest/server/tools)、[Skills](https://learn.chatgpt.com/docs/build-skills)、[Hooks](https://learn.chatgpt.com/docs/hooks)。
