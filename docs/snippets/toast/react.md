```tsx
import { useRef, useState } from 'react'

type Snack = { text: string; undo?: () => void }

export function useToast() {
  const [toast, setToast] = useState('')
  const [snack, setSnack] = useState<Snack | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)
  const snackTimer = useRef<number | undefined>(undefined)

  const showToast = (text: string) => {
    setToast(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2000)
  }

  const showSnackbar = (text: string, undo?: () => void) => {
    setSnack({ text, undo }) // 新消息替换旧消息
    clearTimeout(snackTimer.current)
    snackTimer.current = window.setTimeout(() => setSnack(null), 4000)
  }

  const host = (
    <>
      {/* live region 常驻，只换内容 */}
      <div role="status" aria-live="polite">
        <p className={`toast ${toast ? 'show' : ''}`}>{toast}</p>
      </div>
      <div role="status" aria-live="polite">
        {snack && (
          <div className="snackbar show" key={snack.text}>
            <span>{snack.text}</span>
            <button type="button" onClick={() => { snack.undo?.(); setSnack(null) }}>撤销</button>
          </div>
        )}
      </div>
    </>
  )
  return { showToast, showSnackbar, host }
}
```

```css
.toast { opacity: 0; transform: translateY(8px); transition: opacity 0.2s, transform 0.2s; }
.toast.show { opacity: 1; transform: none; }
.snackbar { animation: slide-up 0.25s ease-out; }
@keyframes slide-up { from { transform: translateY(150%); } }
@media (prefers-reduced-motion: reduce) {
  .toast { transform: none; }
  .snackbar { animation: none; }
}
```
