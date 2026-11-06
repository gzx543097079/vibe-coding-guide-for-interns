```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)
</script>

<template>
  <button type="button" class="btn" :disabled="loading" @click="loading = true">
    {{ loading ? '提交中…' : '提交' }}
  </button>
</template>
```
