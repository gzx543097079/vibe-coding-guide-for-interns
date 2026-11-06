```html
<!-- index.wxml -->
<!-- 确定进度：系统 progress 组件；active 让进度从左往右动画 -->
<progress percent="{{percent}}" stroke-width="4" border-radius="2"
          activeColor="#2563eb" backgroundColor="#e5e7eb" active active-mode="forwards"
          aria-label="上传进度" />

<!-- 不确定进度：系统没有，自己画 -->
<view class="bar" aria-label="正在加载"><view class="slider"></view></view>

<!-- 环形进度：系统没有，常用 canvas 自己画，或换成数字百分比 -->

<button bindtap="onLoadMore">加载更多</button>
```

```css
/* index.wxss */
.bar { height: 8rpx; overflow: hidden; border-radius: 4rpx; background: #e5e7eb; }
.slider { width: 40%; height: 100%; background: #2563eb; animation: slide 1.2s infinite ease-in-out; }
@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
```

```js
// index.js
Page({
  data: { percent: 40 },
  onLoadMore() {
    // 旋转加载指示器：系统浮层
    wx.showLoading({ title: '加载中', mask: true })
    setTimeout(() => wx.hideLoading(), 1500)
  },
})
```
