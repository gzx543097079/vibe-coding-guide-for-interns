```tsx
import { useEffect, useRef, useState } from 'react'

const OPTIONS = [
  { value: 'email', label: '邮件' },
  { value: 'sms', label: '短信' },
  { value: 'push', label: '推送' },
]

export function NotifySettings() {
  const [picked, setPicked] = useState<string[]>(['email'])
  const [theme, setTheme] = useState('light')
  const allRef = useRef<HTMLInputElement>(null)

  const all = picked.length === OPTIONS.length
  const some = picked.length > 0 && !all

  // React 不支持 indeterminate 属性，只能通过 ref 设置
  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = some
  }, [some])

  const toggle = (v: string) =>
    setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))

  return (
    <>
      <fieldset>
        <legend>通知方式</legend>
        <label>
          <input
            ref={allRef}
            type="checkbox"
            checked={all}
            onChange={(e) => setPicked(e.target.checked ? OPTIONS.map((o) => o.value) : [])}
          />{' '}
          全选
        </label>
        {OPTIONS.map((o) => (
          <label key={o.value} className="child">
            <input type="checkbox" checked={picked.includes(o.value)} onChange={() => toggle(o.value)} /> {o.label}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>主题</legend>
        {[['light', '浅色'], ['dark', '深色']].map(([v, text]) => (
          <label key={v}>
            <input type="radio" name="theme" value={v} checked={theme === v} onChange={() => setTheme(v)} /> {text}
          </label>
        ))}
      </fieldset>
    </>
  )
}
```
