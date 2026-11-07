```html
<!-- index.wxml：用系统 picker，点击时把箭头转过去，选完或取消再转回来 -->
<text>城市</text>
<picker mode="selector" range="{{cities}}" value="{{index}}"
  bindchange="onChange" bindcancel="onClose">
  <view class="trigger" bindtap="onOpen">
    {{cities[index]}}
    <text class="arrow {{open ? 'open' : ''}}">▾</text>
  </view>
</picker>
```

```css
/* index.wxss */
.trigger { display: flex; justify-content: space-between; padding: 12px; border: 1px solid #d0d4da; border-radius: 8px; }
.arrow { transition: transform 0.2s; }
.arrow.open { transform: rotate(180deg); }
```

```js
// index.js：picker 不支持禁用单项，只能选中后拦截
Page({
  data: { cities: ['北京', '上海', '广州（暂未开通）', '深圳'], disabled: [2], index: 0, open: false },
  onOpen() {
    this.setData({ open: true })
  },
  onClose() {
    this.setData({ open: false })
  },
  onChange(e) {
    const index = Number(e.detail.value)
    if (this.data.disabled.includes(index)) {
      wx.showToast({ title: '暂未开通', icon: 'none' })
      this.setData({ open: false })
      return
    }
    this.setData({ index, open: false })
  },
})
```
