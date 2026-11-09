---
title: 测试
description: 单元、集成与 E2E 测试，让 AI 先写测试。
---

测试要保护一个可观察的行为。先写清输入、动作和预期结果，再选择测试层级；测试数量或覆盖率不能替代有效断言。

## 按风险选择层级

| 层级 | 适合验证 | 不能独自证明 |
|---|---|---|
| 单元 | 金额计算、状态转换、权限判断 | 数据库与网络真的连通 |
| 集成 | API 与数据库约束、模块之间的协议 | 用户能完成整个流程 |
| E2E | 从页面操作到结果展示的关键旅程 | 所有边界分支都覆盖 |

大量纯逻辑可以在单元层快速检查，少量关键链路再用 E2E。测试金字塔是分配成本的思路，比例要随项目风险调整。支付和离线同步的重点，也会与静态文档站不同。

## 先确认测试会失败

下面只需 Node.js。保存为 `sum.test.mjs`，运行 `node --test sum.test.mjs`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'

function totalCents(items) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
}

test('空订单为零，商品按数量累计整数分', () => {
  assert.equal(totalCents([]), 0)
  assert.equal(totalCents([{ priceCents: 199, quantity: 2 }]), 398)
})
```

在临时练习文件里把乘法改成加法，第二个断言应失败；恢复后再通过。这能发现测试未运行、断言没覆盖目标等问题。真实业务还要定义负数、非整数、溢出和舍入规则，本例只验证正常整数输入，不构成完整金额模块。

## 让 Codex 补的是证据

给它相关函数、现有测试风格和边界规则，要求先列用例与预期，再补断言。对异步流程必须等待结果；只断言「函数存在」或「没有抛错」通常保护不了业务。浏览器测试尽量按角色或稳定语义定位元素，少依赖 DOM 层级和任意等待时间。

测试失败时先分辨实现、预期和环境谁出了问题。不要删除失败用例来换绿灯，也不要让测试自己计算一遍被测算法作为预期。报告写明执行命令、环境与未覆盖范围，CI 未跑的部分保留为未验证。

继续查阅：[Node.js 测试运行器](https://nodejs.org/api/test.html)、[Playwright 编写测试](https://playwright.dev/docs/writing-tests)。
