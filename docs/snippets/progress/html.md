```html
<!-- 确定进度 -->
<div class="bar" role="progressbar" aria-label="上传进度"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="40">
  <span class="fill"></span>
</div>

<!-- 不确定进度：不写 aria-valuenow -->
<div class="bar indeterminate" role="progressbar" aria-label="正在加载">
  <span class="fill"></span>
</div>

<!-- 环形进度：pathLength=100，dashoffset = 100 - 进度 -->
<svg class="ring" viewBox="0 0 36 36" width="48" height="48" role="progressbar"
     aria-label="同步进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40">
  <circle cx="18" cy="18" r="16" pathLength="100" class="track" />
  <circle cx="18" cy="18" r="16" pathLength="100" class="value" />
</svg>

<span class="spinner" role="status" aria-label="加载中"></span>
```

```css
.bar { height: 4px; overflow: hidden; border-radius: 2px; background: #e5e7eb; }
.fill { display: block; height: 100%; background: #2563eb; transform-origin: left;
  transform: scaleX(0.4); transition: transform 0.3s ease-out; }
.indeterminate .fill { width: 40%; transform: translateX(-100%); animation: slide 1.2s infinite ease-in-out; }
@keyframes slide { to { transform: translateX(250%); } }

.ring { transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 4; }
.ring .track { stroke: #e5e7eb; }
.ring .value { stroke: #2563eb; stroke-dasharray: 100; stroke-dashoffset: 60; transition: stroke-dashoffset 0.3s; }

.spinner { display: inline-block; width: 24px; height: 24px; border-radius: 50%;
  border: 3px solid #e5e7eb; border-top-color: #2563eb; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .fill, .ring .value { transition: none; }
  .indeterminate .fill { width: 100%; transform: none; animation: pulse 2s infinite; }
  .spinner { animation-duration: 2.4s; } /* 放慢而不是停掉，否则看起来像卡死 */
}
@keyframes pulse { 50% { opacity: 0.4; } }
```

```js
function setProgress(value) {
  const bar = document.querySelector('.bar:not(.indeterminate)')
  bar.setAttribute('aria-valuenow', String(value))
  bar.querySelector('.fill').style.transform = `scaleX(${value / 100})`
  const ring = document.querySelector('.ring')
  ring.setAttribute('aria-valuenow', String(value))
  ring.querySelector('.value').style.strokeDashoffset = String(100 - value)
}
```
