```tsx
import { useState } from 'react'

type Item = { id: number; title: string }

export function MessageList({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial)
  const [loading, setLoading] = useState(false)

  async function reload() {
    setLoading(true)
    // const data = await fetchMessages(); setItems(data)
    setLoading(false)
  }

  return (
    <>
      <button type="button" onClick={reload} disabled={loading}>
        {loading ? '刷新中…' : '刷新'}
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.title}
            <button type="button" onClick={() => setItems(items.filter((i) => i.id !== item.id))}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
```
