待校对：小程序无障碍属性 aria-role / aria-selected 的支持范围待核实。

```html
<!-- index.wxml：等宽标签，指示器只需平移，宽度固定为 1/n -->
<view class="tablist" aria-role="tablist">
  <view wx:for="{{tabs}}" wx:key="*this"
    class="tab {{current === index ? 'active' : ''}}"
    aria-role="tab" aria-selected="{{current === index}}"
    data-index="{{index}}" bindtap="onTap">{{item}}</view>
  <view class="indicator" style="width: {{100 / tabs.length}}%; transform: translateX({{current * 100}}%);"></view>
</view>

<!-- 只渲染当前面板，切换时重新创建，触发淡入 -->
<view wx:for="{{tabs}}" wx:key="*this" wx:if="{{current === index}}" class="panel">{{item}}订单</view>
```

```css
/* index.wxss */
.tablist { position: relative; display: flex; border-bottom: 1px solid #e0e3e7; }
.tab { flex: 1; padding: 12px 0; text-align: center; }
.tab.active { color: #1a73e8; }
.indicator { position: absolute; left: 0; bottom: 0; height: 2px; background: #1a73e8; transition: transform 0.25s; }
.panel { padding: 16px; animation: fade 0.2s; }
@keyframes fade { from { opacity: 0; } }
```

```js
// index.js
Page({
  data: { tabs: ['全部', '待付款', '待发货', '已完成'], current: 0 },
  onTap(e) {
    this.setData({ current: Number(e.currentTarget.dataset.index) })
  },
})
```
