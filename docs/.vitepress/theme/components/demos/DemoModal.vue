<script setup lang="ts">
import { nextTick, ref, toRef, useId } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const open = ref<'none' | 'sheet' | 'dialog'>('none')
const last = ref<string>('')
const panel = ref<HTMLElement>()
const shareBtn = ref<HTMLButtonElement>()
const delBtn = ref<HTMLButtonElement>()
let opener: HTMLElement | null = null

useScript(toRef(props, 'play'), [
  [500, () => show('sheet', false)],
  [2300, () => close()],
  [3000, () => show('dialog', false)],
  [4600, () => close()],
])

async function show(kind: 'sheet' | 'dialog', moveFocus = true) {
  opener = kind === 'sheet' ? shareBtn.value ?? null : delBtn.value ?? null
  open.value = kind
  await nextTick()
  if (moveFocus) panel.value?.querySelector<HTMLElement>('button')?.focus()
}

async function close(result?: string) {
  if (open.value === 'none') return
  const hadFocus = panel.value?.contains(document.activeElement)
  open.value = 'none'
  if (result) last.value = result
  // 等背景区域解除 inert 后再还原焦点
  await nextTick()
  if (hadFocus) opener?.focus()
}

// 焦点限制在弹窗内，Esc 关闭
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
    return
  }
  if (e.key !== 'Tab' || !panel.value) return
  const items = Array.from(panel.value.querySelectorAll<HTMLElement>('button'))
  if (!items.length) return
  const first = items[0]
  const lastEl = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    lastEl.focus()
  } else if (!e.shiftKey && document.activeElement === lastEl) {
    e.preventDefault()
    first.focus()
  }
}

const options = [
  { label: '复制链接', path: 'M6.5 9.5l3-3M7 5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L10.7 8.7M9 11l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7L5.3 7.3' },
  { label: '保存图片', path: 'M2.5 4.5h11v8h-11zM5.5 10l2-2 2 2 1.5-1.5L13 10.5M10.5 7a.01.01 0 0 1 0 0' },
  { label: '发给同事', path: 'M2.5 8l10.5-5-3.5 10.5-2-4.5z' },
]
</script>

