<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

const STEPS = [12, 27, 41, 58, 73, 86, 100]
const value = ref(0)
const state = ref<'idle' | 'running' | 'paused' | 'done'>('idle')
let timer = 0

function tick() {
  const next = STEPS.find((s) => s > value.value)
  if (next === undefined) return
  value.value = next
  if (next === 100) {
    state.value = 'done'
    return
  }
  timer = window.setTimeout(tick, 500)
}
function primary() {
  if (state.value === 'running') {
    window.clearTimeout(timer)
    state.value = 'paused'
    return
  }
  if (state.value === 'done') value.value = 0
  state.value = 'running'
  timer = window.setTimeout(tick, 500)
}
function reset() {
  window.clearTimeout(timer)
  value.value = 0
  state.value = 'idle'
}
onBeforeUnmount(() => window.clearTimeout(timer))

const label = computed(() => ({ idle: '开始上传', running: '暂停', paused: '继续', done: '重新上传' })[state.value])
const done = computed(() => state.value === 'done')
// 环形进度：右半圈和左半圈各转 0～180°
const rightDeg = computed(() => Math.min(value.value, 50) * 3.6)
const leftDeg = computed(() => Math.max(value.value - 50, 0) * 3.6)

useScript(toRef(props, 'play'), [[500, () => primary()]])
</script>

<template>
  <div class="dp" :class="[frame, { done }]">
    <div class="dp-bar">上传文件</div>
    <div class="dp-body">
      <div class="dp-file">
        <div class="dp-row">
          <span class="dp-name">设计稿.fig</span>
          <span class="dp-meta">4.2 MB</span>
          <span class="dp-pct">{{ done ? '完成' : `${value}%` }}</span>
        </div>
        <div class="dp-track" role="progressbar" aria-label="设计稿.fig 上传进度" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="value">
          <span class="dp-fill" :style="{ transform: `scaleX(${value / 100})` }" />
        </div>
      </div>

      <div class="dp-file">
        <div class="dp-row">
          <span class="dp-name">录屏.mp4</span>
          <span class="dp-meta">处理中</span>
        </div>
        <div class="dp-track" role="progressbar" aria-label="录屏.mp4 处理中">
          <span class="dp-indet" />
        </div>
      </div>

      <div class="dp-sum">
        <div class="dp-ring" role="progressbar" aria-label="总进度" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="value">
          <span class="dp-half r"><span class="dp-disc" :style="{ transform: `rotate(${rightDeg}deg)` }" /></span>
          <span class="dp-half l"><span class="dp-disc" :style="{ transform: `rotate(${leftDeg}deg)` }" /></span>
          <span class="dp-hole">{{ value }}%</span>
        </div>
        <div class="dp-sum-text">
          <span class="dp-name">总进度</span>
          <span class="dp-sync"><span class="dp-spin" aria-hidden="true" />同步中</span>
        </div>
      </div>

      <div class="dp-actions">
        <button type="button" class="dp-btn primary" @click="primary">{{ label }}</button>
        <button type="button" class="dp-btn" :disabled="state === 'idle'" @click="reset">重置</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dp {
  --track: color-mix(in oklab, var(--app-ink) 10%, var(--app-bg));
  --fill: var(--app-accent);
  height: 100%;
  font-size: 14px;
}
.dp.done {
  --fill: oklch(0.52 0.13 150);
}
:root.dark .dp.done {
  --fill: oklch(0.74 0.14 150);
}
.dp-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dp.browser .dp-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dp-body {
  display: grid;
  gap: 14px;
  padding: 8px 18px;
}
.dp.browser .dp-body {
  max-width: 420px;
  padding: 14px 18px;
}
.dp-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  line-height: 20px;
}
.dp-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-ink);
}
.dp-meta {
  font-size: 12px;
  color: var(--app-ink-2);
}
.dp-pct {
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--app-ink-2);
  font-variant-numeric: tabular-nums;
}
.dp-track {
  position: relative;
  height: 6px;
  border-radius: 3px;
  background: var(--track);
  overflow: hidden;
}
.dp-fill {
  position: absolute;
  inset: 0;
  background: var(--fill);
  transform-origin: left center;
  transition: transform 320ms var(--ease-out);
}
.dp-indet {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40%;
  border-radius: 3px;
  background: var(--app-accent);
  animation: dp-indet 1200ms ease-in-out infinite;
}
@keyframes dp-indet {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}

.dp-sum {
  display: flex;
  align-items: center;
  gap: 14px;
}
.dp-ring {
  position: relative;
  flex: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--track);
  overflow: hidden;
}
.dp-half {
  position: absolute;
  top: 0;
  width: 28px;
  height: 56px;
  overflow: hidden;
}
.dp-half.r {
  left: 28px;
}
.dp-half.l {
  left: 0;
}
.dp-disc {
  position: absolute;
  top: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  transition: transform 320ms var(--ease-out);
}
.dp-half.r .dp-disc {
  left: -28px;
  background: linear-gradient(to right, var(--fill) 50%, transparent 50%);
}
.dp-half.l .dp-disc {
  left: 0;
  background: linear-gradient(to left, var(--fill) 50%, transparent 50%);
}
.dp-hole {
  position: absolute;
  inset: 5px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--app-bg);
  font-size: 13px;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  color: var(--app-ink);
}
.dp-sum-text {
  display: grid;
  gap: 4px;
}
.dp-sync {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--app-ink-2);
}
.dp-spin {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--app-accent);
  border-right-color: transparent;
  animation: dp-spin 700ms linear infinite;
}
@keyframes dp-spin {
  to {
    transform: rotate(360deg);
  }
}
.dp-actions {
  display: flex;
  gap: 10px;
}
.dp-btn {
  height: 38px;
  padding: 0 16px;
  border-radius: 10px;
  font-weight: 650;
  background: var(--app-soft);
  color: var(--app-ink);
  border: 1px solid var(--app-line);
  transition: transform 150ms var(--ease-out);
}
.dp-btn.primary {
  min-width: 96px;
  background: var(--app-accent);
  color: var(--app-on-accent);
  border-color: transparent;
}
.dp-btn:active:not(:disabled) {
  transform: scale(0.96);
}
.dp-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
