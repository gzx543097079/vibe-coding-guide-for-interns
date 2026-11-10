<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

const items = [
  { h: 250, title: '今天的构建通过了', sub: '主分支 12 个检查全部通过' },
  { h: 150, title: '新成员加入', sub: '欢迎两位实习生加入前端组' },
  { h: 30, title: '周五下午评审', sub: '三点，线上会议室' },
  { h: 330, title: '本周合并 18 个 PR', sub: '比上周多 5 个' },
]
// 每段 4 秒；按住超过 250ms 算暂停，不到算点击
const DURATION = 4000
const TAP = 250

const index = ref(0)
const progress = ref(0)
const paused = ref(false)
const holding = ref(false)
let elapsed = 0
let last = 0
let raf = 0
let downAt = 0

function go(i: number) {
  index.value = (i + items.length) % items.length
  elapsed = 0
  progress.value = 0
}
const next = () => go(index.value + 1)
// 第一段再往前就重播第一段
const prev = () => go(Math.max(index.value - 1, 0))

function tick(now: number) {
  if (last && !paused.value && !holding.value) {
    elapsed += now - last
    if (elapsed >= DURATION) next()
    else progress.value = elapsed / DURATION
  }
  last = now
  raf = requestAnimationFrame(tick)
}
onMounted(() => (raf = requestAnimationFrame(tick)))
onBeforeUnmount(() => cancelAnimationFrame(raf))

function down(e: PointerEvent) {
  if (e.button) return
  downAt = performance.now()
  holding.value = true
}
function up(dir: 1 | -1) {
  if (!holding.value) return
  holding.value = false
  if (performance.now() - downAt < TAP) dir > 0 ? next() : prev()
}
function key(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

useScript(toRef(props, 'play'), [
  [1200, next],
  [2400, next],
])
</script>

<template>
  <div
    class="dst"
    :class="{ holding }"
    :style="{ '--h': items[index].h }"
    role="group"
    aria-label="快拍"
    @keydown="key"
  >
    <div class="dst-top">
      <div class="dst-bars" aria-hidden="true">
        <span v-for="(it, i) in items" :key="it.h">
          <i :style="{ transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})` }" />
        </span>
      </div>
      <div class="dst-head">
        <span class="dst-avatar" aria-hidden="true">林</span>
        <b>林夕</b>
        <span class="dst-time">2 小时前</span>
        <button
          type="button"
          class="dst-toggle"
          :aria-label="paused ? '继续播放' : '暂停'"
          :aria-pressed="paused"
          @click="paused = !paused"
        >
          <svg v-if="paused" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2.500v9l7.500-4.500z" /></svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.500 2.500h2.500v9H3.500zM8 2.500h2.500v9H8z" /></svg>
        </button>
      </div>
    </div>

    <div :key="index" class="dst-body" aria-live="polite">
      <strong>{{ items[index].title }}</strong>
      <span>{{ items[index].sub }}</span>
    </div>

    <button
      type="button"
      class="dst-zone prev"
      aria-label="上一条"
      @pointerdown="down"
      @pointerup="up(-1)"
      @pointerleave="holding = false"
      @pointercancel="holding = false"
      @click="$event.detail === 0 && prev()"
    />
    <button
      type="button"
      class="dst-zone next"
      aria-label="下一条"
      @pointerdown="down"
      @pointerup="up(1)"
      @pointerleave="holding = false"
      @pointercancel="holding = false"
      @click="$event.detail === 0 && next()"
    />
  </div>
</template>

<style scoped>
.dst {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: oklch(0.55 0.13 var(--h));
  color: #fff;
  font-size: 14px;
  user-select: none;
  -webkit-touch-callout: none;
}
.dst-top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  padding: 10px 10px 0;
  transition: opacity 200ms var(--ease-out);
  pointer-events: none;
}
.dst.holding .dst-top {
  opacity: 0;
}
.dst-bars {
  display: flex;
  gap: 4px;
}
.dst-bars span {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.35);
  overflow: hidden;
}
.dst-bars i {
  display: block;
  height: 100%;
  background: #fff;
  transform-origin: 0 50%;
}
.dst-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 0 2px;
  font-size: 13px;
}
.dst-avatar {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.22);
  font-size: 13px;
  font-weight: 700;
}
.dst-head b {
  font-weight: 600;
}
.dst-time {
  font-size: 12px;
  opacity: 0.7;
}
.dst-toggle {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-left: auto;
  border-radius: 50%;
  color: #fff;
  pointer-events: auto;
}
.dst-toggle:hover {
  background: rgb(255 255 255 / 0.18);
}
.dst-toggle svg {
  fill: currentColor;
}
.dst-toggle:focus-visible,
.dst-zone:focus-visible {
  outline: 2px solid #fff;
  outline-offset: -4px;
}
.dst-body {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 50%;
  display: grid;
  gap: 8px;
  transform: translateY(-50%);
  animation: dst-in 280ms var(--ease-out);
}
.dst-body strong {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.3;
}
.dst-body span {
  font-size: 13px;
  opacity: 0.8;
}
.dst-zone {
  position: absolute;
  top: 64px;
  bottom: 0;
  z-index: 1;
  border-radius: 0;
}
.dst-zone.prev {
  left: 0;
  width: 32%;
}
.dst-zone.next {
  right: 0;
  width: 68%;
}
@keyframes dst-in {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(1.04);
  }
}
</style>
