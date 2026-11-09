---
title: 状态管理
description: 组件状态、全局状态与服务端状态怎么划分。
---

状态管理首先回答**谁拥有数据、谁能修改、什么时候失效**，而不是先选一个全局状态库。多个组件都能看到一个值，不表示它必须存进全局容器。

## 按生命周期划分

| 状态 | 示例 | 常见归属 |
| --- | --- | --- |
| 局部界面状态 | 弹窗开关、输入草稿 | 当前组件或页面 |
| 共享业务状态 | 购物车、跨页流程 | 明确边界的业务状态层 |
| 服务端状态 | 用户列表、订单详情 | 请求与缓存层，带失效规则 |
| URL 状态 | 搜索词、分页、筛选 | 路由参数，便于刷新与分享 |

把服务端列表复制到多个全局变量，会增加同步问题；把草稿输入每个字符都写进后端，也可能产生无意义请求。优先减少重复的事实来源。

## 请求顺序不等于返回顺序

用户快速输入两次查询，较旧请求可能最后返回。下面是可直接在支持 fetch 的环境中使用的函数工厂；`commit` 由页面提供：

```js
function createSearch(commit) {
  let latest = 0
  return async function search(url) {
    const id = ++latest
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (id === latest) commit({ status: 'ready', data })
    } catch (error) {
      if (id === latest) commit({ status: 'error', message: String(error) })
    }
  }
}
```

这个示例仅阻止旧结果覆盖，不取消网络请求，也没有处理页面销毁。实际工程还应结合生命周期、取消机制和缓存策略，不能把这段函数视为完整请求库。

## 修改后检查状态转换

依次检查首次加载、空结果、失败、重试、快速切换和返回页面。用可控制返回顺序的假请求验证竞争条件，比反复点击碰运气可靠。让 Codex 先画清状态拥有者和更新路径，再决定是否需要引入新库。

继续查阅：[React 状态管理](https://react.dev/learn/managing-state)、[Vue 状态管理](https://vuejs.org/guide/scaling-up/state-management.html)。
