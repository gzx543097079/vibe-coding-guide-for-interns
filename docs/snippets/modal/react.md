```tsx
import { useEffect, useRef } from 'react'

export function ConfirmDialog({ open, onClose }: { open: boolean; onClose: (ok: boolean) => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} aria-labelledby="confirm-title" onCancel={() => onClose(false)}>
      <h2 id="confirm-title">删除这篇文档？</h2>
      <button onClick={() => onClose(false)}>取消</button>
      <button onClick={() => onClose(true)}>删除</button>
    </dialog>
  )
}
```
