---
title: 数据与 AI 应用入门
description: 可选方向：数据分析与调用大模型 API。
---

数据分析与大模型应用可以从小样本和离线验证开始。先定义数据口径、权限和正确答案，再考虑自动化与 API；不要让模型补造缺失数据。

## 数据分析先确认分母

「转化率」必须说明时间窗、事件、去重方式和分母。下面是虚构的练习数据，只演示按用户去重，不代表业务统计。用 Python 3 运行：

```python
rows = [
    {"user_id": "u1", "event": "visit"},
    {"user_id": "u1", "event": "visit"},
    {"user_id": "u1", "event": "buy"},
    {"user_id": "u2", "event": "visit"},
]
visitors = {r["user_id"] for r in rows if r["event"] == "visit"}
buyers = {r["user_id"] for r in rows if r["event"] == "buy"}
rate = len(buyers & visitors) / len(visitors) if visitors else None
assert rate == 0.5
print(rate)
```

先手工核对这几行，再扩展到缺失值、重复记录和跨时区边界。真实漏斗还需要判断事件先后及统计周期，不能直接把本例当完整指标实现。

## 模型输出也要验证

例如让模型把工单归类，先准备人工核对的小样本和无法判断的类别。结构化输出能约束格式，不能保证事实正确；字段类型通过后，还要检查值、来源和业务规则。对外部副作用，生成建议与实际执行应有明确边界。

## API 接入先控制成本与失败

API Key 保留在受控服务端，不能写进网页或移动端可提取的代码。请求要有超时、取消、并发限制和用量预算。限流、余额不足、认证失败与服务异常的处理不同；重试须有上限和退避，不能无限重复，更不能重复触发扣款等业务副作用。

费用与限额依模型、用量和账户约定变化，接入时查看当前官方信息并记录使用量，不在教程里承诺固定价格。日志只留必要的脱敏字段，数据保留与模型供应商政策也要确认。

本章没有调用付费 API，示例只在本地计算虚构数据。可以先用固定响应验证错误分支，再在获授权的环境接真实服务，把模型效果、运行成本和失败率一起评估。

继续查阅：[API 错误说明](https://developers.openai.com/api/docs/guides/error-codes)、[API 限流](https://developers.openai.com/api/docs/guides/rate-limits)、[评测方法](/ai/evals)。
