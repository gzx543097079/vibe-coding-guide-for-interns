```html
<ul class="sortable">
  <li><button type="button" class="handle" aria-describedby="sort-tip" aria-label="拖动排序：首页">⠿</button>首页</li>
  <li><button type="button" class="handle" aria-describedby="sort-tip" aria-label="拖动排序：消息">⠿</button>消息</li>
  <li><button type="button" class="handle" aria-describedby="sort-tip" aria-label="拖动排序：我的">⠿</button>我的</li>
</ul>
<p id="sort-tip" hidden>按空格拿起，上下方向键移动，再按空格放下，Esc 取消</p>
<p class="sr-only" aria-live="assertive"></p>
```

```css
.sortable li { display: flex; gap: 8px; transition: transform 0.2s; }
.sortable li.lifted { transform: scale(1.03); box-shadow: 0 8px 20px rgb(0 0 0 / 0.18); transition: none; position: relative; z-index: 1; }
.handle { cursor: grab; touch-action: none; }
@media (prefers-reduced-motion: reduce) { .sortable li { transition: none; } }
```

```js
const list = document.querySelector('.sortable'), live = document.querySelector('[aria-live]')
const rows = () => [...list.children]
const say = (li, verb) => { live.textContent = `${verb}，第 ${rows().indexOf(li) + 1} 项，共 ${rows().length} 项` }
let drag = null, held = null, origin = 0

// 指针拖动：被拖行跟手，其他行用 translateY 让位，松手后再改 DOM 顺序
list.addEventListener('pointerdown', (e) => {
  const handle = e.target.closest('.handle'); if (!handle) return
  const li = handle.parentElement, h = li.offsetHeight
  drag = { li, h, y: e.clientY, from: rows().indexOf(li), to: rows().indexOf(li) }
  handle.setPointerCapture(e.pointerId); li.classList.add('lifted')
})
list.addEventListener('pointermove', (e) => {
  if (!drag) return
  const dy = e.clientY - drag.y
  drag.to = Math.max(0, Math.min(rows().length - 1, drag.from + Math.round(dy / drag.h)))
  drag.li.style.transform = `translateY(${dy}px) scale(1.03)`
  rows().forEach((r, i) => {
    if (r === drag.li) return
    const shift = i > drag.from && i <= drag.to ? -drag.h : i < drag.from && i >= drag.to ? drag.h : 0
    r.style.transform = shift ? `translateY(${shift}px)` : ''
  })
})
list.addEventListener('pointerup', () => {
  if (!drag) return
  const { li, to } = drag; drag = null
  rows().forEach((r) => (r.style.transform = ''))
  li.classList.remove('lifted')
  const others = rows().filter((r) => r !== li)
  list.insertBefore(li, others[to] ?? null); say(li, '已放下')
})

// 键盘：空格拿起/放下，方向键移动，Esc 回到原位
list.addEventListener('keydown', (e) => {
  const handle = e.target.closest('.handle'); if (!handle) return
  const li = handle.parentElement, i = rows().indexOf(li)
  if (e.key === ' ') { e.preventDefault(); held = held ? null : li; origin = i; li.classList.toggle('lifted', !!held); say(li, held ? '已拿起' : '已放下') }
  else if (held && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
    e.preventDefault()
    const j = e.key === 'ArrowUp' ? i - 1 : i + 1
    if (j < 0 || j >= rows().length) return
    list.insertBefore(li, e.key === 'ArrowUp' ? rows()[j] : rows()[j].nextSibling); handle.focus(); say(li, '已移动')
  } else if (held && e.key === 'Escape') {
    list.insertBefore(li, rows().filter((r) => r !== li)[origin] ?? null)
    held = null; li.classList.remove('lifted'); handle.focus(); say(li, '已取消')
  }
})
```
