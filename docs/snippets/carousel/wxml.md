```html
<!-- index.wxml：swiper 自带整页滑动、自动播放和圆点 -->
<swiper
  class="banner"
  current="{{current}}"
  autoplay="{{autoplay}}"
  interval="4000"
  circular
  indicator-dots
  indicator-active-color="#ffffff"
  bindchange="onChange"
>
  <swiper-item wx:for="{{banners}}" wx:key="*this">
    <view class="slide">{{item}}</view>
  </swiper-item>
</swiper>
<view class="actions">
  <button size="mini" bindtap="prev">上一张</button>
  <button size="mini" bindtap="next">下一张</button>
</view>
```

```js
// index.js
Page({
  data: { banners: ['新品上架', '限时优惠', '会员专享'], current: 0, autoplay: true },
  onChange(e) {
    // 滑动、自动播放和按钮切换后都同步当前页
    this.setData({ current: e.detail.current })
  },
  prev() {
    const n = this.data.banners.length
    this.setData({ current: (this.data.current - 1 + n) % n })
  },
  next() {
    this.setData({ current: (this.data.current + 1) % this.data.banners.length })
  },
})
```
