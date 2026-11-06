```vue
<script setup>
import { ref } from 'vue'

const tabs = ['首页', '发现', '我的']
const index = ref(0)
</script>

<template>
  <div role="tablist" aria-label="主导航">
    <button
      v-for="(label, i) in tabs"
      :key="label"
      role="tab"
      :aria-selected="i === index"
      :tabindex="i === index ? 0 : -1"
      @click="index = i"
    >
      {{ label }}
    </button>
  </div>
  <section role="tabpanel">{{ tabs[index] }}的内容</section>
</template>
```
