```html
<button type="button" id="refresh">刷新</button>
<ul id="list"></ul>
```

```js
// 网页通常提供刷新按钮；移动端浏览器自带下拉刷新整页
const list = document.querySelector('#list')
let startY = 0

list.addEventListener('pointerdown', (e) => {
  startY = list.scrollTop === 0 ? e.clientY : 0
})
list.addEventListener('pointerup', (e) => {
  if (startY && e.clientY - startY > 64) reload() // 下拉超过阈值时刷新
  startY = 0
})
document.querySelector('#refresh').addEventListener('click', reload)

async function reload() {
  // 拉取数据后重新渲染 list
}
```
