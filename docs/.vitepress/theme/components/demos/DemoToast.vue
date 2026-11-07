<script setup lang="ts">
import { onBeforeUnmount, ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

let seq = 0
const photos = ref(Array.from({ length: 6 }, (_, i) => ({ id: ++seq, hue: [30, 150, 250, 85, 330, 200][i] })))

// 轻提示：同一时间只显示一条，2 秒后消失
const toast = ref<{ id: number; text: string } | null>(null)
let toastTimer = 0
function showToast(text: string) {
  window.clearTimeout(toastTimer)
  toast.value = { id: ++seq, text }
  toastTimer = window.setTimeout(() => (toast.value = null), 2000)
}

// Snackbar：4 秒后消失，指针悬停或焦点在里面时暂停计时；新消息替换旧消息
const snack = ref<{ id: number; text: string; undo: () => void } | null>(null)
let snackTimer = 0
let remain = 0
let startedAt = 0
function startSnackTimer(ms: number) {
  window.clearTimeout(snackTimer)
  remain = ms
  startedAt = Date.now()
  snackTimer = window.setTimeout(() => (snack.value = null), ms)
}
function pauseSnack() {
  window.clearTimeout(snackTimer)
  remain -= Date.now() - startedAt
}
function resumeSnack() {
  if (snack.value) startSnackTimer(Math.max(remain, 1000))
}
function removePhoto() {
  const i = photos.value.length - 1
  if (i < 0) return
  const [gone] = photos.value.splice(i, 1)
  snack.value = {
    id: ++seq,
    text: '已删除 1 张照片',
    undo: () => {
      photos.value.splice(i, 0, gone)
      snack.value = null
      showToast('已撤销')
    },
  }
  startSnackTimer(4000)
}
function copyLink() {
  showToast('链接已复制')
}
onBeforeUnmount(() => {
  window.clearTimeout(toastTimer)
  window.clearTimeout(snackTimer)
})

useScript(toRef(props, 'play'), [
  [600, () => copyLink()],
  [3000, () => removePhoto()],
])
</script>

<template>
  <div class="dto" :class="frame">
    <div class="dto-bar">相册</div>
    <TransitionGroup tag="ul" name="dto-ph" class="dto-grid">
      <li v-for="p in photos" :key="p.id" class="dto-photo" :style="{ '--h': p.hue }" aria-hidden="true" />
    </TransitionGroup>
    <div class="dto-actions">
      <button type="button" class="dto-btn" @click="copyLink">复制链接</button>
      <button type="button" class="dto-btn danger" :disabled="!photos.length" @click="removePhoto">删除一张</button>
    </div>

    <div class="dto-toast-area" role="status" aria-live="polite">
      <Transition name="dto-toast">
        <p v-if="toast" :key="toast.id" class="dto-toast">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
          {{ toast.text }}
        </p>
      </Transition>
    </div>

    <div class="dto-snack-area" role="status" aria-live="polite">
      <Transition name="dto-snack">
        <div v-if="snack" :key="snack.id" class="dto-snack" @pointerenter="pauseSnack" @pointerleave="resumeSnack" @focusin="pauseSnack" @focusout="resumeSnack">
          <span class="dto-snack-text">{{ snack.text }}</span>
          <button type="button" class="dto-undo" @click="snack.undo">撤销</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.dto {
  position: relative;
  height: 100%;
  font-size: 14px;
  overflow: hidden;
}
.dto-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dto.browser .dto-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dto-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 0 !important;
  padding: 4px 18px !important;
  list-style: none !important;
}
.dto.browser .dto-grid {
  grid-template-columns: repeat(6, 1fr);
  padding: 14px 18px 4px !important;
}
.dto-photo {
  aspect-ratio: 1;
  margin: 0 !important;
  border-radius: 10px;
  background: oklch(0.88 0.05 var(--h));
}
:root.dark .dto-photo {
  background: oklch(0.38 0.06 var(--h));
}
.dto-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 14px 18px;
}
.dto.browser .dto-actions {
  grid-template-columns: auto auto;
  justify-content: start;
}
.dto-btn {
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 650;
  background: var(--app-accent);
  color: var(--app-on-accent);
  transition: transform 150ms var(--ease-out);
}
.dto-btn.danger {
  background: var(--app-soft);
  color: var(--app-danger);
  border: 1px solid var(--app-line);
}
.dto-btn:active:not(:disabled) {
  transform: scale(0.96);
}
.dto-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* 轻提示：屏幕中部偏下居中 */
.dto-toast-area {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 96px;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.dto.browser .dto-toast-area {
  bottom: 72px;
}
.dto-toast {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 !important;
  padding: 9px 16px;
  border-radius: 999px;
  background: rgb(20 20 19 / 0.86);
  color: #fffefb;
  font-size: 14px;
  font-weight: 550;
  line-height: 1.4;
}
:root.dark .dto-toast {
  background: rgb(243 239 231 / 0.92);
  color: #1b1a17;
}
.dto-toast-enter-active {
  transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out);
}
.dto-toast-leave-active {
  position: absolute;
  transition: transform 160ms cubic-bezier(0.4, 0, 1, 1), opacity 160ms cubic-bezier(0.4, 0, 1, 1);
}
.dto-toast-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
.dto-toast-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Snackbar：贴底，左右留 10px */
.dto-snack-area {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
}
.dto.browser .dto-snack-area {
  left: 50%;
  right: auto;
  bottom: 16px;
  width: 360px;
  margin-left: -180px;
}
.dto-snack {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 6px 0 16px;
  border-radius: 14px;
  background: #141413;
  color: #fffefb;
  box-shadow: 0 8px 24px -8px rgb(20 20 19 / 0.4);
}
:root.dark .dto-snack {
  background: #f3efe7;
  color: #1b1a17;
}
.dto-snack-text {
  flex: 1;
  font-size: 14px;
}
.dto-undo {
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  color: #f0b49c;
  font-size: 14px;
  font-weight: 650;
}
.dto-undo:hover {
  background: rgb(255 255 255 / 0.1);
}
:root.dark .dto-undo {
  color: #9c4a30;
}
:root.dark .dto-undo:hover {
  background: rgb(20 20 19 / 0.08);
}
.dto-snack-enter-active {
  transition: transform 320ms var(--ease-out);
}
.dto-snack-leave-active {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transition: transform 200ms cubic-bezier(0.4, 0, 1, 1);
}
.dto-snack-enter-from,
.dto-snack-leave-to {
  transform: translateY(calc(100% + 16px));
}

.dto-ph-leave-active {
  transition: transform 200ms cubic-bezier(0.4, 0, 1, 1), opacity 200ms cubic-bezier(0.4, 0, 1, 1);
}
.dto-ph-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.dto-ph-enter-active {
  transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out);
}
.dto-ph-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
</style>
