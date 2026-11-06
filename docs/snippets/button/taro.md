```tsx
import { useState } from 'react'
import { Button } from '@tarojs/components'

export default function SubmitButton() {
  const [loading, setLoading] = useState(false)

  return (
    <Button type='primary' loading={loading} disabled={loading} onClick={() => setLoading(true)}>
      提交
    </Button>
  )
}
```
