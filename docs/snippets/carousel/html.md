```html
<section class="carousel" aria-roledescription="carousel" aria-label="精选内容">
  <div class="viewport">
    <div class="track" aria-live="off">
      <div class="slide" role="group" aria-roledescription="slide" aria-label="1 / 3">…</div>
      <div class="slide" role="group" aria-roledescription="slide" aria-label="2 / 3">…</div>
      <div class="slide" role="group" aria-roledescription="slide" aria-label="3 / 3">…</div>
    </div>
  </div>
  <button type="button" class="prev" aria-label="上一张">‹</button>
  <button type="button" class="next" aria-label="下一张">›</button>
  <div class="dots"></div>
</section>
```

```css
.viewport { overflow: hidden; }
.track { display: flex; touch-action: pan-y; transition: transform 0.4s ease; }
.track.dragging { transition: none; }
.slide { flex: 0 0 100%; }
.dots button { width: 8px; height: 8px; border-radius: 4px; transition: transform 0.3s; }
.dots button[aria-current='true'] { transform: scaleX(2.5); } /* 当前点拉长 */
@media (prefers-reduced-motion: reduce) { .track, .dots button { transition: none; } }
```

```js
const root = document.querySelector('.carousel')
const track = root.querySelector('.track')
const count = track.children.length
const dots = [...Array(count)].map((_, i) => {
  const b = Object.assign(document.createElement('button'), { type: 'button' })
  b.setAttribute('aria-label', `第 ${i + 1} 张`)
  b.onclick = () => go(i)
  return root.querySelector('.dots').appendChild(b)
})
let index = 0, timer = null, startX = 0, dx = 0

function go(i) {
  index = (i + count) % count
  track.style.transform = `translateX(${-index * 100}%)`
  dots.forEach((d, n) => d.setAttribute('aria-current', String(n === index)))
}
root.querySelector('.prev').onclick = () => go(index - 1)
root.querySelector('.next').onclick = () => go(index + 1)

// 拖动：按下记录起点，移动时跟手，松手超过 1/5 宽度就翻页
track.addEventListener('pointerdown', (e) => { startX = e.clientX; dx = 0; track.setPointerCapture(e.pointerId); track.classList.add('dragging') })
track.addEventListener('pointermove', (e) => {
  if (!track.classList.contains('dragging')) return
  dx = e.clientX - startX
  track.style.transform = `translateX(calc(${-index * 100}% + ${dx}px))`
})
track.addEventListener('pointerup', () => {
  track.classList.remove('dragging')
  go(Math.abs(dx) > root.clientWidth / 5 ? index - Math.sign(dx) : index)
})

// 自动播放：减少动态效果时不启动；悬停或聚焦时暂停，并让读屏播报切换
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const play = () => { if (!reduce) { stop(); timer = setInterval(() => go(index + 1), 4000); track.setAttribute('aria-live', 'off') } }
const stop = () => { clearInterval(timer); track.setAttribute('aria-live', 'polite') }
root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', play)
root.addEventListener('focusin', stop); root.addEventListener('focusout', play)
go(0); play()
```