<template>
  <div class="dm" :class="frame">
    <div class="dm-bar">文档详情</div>
    <div class="dm-body" :inert="open !== 'none' || undefined">
      <div class="dm-doc">
        <span class="dm-line w80" />
        <span class="dm-line w95" />
        <span class="dm-line w60" />
      </div>
      <div class="dm-actions">
        <button ref="shareBtn" type="button" class="dm-btn" @click="show('sheet')">分享</button>
        <button ref="delBtn" type="button" class="dm-btn danger" @click="show('dialog')">删除</button>
      </div>
      <p class="dm-result" aria-live="polite">{{ last ? `上次选择：${last}` : '' }}</p>
    </div>

    <Transition name="dm-fade">
      <div v-if="open !== 'none'" class="dm-backdrop" @click="close()" />
    </Transition>

    <Transition name="dm-sheet">
      <div
        v-if="open === 'sheet'"
        ref="panel"
        class="dm-sheet"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${uid}-sheet`"
        @keydown="onKey"
      >
        <span class="dm-grab" aria-hidden="true" />
        <p :id="`${uid}-sheet`" class="dm-title">分享到</p>
        <div class="dm-opts">
          <button v-for="o in options" :key="o.label" type="button" class="dm-opt" @click="close(o.label)">
            <span class="dm-ico" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 16 16">
                <path :d="o.path" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            {{ o.label }}
          </button>
        </div>
        <button type="button" class="dm-cancel" @click="close()">取消</button>
      </div>
    </Transition>

    <Transition name="dm-pop">
      <div
        v-if="open === 'dialog'"
        ref="panel"
        class="dm-dialog"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="`${uid}-dlg`"
        :aria-describedby="`${uid}-dlg-d`"
        @keydown="onKey"
      >
        <p :id="`${uid}-dlg`" class="dm-title">删除这篇文档？</p>
        <p :id="`${uid}-dlg-d`" class="dm-desc">删除后无法恢复。</p>
        <div class="dm-dlg-actions">
          <button type="button" class="dm-dlg-btn" @click="close('取消删除')">取消</button>
          <button type="button" class="dm-dlg-btn danger" @click="close('删除')">删除</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dm {
  position: relative;
  height: 100%;
  font-size: 14px;
}
.dm-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dm.browser .dm-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dm-body {
  padding: 6px 18px;
}
.dm-doc {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 14px;
  background: var(--app-soft);
}
.dm-line {
  height: 9px;
  border-radius: 5px;
  background: color-mix(in oklab, var(--app-ink) 14%, var(--app-soft));
}
.w80 { width: 80%; }
.w95 { width: 95%; }
.w60 { width: 60%; }
.dm-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
}
.dm.browser .dm-actions {
  grid-template-columns: auto auto;
  justify-content: start;
}
.dm-btn {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 650;
  background: var(--app-accent);
  color: var(--app-on-accent);
  transition: transform 0.18s var(--ease-out);
}
.dm-btn.danger {
  background: var(--app-soft);
  color: var(--app-danger);
  border: 1px solid var(--app-line);
}
.dm-btn:active {
  transform: scale(0.96);
}
.dm-result {
  min-height: 20px;
  margin: 12px 0 0 !important;
  font-size: 12.5px;
  color: var(--app-ink-2);
}

.dm-backdrop {
  position: absolute;
  inset: 0;
  background: oklch(0.15 0.02 250 / 0.42);
}
.dm-sheet {
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 6px;
  padding: 8px 14px 14px;
  border-radius: 22px;
  background: var(--app-bg);
  box-shadow: 0 -4px 24px oklch(0 0 0 / 0.18);
}
.dm.browser .dm-sheet {
  left: 50%;
  width: 340px;
  margin-left: -170px;
}
.dm-grab {
  display: block;
  width: 36px;
  height: 5px;
  margin: 0 auto 10px;
  border-radius: 3px;
  background: var(--app-line);
}
.dm-title {
  margin: 0 0 12px !important;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  color: var(--app-ink);
}
.dm-opts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.dm-opt {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 8px 2px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--app-ink);
}
.dm-opt:hover {
  background: var(--app-soft);
}
.dm-ico {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--app-soft);
  color: var(--app-accent);
}
.dm-cancel {
  width: 100%;
  height: 44px;
  margin-top: 10px;
  border-radius: 12px;
  background: var(--app-soft);
  font-weight: 650;
  color: var(--app-ink);
}

.dm-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 220px;
  margin: -78px 0 0 -110px;
  padding: 18px 16px 12px;
  border-radius: 18px;
  background: var(--app-bg);
  box-shadow: 0 10px 40px oklch(0 0 0 / 0.25);
  text-align: center;
}
.dm-dialog .dm-title {
  margin-bottom: 4px !important;
}
.dm-desc {
  margin: 0 0 14px !important;
  font-size: 13px;
  color: var(--app-ink-2);
}
.dm-dlg-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.dm-dlg-btn {
  height: 38px;
  border-radius: 10px;
  background: var(--app-soft);
  font-weight: 600;
  color: var(--app-ink);
}
.dm-dlg-btn.danger {
  background: var(--app-danger);
  color: #fff;
}
:root.dark .dm-dlg-btn.danger {
  color: oklch(0.18 0.03 27);
}

/* 动画 */
.dm-fade-enter-active,
.dm-fade-leave-active {
  transition: opacity 0.3s var(--ease-out);
}
.dm-fade-enter-from,
.dm-fade-leave-to {
  opacity: 0;
}
.dm-sheet-enter-active {
  transition: transform 0.42s var(--ease-out);
}
.dm-sheet-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.dm-sheet-enter-from,
.dm-sheet-leave-to {
  transform: translateY(calc(100% + 12px));
}
.dm-pop-enter-active {
  transition: transform 0.32s var(--ease-out), opacity 0.2s;
}
.dm-pop-leave-active {
  transition: transform 0.18s ease-in, opacity 0.18s;
}
.dm-pop-enter-from {
  transform: scale(1.12);
  opacity: 0;
}
.dm-pop-leave-to {
  transform: scale(0.94);
  opacity: 0;
}
</style>
