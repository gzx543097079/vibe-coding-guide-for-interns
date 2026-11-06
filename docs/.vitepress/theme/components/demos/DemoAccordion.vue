<script setup lang="ts">
import { nextTick, ref, toRef, useId } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const items = [
  { q: '构建失败先看哪里？', a: '先看 CI 日志里第一条报错，再在本地用同样的命令复现。' },
  { q: '提交信息怎么写？', a: '一行说清改了什么，必要时在正文写原因和影响范围。' },
  { q: '可以直接推送到 main 吗？', a: '不可以。从 main 拉功能分支，提 PR 审查后再合并。' },
  { q: '依赖升级要注意什么？', a: '看更新日志里的破坏性变更，升级后跑一遍完整测试。' },
]
const open = ref(0)
const list = ref<HTMLElement>()
const heads = ref<HTMLButtonElement[]>([])

// FLIP：高度瞬间变化，再用位移把下方各项从旧位置动画到新位置，只改 transform
async function toggle(i: number) {
  const rows = Array.from(list.value?.children ?? []) as HTMLElement[]
  const before = rows.map((r) => r.getBoundingClientRect().top)
  open.value = open.value === i ? -1 : i
  await nextTick()
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  rows.forEach((r, k) => {
    const dy = before[k] - r.getBoundingClientRect().top
    if (!dy) return
    r.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], {
      duration: 320,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    })
  })
}
function onKey(e: KeyboardEvent, i: number) {
  const n = items.length
  let j = i
  if (e.key === 'ArrowDown') j = (i + 1) % n
  else if (e.key === 'ArrowUp') j = (i - 1 + n) % n
  else if (e.key === 'Home') j = 0
  else if (e.key === 'End') j = n - 1
  else return
  e.preventDefault()
  heads.value[j]?.focus()
}

useScript(toRef(props, 'play'), [
  [600, () => toggle(1)],
  [1800, () => toggle(2)],
])
</script>

<template>
  <div class="da" :class="frame">
    <div class="da-bar">常见问题</div>
    <div ref="list" class="da-list">
      <div v-for="(it, i) in items" :key="it.q" class="da-item" :class="{ open: open === i }">
        <h3 class="da-h">
          <button
            :id="`${uid}-h-${i}`"
            ref="heads"
            type="button"
            class="da-head"
            :aria-expanded="open === i"
            :aria-controls="`${uid}-p-${i}`"
            @click="toggle(i)"
            @keydown="onKey($event, i)"
          >
            <span>{{ it.q }}</span>
            <svg class="da-chev" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </h3>
        <div v-show="open === i" :id="`${uid}-p-${i}`" class="da-panel" role="region" :aria-labelledby="`${uid}-h-${i}`">
          <p class="da-a">{{ it.a }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.da {
  height: 100%;
  font-size: 14px;
}
.da-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.da.browser .da-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.da-list {
  margin: 4px 12px;
  border: 1px solid var(--app-line);
  border-radius: 14px;
  overflow: hidden;
}
.da.browser .da-list {
  max-width: 460px;
  margin: 14px 18px;
}
.da-item {
  position: relative;
  background: var(--app-bg);
}
.da-item + .da-item {
  border-top: 1px solid var(--app-line);
}
.da-h {
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  font-size: inherit !important;
  line-height: inherit !important;
}
.da-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  min-height: 48px;
  padding: 0 14px 0 16px;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--app-ink);
  text-align: left;
}
.da-head:hover {
  background: var(--app-soft);
}
.da-head:focus-visible {
  outline-offset: -3px;
}
.da-chev {
  flex: none;
  color: var(--app-ink-2);
  transition: transform 220ms var(--ease-out);
}
.da-item.open .da-chev {
  transform: rotate(180deg);
}
.da-panel {
  animation: da-in 220ms var(--ease-out);
}
.da-a {
  margin: 0 !important;
  padding: 0 16px 14px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--app-ink-2);
}
@keyframes da-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>
