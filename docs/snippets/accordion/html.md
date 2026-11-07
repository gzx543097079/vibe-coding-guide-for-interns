```html
<!-- data-single="true"：一次只展开一个 -->
<div class="accordion" data-single="true">
  <h3>
    <button type="button" id="acc-h1" aria-expanded="true" aria-controls="acc-p1">
      配送说明 <span class="chevron" aria-hidden="true">▾</span>
    </button>
  </h3>
  <div id="acc-p1" role="region" aria-labelledby="acc-h1" class="panel">下单后 48 小时内发货。</div>

  <h3>
    <button type="button" id="acc-h2" aria-expanded="false" aria-controls="acc-p2">
      退换政策 <span class="chevron" aria-hidden="true">▾</span>
    </button>
  </h3>
  <div id="acc-p2" role="region" aria-labelledby="acc-h2" class="panel" hidden>7 天无理由退换。</div>
</div>
```

```css
.accordion button { display: flex; justify-content: space-between; width: 100%; padding: 12px 16px; }
.chevron { transition: transform 0.2s; }
[aria-expanded='true'] .chevron { transform: rotate(180deg); }
.panel:not([hidden]) { padding: 0 16px 12px; animation: fade-in 0.2s ease-out; }
@keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) {
  .chevron { transition: none; }
  .panel:not([hidden]) { animation: none; }
}
```

```js
document.querySelectorAll('.accordion').forEach((acc) => {
  const single = acc.dataset.single === 'true'
  const buttons = acc.querySelectorAll('button[aria-controls]')

  const setOpen = (btn, open) => {
    btn.setAttribute('aria-expanded', String(open))
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true'
      if (single && open) buttons.forEach((b) => b !== btn && setOpen(b, false))
      setOpen(btn, open)
    })
  })
})
```
