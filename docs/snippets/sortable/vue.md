```vue
<script setup>
import { nextTick, ref } from 'vue'
const items = defineModel({ type: Array, required: true })
const drag = ref(null) // { from, to, y, dy, h }
const held = ref(null) // { index, origin }
const msg = ref('')
const say = (verb, i) => { msg.value = `${verb}，第 ${i + 1} 项，共 ${items.value.length} 项` }
const move = (from, to) => { const a = [...items.value]; a.splice(to, 0, ...a.splice(from, 1)); items.value = a }

function down(e, i) {
  e.currentTarget.setPointerCapture(e.pointerId)
  drag.value = { from: i, to: i, y: e.clientY, dy: 0, h: e.currentTarget.parentElement.offsetHeight }
}
function moveTo(e) {
  const d = drag.value; if (!d) return
  d.dy = e.clientY - d.y
  d.to = Math.max(0, Math.min(items.value.length - 1, d.from + Math.round(d.dy / d.h)))
}
function up() { const d = drag.value; if (!d) return; move(d.from, d.to); say('已放下', d.to); drag.value = null }

// 键盘：空格拿起/放下，方向键移动，Esc 回到原位
function key(e, i) {
  const h = held.value
  if (e.key === ' ') { e.preventDefault(); held.value = h ? null : { index: i, origin: i }; say(h ? '已放下' : '已拿起', i) }
  else if (h && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
    e.preventDefault()
    const j = i + (e.key === 'ArrowUp' ? -1 : 1)
    if (j < 0 || j >= items.value.length) return
    const btn = e.currentTarget
    move(i, j); h.index = j; say('已移动', j)
    nextTick(() => btn.focus()) // 节点被移动后浏览器会让它失焦，放回焦点
  } else if (h && e.key === 'Escape') { move(i, h.origin); held.value = null; say('已取消', h.origin) }
}

// 被拖行跟手，其他行用位移让出位置
function style(i) {
  const d = drag.value; if (!d) return
  if (i === d.from) return { transform: `translateY(${d.dy}px) scale(1.03)` }
  const shift = i > d.from && i <= d.to ? -d.h : i < d.from && i >= d.to ? d.h : 0
  return { transform: `translateY(${shift}px)` }
}
</script>

<template>
  <ul class="sortable">
    <li v-for="(it, i) in items" :key="it" :style="style(i)"
      :class="{ lifted: drag?.from === i || held?.index === i }">
      <button type="button" class="handle" :aria-label="`拖动排序：${it}`"
        @pointerdown="down($event, i)" @pointermove="moveTo" @pointerup="up" @keydown="key($event, i)">⠿</button>
      {{ it }}
    </li>
  </ul>
  <p class="sr-only" aria-live="assertive">{{ msg }}</p>
</template>
```
