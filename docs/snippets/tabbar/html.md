```html
<nav>
  <div role="tablist" aria-label="主导航">
    <button role="tab" id="tab-home" aria-selected="true" aria-controls="panel">首页</button>
    <button role="tab" id="tab-mine" aria-selected="false" aria-controls="panel" tabindex="-1">我的</button>
  </div>
</nav>
<section id="panel" role="tabpanel" aria-labelledby="tab-home"></section>
```

```js
const tabs = [...document.querySelectorAll('[role="tab"]')]
const panel = document.querySelector('#panel')

function select(tab) {
  tabs.forEach((t) => {
    const on = t === tab
    t.setAttribute('aria-selected', String(on))
    t.tabIndex = on ? 0 : -1
  })
  panel.setAttribute('aria-labelledby', tab.id)
  tab.focus()
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => select(tab))
  tab.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length])
    if (e.key === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length])
  })
})
```
