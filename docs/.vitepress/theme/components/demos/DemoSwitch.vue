<script setup lang="ts">
import { reactive, toRef, useId } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const rows = reactive([
  { key: 'wifi', label: 'Wi-Fi', desc: '已连接', on: true, disabled: false },
  { key: 'bt', label: '蓝牙', desc: '关闭时无法连接耳机', on: false, disabled: false },
  { key: 'dnd', label: '勿扰模式', desc: '', on: false, disabled: false },
  { key: 'sync', label: '自动同步', desc: '由管理员关闭', on: false, disabled: true },
])

useScript(toRef(props, 'play'), [
  [600, () => (rows[1].on = true)],
  [1500, () => (rows[2].on = true)],
  [2600, () => (rows[2].on = false)],
])
</script>

<template>
  <div class="ds" :class="frame">
    <div class="ds-bar">设置</div>
    <ul class="ds-list">
      <li v-for="row in rows" :key="row.key" class="ds-row" :class="{ disabled: row.disabled }">
        <span class="ds-text">
          <span :id="`${uid}-${row.key}`" class="ds-label">{{ row.label }}</span>
          <span v-if="row.desc" class="ds-desc">{{ row.desc }}</span>
        </span>
        <button
          type="button"
          role="switch"
          class="ds-switch"
          :aria-checked="row.on"
          :aria-labelledby="`${uid}-${row.key}`"
          :disabled="row.disabled"
          @click="row.on = !row.on"
        >
          <span class="ds-thumb" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ds {
  height: 100%;
  font-size: 14px;
}
.ds-bar {
  padding: 12px 18px 12px;
  font-size: 17px;
  font-weight: 700;
}
.ds.browser .ds-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.ds-list {
  margin: 0 12px;
  padding: 0;
  list-style: none;
  border-radius: 14px;
  background: var(--app-soft);
}
.ds.browser .ds-list {
  margin: 14px 18px;
  max-width: 420px;
}
.ds-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 54px;
  padding: 8px 14px;
  margin: 0 !important;
}
.ds-row + .ds-row {
  border-top: 1px solid var(--app-line);
}
.ds-text {
  display: grid;
  flex: 1;
  min-width: 0;
}
.ds-label {
  font-size: 15px;
  font-weight: 550;
}
.ds-desc {
  font-size: 12px;
  color: var(--app-ink-2);
  line-height: 1.4;
}
.ds-row.disabled .ds-label {
  color: var(--app-ink-2);
}
.ds-switch {
  --w: 50px;
  --h: 30px;
  position: relative;
  flex: none;
  width: var(--w);
  height: var(--h);
  border-radius: 999px;
  background: color-mix(in oklab, var(--app-ink) 18%, var(--app-soft));
}
.ds-switch::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: oklch(0.6 0.15 150);
  opacity: 0;
  transition: opacity 0.25s var(--ease-out);
}
:root.dark .ds-switch::before {
  background: oklch(0.68 0.15 150);
}
.ds-switch[aria-checked="true"]::before {
  opacity: 1;
}
.ds-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(var(--h) - 4px);
  height: calc(var(--h) - 4px);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.2), 0 3px 8px oklch(0 0 0 / 0.14);
  transition: transform 0.32s var(--ease-out);
}
.ds-switch[aria-checked='true'] .ds-thumb {
  transform: translateX(calc(var(--w) - var(--h)));
}
.ds-switch:active:not(:disabled) .ds-thumb {
  transform: scaleX(1.15);
  transform-origin: left center;
}
.ds-switch[aria-checked='true']:active:not(:disabled) .ds-thumb {
  transform: translateX(calc(var(--w) - var(--h))) scaleX(1.15);
  transform-origin: right center;
}
.ds-switch:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
