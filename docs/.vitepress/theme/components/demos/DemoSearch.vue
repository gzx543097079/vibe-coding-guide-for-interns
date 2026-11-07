<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, useId } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const docs = [
  'Git 基础', 'GitHub 与 PR 协作', '改写历史', '分支模型与发布', '提示词基础', '提示词反模式',
  '前端性能', '后端性能', '数据库性能', '代码审查', '调试与排错', '安全与规范',
]
const recent = ['分支模型', '性能', 'MCP']

const query = ref('')
const settled = ref('') // 防抖后的查询词
const open = ref(false)
const active = ref(-1)
const picked = ref('')
const input = ref<HTMLInputElement>()
let timer = 0

const results = computed(() => {
  const q = settled.value.trim().toLowerCase()
  if (!q) return recent
  return docs.filter((d) => d.toLowerCase().includes(q)).slice(0, 6)
})
const isRecent = computed(() => !settled.value.trim())

function onInput() {
  open.value = true
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    settled.value = query.value
    active.value = -1
  }, 150)
}
onBeforeUnmount(() => window.clearTimeout(timer))

// 把匹配部分拆出来加粗
function parts(text: string) {
  const q = settled.value.trim()
  if (!q || isRecent.value) return [{ t: text, hit: false }]
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return [{ t: text, hit: false }]
  return [
    { t: text.slice(0, i), hit: false },
    { t: text.slice(i, i + q.length), hit: true },
    { t: text.slice(i + q.length), hit: false },
  ].filter((p) => p.t)
}

function choose(text: string) {
  query.value = text
  settled.value = text
  picked.value = text
  open.value = false
  active.value = -1
}
function onKey(e: KeyboardEvent) {
  const n = results.value.length
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!open.value) {
      open.value = true
      return
    }
    if (!n) return
    const d = e.key === 'ArrowDown' ? 1 : -1
    active.value = active.value < 0 ? (d > 0 ? 0 : n - 1) : (active.value + d + n) % n
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (open.value && active.value >= 0) choose(results.value[active.value])
    else if (query.value.trim()) choose(query.value.trim())
  } else if (e.key === 'Escape') {
    e.preventDefault()
    if (open.value) open.value = false
    else clear()
  }
}
async function clear() {
  query.value = ''
  settled.value = ''
  active.value = -1
  await nextTick()
  input.value?.focus()
}

useScript(toRef(props, 'play'), [
  [400, () => (open.value = true)],
  [900, () => {
    query.value = '性'
    onInput()
  }],
  [1200, () => {
    query.value = '性能'
    onInput()
  }],
  [1900, () => (active.value = 1)],
  [2600, () => choose(results.value[1])],
])
</script>

<template>
  <div class="dse" :class="frame">
    <div class="dse-bar">搜索</div>
    <div class="dse-body">
      <div class="dse-box">
        <svg class="dse-ico" width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="M10.4 10.4 13.5 13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
        <input
          ref="input"
          v-model="query"
          class="dse-input"
          type="text"
          role="combobox"
          placeholder="搜索文档"
          autocomplete="off"
          aria-label="搜索文档"
          aria-autocomplete="list"
          :aria-expanded="open"
          :aria-controls="`${uid}-lb`"
          :aria-activedescendant="open && active >= 0 ? `${uid}-o-${active}` : undefined"
          @input="onInput"
          @focus="open = true"
          @blur="open = false"
          @keydown="onKey"
        />
        <button v-if="query" type="button" class="dse-clear" aria-label="清除" @mousedown.prevent @click="clear">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2l6 6M8 2 2 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
        </button>
      </div>

      <Transition name="dse-pop">
        <div v-if="open" class="dse-panel">
          <p v-if="isRecent" class="dse-head">最近搜索</p>
          <ul v-if="results.length" :id="`${uid}-lb`" class="dse-list" role="listbox" aria-label="搜索建议">
            <li
              v-for="(r, i) in results"
              :id="`${uid}-o-${i}`"
              :key="r"
              role="option"
              class="dse-opt"
              :class="{ active: i === active }"
              :aria-selected="i === active"
              @mousedown.prevent
              @pointerenter="active = i"
              @click="choose(r)"
            >
              <svg v-if="isRecent" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="M8 5v3.2l2 1.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
              <svg v-else width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="M10.4 10.4 13.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
              <span class="dse-text"><template v-for="(p, k) in parts(r)" :key="k"><b v-if="p.hit">{{ p.t }}</b><template v-else>{{ p.t }}</template></template></span>
            </li>
          </ul>
          <p v-else class="dse-empty">没有找到「{{ settled }}」，换个关键词试试。</p>
        </div>
      </Transition>
      <p class="dse-result" aria-live="polite">{{ picked ? `已打开：${picked}` : '' }}</p>
    </div>
  </div>
</template>

<style scoped>
.dse {
  height: 100%;
  font-size: 14px;
}
.dse-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dse.browser .dse-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dse-body {
  position: relative;
  padding: 4px 16px;
}
.dse.browser .dse-body {
  max-width: 420px;
  padding: 14px 18px;
}
.dse-box {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--app-line);
  background: var(--app-soft);
}
.dse-box:focus-within {
  border-color: var(--app-accent);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--app-accent) 18%, transparent);
}
.dse-ico {
  position: absolute;
  left: 12px;
  color: var(--app-ink-2);
  pointer-events: none;
}
.dse-input {
  width: 100%;
  height: 100%;
  padding: 0 40px 0 38px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--app-ink);
  font-size: 15px;
  caret-color: var(--app-accent);
}
.dse-input::placeholder {
  color: var(--app-ink-2);
}
.dse-clear {
  position: absolute;
  right: 10px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--app-ink) 14%, var(--app-soft));
  color: var(--app-ink);
}
.dse-panel {
  position: absolute;
  z-index: 3;
  left: 16px;
  right: 16px;
  margin-top: 6px;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--app-line);
  background: var(--app-bg);
  box-shadow: 0 10px 30px -8px rgb(20 20 19 / 0.25);
  transform-origin: top center;
}
.dse.browser .dse-panel {
  left: 18px;
  right: 18px;
}
.dse-head {
  margin: 0 !important;
  padding: 6px 10px 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--app-ink-2);
}
.dse-list {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.dse-opt {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  margin: 0 !important;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 14.5px;
  color: var(--app-ink-2);
  cursor: pointer;
}
.dse-opt.active {
  background: var(--app-soft);
}
.dse-text {
  color: var(--app-ink);
}
.dse-text b {
  font-weight: 750;
}
.dse-empty {
  margin: 0 !important;
  padding: 12px 10px;
  font-size: 13.5px;
  color: var(--app-ink-2);
}
.dse-result {
  min-height: 20px;
  margin: 10px 2px 0 !important;
  font-size: 12.5px;
  color: var(--app-ink-2);
}
.dse-pop-enter-active {
  transition: transform 160ms var(--ease-out), opacity 160ms var(--ease-out);
}
.dse-pop-leave-active {
  transition: opacity 100ms cubic-bezier(0.4, 0, 1, 1);
}
.dse-pop-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.dse-pop-leave-to {
  opacity: 0;
}
</style>
