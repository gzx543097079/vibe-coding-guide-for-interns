<script setup lang="ts">
import { computed, reactive, ref, toRef, useId, watchEffect } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const items = reactive([
  { key: 'comment', label: '评论', on: true, disabled: false },
  { key: 'mention', label: '提及我', on: true, disabled: false },
  { key: 'build', label: '构建结果', on: false, disabled: false },
  { key: 'security', label: '安全提醒（必选）', on: true, disabled: true },
])
// 「全部」只管可编辑的项，禁用项保持原状
const editable = computed(() => items.filter((i) => !i.disabled))
const all = computed(() => editable.value.every((i) => i.on))
const some = computed(() => !all.value && editable.value.some((i) => i.on))
function toggleAll() {
  const next = !all.value
  editable.value.forEach((i) => (i.on = next))
}
const parent = ref<HTMLInputElement>()
watchEffect(() => {
  if (parent.value) parent.value.indeterminate = some.value
})

const theme = ref('system')
const themes = [
  { v: 'system', label: '跟随系统' },
  { v: 'light', label: '浅色' },
  { v: 'dark', label: '深色' },
]

useScript(toRef(props, 'play'), [
  [600, () => (items[2].on = true)],
  [1400, () => toggleAll()],
  [2200, () => (items[0].on = true)],
  [3000, () => (theme.value = 'light')],
])
</script>

<template>
  <div class="dc" :class="frame">
    <div class="dc-bar">通知设置</div>
    <div class="dc-body">
      <fieldset class="dc-group">
        <legend class="dc-legend">接收哪些通知</legend>
        <label class="dc-row">
          <input ref="parent" type="checkbox" class="dc-input" :checked="all" @change="toggleAll" />
          <span class="dc-box" :class="{ on: all, mixed: some }" aria-hidden="true">
            <svg class="dc-mark" viewBox="0 0 20 20"><path d="M5 10.5 8.5 14 15 6.5" /></svg>
            <span class="dc-dash" />
          </span>
          <span class="dc-label">全部</span>
        </label>
        <label v-for="it in items" :key="it.key" class="dc-row child" :class="{ disabled: it.disabled }">
          <input v-model="it.on" type="checkbox" class="dc-input" :disabled="it.disabled" />
          <span class="dc-box" :class="{ on: it.on }" aria-hidden="true">
            <svg class="dc-mark" viewBox="0 0 20 20"><path d="M5 10.5 8.5 14 15 6.5" /></svg>
          </span>
          <span class="dc-label">{{ it.label }}</span>
        </label>
      </fieldset>

      <fieldset class="dc-group">
        <legend class="dc-legend">主题</legend>
        <label v-for="t in themes" :key="t.v" class="dc-row">
          <input v-model="theme" type="radio" class="dc-input" :name="`${uid}-theme`" :value="t.v" />
          <span class="dc-radio" :class="{ on: theme === t.v }" aria-hidden="true"><span class="dc-dot" /></span>
          <span class="dc-label">{{ t.label }}</span>
        </label>
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
.dc {
  height: 100%;
  font-size: 14px;
}
.dc-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dc.browser .dc-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dc-body {
  display: grid;
  gap: 14px;
  padding: 4px 6px;
}
.dc.browser .dc-body {
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 12px 12px;
}
.dc-group {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.dc-legend {
  padding: 0 12px;
  margin-bottom: 2px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--app-ink-2);
}
.dc-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  cursor: pointer;
}
.dc-row.child {
  padding-left: 44px;
}
.dc-row:hover {
  background: var(--app-soft);
}
.dc-row.disabled {
  cursor: not-allowed;
}
.dc-row.disabled:hover {
  background: transparent;
}
.dc-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--app-ink);
}
.dc-row.disabled .dc-label {
  color: var(--app-ink-2);
}
/* 原生 input 只负责语义和键盘，视觉由后面的 span 画 */
.dc-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
.dc-box,
.dc-radio {
  position: relative;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid color-mix(in oklab, var(--app-ink) 35%, var(--app-bg));
  background: var(--app-bg);
  transition: transform 150ms var(--ease-out);
}
.dc-radio {
  border-radius: 50%;
}
.dc-row:active:not(.disabled) .dc-box,
.dc-row:active .dc-radio {
  transform: scale(0.9);
}
.dc-input:focus-visible + .dc-box,
.dc-input:focus-visible + .dc-radio {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
.dc-row.disabled .dc-box {
  opacity: 0.45;
}
/* 填充层：只改透明度 */
.dc-box::before,
.dc-radio::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 150ms var(--ease-out);
}
.dc-box::before {
  background: var(--app-accent);
}
.dc-radio::before {
  border: 1.5px solid var(--app-accent);
}
.dc-box.on::before,
.dc-box.mixed::before,
.dc-radio.on::before {
  opacity: 1;
}
.dc-mark {
  position: absolute;
  inset: -1.5px;
  width: 20px;
  height: 20px;
  fill: none;
  stroke: var(--app-on-accent);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transform: scale(0.5);
  transition: transform 220ms var(--ease-out), opacity 150ms var(--ease-out);
}
.dc-box.on .dc-mark {
  opacity: 1;
  transform: scale(1);
}
.dc-dash {
  position: absolute;
  left: 3.5px;
  top: 7.4px;
  width: 10px;
  height: 2.2px;
  border-radius: 1.1px;
  background: var(--app-on-accent);
  opacity: 0;
  transform: scale(0.5);
  transition: transform 220ms var(--ease-out), opacity 150ms var(--ease-out);
}
.dc-box.mixed .dc-dash {
  opacity: 1;
  transform: scale(1);
}
.dc-dot {
  position: absolute;
  left: 4.5px;
  top: 4.5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--app-accent);
  transform: scale(0);
  transition: transform 220ms var(--ease-out);
}
.dc-radio.on .dc-dot {
  transform: scale(1);
}
</style>
