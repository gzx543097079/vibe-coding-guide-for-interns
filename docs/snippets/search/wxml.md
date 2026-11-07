```html
<!-- index.wxml：小程序没有联想组件，用 input + 列表自己组合 -->
<view class="search">
  <input value="{{query}}" placeholder="搜索" confirm-type="search" bindinput="onInput" />
  <text wx:if="{{query}}" class="clear" bindtap="onClear" aria-role="button" aria-label="清除">×</text>
</view>
<text wx:if="{{!query && items.length}}" class="heading">最近搜索</text>
<view wx:for="{{items}}" wx:key="word" class="item" data-word="{{item.word}}" bindtap="onSelect">
  <text>{{item.before}}</text><text class="bold">{{item.hit}}</text><text>{{item.after}}</text>
</view>
<view wx:if="{{query && !items.length}}" class="empty">没有找到「{{query}}」相关结果</view>
```

```js
// index.js
const WORDS = ['苹果', '苹果手机', '苹果电脑', '香蕉', '橙子']
const RECENT = ['耳机', '充电器']
// 拆成三段，匹配段用 .bold 样式加粗
const split = (w, q) => {
  const i = q ? w.indexOf(q) : -1
  return i < 0 ? { word: w, before: w, hit: '', after: '' }
    : { word: w, before: w.slice(0, i), hit: q, after: w.slice(i + q.length) }
}
let timer = null

Page({
  data: { query: '', items: RECENT.map((w) => split(w, '')) },
  onInput(e) {
    this.setData({ query: e.detail.value })
    clearTimeout(timer)
    timer = setTimeout(() => this.refresh(e.detail.value.trim()), 150) // 防抖 150ms
  },
  refresh(q) {
    const list = q ? WORDS.filter((w) => w.includes(q)) : RECENT
    this.setData({ items: list.map((w) => split(w, q)) })
  },
  onClear() { this.setData({ query: '' }); this.refresh('') },
  onSelect(e) { this.setData({ query: e.currentTarget.dataset.word, items: [] }) },
})
```
