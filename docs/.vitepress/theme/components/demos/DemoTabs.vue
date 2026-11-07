<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRef, useId, watch } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const tabs = [
  { key: 'overview', label: '概览', title: '最近 7 天', lines: ['12 次提交，2 个 PR 等待审查。', '构建全部通过，平均耗时 3 分 20 秒。'] },
  { key: 'commits', label: '提交', title: 'main 分支', lines: ['fix: 修复分页参数越界', 'feat: 登录页支持记住账号'] },
  { key: 'branches', label: '分支', title: '活跃分支', lines: ['feat/search-suggest：领先 main 4 个提交', 'fix/upload-retry：已合并，可删除'] },
  { key: 'settings', label: '设置', title: '仓库设置', lines: ['默认分支：main', '合并方式：Merge commit'] },
]
const idx = ref(0)
const btns = ref<HTMLButtonElement[]>([])
const bar = reactive({ x: 0, w: 0 })
const ready = ref(false)

// 指示器宽 100px，用 translateX + scaleX 对齐到当前标签
function measure() {
  const el = btns.value[idx.value]
  if (!el) return
  bar.x = el.offsetLeft
  bar.w = el.offsetWidth
}
let ro: ResizeObserver | null = null
onMounted(async () => {
  await nextTick()
  measure()
  // 首次定位不播放动画
  requestAnimationFrame(() => (ready.value = true))
  ro = new ResizeObserver(measure)
  if (btns.value[0]?.parentElement) ro.observe(btns.value[0].parentElement)
})
onBeforeUnmount(() => ro?.disconnect())
watch(idx, () => nextTick(measure))

function go(i: number, focus = false) {
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

useScript(toRef(props, 'play'), [
  [600, () => go(1)],
  [1500, () => go(3)],
  [2400, () => go(0)],
])
</script>

<template>
  <div class="dtb" :class="frame">
    <div class="dtb-bar">vibe-guide</div>
    <div class="dtb-tabs" role="tablist" aria-label="仓库" @keydown="onKey">
      <button
        v-for="(t, i) in tabs"
        :id="`${uid}-t-${i}`"
        :key="t.key"
        ref="btns"
        type="button"
        role="tab"
        class="dtb-tab"
        :aria-selected="i === idx"
        :aria-controls="`${uid}-p`"
        :tabindex="i === idx ? 0 : -1"
        @click="go(i)"
      >
        {{ t.label }}
      </button>
      <span
        class="dtb-ind"
        :class="{ anim: ready }"
        :style="{ transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})` }"
        aria-hidden="true"
      />
    </div>
    <div :id="`${uid}-p`" class="dtb-panel" role="tabpanel" :aria-labelledby="`${uid}-t-${idx}`" tabindex="0">
      <Transition name="dtb-swap">
        <div :key="cur.key" class="dtb-content">
          <p class="dtb-title">{{ cur.title }}</p>
          <p v-for="l in cur.lines" :key="l" class="dtb-line">{{ l }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.dtb {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 14px;
}
.dtb-bar {
  padding: 12px 18px 6px;
  font-size: 17px;
  font-weight: 700;
}
.dtb.browser .dtb-bar {
  font-size: 16px;
}
.dtb-tabs {
  position: relative;
  display: flex;
  padding: 0 8px;
  border-bottom: 1px solid var(--app-line);
}
.dtb.phone .dtb-tab {
  flex: 1;
}
.dtb-tab {
  height: 40px;
  padding: 0 14px;
  font-size: 14.5px;
  font-weight: 550;
  color: var(--app-ink-2);
}
.dtb-tab:hover {
  color: var(--app-ink);
}
.dtb-tab[aria-selected='true'] {
  color: var(--app-ink);
  font-weight: 650;
}
.dtb-tab:focus-visible {
  outline-offset: -4px;
}
.dtb-ind {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--app-accent);
  transform-origin: left center;
}
.dtb-ind.anim {
  transition: transform 320ms var(--ease-out);
}
.dtb-panel {
  position: relative;
  flex: 1;
  overflow: hidden;
}
.dtb-panel:focus-visible {
  outline-offset: -4px;
}
.dtb-content {
  padding: 14px 18px;
}
.dtb-title {
  margin: 0 0 8px !important;
  font-size: 15px;
  font-weight: 700;
  color: var(--app-ink);
}
.dtb-line {
  margin: 0 0 6px !important;
  font-size: 14px;
  line-height: 1.6;
  color: var(--app-ink-2);
}
.dtb-swap-enter-active {
  transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out);
}
.dtb-swap-leave-active {
  position: absolute;
  inset: 0 0 auto;
  transition: opacity 120ms var(--ease-out);
}
.dtb-swap-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.dtb-swap-leave-to {
  opacity: 0;
}
</style>
