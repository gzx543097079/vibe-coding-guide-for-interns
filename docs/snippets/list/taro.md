```ts
// list.config.ts
export default definePageConfig({
  enablePullDownRefresh: true,
})
```

```tsx
// list.tsx
import Taro, { usePullDownRefresh } from '@tarojs/taro'

export default function List() {
  usePullDownRefresh(async () => {
    // 拉取数据完成后：
    Taro.stopPullDownRefresh()
  })

  return null
}
```
