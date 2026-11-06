```tsx
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

export function Carousel({ slides }: { slides: ReactNode[] }) {
  const [index, setIndex] = useState(0)
  const [dx, setDx] = useState(0)
  const [paused, setPaused] = useState(false)
  const drag = useRef<{ x: number } | null>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const go = (i: number) => setIndex((i + slides.length) % slides.length)

  useEffect(() => {
    // 减少动态效果或暂停时不自动播放
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000)
    return () => clearInterval(t)
  }, [paused, slides.length])

  const onDown = (e: PointerEvent) => { drag.current = { x: e.clientX }; e.currentTarget.setPointerCapture(e.pointerId) }
  const onMove = (e: PointerEvent) => { if (drag.current) setDx(e.clientX - drag.current.x) }
  const onUp = () => {
    drag.current = null
    if (Math.abs(dx) > (viewport.current?.clientWidth ?? 0) / 5) go(index - Math.sign(dx))
    setDx(0)
  }

  return (
    <section className="carousel" aria-roledescription="carousel" aria-label="精选内容"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div ref={viewport} className="viewport">
        <div className={`track${drag.current ? ' dragging' : ''}`} aria-live={paused ? 'polite' : 'off'}
          style={{ transform: `translateX(calc(${-index * 100}% + ${dx}px))` }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
          {slides.map((s, i) => (
            <div key={i} className="slide" role="group" aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}>{s}</div>
          ))}
        </div>
      </div>
      <button type="button" className="prev" aria-label="上一张" onClick={() => go(index - 1)}>‹</button>
      <button type="button" className="next" aria-label="下一张" onClick={() => go(index + 1)}>›</button>
      <div className="dots">
        {slides.map((_, i) => (
          <button key={i} type="button" aria-label={`第 ${i + 1} 张`}
            aria-current={i === index} onClick={() => go(i)} />
        ))}
      </div>
    </section>
  )
}
```
