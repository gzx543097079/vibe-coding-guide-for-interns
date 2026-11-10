<script setup lang="ts">
import { nextTick, reactive, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

const msgs = [
  { id: 1, me: false, text: '新版本今晚发布' },
  { id: 2, me: true, text: '收到，我来盯发布' },
  { id: 3, me: false, text: '辛苦了，发完早点休息' },
]
const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏']
const HOLD = 450

const openId = ref(0)
const pressId = ref(0)
const picked = reactive<Record<number, string>>({})
const root = ref<HTMLElement>()
let timer = 0
let sx = 0
let sy = 0

function down(e: PointerEvent, id: number) {
  if (e.button || openId.value) return
  sx = e.clientX
  sy = e.clientY
  pressId.value = id
  timer = window.setTimeout(() => open(id), HOLD)
}
function move(e: PointerEvent) {
  if (pressId.value && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) cancel()
}
function cancel() {
  window.clearTimeout(timer)
  pressId.value = 0
}
function open(id: number) {
  cancel()
  openId.value = id
  nextTick(() => root.value?.querySelector<HTMLElement>('.drx-emoji')?.focus({ preventScroll: true }))
}
function close() {
  const id = openId.value
  if (!id) return
  openId.value = 0
  nextTick(() => root.value?.querySelector<HTMLElement>(`[data-msg="${id}"]`)?.focus({ preventScroll: true }))
}
function pick(e: string) {
  const id = openId.value
  if (picked[id] === e) delete picked[id]
  else picked[id] = e
  close()
}

useScript(toRef(props, 'play'), [
  [600, () => (pressId.value = 3)],
  [1050, () => open(3)],
  [1900, () => pick('❤️')],
])
</script>

<template>
  <div ref="root" class="drx" @keydown.esc="close">
    <div class="drx-bar">林夕</div>
    <div class="drx-list">
      <div v-for="m in msgs" :key="m.id" class="drx-row" :class="{ me: m.me, lifted: openId === m.id }">
        <Transition name="drx-pop">
          <div v-if="openId === m.id" class="drx-menu" role="group" aria-label="选择回应">
            <button
              v-for="(e, i) in emojis"
              :key="e"
              type="button"
              class="drx-emoji"
              :class="{ on: picked[m.id] === e }"
              :style="{ '--i': i }"
              :aria-label="`回应 ${e}`"
              :aria-pressed="picked[m.id] === e"
              @click="pick(e)"
            >{{ e }}</button>
          </div>
        </Transition>
        <button
          type="button"
          class="drx-bubble"
          :class="{ pressing: pressId === m.id }"
          :data-msg="m.id"
          :aria-label="`${m.me ? '自己' : '林夕'}：${m.text}。按回车添加回应`"
          aria-haspopup="true"
          :aria-expanded="openId === m.id"
          @pointerdown="down($event, m.id)"
          @pointermove="move"
          @pointerup="cancel"
          @pointerleave="cancel"
          @pointercancel="cancel"
          @contextmenu.prevent="open(m.id)"
          @click="$event.detail === 0 && open(m.id)"
        >{{ m.text }}</button>
        <Transition name="drx-badge" mode="out-in">
          <button
            v-if="picked[m.id]"
            :key="picked[m.id]"
            type="button"
            class="drx-badge"
            :aria-label="`取消回应 ${picked[m.id]}`"
            @click="delete picked[m.id]"
          >
            <span aria-hidden="true">{{ picked[m.id] }}</span><b aria-hidden="true">1</b>
          </button>
        </Transition>
      </div>
    </div>
    <Transition name="drx-dim">
      <div v-if="openId" class="drx-dim" @click="close" />
    </Transition>
    <p class="sr-only" aria-live="polite">{{ openId ? '已打开回应选择' : '' }}</p>
  </div>
</template>

<style scoped>
.drx {
  position: relative;
  height: 100%;
  font-size: 14px;
  overflow: hidden;
}
.drx-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.drx-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 12px 8px;
}
.drx-row {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.drx-row.me {
  align-items: flex-end;
}
.drx-row.lifted {
  z-index: 2;
}
.drx-bubble {
  max-width: 78%;
  padding: 8px 12px;
  border-radius: 18px 18px 18px 6px;
  background: var(--app-soft);
  color: var(--app-ink);
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
  user-select: none;
  -webkit-touch-callout: none;
  transition: transform 150ms var(--ease-out);
}
.drx-row.me .drx-bubble {
  border-radius: 18px 18px 6px 18px;
  background: var(--app-accent);
  color: var(--app-on-accent);
}
.drx-bubble.pressing {
  transform: scale(0.96);
  transition-duration: 450ms;
}
.drx-menu {
  position: absolute;
  left: 0;
  bottom: calc(100% + 8px);
  display: flex;
  gap: 2px;
  padding: 5px 6px;
  border-radius: 999px;
  background: var(--app-bg);
  box-shadow: 0 6px 24px rgb(0 0 0 / 0.18), 0 0 0 1px var(--app-line);
  transform-origin: 24px 100%;
}
.drx-row.me .drx-menu {
  left: auto;
  right: 0;
  transform-origin: calc(100% - 24px) 100%;
}
.drx-emoji {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  transition: transform 150ms var(--ease-out);
  animation: drx-emoji-in 260ms var(--ease-out) backwards;
  animation-delay: calc(var(--i) * 30ms);
}
.drx-emoji:hover,
.drx-emoji:focus-visible {
  transform: scale(1.25) translateY(-2px);
}
.drx-emoji.on {
  background: var(--app-soft);
}
.drx-badge {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  margin: -6px 10px 0;
  padding: 0 8px 0 6px;
  border: 1px solid var(--app-accent);
  border-radius: 12px;
  background: color-mix(in oklab, var(--app-accent) 14%, var(--app-bg));
  font-size: 14px;
  line-height: 1;
}
.drx-badge b {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-accent);
}
.drx-dim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgb(0 0 0 / 0.28);
}
.drx-dim-enter-active,
.drx-dim-leave-active {
  transition: opacity 180ms var(--ease-out);
}
.drx-dim-enter-from,
.drx-dim-leave-to {
  opacity: 0;
}
.drx-pop-enter-active {
  transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out);
}
.drx-pop-leave-active {
  transition: transform 140ms ease-in, opacity 140ms ease-in;
}
.drx-pop-enter-from,
.drx-pop-leave-to {
  transform: scale(0.6);
  opacity: 0;
}
.drx-badge-enter-active {
  animation: drx-badge-in 350ms var(--ease-out);
}
.drx-badge-leave-active {
  transition: transform 160ms ease-in, opacity 160ms ease-in;
}
.drx-badge-leave-to {
  transform: scale(0);
  opacity: 0;
}
@keyframes drx-emoji-in {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
}
@keyframes drx-badge-in {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
