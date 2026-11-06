```html
<!-- index.wxml -->
<button type="primary" loading="{{loading}}" disabled="{{loading}}" bindtap="onSubmit">提交</button>
```

```js
// index.js
Page({
  data: { loading: false },
  onSubmit() {
    this.setData({ loading: true })
  },
})
```
