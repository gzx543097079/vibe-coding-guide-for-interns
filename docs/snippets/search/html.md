```html
<div class="search">
  <label for="q" class="sr-only">搜索</label>
  <input id="q" type="search" role="combobox" aria-autocomplete="list" aria-controls="suggest"
    aria-expanded="false" autocomplete="off" placeholder="搜索" />
  <button type="button" class="clear" aria-label="清除" hidden>×</button>
  <p class="heading" id="suggest-title" hidden>最近搜索</p>
  <ul id="suggest" role="listbox" aria-label="搜索建议" hidden></ul>
  <p class="empty" aria-live="polite"></p>
</div>
```

```js
const input = document.querySelector('#q'), list = document.querySelector('#suggest')
const title = document.querySelector('#suggest-title'), empty = document.querySelector('.empty')
const clear = document.querySelector('.clear')
const words = ['苹果', '苹果手机', '苹果电脑', '香蕉', '橙子']
const recent = ['耳机', '充电器']
let items = [], active = -1, timer

function render(q) {
  items = q ? words.filter((w) => w.includes(q)) : recent
  title.hidden = !!q || !items.length
  list.replaceChildren(...items.map((w, i) => {
    const li = Object.assign(document.createElement('li'), { id: `opt-${i}` })
    li.setAttribute('role', 'option')
    const at = q ? w.indexOf(q) : -1
    // 用 textContent 拼接，避免把用户输入当 HTML 解析
    const b = document.createElement('b'); b.textContent = at >= 0 ? q : ''
    li.append(at >= 0 ? w.slice(0, at) : w, b, at >= 0 ? w.slice(at + q.length) : '')
    li.onpointerdown = (e) => { e.preventDefault(); choose(w) }
    return li
  }))
  empty.textContent = q && !items.length ? `没有找到「${q}」相关结果` : ''
  setOpen(items.length > 0); move(-1)
}
function setOpen(open) { list.hidden = !open; input.setAttribute('aria-expanded', String(open)) }
function move(i) {
  active = i
  ;[...list.children].forEach((li, n) => li.setAttribute('aria-selected', String(n === i)))
  i >= 0 ? input.setAttribute('aria-activedescendant', `opt-${i}`) : input.removeAttribute('aria-activedescendant')
}
function choose(w) { input.value = w; clear.hidden = false; setOpen(false); title.hidden = true }

input.addEventListener('input', () => {
  clear.hidden = !input.value
  clearTimeout(timer); timer = setTimeout(() => render(input.value.trim()), 150) // 防抖 150ms
})
input.addEventListener('focus', () => render(input.value.trim()))
input.addEventListener('blur', () => { setOpen(false); title.hidden = true })
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); setOpen(true); move((active + 1) % items.length) }
  else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); move((active - 1 + items.length) % items.length) }
  else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(items[active]) }
  else if (e.key === 'Escape') { setOpen(false); title.hidden = true }
})
clear.onclick = () => { input.value = ''; clear.hidden = true; input.focus(); render('') }
```
