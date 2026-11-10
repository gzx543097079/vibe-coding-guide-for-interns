<script setup lang="ts">
import { nextTick, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

const hues = [30, 150, 250, 85, 330, 200]
// 向下拖过 80px 松手就关闭
const CLOSE_AT = 80

const openIdx = ref(-1)
// 大图的 transform、圆角、遮罩透明度都由状态直接给出；animate 决定这次变化要不要过渡
const tf = ref('none')
const radius = ref(0)
const dim = ref(0)
const animate = ref(false)
const closing = ref(false)
const root = ref<HTMLElement>()
const full = ref<HTMLElement>()
const closeBtn = ref<HTMLElement>()
let sx = 0
let sy = 0
let dragging = false
let dy = 0
let timer = 0

const thumb = (i: number) => root.value!.querySelector<HTMLElement>(`[data-thumb="${i}"]`)!

/** 把大图摆回缩略图位置所需的 transform 和圆角 */
function toThumb(i: number) {
  const a = thumb(i).getBoundingClientRect()
  const b = full.value!.getBoundingClientRect()
  const s = a.width / b.width
  return {
    t: `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${s})`,
    r: 10 / s,
  }
}

async function open(i: number) {
  if (openIdx.value >= 0) return
  window.clearTimeout(timer)
  closing.value = false
  animate.value = false
  tf.value = 'none'
  openIdx.value = i
  await nextTick()
  const from = toThumb(i)
  tf.value = from.t
  radius.value = from.r
  dim.value = 0
  await nextTick()
  void full.value!.offsetWidth
  animate.value = true
  tf.value = 'none'
  radius.value = 0
  dim.value = 1
  closeBtn.value?.focus({ preventScroll: true })
}

function close() {
  const i = openIdx.value
  if (i < 0 || closing.value) return
  // 先去掉当前 transform 再量位置，否则拖动中的位移会算进去
  const keep = tf.value
  animate.value = false
  tf.value = 'none'
  full.value!.style.transform = 'none'
  const to = toThumb(i)
  full.value!.style.transform = keep
  tf.value = keep
  void full.value!.offsetWidth
  closing.value = true
  animate.value = true
  tf.value = to.t
  radius.value = to.r
  dim.value = 0
  timer = window.setTimeout(() => {
    openIdx.value = -1
    closing.value = false
    nextTick(() => thumb(i).focus({ preventScroll: true }))
  }, 280)
}

function down(e: PointerEvent) {
  if (e.button || closing.value) return
  dragging = true
  sx = e.clientX
  sy = e.clientY
  dy = 0
  animate.value = false
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function move(e: PointerEvent) {
  if (!dragging) return
  const x = e.clientX - sx
  dy = e.clientY - sy
  const down = Math.max(dy, 0)
  tf.value = `translate(${x}px, ${dy}px) scale(${1 - Math.min(down / 500, 0.3)})`
  dim.value = 1 - Math.min(down / 200, 1) * 0.7
}
function up() {
  if (!dragging) return
  dragging = false
  if (dy > CLOSE_AT) return close()
  animate.value = true
  tf.value = 'none'
  dim.value = 1
}

useScript(toRef(props, 'play'), [
  [700, () => open(1)],
  [2400, close],
])
</script>

<template>
  <div ref="root" class="dzm">
    <div class="dzm-bar">相册</div>
    <div class="dzm-grid">
      <button
        v-for="(h, i) in hues"
        :key="h"
        type="button"
        class="dzm-thumb"
        :class="{ away: openIdx === i }"
        :style="{ '--h': h }"
        :data-thumb="i"
        :aria-label="`查看第 ${i + 1} 张照片`"
        @click="open(i)"
      >{{ i + 1 }}</button>
    </div>

    <div
      v-if="openIdx >= 0"
      class="dzm-viewer"
      :class="{ animate, closing }"
      role="dialog"
      aria-modal="true"
      :aria-label="`第 ${openIdx + 1} 张照片，共 ${hues.length} 张`"
      @keydown.esc="close"
    >
      <div class="dzm-dim" :style="{ opacity: dim }" />
      <div class="dzm-top" :style="{ opacity: dim }">
        <span>{{ openIdx + 1 }} / {{ hues.length }}</span>
        <button ref="closeBtn" type="button" class="dzm-close" aria-label="关闭" @click="close">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m3 3 8 8M11 3l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
        </button>
      </div>
      <div
        ref="full"
        class="dzm-full"
        :style="{ '--h': hues[openIdx], transform: tf, borderRadius: radius + 'px' }"
        @pointerdown="down"
        @pointermove="move"
        @pointerup="up"
        @pointercancel="up"
      >{{ openIdx + 1 }}</div>
    </div>
  </div>
</template>

<style scoped>
.dzm {
  position: relative;
  height: 100%;
  overflow: hidden;
  font-size: 14px;
}
.dzm-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dzm-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 4px 18px;
}
.dzm-thumb,
.dzm-full {
  display: grid;
  place-items: center;
  background: oklch(0.88 0.05 var(--h));
  color: oklch(0.38 0.12 var(--h) / 0.55);
  font-weight: 700;
  line-height: 1;
}
:root.dark .dzm-thumb,
:root.dark .dzm-full {
  background: oklch(0.38 0.06 var(--h));
  color: oklch(0.9 0.08 var(--h) / 0.55);
}
.dzm-thumb {
  aspect-ratio: 1;
  border-radius: 10px;
  font-size: 20px;
}
.dzm-thumb.away {
  visibility: hidden;
}
.dzm-viewer {
  position: absolute;
  inset: 0;
  z-index: 5;
}
.dzm-dim {
  position: absolute;
  inset: 0;
  background: #000;
}
.dzm-top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  height: 48px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.dzm-close {
  position: absolute;
  right: 10px;
  top: 8px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.16);
  color: #fff;
}
.dzm-close:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}
.dzm-full {
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  aspect-ratio: 1;
  margin-top: -50%;
  font-size: 74px;
  touch-action: none;
  user-select: none;
  cursor: grab;
}
.dzm-viewer.animate .dzm-full {
  transition: transform 320ms var(--ease-out), border-radius 320ms var(--ease-out);
}
.dzm-viewer.animate .dzm-dim,
.dzm-viewer.animate .dzm-top {
  transition: opacity 320ms var(--ease-out);
}
.dzm-viewer.closing .dzm-full,
.dzm-viewer.closing .dzm-dim,
.dzm-viewer.closing .dzm-top {
  transition-duration: 280ms;
}
</style>
