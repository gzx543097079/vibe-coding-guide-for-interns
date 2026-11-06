```ts
// app.config.ts
export default defineAppConfig({
  pages: ['pages/index/index', 'pages/mine/mine'],
  tabBar: {
    list: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/mine/mine', text: '我的' },
    ],
  },
})
```

```ts
// 在代码中切换到 tabBar 页面要用 switchTab
import Taro from '@tarojs/taro'

Taro.switchTab({ url: '/pages/mine/mine' })
```
