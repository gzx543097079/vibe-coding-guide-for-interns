待校对：wxss 中 CSS 变量与 calc 组合在旧基础库上的支持情况待核实；小程序没有减少动态效果的接口，未处理。

```html
<!-- index.wxml：动画写在 wxss 的 keyframes 里，切换 class 触发 -->
<view class="like {{anim}}" bindtap="toggle" aria-role="button" aria-label="赞，{{count}}">
  <view class="burst">
    <view wx:for="{{dots}}" wx:key="*this" class="dot" style="--a: {{item * 45}}deg" />
  </view>
  <image class="heart" src="{{liked ? '/img/heart-on.png' : '/img/heart.png'}}" />
  <view class="count"><text class="num">{{count}}</text></view>
</view>
```

```css
/* index.wxss：keyframes 与网页版 pop / shrink / burst / roll 相同 */
.like.pop .heart { animation: pop 0.45s ease-out; }
.like.shrink .heart { animation: shrink 0.3s ease-out; }
.like.pop .dot { animation: burst 0.5s ease-out; }
.like.pop .num, .like.shrink .num { animation: roll 0.3s ease-out; }
```

```js
// index.js
Page({
  data: { liked: false, count: 128, anim: '', dots: [0, 1, 2, 3, 4, 5, 6, 7] },
  toggle() {
    const liked = !this.data.liked
    // 先清空 class 再加回，保证连续点击时动画能重播；取消点赞只做缩小回弹
    this.setData({ anim: '' }, () => {
      this.setData({
        liked,
        count: this.data.count + (liked ? 1 : -1),
        anim: liked ? 'pop' : 'shrink',
      })
    })
  },
})
```
