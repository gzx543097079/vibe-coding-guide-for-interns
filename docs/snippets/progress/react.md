```tsx
// value 传 null 表示不确定进度
export function ProgressBar({ value, label }: { value: number | null; label: string }) {
  const indeterminate = value === null
  return (
    <div
      className={`bar ${indeterminate ? 'indeterminate' : ''}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : value}
    >
      <span className="fill" style={indeterminate ? undefined : { transform: `scaleX(${value / 100})` }} />
    </div>
  )
}

export function ProgressRing({ value, label }: { value: number; label: string }) {
  return (
    <svg className="ring" viewBox="0 0 36 36" width={48} height={48} role="progressbar"
         aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <circle cx="18" cy="18" r="16" pathLength={100} className="track" />
      <circle cx="18" cy="18" r="16" pathLength={100} className="value"
              style={{ strokeDashoffset: 100 - value }} />
    </svg>
  )
}

export function Spinner() {
  return <span className="spinner" role="status" aria-label="加载中" />
}
```

```css
.bar { height: 4px; overflow: hidden; border-radius: 2px; background: #e5e7eb; }
.fill { display: block; height: 100%; background: #2563eb; transform-origin: left; transition: transform 0.3s ease-out; }
.indeterminate .fill { width: 40%; transform: translateX(-100%); animation: slide 1.2s infinite ease-in-out; }
@keyframes slide { to { transform: translateX(250%); } }
.ring { transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 4; }
.ring .track { stroke: #e5e7eb; }
.ring .value { stroke: #2563eb; stroke-dasharray: 100; transition: stroke-dashoffset 0.3s; }
.spinner { display: inline-block; width: 24px; height: 24px; border-radius: 50%;
  border: 3px solid #e5e7eb; border-top-color: #2563eb; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .fill, .ring .value { transition: none; }
  .indeterminate .fill { width: 100%; transform: none; animation: pulse 2s infinite; }
  .spinner { animation-duration: 2.4s; }
}
@keyframes pulse { 50% { opacity: 0.4; } }
```
