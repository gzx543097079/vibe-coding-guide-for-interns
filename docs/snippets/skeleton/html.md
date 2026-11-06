```html
<!-- aria-busy 告诉读屏这里在加载；占位块本身对读屏隐藏 -->
<div class="card" id="profile" aria-busy="true">
  <div class="skeleton" aria-hidden="true">
    <span class="sk sk-avatar"></span>
    <span class="sk sk-line"></span>
    <span class="sk sk-line short"></span>
  </div>
  <span class="visually-hidden">加载中</span>
</div>

<template id="profile-tpl">
  <div class="loaded">
    <img alt="" width="40" height="40" style="grid-row: span 2; border-radius: 50%">
    <strong></strong>
    <span></span>
  </div>
</template>
```

```css
.skeleton, .loaded { display: grid; grid-template-columns: 40px 1fr; gap: 8px 12px; align-items: center; }
.sk { position: relative; overflow: hidden; background: #e5e7eb; border-radius: 4px; }
.sk-avatar { grid-row: span 2; width: 40px; height: 40px; border-radius: 50%; }
.sk-line { height: 12px; width: 80%; }
.sk-line.short { width: 50%; }
/* 光泽层：只移动 transform，不改尺寸 */
.sk::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.6), transparent);
  animation: shimmer 1.4s infinite; }
@keyframes shimmer { to { transform: translateX(100%); } }
.loaded { animation: fade-in 0.3s ease-out; }
@keyframes fade-in { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .sk::after { animation: none; display: none; }
}
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
```

```js
async function loadProfile() {
  const card = document.querySelector('#profile')
  const user = await fetch('/api/me').then((r) => r.json())
  // 用 template 克隆真实结构，文字走 textContent，避免拼接 HTML
  const node = document.querySelector('#profile-tpl').content.cloneNode(true)
  node.querySelector('img').src = user.avatar
  node.querySelector('strong').textContent = user.name
  node.querySelector('span').textContent = user.bio
  card.replaceChildren(node)
  card.setAttribute('aria-busy', 'false')
}
loadProfile()
```
