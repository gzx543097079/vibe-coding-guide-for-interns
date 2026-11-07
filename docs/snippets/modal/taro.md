```tsx
import Taro from '@tarojs/taro'

export async function openShare() {
  const res = await Taro.showActionSheet({ itemList: ['复制链接', '保存图片'] })
  console.log('选择了第', res.tapIndex, '项')
}

export async function confirmDelete() {
  const res = await Taro.showModal({ title: '删除这篇文档？', content: '删除后无法恢复。' })
  if (res.confirm) {
    // 删除
  }
}
```
