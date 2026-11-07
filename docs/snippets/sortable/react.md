```tsx
import { useState, type KeyboardEvent, type PointerEvent } from 'react'

type Drag = { from: number; to: number; y: number; dy: number; h: number }
const move = <T,>(a: T[], from: number, to: number) => { const b = [...a]; b.splice(to, 0, ...b.splice(from, 1)); return b }

export function Sortable({ initial }: { initial: string[] }) {
  const [items, setItems] = useState(initial)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [held, setHeld] = useState<{ index: number; origin: number } | null>(null)
  const [msg, setMsg] = useState('')
  const say = (verb: string, i: number) => setMsg(`${verb}，第 ${i + 1} 项，共 ${items.length} 项`)

  const onDown = (e: PointerEvent<HTMLButtonElement>, i: number) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ from: i, to: i, y: e.clientY, dy: 0, h: e.currentTarget.parentElement!.offsetHeight })
  }
  const onMove = (e: PointerEvent) => {
    if (!drag) return
    const dy = e.clientY - drag.y
    setDrag({ ...drag, dy, to: Math.max(0, Math.min(items.length - 1, drag.from + Math.round(dy / drag.h))) })
  }
  const onUp = () => { if (!drag) return; setItems(move(items, drag.from, drag.to)); say('已放下', drag.to); setDrag(null) }

  // 键盘：空格拿起/放下，方向键移动，Esc 回到原位
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === ' ') { e.preventDefault(); setHeld(held ? null : { index: i, origin: i }); say(held ? '已放下' : '已拿起', i) }
    else if (held && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault()
      const j = i + (e.key === 'ArrowUp' ? -1 : 1)
      if (j < 0 || j >= items.length) return
      const btn = e.currentTarget as HTMLElement
      setItems(move(items, i, j)); setHeld({ ...held, index: j }); say('已移动', j)
      requestAnimationFrame(() => btn.focus()) // 节点被移动后浏览器会让它失焦，放回焦点
    } else if (held && e.key === 'Escape') { setItems(move(items, i, held.origin)); setHeld(null); say('已取消', held.origin) }
  }

  // 被拖行跟手，其他行用位移让出位置
  const style = (i: number) => {
    if (!drag) return undefined
    if (i === drag.from) return { transform: `translateY(${drag.dy}px) scale(1.03)` }
    const shift = i > drag.from && i <= drag.to ? -drag.h : i < drag.from && i >= drag.to ? drag.h : 0
    return { transform: `translateY(${shift}px)` }
  }

  return (
    <>
      <ul className="sortable">
        {items.map((it, i) => (
          <li key={it} style={style(i)} className={drag?.from === i || held?.index === i ? 'lifted' : undefined}>
            <button type="button" className="handle" aria-label={`拖动排序：${it}`}
              onPointerDown={(e) => onDown(e, i)} onPointerMove={onMove} onPointerUp={onUp} onKeyDown={(e) => onKey(e, i)}>⠿</button>
            {it}
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="assertive">{msg}</p>
    </>
  )
}
```
