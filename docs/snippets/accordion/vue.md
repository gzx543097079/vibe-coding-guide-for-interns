```vue
<script setup lang="ts">
import { ref, useId } from 'vue'

const props = withDefaults(defineProps<{
  items: { title: string; body: string }[]
  single?: boolean // 一次只展开一个
}>(), { single: true })

const uid = useId() // Vue 3.5+
const open = ref(new Set<number>([0]))

function toggle(i: number) {
  const next = new Set(props.single ? [] : open.value)
  if (open.value.has(i)) next.delete(i)
  else next.add(i)
  open.value = next
}
</script>

<template>
  <div class="accordion">
    <template v-for="(item, i) in items" :key="i">
      <h3>
        <button type="button" :id="`${uid}-h${i}`" :aria-expanded="open.has(i)"
                :aria-controls="`${uid}-p${i}`" @click="toggle(i)">
          {{ item.title }}
          <span class="chevron" aria-hidden="true">▾</span>
        </button>
      </h3>
      <div :id="`${uid}-p${i}`" role="region" :aria-labelledby="`${uid}-h${i}`"
           class="panel" :hidden="!open.has(i)">
        {{ item.body }}
      </div>
    </template>
  </div>
</template>

<style scoped>
button { display: flex; justify-content: space-between; width: 100%; padding: 12px 16px; }
.chevron { transition: transform 0.2s; }
[aria-expanded='true'] .chevron { transform: rotate(180deg); }
.panel:not([hidden]) { padding: 0 16px 12px; animation: fade-in 0.2s ease-out; }
@keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) {
  .chevron { transition: none; }
  .panel:not([hidden]) { animation: none; }
}
</style>
```
