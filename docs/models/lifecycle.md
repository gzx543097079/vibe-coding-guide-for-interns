---
title: 型号更新与迁移
description: 别名和固定版本、弃用日期、接口参数变化：模型换代时代码要怎么不被打断。
---

> 这一篇的例子来自官方页面，核对于 **2026-11-13**。日期已经过去的话，以官方最新页面为准。

## 同一个名字，背后可能换了模型

核对中碰到的几种情况：

- **固定快照。** Anthropic 的概览页写明，每个模型 ID 都是固定快照；你写的 `claude-opus-5-5` 不会悄悄变成另一个版本。
- **别名指向会变的版本。** DeepSeek 的 `deepseek-flash` 当前指向 `DeepSeek-V4.1-Flash-1017`，更新日志里 2026-10-17 的更新「API 名称不变」。也就是说，名字没变，背后的版本换了。旧名称 `deepseek-v4-flash` 等已下线，请求由新版本提供服务。
- **自动路由。** Google 写明，Gemini 2.5 Flash 和 2.5 Pro 自 2026-12-01 起，请求会自动路由到 `gemini-3.5-flash-lite` 和 `gemini-3.8-flash`。代码没改，调用的却是另一个模型。
- **版本号写在 ID 里。** 方舟的豆包模型 ID 末尾带一串数字（如 `doubao-seed-2-1-pro-260915`），同一系列并存多个版本，上下文大小都可能不一样。

## 正在发生或已排定的下线

这些都是官方页面写明的日期，用来说明「下线是常态」，不是让你现在就去迁：

| 厂商 | 内容 | 日期 |
|---|---|---|
| OpenAI | `gpt-5`、`gpt-5-mini`、`gpt-5-nano`、`gpt-5-pro`、`o3`、`o3-pro` 下线 | 2026-12-11 |
| OpenAI | `gpt-4o`、`gpt-4o-mini`、`gpt-4.1`、`gpt-4.1-mini` 下线 | 2027-01-14 |
| OpenAI | `gpt-5.3-codex`、`gpt-5.4-nano`、`gpt-5.1` 下线 | 2027-04-01 |
| Anthropic | `claude-sonnet-4-5-20250929` 退役，推荐替代 `claude-sonnet-5-5` | 2026-11-30 |
| Anthropic | `claude-haiku-4-5-20251001` 退役 | 页面写「不早于 2026-10-15」 |
| Anthropic | API 参数 `temperature`、`top_p`、`top_k` 在版本 `2026-10-21` 中移除，之后返回 400 | 2026-10-21 起 |
| Google | Gemini 2.5 Flash、2.5 Pro 的请求改为自动路由 | 2026-12-01 |
| 月之暗面 | `kimi-k2.7-code`、`kimi-k2.7-code-highspeed`、`kimi-k2.6` 预计全面下线 | 2026 年 12 月底 |

另外，OpenAI 的弃用页还列出了 Assistants API（2026-08-26）、`/v1/prompts` 和 Agent Builder（2026-11-30）等功能的下线时间。**下线的不只是模型，也有接口和功能。**

## 参数的变化也会打断你

这类变化很容易被忽略，因为型号没换：

- Anthropic 新型号对 `temperature`、`top_p`、`top_k` 返回 400 或要求省略，同时 `thinking` 的手动预算也不再可用。
- DeepSeek 的思考模式下，`temperature` 等参数不生效，带工具的请求必须回传 `reasoning_content`。
- OpenAI GPT-6 Luna 在 Chat Completions 里，只有 `reasoning_effort` 为 `none` 才支持函数调用。

## 怎么让代码不被打断

<RSteps>
<RStep title="模型 ID 放进配置" note="不要写死在代码里" open>

把模型 ID、思考档位这些参数放进配置文件或环境变量，不要散落在代码各处。换型号时只改一处。

</RStep>
<RStep title="写下用的是哪个版本" note="出问题时才能对上">

在日志或请求记录里带上**完整的模型 ID**，必要时记录响应里返回的实际型号。「我们用的是某家的模型」对排查没有帮助。

</RStep>
<RStep title="能固定就固定" note="别名换底座时你要知情">

厂商提供固定版本的，生产环境优先用固定版本。用别名的，要接受它会变，并且订阅对应的更新日志。

</RStep>
<RStep title="换之前先跑评测集" note="同一批任务，前后对比">

迁移前后用同一个评测集各跑一遍，对比通过率、延迟和 token 用量。做法见 [评测与验收](/ai/evals)。

</RStep>
<RStep title="准备一个退路" note="下线日期不会等你">

在配置里留一个备选型号，并定期看各家的弃用页。把官方弃用页的链接放进团队的文档里，设一个提醒。

</RStep>
</RSteps>

## 哪些页面值得订阅

- OpenAI：[弃用公告](https://developers.openai.com/api/docs/deprecations)
- Anthropic：[弃用与退役](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- Google：[模型总览](https://aistudio.google.com/docs/models) 里的「以前的模型」和弃用说明
- DeepSeek：[更新日志](https://api-docs.deepseek.com/zh-cn/updates)
- 月之暗面：[模型列表](https://platform.kimi.com/docs/models.md)

## 出处

- 以上各表的日期，均来自上面列出的官方页面。
- 团队层面怎么管理这类变化，见 [团队规范](/ai/team-standards)。
