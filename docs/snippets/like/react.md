```tsx
import { useState, type CSSProperties } from 'react'

export function LikeButton({ initial = 0 }: { initial?: number }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initial)
  const [anim, setAnim] = useState<'' | 'pop' | 'shrink'>('')
  const [tick, setTick] = useState(0) // 变化时作为 key 让动画重新播放

  const toggle = () => {
    const next = !liked
    setLiked(next)
    setCount((c) => c + (next ? 1 : -1))
    setAnim(next ? 'pop' : 'shrink') // 取消点赞只缩小回弹，不爆发
    setTick((t) => t + 1)
  }

  // 样式与 keyframes 沿用 html 版本，减少动态效果时由 CSS 关闭动画
  return (
    <button type="button" className={`like ${anim}`} aria-pressed={liked} onClick={toggle}>
      <span key={`b${tick}`} className="burst" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ '--i': i } as CSSProperties} />
        ))}
      </span>
      <svg key={`h${tick}`} className="heart" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21 3.5 12.5a5 5 0 0 1 7-7L12 7l1.5-1.5a5 5 0 0 1 7 7Z" />
      </svg>
      <span className="sr-only">赞</span>
      <span className="count">
        <span key={count} className={tick ? 'roll' : undefined}>{count}</span>
      </span>
    </button>
  )
}
```
