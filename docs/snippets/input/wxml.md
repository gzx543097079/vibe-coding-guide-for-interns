待校对：小程序 input 在部分基础库版本是原生组件，浮动标签叠在上面可能被遮挡；input 没有 email 类型，这里用 text。

```html
<!-- index.wxml -->
<view class="field {{error ? 'invalid' : ''}} {{shake ? 'shake' : ''}}" bindanimationend="onShakeEnd">
  <text class="label {{focused || email ? 'up' : ''}}">邮箱</text>
  <input class="input" type="text" value="{{email}}" aria-label="邮箱"
    bindinput="onInput" bindfocus="onFocus" bindblur="onBlur" />
  <icon wx:if="{{email}}" class="clear" type="clear" size="18" aria-label="清除" bindtap="onClear" />
</view>
<text wx:if="{{error}}" class="err">{{error}}</text>
```

```css
/* index.wxss */
.field { position: relative; padding: 20px 40px 6px 12px; border: 1px solid #8a919c; border-radius: 8px; }
.field.invalid { border-color: #d93025; }
.label { position: absolute; left: 12px; top: 14px; color: #5f6368; transform-origin: left top; transition: transform 0.2s; pointer-events: none; }
.label.up { transform: translateY(-9px) scale(0.75); }
.clear { position: absolute; right: 12px; top: 16px; }
.err { color: #d93025; font-size: 13px; }
.shake { animation: shake 0.3s; }
@keyframes shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
```

```js
// index.js
Page({
  data: { email: '', focused: false, error: '', shake: false },
  onInput(e) {
    this.setData({ email: e.detail.value })
  },
  onFocus() {
    this.setData({ focused: true })
  },
  onBlur() {
    const { email } = this.data
    const ok = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    this.setData({ focused: false, error: ok ? '' : '邮箱格式不对', shake: !ok })
  },
  onShakeEnd() {
    this.setData({ shake: false })
  },
  onClear() {
    this.setData({ email: '', error: '' })
  },
})
```
