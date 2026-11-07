```tsx
import { useId, useState } from 'react'

type Item = { title: string; body: string }

export function Accordion({ items, single = true }: { items: Item[]; single?: boolean }) {
  const uid = useId()
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(single ? [] : prev) // single 时一次只展开一个
      if (prev.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const expanded = open.has(i)
        return (
          <div key={i}>
            <h3>
              <button type="button" id={`${uid}-h${i}`} aria-expanded={expanded}
                      aria-controls={`${uid}-p${i}`} onClick={() => toggle(i)}>
                {item.title}
                <span className="chevron" aria-hidden="true">▾</span>
              </button>
            </h3>
            <div id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-h${i}`}
                 className="panel" hidden={!expanded}>
              {item.body}
            </div>
          </div>
        )
      })}
    </div>
  )
}
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
