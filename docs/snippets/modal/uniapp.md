```js
// 底部操作菜单
uni.showActionSheet({
  itemList: ['复制链接', '保存图片'],
  success: (res) => {
    console.log('选择了第', res.tapIndex, '项')
  },
})

// 确认对话框
uni.showModal({
  title: '删除这篇文档？',
  content: '删除后无法恢复。',
  success: (res) => {
    if (res.confirm) {
      // 删除
    }
  },
})
```
