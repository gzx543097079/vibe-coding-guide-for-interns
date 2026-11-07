<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRef, useId } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const options = [
  { v: 'urgent', label: '紧急', disabled: false },
  { v: 'high', label: '高', disabled: false },
  { v: 'mid', label: '中', disabled: false },
  { v: 'low', label: '低', disabled: false },
  { v: 'frozen', label: '冻结（需管理员）', disabled: true },
]
const value = ref('mid')
const open = ref(false)
const active = ref(2)
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const listbox = ref<HTMLElement>()
const current = computed(() => options.find((o) => o.v === value.value)!)

async function show() {
  if (open.value) return
  open.value = true
  active.value = options.findIndex((o) => o.v === value.value)
  await nextTick()
  listbox.value?.focus({ preventScroll: true })
}
function hide(refocus = true) {
  if (!open.value) return
  open.value = false
  if (refocus) trigger.value?.focus()
}
function choose(i: number) {
  const o = options[i]
  if (!o || o.disabled) return
  value.value = o.v
  hide()
}
// 跳过禁用项移动高亮
function step(d: number) {
  let i = active.value
  for (let n = 0; n < options.length; n++) {
    i = Math.min(options.length - 1, Math.max(0, i + d))
    if (!options[i].disabled) {
      active.value = i
      return
    }
    if (i === 0 || i === options.length - 1) return
  }
}
function onTriggerKey(e: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
    e.preventDefault()
    show()
  }
}
function onListKey(e: KeyboardEvent) {
  const map: Record<string, () => void> = {
    ArrowDown: () => step(1),
    ArrowUp: () => step(-1),
    Home: () => {
      active.value = -1
      step(1)
    },
    End: () => {
      active.value = options.length
      step(-1)
    },
    Enter: () => choose(active.value),
    ' ': () => choose(active.value),
    Escape: () => hide(),
  }
  if (e.key === 'Tab') return hide(false)
  const fn = map[e.key]
  if (!fn) return
  e.preventDefault()
  fn()
}
function onDocDown(e: PointerEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) hide(false)
}
onMounted(() => document.addEventListener('pointerdown', onDocDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocDown))

useScript(toRef(props, 'play'), [
  [600, () => {
    open.value = true
    active.value = 2
  }],
  [1200, () => step(-1)],
  [1700, () => {
    value.value = options[active.value].v
    open.value = false
  }],
])
</script>

<template>
  <div class="dsl" :class="frame">
    <div class="dsl-bar">新建任务</div>
    <div class="dsl-body">
      <span :id="`${uid}-lab`" class="dsl-label">优先级</span>
      <div ref="root" class="dsl-wrap">
        <button
          ref="trigger"
          type="button"
          class="dsl-trigger"
          :class="{ open }"
          aria-haspopup="listbox"
          :aria-expanded="open"
          :aria-labelledby="`${uid}-lab ${uid}-val`"
          @click="open ? hide() : show()"
          @keydown="onTriggerKey"
        >
          <span :id="`${uid}-val`">{{ current.label }}</span>
          <svg class="dsl-chev" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <Transition name="dsl-pop">
          <ul
            v-if="open"
            ref="listbox"
            class="dsl-list"
            role="listbox"
            tabindex="-1"
            :aria-labelledby="`${uid}-lab`"
            :aria-activedescendant="`${uid}-o-${active}`"
            @keydown="onListKey"
          >
            <li
              v-for="(o, i) in options"
              :id="`${uid}-o-${i}`"
              :key="o.v"
              role="option"
              class="dsl-opt"
              :class="{ active: i === active, selected: o.v === value, disabled: o.disabled }"
              :aria-selected="o.v === value"
              :aria-disabled="o.disabled || undefined"
              @pointerenter="!o.disabled && (active = i)"
              @click="choose(i)"
            >
              <span>{{ o.label }}</span>
              <svg v-if="o.v === value" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </li>
          </ul>
        </Transition>
      </div>
      <p class="dsl-hint">紧急任务会通知所有成员。</p>
    </div>
  </div>
</template>

<style scoped>
.dsl {
  height: 100%;
  font-size: 14px;
}
.dsl-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dsl.browser .dsl-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dsl-body {
  padding: 8px 18px;
}
.dsl.browser .dsl-body {
  padding: 12px 18px;
}
.dsl-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--app-ink-2);
}
.dsl-wrap {
  position: relative;
}
.dsl.browser .dsl-wrap {
  width: 240px;
}
.dsl-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 0 12px 0 14px;
  border-radius: 12px;
  border: 1px solid var(--app-line);
  background: var(--app-soft);
  color: var(--app-ink);
  font-size: 15px;
  font-weight: 500;
  text-align: left;
}
.dsl-trigger:hover {
  border-color: color-mix(in oklab, var(--app-ink) 30%, var(--app-line));
}
.dsl-trigger.open {
  border-color: var(--app-accent);
}
.dsl-chev {
  color: var(--app-ink-2);
  transition: transform 220ms var(--ease-out);
}
.dsl-trigger.open .dsl-chev {
  transform: rotate(180deg);
}
.dsl-list {
  position: absolute;
  z-index: 3;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  margin: 0 !important;
  padding: 4px !important;
  list-style: none !important;
  border-radius: 12px;
  border: 1px solid var(--app-line);
  background: var(--app-bg);
  box-shadow: 0 10px 30px -8px rgb(20 20 19 / 0.25);
  transform-origin: top center;
  outline: none;
}
.dsl-opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
  margin: 0 !important;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 14.5px;
  color: var(--app-ink);
  cursor: pointer;
}
.dsl-opt.active {
  background: var(--app-soft);
}
.dsl-list:focus-visible .dsl-opt.active {
  box-shadow: inset 0 0 0 2px var(--focus);
}
.dsl-opt.selected {
  font-weight: 650;
}
.dsl-opt.selected svg {
  color: var(--app-accent);
}
.dsl-opt.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.dsl-hint {
  margin: 8px 0 0 !important;
  font-size: 12.5px;
  color: var(--app-ink-2);
}
.dsl-pop-enter-active {
  transition: transform 180ms var(--ease-out), opacity 180ms var(--ease-out);
}
.dsl-pop-leave-active {
  transition: transform 120ms cubic-bezier(0.4, 0, 1, 1), opacity 120ms cubic-bezier(0.4, 0, 1, 1);
}
.dsl-pop-enter-from,
.dsl-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
