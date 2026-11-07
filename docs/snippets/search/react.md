```tsx
import { useEffect, useId, useState, type KeyboardEvent } from 'react'

export function SearchBox({ words, recent }: { words: string[]; recent: string[] }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [q, setQ] = useState('') // 防抖后的关键词
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const t = setTimeout(() => { setQ(query.trim()); setActive(-1) }, 150)
    return () => clearTimeout(t)
  }, [query])

  const items = q ? words.filter((w) => w.includes(q)) : recent
  const choose = (w: string) => { setQuery(w); setOpen(false) }

  const onKey = (e: KeyboardEvent) => {
    const n = items.length
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); setOpen(true); setActive((active + 1) % n) }
    else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setActive((active - 1 + n) % n) }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(items[active]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  // 只加粗匹配段，React 会自动转义文本
  const highlight = (w: string) => {
    const i = q ? w.indexOf(q) : -1
    return i < 0 ? w : <>{w.slice(0, i)}<b>{q}</b>{w.slice(i + q.length)}</>
  }

  return (
    <div className="search">
      <input type="search" role="combobox" aria-label="搜索" aria-autocomplete="list"
        aria-controls={`${id}-list`} aria-expanded={open && items.length > 0}
        aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
        value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={onKey} />
      {query && <button type="button" aria-label="清除" onClick={() => setQuery('')}>×</button>}
      {open && !q && items.length > 0 && <p>最近搜索</p>}
      <ul id={`${id}-list`} role="listbox" aria-label="搜索建议" hidden={!open || items.length === 0}>
        {items.map((w, i) => (
          <li key={w} id={`${id}-${i}`} role="option" aria-selected={i === active}
            onPointerDown={(e) => { e.preventDefault(); choose(w) }}>{highlight(w)}</li>
        ))}
      </ul>
      <p aria-live="polite">{open && q && items.length === 0 ? `没有找到「${q}」相关结果` : ''}</p>
    </div>
  )
}
```
