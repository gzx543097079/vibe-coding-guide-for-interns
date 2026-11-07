```tsx
import { useEffect, useState } from 'react'

type User = { name: string; bio: string; avatar: string }

function ProfileSkeleton() {
  return (
    <div className="row" aria-hidden="true">
      <span className="sk avatar" />
      <span className="sk line" />
      <span className="sk line short" />
    </div>
  )
}

export function ProfileCard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch('/api/me').then((r) => r.json()).then(setUser)
  }, [])

  return (
    <div className="card" aria-busy={!user}>
      {!user ? (
        <ProfileSkeleton />
      ) : (
        <div className="row fade-in">
          <img src={user.avatar} alt="" className="avatar" />
          <strong>{user.name}</strong>
          <span>{user.bio}</span>
        </div>
      )}
    </div>
  )
}
```

```css
.row { display: grid; grid-template-columns: 40px 1fr; gap: 8px 12px; align-items: center; }
.avatar { grid-row: span 2; width: 40px; height: 40px; border-radius: 50%; }
.sk { position: relative; overflow: hidden; background: #e5e7eb; border-radius: 4px; }
.sk.avatar { border-radius: 50%; }
.line { height: 12px; width: 80%; }
.line.short { width: 50%; }
.sk::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.6), transparent);
  animation: shimmer 1.4s infinite; }
@keyframes shimmer { to { transform: translateX(100%); } }
.fade-in { animation: fade-in 0.3s ease-out; }
@keyframes fade-in { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .sk::after { display: none; }
}
```
