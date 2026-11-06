<script lang="ts">
import { reactive } from 'vue'

// 同一 group 的所有标签页共享选中项，并记忆到 localStorage
const selected = reactive<Record<string, string>>({})
const KEY = 'vcg-codetabs:'

function load(group: string): string | null {
  try {
    return window.localStorage.getItem(KEY + group)
  } catch {
    return null
  }
}
function save(group: string, label: string) {
  try {
    window.localStorage.setItem(KEY + group, label)
  } catch {
    /* 存储不可用时只在本页联动 */
  }
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref, useId, useSlots } from 'vue'

const props = defineProps<{
  /** 联动分组，同组标签页同步切换 */
  group: string
  /** 标签名，按顺序对应插槽 t1、t2、t3… */
  labels: string[]
}>()

const slots = useSlots()
const uid = useId()
const tabRefs = ref<HTMLButtonElement[]>([])
const panelRefs = ref<HTMLElement[]>([])
const copied = ref(false)

const current = computed(() => {
  const label = selected[props.group]
  const idx = label ? props.labels.indexOf(label) : -1
  return idx >= 0 ? idx : 0
})

onMounted(() => {
  if (selected[props.group]) return
  const stored = load(props.group)
  if (stored && props.labels.includes(stored)) selected[props.group] = stored
})

function select(i: number, focus = false) {
  const label = props.labels[i]
  selected[props.group] = label
  save(props.group, label)
  if (focus) tabRefs.value[i]?.focus()
}

function onKey(e: KeyboardEvent) {
  const n = props.labels.length
  let i = current.value
  if (e.key === 'ArrowRight') i = (i + 1) % n
  else if (e.key === 'ArrowLeft') i = (i - 1 + n) % n
  else if (e.key === 'Home') i = 0
  else if (e.key === 'End') i = n - 1
  else return
  e.preventDefault()
  select(i, true)
}

async function copy() {
  const panel = panelRefs.value[current.value]
  if (!panel) return
  const text = Array.from(panel.querySelectorAll('pre code'))
    .map((el) => (el as HTMLElement).innerText.replace(/\n$/, ''))
    .join('\n\n')
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1600)
  } catch {
    copied.value = false
  }
}

const hasSlot = (i: number) => Boolean(slots[`t${i + 1}`])
</script>

<template>
  <div class="ct">
    <div class="ct-bar">
      <div class="ct-tabs" role="tablist" aria-label="实现方式" @keydown="onKey">
        <button
          v-for="(label, i) in labels"
          :id="`${uid}-tab-${i}`"
          :key="label"
          ref="tabRefs"
          type="button"
          role="tab"
          class="ct-tab"
          :aria-selected="i === current"
          :aria-controls="`${uid}-panel-${i}`"
          :tabindex="i === current ? 0 : -1"
          @click="select(i)"
        >
          {{ label }}
        </button>
      </div>
      <button type="button" class="ct-copy" :class="{ done: copied }" @click="copy">
        <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
          <template v-if="!copied">
            <rect x="5.5" y="5.5" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" fill="none" stroke="currentColor" stroke-width="1.5" />
          </template>
          <path v-else d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ copied ? '已复制' : '复制代码' }}</span>
      </button>
    </div>
    <div
      v-for="(label, i) in labels"
      :id="`${uid}-panel-${i}`"
      :key="label"
      ref="panelRefs"
      class="ct-panel"
      role="tabpanel"
      :aria-labelledby="`${uid}-tab-${i}`"
      :hidden="i !== current"
      tabindex="0"
    >
      <slot v-if="hasSlot(i)" :name="`t${i + 1}`" />
      <p v-else class="ct-empty">这一种写法待补充。</p>
    </div>
  </div>
</template>

<style scoped>
.ct {
  margin: 0;
  border: 1px solid var(--rule);
  border-radius: 12px;
  background: var(--paper-2);
  overflow: hidden;
}
.ct-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 0 8px;
  border-bottom: 1px solid var(--rule);
}
.ct-tabs {
  display: flex;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.ct-tab {
  position: relative;
  flex: none;
  padding: 8px 12px 10px;
  border-radius: 8px 8px 0 0;
  font-size: 13.5px;
  font-weight: 550;
  color: var(--ink-2);
  white-space: nowrap;
}
.ct-tab:hover {
  color: var(--ink);
  background: var(--paper-3);
}
.ct-tab[aria-selected='true'] {
  color: var(--ink);
  font-weight: 650;
}
.ct-tab[aria-selected='true']::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: -1px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--line, var(--ink));
}
.ct-tab:focus-visible {
  outline-offset: -2px;
}
.ct-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  margin: 0 0 6px auto;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12.5px;
  color: var(--ink-2);
  border: 1px solid var(--rule);
  background: var(--raised);
}
.ct-copy:hover {
  color: var(--ink);
  border-color: var(--rule-strong);
}
.ct-copy.done {
  color: var(--line-start);
}
.ct-panel:focus-visible {
  outline-offset: -3px;
}
.ct-panel :deep(div[class*='language-']) {
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: var(--paper-2);
}
.ct-panel :deep(div[class*='language-'] + div[class*='language-']) {
  border-top: 1px dashed var(--rule) !important;
}
.ct-panel :deep(p) {
  margin: 0;
  padding: 10px 16px;
  font-size: 13.5px;
  color: var(--ink-2);
}
.ct-empty {
  padding: 18px 16px !important;
}
@media (max-width: 639px) {
  .ct-copy span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
}
</style>
