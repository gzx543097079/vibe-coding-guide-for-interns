```jsonc
// app.json
{
  "pages": ["pages/index/index", "pages/mine/mine"],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/mine/mine", "text": "我的" }
    ]
  }
}
```

```js
// 在代码中切换到 tabBar 页面要用 switchTab
wx.switchTab({ url: '/pages/mine/mine' })
```
