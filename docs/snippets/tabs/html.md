```html
<div role="tablist" aria-label="订单">
  <button role="tab" id="tab-all" aria-selected="true" aria-controls="panel-all">全部</button>
  <button role="tab" id="tab-pay" aria-selected="false" aria-controls="panel-pay" tabindex="-1">待付款</button>
  <button role="tab" id="tab-ship" aria-selected="false" aria-controls="panel-ship" tabindex="-1">待发货</button>
  <span class="indicator" aria-hidden="true"></span>
</div>
<section role="tabpanel" id="panel-all" aria-labelledby="tab-all" tabindex="0">全部订单</section>
<section role="tabpanel" id="panel-pay" aria-labelledby="tab-pay" tabindex="0" hidden>待付款订单</section>
<section role="tabpanel" id="panel-ship" aria-labelledby="tab-ship" tabindex="0" hidden>待发货订单</section>
```

```css
[role='tablist'] { position: relative; display: flex; border-bottom: 1px solid #e0e3e7; }
[role='tab'] { padding: 12px 16px; border: 0; background: none; }
[role='tab'][aria-selected='true'] { color: #1a73e8; }
/* 基准宽 100px，实际宽度用 scaleX 换算；原点放左边，平移量就是标签的 offsetLeft */
.indicator { position: absolute; left: 0; bottom: 0; width: 100px; height: 2px; background: #1a73e8; transform-origin: left; transition: transform 0.25s ease; }
[role='tabpanel']:not([hidden]) { animation: fade 0.2s; }
@keyframes fade { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .indicator { transition: none; }
  [role='tabpanel']:not([hidden]) { animation: none; }
}
```

```js
const tabs = [...document.querySelectorAll('[role="tab"]')]
const indicator = document.querySelector('.indicator')

function moveIndicator(tab) {
  indicator.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth / 100})`
}

function select(tab) {
  tabs.forEach((t) => {
    const on = t === tab
    t.setAttribute('aria-selected', String(on))
    t.tabIndex = on ? 0 : -1 // roving tabindex：Tab 键只停在选中项
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on
  })
  tab.focus()
  moveIndicator(tab)
}

tabs.forEach((t) => t.addEventListener('click', () => select(t)))
document.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
  const i = tabs.indexOf(document.activeElement)
  const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key]
  if (next === undefined) return
  e.preventDefault()
  select(tabs[(next + tabs.length) % tabs.length])
})
moveIndicator(tabs[0])
window.addEventListener('resize', () => moveIndicator(tabs.find((t) => t.tabIndex === 0)))
```
