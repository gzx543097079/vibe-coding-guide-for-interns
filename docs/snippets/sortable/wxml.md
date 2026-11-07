待校对：movable-view 的 y 设为与上次相同的值时不会重新定位，落位时可能需要先改成微小偏移再改回；整行都可拖动，限定只用手柄需要额外处理。

```html
<!-- index.wxml：每行一个 movable-view，只允许竖向拖动 -->
<movable-area class="area" style="height: {{order.length * 56}}px">
  <movable-view wx:for="{{items}}" wx:key="id" direction="vertical" y="{{item.y}}"
    class="row {{dragId === item.id ? 'lifted' : ''}}" data-id="{{item.id}}"
    bindtouchstart="onStart" bindchange="onMove" bindtouchend="onDrop">
    <text class="handle">⠿</text><text>{{item.title}}</text>
  </movable-view>
</movable-area>
```

```js
// index.js：.lifted 在 wxss 里设置 transform: scale(1.03) 和阴影
const H = 56
const layout = (items, order) => items.map((it) => ({ ...it, y: order.indexOf(it.id) * H }))

Page({
  data: { items: [], order: ['首页', '消息', '发现', '我的'], dragId: '' },
  onLoad() {
    const items = this.data.order.map((t) => ({ id: t, title: t }))
    this.setData({ items: layout(items, this.data.order) })
  },
  onStart(e) { this.setData({ dragId: e.currentTarget.dataset.id }) },
  onMove(e) {
    if (e.detail.source !== 'touch') return
    const id = this.data.dragId
    const others = this.data.order.filter((x) => x !== id)
    const to = Math.max(0, Math.min(others.length, Math.round(e.detail.y / H)))
    others.splice(to, 0, id)
    this.pending = others
    // 其他行移到新位置让出空位，被拖行保持跟手
    this.setData({ items: this.data.items.map((it) => it.id === id ? it : { ...it, y: others.indexOf(it.id) * H }) })
  },
  onDrop() {
    const order = this.pending || this.data.order
    this.pending = null
    this.setData({ order, dragId: '', items: layout(this.data.items, order) })
  },
})
```
