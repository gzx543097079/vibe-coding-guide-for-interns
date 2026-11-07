<script setup lang="ts">
import { onBeforeUnmount, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

const posts = [
  { name: '林夕', time: '10 分钟前', text: '登录页的按钮加了加载状态，连点不会重复提交了。', hue: 30 },
  { name: '周拓', time: '1 小时前', text: '分页接口的 pageSize 上限改成 100，超出直接报错。', hue: 250 },
  { name: '陈一', time: '昨天', text: '周五前把单元测试覆盖率补到 80%。', hue: 150 },
]
const loading = ref(false)
let timer = 0
function reload() {
  if (loading.value) return
  loading.value = true
  timer = window.setTimeout(() => (loading.value = false), 1600)
}
onBeforeUnmount(() => window.clearTimeout(timer))

useScript(toRef(props, 'play'), [[500, () => reload()]])
</script>

<template>
  <div class="dsk" :class="frame">
    <div class="dsk-bar">
      <span>动态</span>
      <button type="button" class="dsk-reload" :disabled="loading" aria-label="重新加载" @click="reload">
        <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
    <ul class="dsk-list" :aria-busy="loading">
      <li v-for="(p, i) in posts" :key="p.name" class="dsk-row">
        <template v-if="loading">
          <span class="dsk-block dsk-avatar" aria-hidden="true" />
          <span class="dsk-text" aria-hidden="true">
            <span class="dsk-block dsk-l1" />
            <span class="dsk-block dsk-l2" />
            <span class="dsk-block dsk-l3" />
          </span>
        </template>
        <template v-else>
          <span class="dsk-avatar real in" :style="{ '--h': p.hue, '--d': `${i * 60}ms` }" aria-hidden="true">{{ p.name.slice(0, 1) }}</span>
          <span class="dsk-text in" :style="{ '--d': `${i * 60}ms` }">
            <span class="dsk-head"><b>{{ p.name }}</b><span class="dsk-time">{{ p.time }}</span></span>
            <span class="dsk-body">{{ p.text }}</span>
          </span>
        </template>
      </li>
    </ul>
    <p class="sr-only" aria-live="polite">{{ loading ? '正在加载' : '' }}</p>
  </div>
</template>

<style scoped>
.dsk {
  height: 100%;
  font-size: 14px;
}
.dsk-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 8px 18px;
  font-size: 17px;
  font-weight: 700;
  border-bottom: 1px solid var(--app-line);
}
.dsk.browser .dsk-bar {
  font-size: 16px;
}
.dsk-reload {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: var(--app-accent);
}
.dsk-reload:hover {
  background: var(--app-soft);
}
.dsk-reload:disabled {
  opacity: 0.5;
}
.dsk-list {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.dsk-row {
  display: flex;
  gap: 12px;
  min-height: 84px;
  margin: 0 !important;
  padding: 14px 18px;
  border-bottom: 1px solid var(--app-line);
}
.dsk.browser .dsk-row {
  min-height: 0;
  height: 76px;
}
.dsk-avatar {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.dsk-avatar.real {
  display: grid;
  place-items: center;
  background: oklch(0.92 0.05 var(--h));
  color: oklch(0.38 0.12 var(--h));
  font-size: 15px;
  font-weight: 700;
}
:root.dark .dsk-avatar.real {
  background: oklch(0.34 0.06 var(--h));
  color: oklch(0.9 0.08 var(--h));
}
.dsk-text {
  display: grid;
  align-content: start;
  gap: 8px;
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}
.dsk-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
  line-height: 18px;
}
.dsk-time {
  font-size: 12px;
  color: var(--app-ink-2);
}
.dsk-body {
  margin-top: -4px;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--app-ink-2);
}

/* 占位块：底色 + 一道从左到右扫过的光泽 */
.dsk-block {
  position: relative;
  display: block;
  overflow: hidden;
  background: color-mix(in oklab, var(--app-ink) 9%, var(--app-bg));
}
.dsk-block::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.55), transparent);
  transform: translateX(-100%);
  animation: dsk-shine 1400ms ease-in-out infinite;
}
:root.dark .dsk-block::after {
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.07), transparent);
}
.dsk-l1 {
  width: 40%;
  height: 12px;
  border-radius: 6px;
}
.dsk-l2 {
  width: 90%;
  height: 10px;
  border-radius: 5px;
}
.dsk-l3 {
  width: 70%;
  height: 10px;
  border-radius: 5px;
}
@keyframes dsk-shine {
  to {
    transform: translateX(100%);
  }
}
.in {
  animation: dsk-in 320ms var(--ease-out) var(--d) both;
}
@keyframes dsk-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}
</style>
