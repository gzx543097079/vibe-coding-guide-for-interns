---
title: 权限模型
description: RBAC、数据权限与接口安全。
---

权限模型需要回答**谁能对哪条资源执行什么动作**。只验证已登录，或者在页面上隐藏按钮，都不能阻止调用方直接请求接口。

## 角色、资源与作用域

RBAC 用角色组织一组权限；数据权限还要检查租户、资源归属、部门或其他业务条件。身份从可信会话获取，不让请求参数中的角色或 user_id 替代服务端判断。

下面是纯函数练习，展示租户和资源归属的组合；不是可直接用于生产的完整授权系统：

```js
function canReadOrder(actor, order) {
  if (!actor || !order || actor.tenantId !== order.tenantId) return false
  return actor.role === 'admin' || actor.id === order.ownerId
}
const order = { tenantId: 't1', ownerId: 'u1' }
console.assert(canReadOrder({ id: 'u1', tenantId: 't1', role: 'member' }, order))
console.assert(!canReadOrder({ id: 'u2', tenantId: 't1', role: 'member' }, order))
console.assert(!canReadOrder({ id: 'u1', tenantId: 't2', role: 'admin' }, order))
```

## 查询阶段就限制数据范围

列表、详情、导出和批量操作都应检查。先查出所有记录再在客户端过滤，仍可能泄露数据；分页总数、错误信息和下载链接也会透露资源存在性。

| 场景 | 需要覆盖 |
| --- | --- |
| 未登录或会话过期 | 不返回业务数据 |
| 同租户但非拥有者 | 按明确业务规则允许或拒绝 |
| 不同租户 | 不因相同记录 ID 越界 |
| 管理员操作 | 最小授权、审计与敏感动作约束 |

权限校验应默认拒绝不明确的访问，并在真正执行的一侧应用。新增路由、后台任务和内部调用同样不能漏掉；只在网关上验证身份不等于每个业务资源都已授权。

让 Codex 修改权限时，先提供角色与资源规则，用不同身份交叉测试正常和拒绝路径。不要为让演示能跑而关闭鉴权，或在日志里暴露令牌和个人信息。

继续查阅：[OWASP 授权指南](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)、[API 契约](/backend/api)。
