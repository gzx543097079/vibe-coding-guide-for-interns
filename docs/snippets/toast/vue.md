```vue
<script setup lang="ts">
import { ref } from 'vue'

const toast = ref('')
const snack = ref<{ text: string; undo?: () => void } | null>(null)
let toastTimer: number | undefined
let snackTimer: number | undefined

function showToast(text: string) {
  toast.value = text
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 2000)
}

function showSnackbar(text: string, undo?: () => void) {
  snack.value = { text, undo } // 新消息替换旧消息
  clearTimeout(snackTimer)
  snackTimer = window.setTimeout(() => (snack.value = null), 4000)
}

function onUndo() {
  snack.value?.undo?.()
  snack.value = null
}
</script>

<template>
  <button type="button" @click="showToast('已复制')">复制链接</button>
  <button type="button" @click="showSnackbar('已删除 1 条', () => { /* 恢复 */ })">删除</button>

  <!-- 外层 live region 常驻，内容变化时读屏播报 -->
  <div role="status" aria-live="polite">
    <Transition name="toast"><p v-if="toast" class="toast">{{ toast }}</p></Transition>
  </div>
  <div role="status" aria-live="polite">
    <Transition name="snack">
      <div v-if="snack" :key="snack.text" class="snackbar">
        <span>{{ snack.text }}</span>
        <button type="button" @click="onUndo">撤销</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
.snack-enter-active, .snack-leave-active { transition: transform 0.25s; }
.snack-enter-from, .snack-leave-to { transform: translateY(150%); }
@media (prefers-reduced-motion: reduce) {
  .toast-enter-from, .toast-leave-to, .snack-enter-from, .snack-leave-to { transform: none; opacity: 0; }
}
</style>
