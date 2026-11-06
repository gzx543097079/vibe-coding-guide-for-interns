```tsx
import { useState } from 'react'

export function SubmitButton() {
  const [loading, setLoading] = useState(false)

  return (
    <button type="button" className="btn" disabled={loading} onClick={() => setLoading(true)}>
      {loading ? '提交中…' : '提交'}
    </button>
  )
}
```
