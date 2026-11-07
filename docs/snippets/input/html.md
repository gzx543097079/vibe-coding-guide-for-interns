```html
<div class="field">
  <input id="email" type="email" placeholder=" " autocomplete="email" aria-describedby="email-err">
  <label for="email">邮箱</label>
  <button type="button" class="clear" aria-label="清除邮箱" hidden>×</button>
  <p id="email-err" class="err" aria-live="polite"></p>
</div>
```

```css
.field { position: relative; }
.field input { width: 100%; padding: 20px 36px 6px 12px; border: 1px solid #8a919c; border-radius: 8px; font-size: 16px; }
/* placeholder=" " 配合 :placeholder-shown 判断有没有值 */
.field label { position: absolute; left: 12px; top: 14px; color: #5f6368; pointer-events: none; transform-origin: left top; transition: transform 0.2s; }
.field input:focus + label,
.field input:not(:placeholder-shown) + label { transform: translateY(-9px) scale(0.75); }
.field input[aria-invalid='true'] { border-color: #d93025; }
.clear { position: absolute; right: 8px; top: 12px; }
.err { min-height: 1.2em; margin: 4px 0 0; color: #d93025; font-size: 13px; }
.shake { animation: shake 0.3s; }
@keyframes shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
@media (prefers-reduced-motion: reduce) {
  .field label { transition: none; }
  .shake { animation: none; }
}
```

```js
const field = document.querySelector('.field')
const input = field.querySelector('input')
const clear = field.querySelector('.clear')
const err = document.querySelector('#email-err')
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function setError(msg) {
  input.setAttribute('aria-invalid', String(msg !== ''))
  err.textContent = msg
}

input.addEventListener('input', () => (clear.hidden = input.value === ''))
input.addEventListener('blur', () => {
  const bad = input.value !== '' && !isEmail(input.value)
  setError(bad ? '邮箱格式不对，例如 name@example.com' : '')
  if (!bad) return
  field.classList.remove('shake')
  void field.offsetWidth // 强制重排，让动画可以重复播放
  field.classList.add('shake')
})
clear.addEventListener('mousedown', (e) => e.preventDefault()) // 不让输入框先失焦触发校验
clear.addEventListener('click', () => {
  input.value = ''
  clear.hidden = true
  setError('')
  input.focus()
})
```
