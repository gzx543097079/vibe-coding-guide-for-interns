```vue
<script setup>
import { ref } from 'vue'

const items = ref([{ id: 1, title: '构建通知' }])
const loading = ref(false)

async function reload() {
  loading.value = true
  // items.value = await fetchMessages()
  loading.value = false
}
const remove = (id) => {
  items.value = items.value.filter((i) => i.id !== id)
}
</script>

<template>
  <button type="button" :disabled="loading" @click="reload">{{ loading ? '刷新中…' : '刷新' }}</button>
  <TransitionGroup tag="ul" name="list">
    <li v-for="item in items" :key="item.id">
      {{ item.title }}
      <button type="button" @click="remove(item.id)">删除</button>
    </li>
  </TransitionGroup>
</template>
```
