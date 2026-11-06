```jsonc
// index.json：开启页面下拉刷新
{ "enablePullDownRefresh": true }
```

```js
// index.js
Page({
  data: { items: [] },
  onPullDownRefresh() {
    // 拉取数据完成后：
    wx.stopPullDownRefresh()
  },
})
```

滑动删除没有原生组件，通常用 `movable-area` / `movable-view` 或组件库实现（待补充）。
