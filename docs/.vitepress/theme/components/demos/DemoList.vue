<script setup lang="ts">
import { computed, nextTick, reactive, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

interface Item {
  id: number
  title: string
  sub: string
  hue: number
}

let seq = 0
const make = (title: string, sub: string, hue: number): Item => ({ id: ++seq, title, sub, hue })
const items = ref<Item[]>([
  make('构建通知', 'main 分支构建通过', 150),
  make('代码审查', '你的 PR 有 2 条新评论', 258),
  make('导师', '下午三点对一下需求', 30),
  make('测试环境', '部署完成', 200),
  make('周报提醒', '周五下班前提交', 78),
])
const incoming = [
  ['Issue 指派', '新任务：修复分页参数', 302],
  ['依赖更新', '有 1 个安全补丁待合并', 355],
  ['构建通知', 'feat 分支构建失败', 30],
] as const

const THRESHOLD = 64
const pull = ref(0)
const animating = ref(false)
const refreshing = ref(false)
const openId = ref<number | null>(null)
const drag = reactive({ id: null as number | null, dx: 0, active: false })

const { later } = useScript(toRef(props, 'play'), [
  [500, () => {
    animating.value = true
    pull.value = THRESHOLD + 6
  }],
  [900, () => refresh()],
  [2400, () => (openId.value = items.value[1]?.id ?? null)],
  [3600, () => (openId.value = null)],
])

function refresh() {
  if (refreshing.value) return
  animating.value = true
  refreshing.value = true
  pull.value = 52
  later(1000, () => {
    const next = incoming[(seq - 5) % incoming.length]
    items.value.unshift(make(next[0], next[1], next[2]))
    if (items.value.length > 6) items.value.pop()
    refreshing.value = false
    pull.value = 0
  })
}

function remove(id: number) {
  items.value = items.value.filter((i) => i.id !== id)
  openId.value = null
}

// 指针手势：先判断方向，横向为滑动删除，纵向下拉为刷新
let startX = 0
let startY = 0
let axis: 'x' | 'y' | null = null
let target: number | null = null
let touch = false

function down(e: PointerEvent, id: number | null) {
  if (refreshing.value || e.button !== 0) return
  if ((e.target as HTMLElement).closest('button')) return
  startX = e.clientX
  startY = e.clientY
  axis = null
  target = id
  touch = e.pointerType === 'touch'
  animating.value = false
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}
function move(e: PointerEvent) {
  if (startX === 0 && startY === 0) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (!axis) {
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
    axis = Math.abs(dx) > Math.abs(dy) && target !== null ? 'x' : 'y'
    // 触摸时纵向滑动交给页面滚动，刷新使用顶部按钮
    if (axis === 'y' && touch) {
      startX = startY = 0
      axis = null
      return
    }
  }
  if (axis === 'y') {
    pull.value = dy > 0 ? Math.min(dy * 0.55, 96) : 0
  } else {
    const base = openId.value === target ? -80 : 0
    drag.id = target
    drag.active = true
    drag.dx = Math.max(-96, Math.min(0, base + dx))
  }
}
function up() {
  animating.value = true
  if (axis === 'y') {
    if (pull.value >= THRESHOLD) refresh()
    else pull.value = 0
  } else if (axis === 'x' && drag.id !== null) {
    openId.value = drag.dx < -40 ? drag.id : null
  } else if (axis === null && openId.value !== null && target !== openId.value) {
    openId.value = null
  }
  drag.active = false
  drag.id = null
  drag.dx = 0
  startX = startY = 0
  axis = null
}

async function toggleMore(id: number, e: MouseEvent) {
  const open = openId.value !== id
  openId.value = open ? id : null
  if (!open) return
  await nextTick()
  // 键盘打开时把焦点移到删除按钮
  const row = (e.currentTarget as HTMLElement).closest('.dl-row')
  if (e.detail === 0) row?.querySelector<HTMLButtonElement>('.dl-del')?.focus()
}

function offset(id: number) {
  if (drag.active && drag.id === id) return drag.dx
  return openId.value === id ? -80 : 0
}

const ready = computed(() => pull.value >= THRESHOLD || refreshing.value)
const fmt = ['09:12', '昨天', '昨天', '周一', '周一', '上周']
</script>

<template>
  <div class="dl" :class="frame">
    <div class="dl-bar">
      <span>消息</span>
      <button type="button" class="dl-refresh" :disabled="refreshing" aria-label="刷新列表" @click="refresh">
        <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div class="dl-viewport" @pointermove="move" @pointerup="up" @pointercancel="up" @pointerdown.self="down($event, null)">
      <div class="dl-indicator" :class="{ ready, spinning: refreshing, anim: animating }" :style="{ transform: `translateY(${pull - 44}px)`, opacity: Math.min(pull / 40, 1) }" aria-hidden="true">
        <svg v-if="!refreshing" width="18" height="18" viewBox="0 0 16 16" class="dl-arrow">
          <path d="M8 3v10M4 9l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span v-else class="dl-spin" />
        <span class="dl-ind-text">{{ refreshing ? '正在刷新' : ready ? '松开刷新' : '下拉刷新' }}</span>
      </div>

      <TransitionGroup tag="ul" name="dl-item" class="dl-list" :class="{ anim: animating }" :style="{ transform: `translateY(${pull}px)` }">
        <li v-for="(item, i) in items" :key="item.id" class="dl-row">
          <button type="button" class="dl-del" :tabindex="openId === item.id ? 0 : -1" @click="remove(item.id)" @focus="openId = item.id">
            删除
          </button>
          <div
            class="dl-cell"
            :class="{ anim: !(drag.active && drag.id === item.id) }"
            :style="{ transform: `translateX(${offset(item.id)}px)` }"
            @pointerdown="down($event, item.id)"
          >
            <span class="dl-avatar" :style="{ '--h': item.hue }" aria-hidden="true">{{ item.title.slice(0, 1) }}</span>
            <span class="dl-text">
              <span class="dl-title">{{ item.title }}</span>
              <span class="dl-sub">{{ item.sub }}</span>
            </span>
            <span class="dl-time">{{ fmt[i] ?? '' }}</span>
            <button
              type="button"
              class="dl-more"
              :aria-label="`${item.title}：显示删除按钮`"
              :aria-expanded="openId === item.id"
              @click="toggleMore(item.id, $event)"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="3" cy="8" r="1.4" fill="currentColor" /><circle cx="8" cy="8" r="1.4" fill="currentColor" /><circle cx="13" cy="8" r="1.4" fill="currentColor" /></svg>
            </button>
          </div>
        </li>
      </TransitionGroup>
    </div>
    <p class="sr-only" aria-live="polite">{{ refreshing ? '正在刷新' : '' }}</p>
  </div>
</template>

<style scoped>
.dl {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 14px;
  user-select: none;
}
.dl-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 8px 18px;
  font-size: 17px;
  font-weight: 700;
  border-bottom: 1px solid var(--app-line);
  position: relative;
  z-index: 2;
  background: var(--app-bg);
}
.dl.browser .dl-bar {
  font-size: 16px;
}
.dl-refresh {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: var(--app-accent);
}
.dl-refresh:hover {
  background: var(--app-soft);
}
.dl-refresh:disabled {
  opacity: 0.5;
}
.dl-viewport {
  position: relative;
  flex: 1;
  overflow: hidden;
  touch-action: pan-y;
  cursor: grab;
}
.dl-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--app-ink-2);
}
.dl-indicator.anim,
.dl-list.anim {
  transition: transform 0.38s var(--ease-out), opacity 0.3s;
}
.dl-arrow {
  transition: transform 0.25s var(--ease-out);
}
.dl-indicator.ready .dl-arrow {
  transform: rotate(180deg);
}
.dl-spin {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--app-accent);
  border-right-color: transparent;
  animation: dl-spin 0.7s linear infinite;
}
@keyframes dl-spin {
  to {
    transform: rotate(360deg);
  }
}
.dl-list {
  position: relative;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  background: var(--app-bg);
}
.dl-row {
  position: relative;
  margin: 0 !important;
  overflow: hidden;
  border-bottom: 1px solid var(--app-line);
}
.dl-del {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80px;
  background: var(--app-danger);
  color: #fff;
  font-weight: 650;
}
:root.dark .dl-del {
  color: oklch(0.18 0.03 27);
}
.dl-cell {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px 10px 16px;
  background: var(--app-bg);
}
.dl-cell.anim {
  transition: transform 0.32s var(--ease-out);
}
.dl-avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: oklch(0.92 0.05 var(--h));
  color: oklch(0.38 0.12 var(--h));
  font-size: 14px;
  font-weight: 700;
}
:root.dark .dl-avatar {
  background: oklch(0.34 0.06 var(--h));
  color: oklch(0.9 0.08 var(--h));
}
.dl-text {
  display: grid;
  flex: 1;
  min-width: 0;
}
.dl-title {
  font-weight: 650;
  font-size: 14px;
}
.dl-sub {
  font-size: 12.5px;
  color: var(--app-ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dl-time {
  align-self: flex-start;
  font-size: 11.5px;
  color: var(--app-ink-2);
  font-variant-numeric: tabular-nums;
}
.dl-more {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: var(--app-ink-2);
}
.dl-more:hover {
  background: var(--app-soft);
}

.dl-item-enter-active {
  transition: transform 0.45s var(--ease-out), opacity 0.35s;
}
.dl-item-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}
.dl-item-leave-active {
  position: absolute;
  left: 0;
  right: 0;
  transition: transform 0.3s ease-in, opacity 0.25s;
}
.dl-item-leave-to {
  opacity: 0;
  transform: translateX(-40%);
}
.dl-item-move {
  transition: transform 0.4s var(--ease-out);
}
</style>
