待校对：aria-role / aria-label 属于小程序读屏适配属性，aria-expanded 是否被支持待核实。

```html
<!-- index.wxml -->
<view wx:for="{{sections}}" wx:key="title" class="section">
  <view class="header" data-index="{{index}}" bindtap="onToggle"
        aria-role="button" aria-expanded="{{item.open}}"
        aria-label="{{item.title}}，{{item.open ? '已展开' : '已收起'}}">
    <text>{{item.title}}</text>
    <text class="chevron {{item.open ? 'open' : ''}}">▾</text>
  </view>
  <view wx:if="{{item.open}}" class="body">{{item.body}}</view>
</view>
```

```css
/* index.wxss */
.header { display: flex; justify-content: space-between; padding: 32rpx; }
.chevron { transition: transform 0.2s; }
.chevron.open { transform: rotate(180deg); }
.body { padding: 0 32rpx 32rpx; animation: fade-in 0.2s ease-out; }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
```

```js
// index.js
Page({
  data: {
    single: true, // 一次只展开一个
    sections: [
      { title: '配送说明', body: '下单后 48 小时内发货。', open: true },
      { title: '退换政策', body: '7 天无理由退换。', open: false },
    ],
  },
  onToggle(e) {
    const i = e.currentTarget.dataset.index
    const sections = this.data.sections.map((s, j) => ({
      ...s,
      open: j === i ? !s.open : this.data.single ? false : s.open,
    }))
    this.setData({ sections })
  },
})
```
