```tsx
import { useState } from 'react'

const tabs = ['首页', '发现', '我的']

export function TabBar() {
  const [index, setIndex] = useState(0)

  return (
    <>
      <div role="tablist" aria-label="主导航">
        {tabs.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={i === index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <section role="tabpanel">{tabs[index]}的内容</section>
    </>
  )
}
```
