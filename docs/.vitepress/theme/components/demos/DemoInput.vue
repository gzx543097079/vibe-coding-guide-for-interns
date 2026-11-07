<script setup lang="ts">
import { nextTick, ref, toRef, useId } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()
const uid = useId()

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const email = ref('')
const nick = ref('')
const focused = ref<'' | 'email' | 'nick'>('')
const error = ref(false)
const emailEl = ref<HTMLInputElement>()
const fieldEl = ref<HTMLElement>()

function validate() {
  error.value = email.value !== '' && !EMAIL.test(email.value)
  // 每次校验失败都重新播放一次抖动：先去掉类名、强制重排，再加回去
  const el = fieldEl.value
  if (error.value && el) {
    el.classList.remove('shake')
    void el.offsetWidth
    el.classList.add('shake')
  }
}
function onBlur() {
  focused.value = ''
  validate()
}
function onInput() {
  // 改正后立即清除错误，不等失焦
  if (error.value && EMAIL.test(email.value)) error.value = false
}
async function clear() {
  email.value = ''
  error.value = false
  await nextTick()
  emailEl.value?.focus()
}

useScript(toRef(props, 'play'), [
  [400, () => (focused.value = 'email')],
  [700, () => (email.value = 'lin')],
  [900, () => (email.value = 'lin@exa')],
  [1600, () => onBlur()],
  [3000, () => {
    email.value = 'lin@example.com'
    onInput()
  }],
])
</script>

<template>
  <div class="di" :class="frame">
    <div class="di-bar">注册账号</div>
    <form class="di-form" novalidate @submit.prevent="validate">
      <div class="di-item">
        <!-- 抖动放在只有静态类名的外层，避免 Vue 更新 class 时把动画类冲掉 -->
        <div ref="fieldEl" class="di-shake" @animationend="fieldEl?.classList.remove('shake')">
        <div class="di-field" :class="{ focus: focused === 'email', filled: email !== '', invalid: error }">
          <input
            :id="`${uid}-email`"
            ref="emailEl"
            v-model="email"
            class="di-input"
            type="email"
            autocomplete="email"
            :aria-invalid="error"
            :aria-describedby="error ? `${uid}-err` : undefined"
            @focus="focused = 'email'"
            @blur="onBlur"
            @input="onInput"
          />
          <label :for="`${uid}-email`" class="di-label">邮箱</label>
          <button type="button" class="di-clear" :class="{ show: email !== '' }" :tabindex="email ? 0 : -1" aria-label="清除邮箱" @mousedown.prevent @click="clear">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2l6 6M8 2 2 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
          </button>
        </div>
        </div>
        <Transition name="di-msg">
          <p v-if="error" :id="`${uid}-err`" class="di-error">邮箱格式不对，例如 name@example.com</p>
        </Transition>
      </div>

      <div class="di-item">
        <div class="di-field" :class="{ focus: focused === 'nick', filled: nick !== '' }">
          <input
            :id="`${uid}-nick`"
            v-model="nick"
            class="di-input"
            maxlength="12"
            :aria-describedby="`${uid}-count`"
            @focus="focused = 'nick'"
            @blur="focused = ''"
          />
          <label :for="`${uid}-nick`" class="di-label">昵称</label>
        </div>
        <p :id="`${uid}-count`" class="di-count">{{ nick.length }}/12</p>
      </div>
    </form>
  </div>
</template>

<style scoped>
.di {
  height: 100%;
  font-size: 14px;
}
.di-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.di.browser .di-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.di-form {
  display: grid;
  gap: 6px;
  padding: 8px 18px;
}
.di.browser .di-form {
  max-width: 360px;
  padding: 18px 18px;
}
.di-item {
  min-height: 78px;
}
.di-field {
  position: relative;
  height: 52px;
  border-radius: 12px;
  border: 1px solid var(--app-line);
  background: var(--app-soft);
}
.di-field.focus {
  border-color: var(--app-accent);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--app-accent) 18%, transparent);
}
.di-field.invalid {
  border-color: var(--app-danger);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--app-danger) 16%, transparent);
}
.di-shake.shake {
  animation: di-shake 360ms var(--ease-out);
}
.di-input {
  width: 100%;
  height: 100%;
  padding: 20px 40px 6px 14px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--app-ink);
  font-size: 15px;
  caret-color: var(--app-accent);
}
.di-label {
  position: absolute;
  left: 14px;
  top: 15px;
  font-size: 15px;
  line-height: 20px;
  color: var(--app-ink-2);
  pointer-events: none;
  transform-origin: left top;
  transition: transform 220ms var(--ease-out);
}
.di-field.focus .di-label,
.di-field.filled .di-label {
  transform: translateY(-9px) scale(0.78);
}
.di-field.focus .di-label {
  color: var(--app-accent);
}
.di-field.invalid .di-label {
  color: var(--app-danger);
}
.di-clear {
  position: absolute;
  right: 12px;
  top: 14px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--app-ink) 14%, var(--app-soft));
  color: var(--app-ink);
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
  transition: transform 150ms var(--ease-out), opacity 150ms var(--ease-out);
}
.di-clear.show {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.di-error {
  margin: 6px 2px 0 !important;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--app-danger);
}
.di-count {
  margin: 6px 2px 0 !important;
  font-size: 12px;
  line-height: 1.5;
  color: var(--app-ink-2);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.di-msg-enter-active {
  transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out);
}
.di-msg-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
@keyframes di-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}
</style>
