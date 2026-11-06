```html
<button type="button" id="copy">复制链接</button>
<button type="button" id="del">删除</button>

<!-- 两个区域常驻在页面上，只改里面的文字，读屏才能稳定播报 -->
<div class="toast" role="status" aria-live="polite"></div>
<div class="snackbar" role="status" aria-live="polite">
  <span class="snackbar-text"></span>
  <button type="button" class="snackbar-undo">撤销</button>
</div>
```

```css
.toast { position: fixed; left: 50%; bottom: 96px; padding: 8px 16px; border-radius: 8px;
  background: rgb(0 0 0 / 0.8); color: #fff; opacity: 0; transform: translate(-50%, 8px);
  transition: opacity 0.2s, transform 0.2s; pointer-events: none; }
.toast.show { opacity: 1; transform: translate(-50%, 0); }
.snackbar { position: fixed; left: 16px; right: 16px; bottom: 16px; display: flex; gap: 12px;
  padding: 12px 16px; border-radius: 8px; background: #323232; color: #fff;
  transform: translateY(150%); visibility: hidden; transition: transform 0.25s, visibility 0s 0.25s; }
.snackbar.show { transform: translateY(0); visibility: visible; transition: transform 0.25s; }
@media (prefers-reduced-motion: reduce) {
  .toast, .toast.show { transform: translate(-50%, 0); }
  .snackbar, .snackbar.show { transform: none; transition: visibility 0s; }
}
```

```js
const toast = document.querySelector('.toast')
const bar = document.querySelector('.snackbar')
let toastTimer, barTimer, undoFn

function showToast(text) {
  toast.textContent = text
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000)
}

function showSnackbar(text, onUndo) {
  // 新消息直接替换旧消息，并重新计时
  bar.querySelector('.snackbar-text').textContent = text
  undoFn = onUndo
  bar.classList.add('show')
  clearTimeout(barTimer)
  barTimer = setTimeout(() => bar.classList.remove('show'), 4000)
}

bar.querySelector('.snackbar-undo').addEventListener('click', () => {
  undoFn?.()
  bar.classList.remove('show')
})
document.querySelector('#copy').addEventListener('click', () => showToast('已复制'))
document.querySelector('#del').addEventListener('click', () => showSnackbar('已删除 1 条', () => { /* 恢复 */ }))
```
