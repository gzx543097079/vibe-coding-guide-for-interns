```html
<button class="btn" type="button" id="submit">提交</button>
```

```css
.btn { padding: 10px 20px; border-radius: 10px; transition: transform 0.15s; }
.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

```js
const button = document.querySelector('#submit')
button.addEventListener('click', () => {
  button.disabled = true // 防止重复提交
  button.textContent = '提交中…'
})
```
