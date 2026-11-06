```jsonc
// pages.json 中对应页面的 style
{ "path": "pages/list/list", "style": { "enablePullDownRefresh": true } }
```

```vue
<script setup>
import { ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'

const items = ref([])

onPullDownRefresh(async () => {
  // 拉取数据完成后：
  uni.stopPullDownRefresh()
})
</script>
```

滑动删除可使用 uni-ui 的 `uni-swipe-action` 扩展组件（待校对）。
