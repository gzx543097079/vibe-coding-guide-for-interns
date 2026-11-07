---
title: 工具调用
description: 模型如何用结构化参数调用函数、读写文件、运行命令。
---

<RPath />

工具调用（tool calling）是一份约定：**程序声明工具，模型提出调用请求，执行程序检查并运行，再把结果交回模型。** Codex 用工具读文件、修改代码和运行命令。下面用 OpenAI 的 function calling 讲清这次往返。

## 一次完整的往返

下面用一个查天气的工具，看 OpenAI Responses API 的请求和响应节选。它是应用开发示例，不是 Codex CLI 的内部通信格式；天气和 ID 都是虚构的演示数据。

<AiLoop preset="api" />

模型提出 `get_weather` 调用并填写参数，程序执行后它再读结果作答。函数实现留在应用里；注册给模型的是 `name`、`description` 和 `parameters`。具体字段见 [OpenAI 官方 Function calling 文档](https://developers.openai.com/api/docs/guides/function-calling)。

## 工具说明写给模型看

模型靠工具的名字、说明和参数结构判断什么时候用、怎么填参数。说明写得含糊，它就会在错误的时机调用，或者填错参数。

<RCompare bad-title="名字和说明太笼统" good-title="说清用途、时机和参数">
<template #bad>

```json
{
  "type": "function",
  "name": "query",
  "description": "查询数据",
  "parameters": {
    "type": "object",
    "properties": { "q": { "type": "string" } }
  }
}
```

查什么数据？`q` 填 SQL、关键词还是 ID？模型只能猜。

</template>
<template #good>

```json
{
  "type": "function",
  "name": "get_order",
  "description": "按订单号读取一笔订单的状态和金额。只读，不修改数据。用户提到具体订单号时使用。",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "订单号，形如 ORD-20240101-0001"
      }
    },
    "required": ["order_id"],
    "additionalProperties": false
  },
  "strict": true
}
```

</template>
</RCompare>

## 工具在哪里执行

<RPoints cols="3">
<RPoint icon="code" title="你定义、你执行">最常见的情况。你写 schema、写实现、回传结果，比如查自己的数据库、调内部接口。</RPoint>
<RPoint icon="terminal" title="本地执行环境">Codex 通过本地工具读文件、改代码、运行命令。能操作什么，要看沙箱、审批与当前工具提供的能力。</RPoint>
<RPoint icon="cloud" title="服务端执行">平台提供的搜索或代码执行工具，可在服务端运行。权限和执行边界需要按具体工具核对。</RPoint>
</RPoints>

上面按执行位置区分，不是统一的 API 类型枚举。自定义函数返回 `function_call`；程序回传 `function_call_output` 并关联 `call_id`。内置工具有各自的结果类型，不要照搬函数工具的处理方式。

## 什么时候该用工具

<RCompare neutral bad-title="需要工具" good-title="不需要工具">
<template #bad>

- 有副作用的动作：写文件、发邮件、改数据库。
- 实时或私有的数据：今天的天气、你项目里的代码。
- 必须访问外部系统才能拿到的结果，比如读取工单状态。

</template>
<template #good>

- 模型本身就能做的：翻译、总结、解释概念。
- 一问一答、没有任何东西要执行。
- 任务很轻，多一次往返反而更慢。

</template>
</RCompare>

只想得到固定字段的 JSON，不一定要调用工具；厂商提供的结构化输出能力也能约束回复格式。工具调用适合让程序执行动作或取回数据，两者不要混为一谈。

## 动手前的三问

<RAsk>
<template #know>

- 模型只输出调用请求，执行的永远是程序，所以权限控制要放在程序这一侧。
- 模型看不到工具的实现，只看得到名字、说明和参数结构。
- 工具结果会原样进入上下文，内容长、内容不可信都会影响后续判断。

</template>
<template #verify>

- 打印或记录每一次工具调用的名字和参数，确认和你预期一致。
- 故意给一个错误参数，看工具返回的错误信息模型能不能看懂并修正。
- 检查工具说明里有没有写清「只读」还是「会修改数据」。

</template>
<template #pitfall>

- 参数填错格式，或者编出 schema 里没有的参数。
- 在不该调用的时候调用有副作用的工具，比如重复提交。
- 工具返回错误后不看错误内容，换个说法再试同样的参数。

</template>
</RAsk>
