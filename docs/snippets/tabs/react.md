```tsx
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'

const TABS = ['全部', '待付款', '待发货', '已完成']

// 样式同 HTML 版
export function OrdersTabs() {
  const [current, setCurrent] = useState(0)
  const [bar, setBar] = useState({ x: 0, w: 0 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // 绘制前量出选中标签的位置和宽度
  useLayoutEffect(() => {
    const el = tabRefs.current[current]
    if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth })
  }, [current])

  function select(i: number) {
    const next = (i + TABS.length) % TABS.length
    setCurrent(next)
    tabRefs.current[next]?.focus()
  }

  function onKeyDown(e: KeyboardEvent) {
    const map: Record<string, number> = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: TABS.length - 1 }
    if (!(e.key in map)) return
    e.preventDefault()
    select(map[e.key])
  }

  return (
    <>
      <div role="tablist" aria-label="订单" onKeyDown={onKeyDown}>
        {TABS.map((t, i) => (
          <button key={t} ref={(el) => { tabRefs.current[i] = el }} role="tab" id={`tab-${i}`}
            aria-selected={current === i} aria-controls={current === i ? `panel-${i}` : undefined}
            tabIndex={current === i ? 0 : -1} onClick={() => select(i)}>
            {t}
          </button>
        ))}
        <span className="indicator" aria-hidden="true" style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})` }} />
      </div>
      {/* key 变化时重新挂载，触发 CSS 淡入 */}
      <section key={current} role="tabpanel" id={`panel-${current}`} aria-labelledby={`tab-${current}`} tabIndex={0}>
        {TABS[current]}订单
      </section>
    </>
  )
}
```
