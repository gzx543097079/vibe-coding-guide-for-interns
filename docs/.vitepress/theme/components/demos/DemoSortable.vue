<script setup lang="ts">
import { computed, nextTick, reactive, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

const items = ref([
  { id: 1, text: '整理需求文档' },
  { id: 2, text: '评审登录页 PR' },
  { id: 3, text: '修复分页参数' },
  { id: 4, text: '补充单元测试' },
  { id: 5, text: '更新周报' },
])
const n = computed(() => items.value.length)

// from：被拿起的行；to：它将落下的位置；dy：指针拖动的位移
const s = reactive({ mode: null as null | 'pointer' | 'key', from: -1, to: -1, dy: 0, settling: false })
const instant = ref(false)
const msg = ref('')
const list = ref<HTMLElement>()
const handles = ref<HTMLButtonElement[]>([])
let rowH = 49
let startY = 0

function measure() {
  const row = list.value?.querySelector<HTMLElement>('.dso-row')
  if (row) rowH = row.offsetHeight
}
function offset(k: number): number {
  if (s.mode === null) return 0
  if (k === s.from) return s.mode === 'pointer' && !s.settling ? s.dy : (s.to - s.from) * rowH
  if (s.from < k && k <= s.to) return -rowH
  if (s.to <= k && k < s.from) return rowH
  return 0
}
const name = (i: number) => `「${items.value[i].text}」`

function pick(i: number, mode: 'pointer' | 'key') {
  measure()
  Object.assign(s, { mode, from: i, to: i, dy: 0, settling: false })
  if (mode === 'key') msg.value = `已拿起${name(i)}，当前位置 ${i + 1} / ${n.value}。用上下方向键移动，空格放下，Esc 取消。`
}
// 落下：先让被拖的行动画到目标位置，再真正调整数组顺序
function drop(cancel = false) {
  if (s.mode === null) return
  const { from, mode } = s
  if (cancel) s.to = from
  const to = s.to
  s.settling = true
  const label = name(from)
  window.setTimeout(async () => {
    instant.value = true
    if (to !== from) {
      const [it] = items.value.splice(from, 1)
      items.value.splice(to, 0, it)
    }
    Object.assign(s, { mode: null, from: -1, to: -1, dy: 0, settling: false })
    msg.value = cancel ? `已取消，${label}回到第 ${from + 1} 位` : `已放下${label}，位置 ${to + 1} / ${n.value}`
    await nextTick()
    if (mode === 'key') handles.value[to]?.focus()
    requestAnimationFrame(() => requestAnimationFrame(() => (instant.value = false)))
  }, mode === 'pointer' || to !== from || cancel ? 200 : 0)
}

function down(e: PointerEvent, i: number) {
  if (e.button !== 0 || s.mode) return
  e.preventDefault()
  startY = e.clientY
  pick(i, 'pointer')
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}
function move(e: PointerEvent) {
  if (s.mode !== 'pointer' || s.settling) return
  s.dy = e.clientY - startY
  s.to = Math.max(0, Math.min(n.value - 1, s.from + Math.round(s.dy / rowH)))
}
function up() {
  if (s.mode === 'pointer' && !s.settling) drop()
}
function onKey(e: KeyboardEvent, i: number) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    if (s.mode === null) pick(i, 'key')
    else if (s.mode === 'key') drop()
  } else if (s.mode === 'key' && !s.settling && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
    e.preventDefault()
    s.to = Math.max(0, Math.min(n.value - 1, s.to + (e.key === 'ArrowDown' ? 1 : -1)))
    msg.value = `${name(s.from)}移到第 ${s.to + 1} 位`
  } else if (s.mode === 'key' && e.key === 'Escape') {
    e.preventDefault()
    drop(true)
  }
}

useScript(toRef(props, 'play'), [
  [600, () => pick(2, 'key')],
  [1100, () => (s.to = 1)],
  [1600, () => (s.to = 0)],
  [2200, () => drop()],
])
</script>

<template>
  <div class="dso" :class="frame">
    <div class="dso-bar">今日待办</div>
    <ul ref="list" class="dso-list" :class="{ instant }">
      <li
        v-for="(it, i) in items"
        :key="it.id"
        class="dso-row"
        :class="{ lifted: s.mode !== null && i === s.from && !s.settling, drag: s.mode === 'pointer' && i === s.from && !s.settling, top: i === s.from }"
        :style="{ transform: `translateY(${offset(i)}px)${s.mode !== null && i === s.from && !s.settling ? ' scale(1.03)' : ''}` }"
      >
        <button
          ref="handles"
          type="button"
          class="dso-handle"
          :aria-label="`拖动排序：${it.text}`"
          :aria-pressed="s.mode === 'key' && i === s.from"
          @pointerdown="down($event, i)"
          @pointermove="move"
          @pointerup="up"
          @pointercancel="up"
          @keydown="onKey($event, i)"
          @blur="s.mode === 'key' && i === s.from && drop(true)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><g fill="currentColor"><circle cx="6" cy="4" r="1.2" /><circle cx="10" cy="4" r="1.2" /><circle cx="6" cy="8" r="1.2" /><circle cx="10" cy="8" r="1.2" /><circle cx="6" cy="12" r="1.2" /><circle cx="10" cy="12" r="1.2" /></g></svg>
        </button>
        <span class="dso-text">{{ it.text }}</span>
      </li>
    </ul>
    <p class="sr-only" aria-live="assertive">{{ msg }}</p>
  </div>
</template>

<style scoped>
.dso {
  height: 100%;
  font-size: 14px;
}
.dso-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dso.browser .dso-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dso-list {
  position: relative;
  margin: 4px 12px !important;
  padding: 0 !important;
  list-style: none !important;
  border: 1px solid var(--app-line);
  border-radius: 14px;
  background: var(--app-soft);
}
.dso.browser .dso-list {
  max-width: 420px;
  margin: 14px 18px !important;
}
.dso-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 49px;
  margin: 0 !important;
  padding: 0 14px 0 6px;
  background: var(--app-bg);
  box-shadow: inset 0 -1px 0 var(--app-line);
  transition: transform 200ms var(--ease-out);
}
.dso-row:first-child {
  border-radius: 13px 13px 0 0;
}
.dso-row:last-child {
  border-radius: 0 0 13px 13px;
  box-shadow: none;
}
/* 浮起阴影放在伪元素上，只渐变透明度 */
.dso-row::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  box-shadow: 0 8px 24px -6px rgb(20 20 19 / 0.28), 0 0 0 1px var(--app-line);
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms var(--ease-out);
}
.dso-row.lifted {
  border-radius: 10px;
}
.dso-row.lifted::after {
  opacity: 1;
}
.dso-row.drag {
  transition: none;
}
.dso-list.instant .dso-row,
.dso-list.instant .dso-row::after {
  transition: none;
}
.dso-row.top {
  z-index: 2;
}
.dso-handle {
  display: grid;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--app-ink-2);
  cursor: grab;
  touch-action: none;
}
.dso-handle:hover {
  background: var(--app-soft);
  color: var(--app-ink);
}
.dso-row.drag .dso-handle {
  cursor: grabbing;
}
.dso-handle[aria-pressed='true'] {
  background: color-mix(in oklab, var(--app-accent) 14%, transparent);
  color: var(--app-accent);
}
.dso-text {
  font-size: 15px;
  color: var(--app-ink);
}
</style>
