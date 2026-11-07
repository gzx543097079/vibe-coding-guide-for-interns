<script setup lang="ts">
import { computed, ref, toRef, useId } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const tabs = [
  { key: 'home', label: '首页', d: 'M2.5 7.5 8 3l5.5 4.5V13a.5.5 0 0 1-.5.5h-3v-3.5h-4v3.5H3a.5.5 0 0 1-.5-.5z' },
  { key: 'find', label: '发现', d: 'M8 1.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8zM10.6 5.4 9.3 9.3 5.4 10.6l1.3-3.9z' },
  { key: 'msg', label: '消息', d: 'M2.5 3.5h11v7.5h-6l-3 2.5V11h-2z' },
  { key: 'me', label: '我的', d: 'M8 2.5a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM2.8 13.5c.6-2.6 2.7-4 5.2-4s4.6 1.4 5.2 4' },
]
const blocks: Record<string, number[]> = {
  home: [100, 70, 86],
  find: [60, 60, 60, 60],
  msg: [92, 92, 92],
  me: [40, 100, 100],
}

const idx = ref(0)
const dir = ref(1)
const btns = ref<HTMLButtonElement[]>([])

useScript(toRef(props, 'play'), [
  [600, () => go(1)],
  [1500, () => go(2)],
  [2400, () => go(0)],
])

function go(i: number, focus = false) {
  if (i === idx.value) return
  dir.value = i > idx.value ? 1 : -1
  idx.value = i
  if (focus) btns.value[i]?.focus()
}
function onKey(e: KeyboardEvent) {
  const n = tabs.length
  let i = idx.value
  if (e.key === 'ArrowRight') i = (i + 1) % n
  else if (e.key === 'ArrowLeft') i = (i - 1 + n) % n
  else if (e.key === 'Home') i = 0
  else if (e.key === 'End') i = n - 1
  else return
  e.preventDefault()
  go(i, true)
}
const cur = computed(() => tabs[idx.value])
</script>

<template>
  <div class="dt" :class="[frame, dir > 0 ? 'fwd' : 'back']">
    <div
      class="dt-bar"
      role="tablist"
      aria-label="主导航"
      :style="{ '--i': idx, '--n': tabs.length }"
      @keydown="onKey"
    >
      <span class="dt-pill" aria-hidden="true" />
      <button
        v-for="(t, i) in tabs"
        :id="`${uid}-t-${i}`"
        :key="t.key"
        ref="btns"
        type="button"
        role="tab"
        class="dt-tab"
        :aria-selected="i === idx"
        :aria-controls="`${uid}-p`"
        :tabindex="i === idx ? 0 : -1"
        @click="go(i)"
      >
        <svg :key="i === idx ? 'on' : 'off'" class="dt-ico" width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
          <path :d="t.d" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round" />
        </svg>
        <span class="dt-label">{{ t.label }}</span>
      </button>
    </div>

    <div :id="`${uid}-p`" class="dt-page" role="tabpanel" :aria-labelledby="`${uid}-t-${idx}`">
      <Transition name="dt-swap" mode="out-in">
        <div :key="cur.key" class="dt-content">
          <p class="dt-title">{{ cur.label }}</p>
          <div class="dt-blocks" :class="cur.key">
            <span v-for="(w, i) in blocks[cur.key]" :key="i" class="dt-block" :style="{ width: `${w}%` }" />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.dt {
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  font-size: 14px;
}
.dt.browser {
  flex-direction: column;
}
.dt-page {
  position: relative;
  flex: 1;
  overflow: hidden;
}
.dt-content {
  padding: 12px 18px;
}
.dt-title {
  margin: 0 0 14px !important;
  font-size: 22px;
  font-weight: 750;
  letter-spacing: -0.01em;
}
.dt-blocks {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.dt-block {
  height: 64px;
  border-radius: 14px;
  background: var(--app-soft);
  border: 1px solid var(--app-line);
}
.dt-blocks.find .dt-block {
  width: calc(50% - 5px) !important;
  height: 92px;
}
.dt-blocks.msg .dt-block {
  height: 52px;
}
.dt-blocks.me .dt-block:first-child {
  width: 64px !important;
  height: 64px;
  border-radius: 50%;
}

.dt-bar {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--n), 1fr);
  padding: 6px 8px 4px;
  border-top: 1px solid var(--app-line);
  background: color-mix(in oklab, var(--app-bg) 92%, var(--app-soft));
}
.dt.browser .dt-bar {
  display: flex;
  gap: 4px;
  padding: 8px 14px;
  border-top: 0;
  border-bottom: 1px solid var(--app-line);
}
.dt-pill {
  position: absolute;
  top: 6px;
  left: 8px;
  width: calc((100% - 16px) / var(--n));
  height: 34px;
  display: flex;
  justify-content: center;
  transform: translateX(calc(var(--i) * 100%));
  transition: transform 0.4s var(--ease-out);
}
.dt-pill::before {
  content: '';
  width: 56px;
  height: 100%;
  border-radius: 17px;
  background: color-mix(in oklab, var(--app-accent) 16%, transparent);
}
.dt.browser .dt-pill {
  display: none;
}
.dt-tab {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 1px;
  padding: 6px 0 2px;
  color: var(--app-ink-2);
  border-radius: 10px;
}
.dt.browser .dt-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
}
.dt.browser .dt-tab[aria-selected='true'] {
  background: color-mix(in oklab, var(--app-accent) 14%, transparent);
}
.dt-tab[aria-selected='true'] {
  color: var(--app-accent);
}
.dt-tab[aria-selected='true'] .dt-ico {
  animation: dt-pop 0.45s var(--ease-out);
}
.dt-tab[aria-selected='true'] .dt-ico path {
  stroke-width: 1.7;
}
.dt-label {
  font-size: 11px;
  font-weight: 600;
}
.dt.browser .dt-label {
  font-size: 13.5px;
}
.dt-tab:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: -2px;
}
@keyframes dt-pop {
  0% {
    transform: scale(0.8) translateY(2px);
  }
  60% {
    transform: scale(1.12) translateY(-1px);
  }
}

.dt-swap-enter-active {
  transition: transform 0.32s var(--ease-out), opacity 0.25s;
}
.dt-swap-leave-active {
  transition: transform 0.16s ease-in, opacity 0.16s;
}
.dt.fwd .dt-swap-enter-from {
  transform: translateX(18px);
  opacity: 0;
}
.dt.back .dt-swap-enter-from {
  transform: translateX(-18px);
  opacity: 0;
}
.dt.fwd .dt-swap-leave-to {
  transform: translateX(-12px);
  opacity: 0;
}
.dt.back .dt-swap-leave-to {
  transform: translateX(12px);
  opacity: 0;
}
</style>
