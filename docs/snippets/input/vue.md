```vue
<script setup>
import { ref } from 'vue'

const email = ref('')
const error = ref('')
const shaking = ref(false)
const inputEl = ref(null)
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function validate() {
  const bad = email.value !== '' && !isEmail(email.value)
  error.value = bad ? '邮箱格式不对，例如 name@example.com' : ''
  shaking.value = bad
}

function clear() {
  email.value = ''
  error.value = ''
  inputEl.value.focus()
}
</script>

<template>
  <!-- 样式同 HTML 版：placeholder=" " + :placeholder-shown 控制浮动标签 -->
  <div class="field" :class="{ shake: shaking }" @animationend="shaking = false">
    <input
      id="email"
      ref="inputEl"
      v-model="email"
      type="email"
      placeholder=" "
      autocomplete="email"
      :aria-invalid="error !== ''"
      aria-describedby="email-err"
      @blur="validate"
    />
    <label for="email">邮箱</label>
    <!-- mousedown.prevent：点清除时输入框不先失焦 -->
    <button v-if="email" type="button" class="clear" aria-label="清除邮箱" @mousedown.prevent @click="clear">×</button>
    <p id="email-err" class="err" aria-live="polite">{{ error }}</p>
  </div>
</template>
```
