```vue
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const dialog = ref(null)

watch(
  () => props.open,
  (open) => {
    if (open && !dialog.value.open) dialog.value.showModal()
    if (!open && dialog.value.open) dialog.value.close()
  },
)
</script>

<template>
  <dialog ref="dialog" aria-labelledby="confirm-title" @cancel="emit('close', false)">
    <h2 id="confirm-title">删除这篇文档？</h2>
    <button @click="emit('close', false)">取消</button>
    <button @click="emit('close', true)">删除</button>
  </dialog>
</template>
```
