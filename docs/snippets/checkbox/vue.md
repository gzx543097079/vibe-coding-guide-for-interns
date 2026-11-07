```vue
<script setup>
import { computed, ref } from 'vue'

const options = [
  { value: 'email', label: '邮件' },
  { value: 'sms', label: '短信' },
  { value: 'push', label: '推送' },
]
const picked = ref(['email'])
const theme = ref('light')

const allChecked = computed(() => picked.value.length === options.length)
const someChecked = computed(() => picked.value.length > 0 && !allChecked.value)

function toggleAll(e) {
  picked.value = e.target.checked ? options.map((o) => o.value) : []
}
</script>

<template>
  <fieldset>
    <legend>通知方式</legend>
    <!-- :indeterminate 会设置成 DOM 属性 -->
    <label>
      <input type="checkbox" :checked="allChecked" :indeterminate="someChecked" @change="toggleAll" /> 全选
    </label>
    <label v-for="o in options" :key="o.value" class="child">
      <input v-model="picked" type="checkbox" :value="o.value" /> {{ o.label }}
    </label>
  </fieldset>

  <fieldset>
    <legend>主题</legend>
    <label><input v-model="theme" type="radio" name="theme" value="light" /> 浅色</label>
    <label><input v-model="theme" type="radio" name="theme" value="dark" /> 深色</label>
  </fieldset>
</template>
```
