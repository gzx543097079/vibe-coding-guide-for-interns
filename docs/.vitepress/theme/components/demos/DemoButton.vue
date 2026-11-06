<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

const status = ref<'idle' | 'loading' | 'done'>('idle')
const pressing = ref(false)

const { later } = useScript(toRef(props, 'play'), [
  [500, () => (pressing.value = true)],
  [680, () => {
    pressing.value = false
    submit()
  }],
])

function submit() {
  if (status.value !== 'idle') return
  status.value = 'loading'
  later(1300, () => {
    status.value = 'done'
    later(1500, () => (status.value = 'idle'))
  })
}
</script>

<template>
  <div class="db" :class="frame">
    <div class="db-bar">反馈问题</div>
    <div class="db-form">
      <label class="db-field">
        <span>标题</span>
        <span class="db-input">登录页按钮无响应</span>
      </label>
      <label class="db-field">
        <span>描述</span>
        <span class="db-input tall">点击后没有任何提示</span>
      </label>
    </div>
    <div class="db-actions">
      <button
        type="button"
        class="db-btn primary"
        :class="{ pressing, loading: status === 'loading', done: status === 'done' }"
        :disabled="status === 'loading'"
        :aria-busy="status === 'loading'"
        @click="submit"
      >
        <span v-if="status === 'loading'" class="db-spin" aria-hidden="true" />
        <svg v-else-if="status === 'done'" class="db-check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ status === 'loading' ? '提交中…' : status === 'done' ? '已提交' : '提交' }}</span>
      </button>
      <div class="db-row">
        <button type="button" class="db-btn ghost">取消</button>
        <button type="button" class="db-btn ghost" disabled>已禁用</button>
      </div>
    </div>
    <p class="sr-only" aria-live="polite">{{ status === 'loading' ? '正在提交' : status === 'done' ? '提交成功' : '' }}</p>
  </div>
</template>

<style scoped>
.db {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 14px;
}
.db-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.db.browser .db-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.db-form {
  display: grid;
  gap: 12px;
  padding: 8px 18px;
}
.db-field {
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: var(--app-ink-2);
}
.db-input {
  display: block;
  padding: 9px 12px;
  border-radius: 10px;
  background: var(--app-soft);
  border: 1px solid var(--app-line);
  color: var(--app-ink);
  font-size: 13.5px;
}
.db-input.tall {
  min-height: 64px;
}
.db.browser .db-form {
  grid-template-columns: 1fr 1fr;
}
.db-actions {
  margin-top: auto;
  display: grid;
  gap: 10px;
  padding: 14px 18px 18px;
}
.db.browser .db-actions {
  margin-top: 4px;
  grid-template-columns: auto auto;
  justify-content: start;
  align-items: center;
}
.db-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.db-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 650;
  transition: transform 0.18s var(--ease-out), opacity 0.2s;
}
.db-btn.primary {
  background: var(--app-accent);
  color: var(--app-on-accent);
  box-shadow: 0 1px 2px rgb(20 20 19 / 0.2), 0 4px 12px -2px rgb(179 87 58 / 0.3);
}
.db-btn.primary:hover {
  background: color-mix(in oklab, var(--app-accent) 90%, var(--app-ink));
}
.db-btn:active,
.db-btn.pressing {
  transform: scale(0.96);
}
.db-btn.primary:active,
.db-btn.primary.pressing {
  box-shadow: 0 1px 1px rgb(20 20 19 / 0.2);
  background: color-mix(in oklab, var(--app-accent) 82%, var(--app-ink));
}
.db-btn.primary.loading {
  opacity: 0.85;
  cursor: progress;
}
.db-btn.primary.done {
  background: oklch(0.52 0.13 150);
}
:root.dark .db-btn.primary.done {
  background: oklch(0.74 0.14 150);
}
.db-btn.ghost {
  background: var(--app-soft);
  color: var(--app-ink);
  border: 1px solid var(--app-line);
}
.db-btn.ghost:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}
.db-spin {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: spin 0.7s linear infinite;
}
.db-check {
  animation: pop 0.35s var(--ease-out);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes pop {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
}
</style>
