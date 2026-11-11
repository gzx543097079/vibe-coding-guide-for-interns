<script setup lang="ts">
import { nextTick, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

interface Msg {
  id: number
  me: boolean
  text: string
  quote?: string
}
const msgs = ref<Msg[]>([
  { id: 1, me: false, text: '周五的评审改到下午三点了' },
  { id: 2, me: true, text: '好的，我把演示准备好' },
  { id: 3, me: false, text: '登录页那个问题修了吗？' },
  { id: 4, me: true, text: '修了，下午合并' },
])

// 位移 = 手指位移 × 0.6，最多 64px；超过 48px 松手才算回复
const RATIO = 0.6
const MAX = 64
const THRESHOLD = 48

const dragId = ref(0)
const dx = ref(0)
const settling = ref(false)
// 过了阈值松手后，箭头保持强调色直到回弹结束
const armedId = ref(0)
const replyTo = ref<Msg | null>(null)
const draft = ref('')
const freshId = ref(0)
const input = ref<HTMLInputElement>()
const list = ref<HTMLElement>()
let startX = 0
let active = false

const who = (m: Msg) => (m.me ? '自己' : '林夕')

function down(e: PointerEvent, m: Msg) {
  if (e.button) return
  active = true
  startX = e.clientX
  dragId.value = m.id
  dx.value = 0
  settling.value = false
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function move(e: PointerEvent) {
  if (!active) return
  dx.value = Math.max(-MAX, Math.min(0, (e.clientX - startX) * RATIO))
}
function up() {
  if (!active) return
  active = false
  const hit = dx.value <= -THRESHOLD
  const m = msgs.value.find((x) => x.id === dragId.value)
  settling.value = true
  dx.value = 0
  if (hit && m) {
    armedId.value = m.id
    later(300, () => (armedId.value = 0))
    reply(m)
  }
}
function reply(m: Msg) {
  replyTo.value = m
  input.value?.focus({ preventScroll: true })
}
function send() {
  const text = draft.value.trim()
  if (!text) return
  const id = msgs.value.length + 1
  msgs.value.push({ id, me: true, text, quote: replyTo.value?.text })
  freshId.value = id
  draft.value = ''
  replyTo.value = null
  nextTick(() => list.value?.scrollTo({ top: list.value.scrollHeight }))
}

const { later } = useScript(toRef(props, 'play'), [
  [600, () => {
    dragId.value = 3
    settling.value = true
    dx.value = -MAX
  }],
  [1300, () => {
    dx.value = 0
    reply(msgs.value[2])
  }],
  [2200, () => {
    draft.value = '修好了'
    later(500, send)
  }],
])
</script>

<template>
  <div class="dsr">
    <div class="dsr-bar">林夕</div>
    <div ref="list" class="dsr-list" :class="{ quoting: replyTo }">
      <div v-for="m in msgs" :key="m.id" class="dsr-row" :class="{ me: m.me }">
        <button
          type="button"
          class="dsr-bubble"
          :class="{ settling: settling || dragId !== m.id, fresh: freshId === m.id }"
          :style="{ transform: dragId === m.id && dx ? `translateX(${dx}px)` : undefined }"
          :aria-label="`${who(m)}：${m.text}。按回车回复`"
          @pointerdown="down($event, m)"
          @pointermove="move"
          @pointerup="up"
          @pointercancel="up"
          @click="$event.detail === 0 && reply(m)"
        >
          <span v-if="m.quote" class="dsr-quote">{{ m.quote }}</span>
          {{ m.text }}
        </button>
        <span
          class="dsr-arrow"
          :class="{ armed: (dragId === m.id && dx <= -THRESHOLD) || armedId === m.id, settling: settling || dragId !== m.id }"
          :style="{
            opacity: dragId === m.id ? Math.min(-dx / THRESHOLD, 1) : 0,
            transform: `scale(${dragId === m.id ? 0.5 + 0.5 * Math.min(-dx / THRESHOLD, 1) : 0.5})`,
          }"
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.5 3.5 2.5 7.5l4 4M3 7.5h6a4 4 0 0 1 4 4v1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </div>
    </div>

    <Transition name="dsr-ref">
      <div v-if="replyTo" class="dsr-ref">
        <span class="dsr-ref-body">
          <b>回复 {{ who(replyTo) }}</b>
          <span>{{ replyTo.text }}</span>
        </span>
        <button type="button" class="dsr-ref-close" aria-label="取消回复" @click="replyTo = null">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m3 3 8 8M11 3l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
        </button>
      </div>
    </Transition>

    <form class="dsr-input" @submit.prevent="send">
      <input ref="input" v-model="draft" type="text" placeholder="发消息" aria-label="消息内容" autocomplete="off" />
      <button type="submit" class="dsr-send" :disabled="!draft.trim()" aria-label="发送">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.500 4.500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </form>
    <p class="sr-only" aria-live="polite">{{ replyTo ? `正在回复：${replyTo.text}` : '' }}</p>
  </div>
</template>

<style scoped>
.dsr {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 14px;
}
.dsr-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dsr-list {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 12px 8px;
}
.dsr-list.quoting {
  padding-bottom: 52px;
}
.dsr-row {
  position: relative;
  display: flex;
  flex: none;
}
.dsr-row.me {
  justify-content: flex-end;
}
.dsr-bubble {
  position: relative;
  z-index: 1;
  max-width: 78%;
  padding: 8px 12px;
  border-radius: 18px 18px 18px 6px;
  background: var(--app-soft);
  color: var(--app-ink);
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
  touch-action: pan-y;
  user-select: none;
  cursor: grab;
}
.dsr-row.me .dsr-bubble {
  border-radius: 18px 18px 6px 18px;
  background: var(--app-accent);
  color: var(--app-on-accent);
}
.dsr-bubble.settling {
  transition: transform 300ms var(--ease-out);
}
.dsr-bubble.fresh {
  animation: dsr-in 260ms var(--ease-out);
}
.dsr-quote {
  display: block;
  max-width: 100%;
  margin-bottom: 4px;
  padding-left: 8px;
  border-left: 2px solid currentColor;
  font-size: 12px;
  opacity: 0.75;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsr-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-top: -14px;
  border-radius: 50%;
  background: var(--app-soft);
  color: var(--app-ink-2);
  pointer-events: none;
}
.dsr-arrow.settling {
  transition: opacity 300ms var(--ease-out), transform 300ms var(--ease-out);
}
.dsr-arrow.armed {
  background: var(--app-accent);
  color: var(--app-on-accent);
}
.dsr-arrow.armed svg {
  animation: dsr-pop 200ms var(--ease-out);
}
.dsr-ref {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 8px 0 12px;
  border-top: 1px solid var(--app-line);
  background: var(--app-bg);
}
.dsr-ref-body {
  flex: 1;
  min-width: 0;
  display: grid;
  padding-left: 8px;
  border-left: 2px solid var(--app-accent);
  line-height: 1.35;
}
.dsr-ref-body b {
  font-size: 12px;
  font-weight: 700;
  color: var(--app-accent);
}
.dsr-ref-body span {
  font-size: 12px;
  color: var(--app-ink-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsr-ref-close {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--app-ink-2);
}
.dsr-ref-close:hover {
  background: var(--app-soft);
}
.dsr-ref-enter-active,
.dsr-ref-leave-active {
  transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out);
}
.dsr-ref-enter-from,
.dsr-ref-leave-to {
  transform: translateY(8px);
  opacity: 0;
}
.dsr-input {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 10px;
  border-top: 1px solid var(--app-line);
  background: var(--app-bg);
}
.dsr-input input {
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 18px;
  background: var(--app-soft);
  color: var(--app-ink);
  font: inherit;
  font-size: 14px;
  outline: 0;
}
.dsr-input input::placeholder {
  color: var(--app-ink-2);
}
.dsr-input input:focus-visible {
  box-shadow: inset 0 0 0 2px var(--app-accent);
}
.dsr-send {
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--app-accent);
  color: var(--app-on-accent);
  transition: opacity 150ms;
}
.dsr-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
@keyframes dsr-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }
}
@keyframes dsr-pop {
  50% {
    transform: scale(1.25);
  }
}
</style>
