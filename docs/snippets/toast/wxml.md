待校对：小程序读屏适配的 aria-role / aria-label 属性存在，但 Snackbar 出现时是否会被主动播报待核实。

```html
<!-- index.wxml -->
<button bindtap="onCopy">复制链接</button>
<button bindtap="onDelete">删除</button>

<!-- 系统没有 Snackbar，自己画 -->
<view class="snackbar {{snack ? 'show' : ''}}" aria-role="alert">
  <text>{{snack}}</text>
  <text class="undo" bindtap="onUndo" aria-role="button">撤销</text>
</view>
```

```css
/* index.wxss */
.snackbar { position: fixed; left: 32rpx; right: 32rpx; bottom: 32rpx; display: flex;
  justify-content: space-between; padding: 24rpx 32rpx; border-radius: 16rpx;
  background: #323232; color: #fff; transform: translateY(200%); transition: transform 0.25s; }
.snackbar.show { transform: translateY(0); }
.undo { color: #8ab4f8; }
```

```js
// index.js
Page({
  data: { snack: '' },
  onCopy() {
    // 轻提示用系统 Toast；icon: 'none' 才能显示较长文字
    wx.showToast({ title: '已复制', icon: 'none', duration: 2000 })
  },
  onDelete() {
    this.setData({ snack: '已删除 1 条' }) // 新消息替换旧消息
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.setData({ snack: '' }), 4000)
  },
  onUndo() {
    // 恢复
    clearTimeout(this.timer)
    this.setData({ snack: '' })
  },
})
```
