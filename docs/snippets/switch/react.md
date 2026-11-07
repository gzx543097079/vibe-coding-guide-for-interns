```tsx
import { useState } from 'react'

export function Switch({ label }: { label: string }) {
  const [on, setOn] = useState(true)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="switch"
      onClick={() => setOn(!on)}
    >
      <span className="thumb" />
    </button>
  )
}
```
