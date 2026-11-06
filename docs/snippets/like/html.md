```html
<button type="button" class="like" aria-pressed="false">
  <span class="burst" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
  <svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 3.5 12.5a5 5 0 0 1 7-7L12 7l1.5-1.5a5 5 0 0 1 7 7Z" /></svg>
  <span class="sr-only">赞</span>
  <span class="count"><span>128</span></span>
</button>
```

```css
.like { position: relative; display: inline-flex; align-items: center; gap: 6px; color: #888; }
.like[aria-pressed='true'] { color: #e5484d; }
.heart { width: 24px; fill: currentColor; }
.like.pop .heart { animation: pop 0.45s ease-out; }
.like.shrink .heart { animation: shrink 0.3s ease-out; }
@keyframes pop { 30% { transform: scale(0.7); } 70% { transform: scale(1.2); } }
@keyframes shrink { 40% { transform: scale(0.8); } }
.burst i { position: absolute; left: 9px; top: 9px; width: 6px; height: 6px; border-radius: 50%; background: #e5484d; opacity: 0; }
.like.pop .burst i { animation: burst 0.5s ease-out; }
.burst i { --a: calc(45deg * var(--i)); } /* 每个点一个方向，--i 由 JS 写入 */
@keyframes burst {
  from { opacity: 1; transform: rotate(var(--a)) translateY(0) scale(1); }
  to { opacity: 0; transform: rotate(var(--a)) translateY(-22px) scale(0.3); }
}
.count { display: inline-block; overflow: hidden; height: 1.2em; }
.count span { display: block; }
.count .roll { animation: roll 0.3s ease-out; }
@keyframes roll { from { transform: translateY(100%); } }
/* 减少动态效果：只切换颜色 */
@media (prefers-reduced-motion: reduce) { .like * { animation: none !important; } }
```

```js
const btn = document.querySelector('.like')
const num = btn.querySelector('.count span')
btn.querySelectorAll('.burst i').forEach((dot, i) => dot.style.setProperty('--i', i))
let count = 128

btn.addEventListener('click', () => {
  const liked = btn.getAttribute('aria-pressed') !== 'true'
  btn.setAttribute('aria-pressed', String(liked))
  count += liked ? 1 : -1
  num.textContent = count
  // 点赞做回弹加爆发，取消只做缩小回弹；先移除再加上以便重复触发动画
  btn.classList.remove('pop', 'shrink'); num.classList.remove('roll')
  void btn.offsetWidth
  btn.classList.add(liked ? 'pop' : 'shrink'); num.classList.add('roll')
})
```
