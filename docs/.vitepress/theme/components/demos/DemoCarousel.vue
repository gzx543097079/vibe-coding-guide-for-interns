<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRef, useId, watch } from 'vue'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const slides = [
  { title: '本周精选', sub: '5 篇提示词实践', hue: 30 },
  { title: '上手指南', sub: '从环境安装开始', hue: 150 },
  { title: '控件专题', sub: '17 个常用控件', hue: 250 },
  { title: '排错手册', sub: '读报错的顺序', hue: 330 },
]
const idx = ref(0)
const dx = ref(0)
const dragging = ref(false)
const paused = ref(false)
const hovering = ref(false)
const focusWithin = ref(false)
const viewport = ref<HTMLElement>()
const n = slides.length

function go(i: number) {
  idx.value = Math.max(0, Math.min(n - 1, i))
}

// 自动播放：每 4 秒下一张，到最后一张回到第一张；悬停、聚焦、拖动或手动暂停时停止
let timer = 0
const running = computed(() => props.play && !paused.value && !hovering.value && !focusWithin.value && !dragging.value)
function schedule() {
  window.clearInterval(timer)
  if (!running.value) return
  timer = window.setInterval(() => (idx.value = (idx.value + 1) % n), 4000)
}
watch(running, schedule)
onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) paused.value = true
  schedule()
})
onBeforeUnmount(() => window.clearInterval(timer))

// 拖动：跟手移动，首尾两端加阻尼；松手时超过宽度 20% 翻页
let startX = 0
let width = 1
function down(e: PointerEvent) {
  if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return
  startX = e.clientX
  width = viewport.value?.offsetWidth ?? 1
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}
function move(e: PointerEvent) {
  if (!dragging.value) return
  let d = e.clientX - startX
  if ((idx.value === 0 && d > 0) || (idx.value === n - 1 && d < 0)) d *= 0.35
  dx.value = d
}
function up() {
  if (!dragging.value) return
  if (dx.value < -width * 0.2) go(idx.value + 1)
  else if (dx.value > width * 0.2) go(idx.value - 1)
  dx.value = 0
  dragging.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') go(idx.value + 1)
  else if (e.key === 'ArrowLeft') go(idx.value - 1)
  else return
  e.preventDefault()
}
</script>

<template>
  <div class="dcr" :class="frame">
    <div class="dcr-bar">精选</div>
    <section
      class="dcr-wrap"
      aria-roledescription="carousel"
      aria-label="精选内容"
      @pointerenter="hovering = true"
      @pointerleave="hovering = false"
      @focusin="focusWithin = true"
      @focusout="focusWithin = false"
      @keydown="onKey"
    >
      <div
        ref="viewport"
        class="dcr-viewport"
        @pointerdown="down"
        @pointermove="move"
        @pointerup="up"
        @pointercancel="up"
      >
        <div
          class="dcr-track"
          :class="{ anim: !dragging }"
          :style="{ transform: `translateX(calc(${-idx * 100}% + ${dx}px))` }"
          :aria-live="running ? 'off' : 'polite'"
        >
          <div
            v-for="(s, i) in slides"
            :key="s.title"
            class="dcr-slide"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${i + 1} / ${n}`"
            :aria-hidden="i !== idx"
            :style="{ '--h': s.hue }"
          >
            <p class="dcr-title">{{ s.title }}</p>
            <p class="dcr-sub">{{ s.sub }}</p>
          </div>
        </div>
        <button type="button" class="dcr-nav prev" :disabled="idx === 0" aria-label="上一张" @click="go(idx - 1)">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <button type="button" class="dcr-nav next" :disabled="idx === n - 1" aria-label="下一张" @click="go(idx + 1)">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
      </div>
      <div class="dcr-foot">
        <div class="dcr-dots">
          <button
            v-for="(s, i) in slides"
            :key="s.title"
            type="button"
            class="dcr-dot"
            :class="{ on: i === idx }"
            :aria-label="`第 ${i + 1} 张：${s.title}`"
            :aria-current="i === idx || undefined"
            @click="go(i)"
          >
            <span />
          </button>
        </div>
        <button type="button" class="dcr-pause" :aria-label="paused ? '开始自动播放' : '暂停自动播放'" @click="paused = !paused">
          <svg v-if="paused" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 2.2v7.6L9.8 6z" fill="currentColor" /></svg>
          <svg v-else width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" /></svg>
        </button>
      </div>
    </section>
    <p :id="`${uid}-hint`" class="dcr-hint">拖动或用左右方向键切换。</p>
  </div>
</template>

<style scoped>
.dcr {
  height: 100%;
  font-size: 14px;
}
.dcr-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dcr.browser .dcr-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dcr-wrap {
  padding: 4px 16px 0;
}
.dcr.browser .dcr-wrap {
  max-width: 460px;
  padding: 16px 18px 0;
}
.dcr-viewport {
  position: relative;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
}
.dcr-track {
  display: flex;
  height: 100%;
}
.dcr-track.anim {
  transition: transform 420ms var(--ease-out);
}
.dcr-slide {
  flex: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  padding: 16px 18px;
  background: oklch(0.9 0.05 var(--h));
  color: oklch(0.32 0.1 var(--h));
}
:root.dark .dcr-slide {
  background: oklch(0.36 0.06 var(--h));
  color: oklch(0.92 0.06 var(--h));
}
.dcr-title {
  margin: 0 !important;
  font-size: 20px;
  font-weight: 750;
  line-height: 1.3;
}
.dcr-sub {
  margin: 2px 0 0 !important;
  font-size: 13px;
  opacity: 0.85;
}
.dcr-nav {
  position: absolute;
  top: 50%;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin-top: -16px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--app-bg) 88%, transparent);
  color: var(--app-ink);
  box-shadow: 0 2px 8px -2px rgb(20 20 19 / 0.25);
  transition: transform 150ms var(--ease-out), opacity 150ms var(--ease-out);
}
.dcr-nav.prev {
  left: 8px;
}
.dcr-nav.next {
  right: 8px;
}
.dcr-nav:active:not(:disabled) {
  transform: scale(0.92);
}
.dcr-nav:disabled {
  opacity: 0;
  pointer-events: none;
}
.dcr-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}
.dcr-dots {
  display: flex;
}
.dcr-dot {
  display: grid;
  place-items: center;
  width: 20px;
  height: 24px;
}
.dcr-dot span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--app-ink);
  opacity: 0.22;
  transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out);
}
.dcr-dot.on span {
  opacity: 1;
  transform: scale(1.35);
}
.dcr-pause {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: var(--app-ink-2);
  border: 1px solid var(--app-line);
}
.dcr-pause:hover {
  color: var(--app-ink);
}
.dcr-hint {
  margin: 10px 18px 0 !important;
  font-size: 12.5px;
  text-align: center;
  color: var(--app-ink-2);
}
</style>
