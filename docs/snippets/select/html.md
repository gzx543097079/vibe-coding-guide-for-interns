```html
<span id="city-label">城市</span>
<div class="select">
  <button type="button" id="city-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="city-label city-btn">
    <span class="value">北京</span> <span class="arrow" aria-hidden="true">▾</span>
  </button>
  <ul role="listbox" id="city-list" tabindex="-1" aria-labelledby="city-label" hidden>
    <li role="option" id="opt-bj" aria-selected="true">北京</li>
    <li role="option" id="opt-sh" aria-selected="false">上海</li>
    <li role="option" id="opt-gz" aria-selected="false" aria-disabled="true">广州（暂未开通）</li>
    <li role="option" id="opt-sz" aria-selected="false">深圳</li>
  </ul>
</div>
```

```css
.select { position: relative; display: inline-block; }
.arrow { display: inline-block; transition: transform 0.2s; } [aria-expanded='true'] .arrow { transform: rotate(180deg); }
[role='listbox'] { position: absolute; top: 100%; left: 0; min-width: 100%; margin: 4px 0 0; padding: 4px 0; list-style: none; background: #fff; border: 1px solid #d0d4da; border-radius: 8px; }
[role='listbox']:not([hidden]) { animation: drop 0.15s ease-out; } @keyframes drop { from { opacity: 0; transform: translateY(-4px); } }
[role='option'] { position: relative; padding: 8px 12px 8px 32px; } [role='option'].active { background: #e8f0fe; }
[role='option'][aria-selected='true']::before { content: '✓'; position: absolute; left: 12px; } [role='option'][aria-disabled='true'] { color: #9aa0a6; }
@media (prefers-reduced-motion: reduce) { .arrow { transition: none; } [role='listbox']:not([hidden]) { animation: none; } }
```

```js
const btn = document.querySelector('#city-btn')
const list = document.querySelector('#city-list')
const options = [...list.querySelectorAll('[role="option"]')]
const enabled = options.filter((o) => o.getAttribute('aria-disabled') !== 'true')
let active = null
function setActive(opt) {
  active?.classList.remove('active')
  active = opt
  opt.classList.add('active')
  list.setAttribute('aria-activedescendant', opt.id)
}
function open() {
  list.hidden = false
  btn.setAttribute('aria-expanded', 'true')
  setActive(enabled.find((o) => o.getAttribute('aria-selected') === 'true') ?? enabled[0])
  list.focus()
}
function close(refocus = true) {
  list.hidden = true
  btn.setAttribute('aria-expanded', 'false')
  if (refocus) btn.focus() // Esc 或选中后把焦点还给触发按钮
}
function choose(opt) {
  if (!enabled.includes(opt)) return // 跳过禁用项
  options.forEach((o) => o.setAttribute('aria-selected', String(o === opt)))
  btn.querySelector('.value').textContent = opt.textContent
  close()
}
btn.addEventListener('mousedown', (e) => e.preventDefault()) // Safari 点按钮不聚焦，避免先触发 focusout
btn.addEventListener('click', () => (list.hidden ? open() : close()))
list.addEventListener('click', (e) => choose(e.target.closest('[role="option"]')))
list.addEventListener('keydown', (e) => {
  const i = enabled.indexOf(active)
  if (e.key === 'ArrowDown') setActive(enabled[Math.min(i + 1, enabled.length - 1)])
  else if (e.key === 'ArrowUp') setActive(enabled[Math.max(i - 1, 0)])
  else if (e.key === 'Enter' || e.key === ' ') choose(active)
  else if (e.key === 'Escape') close()
  else return
  e.preventDefault()
})
list.addEventListener('focusout', (e) => e.relatedTarget !== btn && close(false)) // 点外部或 Tab 走开时关闭
```
