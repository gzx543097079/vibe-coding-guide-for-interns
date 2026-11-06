```html
<!-- index.wxml -->
<view class="row">
  <text>Wi-Fi</text>
  <switch checked="{{wifiOn}}" bindchange="onChange" />
</view>
```

```js
// index.js
Page({
  data: { wifiOn: true },
  onChange(e) {
    this.setData({ wifiOn: e.detail.value })
  },
})
```
