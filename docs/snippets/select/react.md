```tsx
import { useId, useRef, useState, type KeyboardEvent } from 'react'

type Option = { value: string; label: string; disabled?: boolean }
type Props = { label: string; options: Option[]; value: string; onChange: (v: string) => void } // 样式同 HTML 版
export function Select({ label, options, value, onChange }: Props) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(value) // 键盘高亮项
  const btnRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const enabled = options.filter((o) => !o.disabled)
  const current = options.find((o) => o.value === value)
  function show() {
    setActive(value)
    setOpen(true)
    requestAnimationFrame(() => listRef.current?.focus())
  }
  function close(refocus = true) {
    setOpen(false)
    if (refocus) btnRef.current?.focus() // Esc 或选中后焦点回到触发按钮
  }
  function choose(o?: Option) {
    if (!o || o.disabled) return
    onChange(o.value)
    close()
  }
  function onKeyDown(e: KeyboardEvent) {
    const i = enabled.findIndex((o) => o.value === active)
    if (e.key === 'ArrowDown') setActive(enabled[Math.min(i + 1, enabled.length - 1)].value)
    else if (e.key === 'ArrowUp') setActive(enabled[Math.max(i - 1, 0)].value)
    else if (e.key === 'Enter' || e.key === ' ') choose(enabled[i])
    else if (e.key === 'Escape') close()
    else return
    e.preventDefault()
  }

  return (
    <div className="select">
      <span id={`${id}-label`}>{label}</span>
      <button ref={btnRef} id={`${id}-btn`} type="button" aria-haspopup="listbox" aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-btn`} onClick={() => (open ? close() : show())}
        onMouseDown={(e) => e.preventDefault()}>
        {current?.label} <span className="arrow" aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul ref={listRef} role="listbox" tabIndex={-1} aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-${active}`} onKeyDown={onKeyDown}
          onBlur={(e) => e.relatedTarget !== btnRef.current && close(false)}>
          {options.map((o) => (
            <li key={o.value} id={`${id}-${o.value}`} role="option" aria-selected={o.value === value}
              aria-disabled={o.disabled || undefined} className={o.value === active ? 'active' : undefined}
              onClick={() => choose(o)}>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```
