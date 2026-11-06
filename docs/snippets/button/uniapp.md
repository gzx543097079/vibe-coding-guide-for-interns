```vue
<template>
  <button type="primary" :loading="loading" :disabled="loading" @click="onSubmit">提交</button>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const onSubmit = () => {
  loading.value = true
}
</script>
```
