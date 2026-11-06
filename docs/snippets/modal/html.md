```html
<button type="button" id="open">删除</button>

<dialog id="confirm" aria-labelledby="confirm-title">
  <form method="dialog">
    <h2 id="confirm-title">删除这篇文档？</h2>
    <p>删除后无法恢复。</p>
    <button value="cancel">取消</button>
    <button value="ok">删除</button>
  </form>
</dialog>
```

```css
dialog::backdrop { background: rgb(0 0 0 / 0.4); }
dialog[open] { animation: pop 0.25s ease-out; }
@keyframes pop { from { transform: scale(0.95); opacity: 0; } }
```

```js
const dialog = document.querySelector('#confirm')
document.querySelector('#open').addEventListener('click', () => dialog.showModal())
dialog.addEventListener('close', () => {
  if (dialog.returnValue === 'ok') {
    // 删除
  }
})
```
