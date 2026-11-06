```html
<fieldset>
  <legend>通知方式</legend>
  <label><input type="checkbox" id="all"> 全选</label>
  <div class="children">
    <label><input type="checkbox" name="channel" value="email" checked> 邮件</label>
    <label><input type="checkbox" name="channel" value="sms"> 短信</label>
    <label><input type="checkbox" name="channel" value="push"> 推送</label>
  </div>
</fieldset>

<!-- 同名 radio 自成一组，浏览器自带方向键切换 -->
<fieldset>
  <legend>主题</legend>
  <label><input type="radio" name="theme" value="light" checked> 浅色</label>
  <label><input type="radio" name="theme" value="dark"> 深色</label>
</fieldset>
```

```css
input[type='checkbox'], input[type='radio'] {
  appearance: none; display: inline-grid; place-content: center;
  width: 20px; height: 20px; margin: 0; border: 2px solid #8a919c;
}
input[type='checkbox'] { border-radius: 4px; }
input[type='radio'] { border-radius: 50%; }
input:checked, input:indeterminate { border-color: #1a73e8; }
input[type='checkbox']:checked, input[type='checkbox']:indeterminate { background: #1a73e8; }
/* 对勾：缩放 + 淡入 */
input[type='checkbox']::before {
  content: ''; width: 10px; height: 5px; border: solid #fff; border-width: 0 0 2px 2px;
  transform: rotate(-45deg) scale(0); opacity: 0; transition: transform 0.2s, opacity 0.2s;
}
input[type='checkbox']:checked::before { transform: rotate(-45deg) scale(1); opacity: 1; }
/* 半选：一条横线 */
input[type='checkbox']:indeterminate::before { height: 0; border-width: 0 0 2px; transform: none; opacity: 1; }
/* 单选圆点：从 0 缩放到 1 */
input[type='radio']::before {
  content: ''; width: 10px; height: 10px; border-radius: 50%; background: #1a73e8;
  transform: scale(0); transition: transform 0.2s;
}
input[type='radio']:checked::before { transform: scale(1); }
input:focus-visible { outline: 2px solid #1a73e8; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { input::before { transition: none; } }
```

```js
const all = document.querySelector('#all')
const items = [...document.querySelectorAll('input[name="channel"]')]

// indeterminate 只能用 JS 属性设置，HTML 里没有对应属性
function syncParent() {
  const n = items.filter((i) => i.checked).length
  all.checked = n === items.length
  all.indeterminate = n > 0 && n < items.length
}

all.addEventListener('change', () => items.forEach((i) => (i.checked = all.checked)))
items.forEach((i) => i.addEventListener('change', syncParent))
syncParent()
```
