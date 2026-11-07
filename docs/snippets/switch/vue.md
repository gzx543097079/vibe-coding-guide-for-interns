```vue
<script setup>
const on = defineModel({ type: Boolean, default: true })
defineProps({ label: String })
</script>

<template>
  <button type="button" role="switch" :aria-checked="on" :aria-label="label" class="switch" @click="on = !on">
    <span class="thumb" />
  </button>
</template>
```
