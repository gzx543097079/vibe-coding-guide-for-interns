```html
<!-- index.wxml -->
<view wx:if="{{loading}}" class="row" aria-label="加载中">
  <view class="sk avatar"></view>
  <view class="sk line"></view>
  <view class="sk line short"></view>
</view>
<view wx:else class="row fade-in">
  <image class="avatar" src="{{user.avatar}}" />
  <text class="name">{{user.name}}</text>
  <text>{{user.bio}}</text>
</view>
```

```css
/* index.wxss */
.row { display: grid; grid-template-columns: 80rpx 1fr; gap: 16rpx 24rpx; align-items: center; padding: 32rpx; }
.avatar { grid-row: span 2; width: 80rpx; height: 80rpx; border-radius: 50%; }
.sk { position: relative; overflow: hidden; background: #e5e7eb; border-radius: 8rpx; }
.sk.avatar { border-radius: 50%; }
.line { height: 24rpx; width: 80%; }
.line.short { width: 50%; }
.sk::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: translateX(-100%); animation: shimmer 1.4s infinite; }
@keyframes shimmer { to { transform: translateX(100%); } }
.fade-in { animation: fade-in 0.3s ease-out; }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
```

```js
// index.js
Page({
  data: { loading: true, user: null },
  onLoad() {
    wx.request({
      url: 'https://example.com/api/me',
      success: (res) => this.setData({ loading: false, user: res.data }),
    })
  },
})
```
