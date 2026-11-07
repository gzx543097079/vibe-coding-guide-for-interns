```html
<!-- index.wxml：checkbox 没有半选状态，父项用文字提示 -->
<checkbox-group bindchange="onAllChange">
  <label>
    <checkbox value="all" checked="{{allChecked}}" />全选
    <text wx:if="{{partial}}" class="hint">（已选部分）</text>
  </label>
</checkbox-group>
<checkbox-group bindchange="onItemsChange">
  <label wx:for="{{items}}" wx:key="value" class="child">
    <checkbox value="{{item.value}}" checked="{{item.checked}}" />{{item.label}}
  </label>
</checkbox-group>

<radio-group bindchange="onThemeChange">
  <label><radio value="light" checked="{{theme === 'light'}}" />浅色</label>
  <label><radio value="dark" checked="{{theme === 'dark'}}" />深色</label>
</radio-group>
```

```js
// index.js
Page({
  data: {
    items: [
      { value: 'email', label: '邮件', checked: true },
      { value: 'sms', label: '短信', checked: false },
      { value: 'push', label: '推送', checked: false },
    ],
    allChecked: false,
    partial: true,
    theme: 'light',
  },
  onAllChange(e) {
    const on = e.detail.value.length > 0
    const items = this.data.items.map((i) => ({ ...i, checked: on }))
    this.setData({ items, allChecked: on, partial: false })
  },
  onItemsChange(e) {
    const picked = e.detail.value
    const items = this.data.items.map((i) => ({ ...i, checked: picked.includes(i.value) }))
    const n = picked.length
    this.setData({ items, allChecked: n === items.length, partial: n > 0 && n < items.length })
  },
  onThemeChange(e) {
    this.setData({ theme: e.detail.value })
  },
})
```
