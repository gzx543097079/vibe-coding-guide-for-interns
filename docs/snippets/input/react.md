```tsx
import { useId, useRef, useState } from 'react'

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// 样式同 HTML 版：placeholder=" " + :placeholder-shown 控制浮动标签
export function EmailField() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function validate() {
    const bad = email !== '' && !isEmail(email)
    setError(bad ? '邮箱格式不对，例如 name@example.com' : '')
    setShake(bad)
  }

  return (
    <div className={shake ? 'field shake' : 'field'} onAnimationEnd={() => setShake(false)}>
      <input
        id={id}
        ref={inputRef}
        type="email"
        placeholder=" "
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={validate}
        aria-invalid={error !== ''}
        aria-describedby={`${id}-err`}
      />
      <label htmlFor={id}>邮箱</label>
      {email && (
        <button
          type="button"
          className="clear"
          aria-label="清除邮箱"
          onMouseDown={(e) => e.preventDefault()} // 不让输入框先失焦触发校验
          onClick={() => {
            setEmail('')
            setError('')
            inputRef.current?.focus()
          }}
        >
          ×
        </button>
      )}
      <p id={`${id}-err`} className="err" aria-live="polite">
        {error}
      </p>
    </div>
  )
}
```
