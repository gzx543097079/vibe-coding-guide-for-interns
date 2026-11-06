```vue
<script setup>
import { computed, ref, watch } from 'vue'
const props = defineProps({ words: Array, recent: Array })
const query = ref(''), debounced = ref(''), open = ref(false), active = ref(-1)
let timer
// 防抖 150ms
watch(query, (q) => { clearTimeout(timer); timer = setTimeout(() => { debounced.value = q.trim(); active.value = -1 }, 150) })

const items = computed(() => debounced.value ? props.words.filter((w) => w.includes(debounced.value)) : props.recent)
// 拆成「前 / 匹配 / 后」三段，模板里只加粗中间段
const parts = (w) => { const q = debounced.value, i = q ? w.indexOf(q) : -1; return i < 0 ? [w, '', ''] : [w.slice(0, i), q, w.slice(i + q.length)] }
const choose = (w) => { query.value = w; open.value = false }

function onKey(e) {
  const n = items.value.length
  if (e.key === 'ArrowDown' && n) { e.preventDefault(); open.value = true; active.value = (active.value + 1) % n }
  else if (e.key === 'ArrowUp' && n) { e.preventDefault(); active.value = (active.value - 1 + n) % n }
  else if (e.key === 'Enter' && active.value >= 0) { e.preventDefault(); choose(items.value[active.value]) }
  else if (e.key === 'Escape') open.value = false
}
</script>

<template>
  <div class="search">
    <input v-model="query" type="search" role="combobox" aria-label="搜索" aria-autocomplete="list"
      aria-controls="suggest" :aria-expanded="open && items.length > 0"
      :aria-activedescendant="active >= 0 ? `opt-${active}` : undefined"
      @focus="open = true" @input="open = true" @blur="open = false" @keydown="onKey" />
    <button v-if="query" type="button" aria-label="清除" @click="query = ''">×</button>
    <template v-if="open">
      <p v-if="!debounced && items.length" id="suggest-title">最近搜索</p>
      <ul v-show="items.length" id="suggest" role="listbox" aria-label="搜索建议">
        <li v-for="(w, i) in items" :id="`opt-${i}`" :key="w" role="option" :aria-selected="i === active"
          @pointerdown.prevent="choose(w)">{{ parts(w)[0] }}<b>{{ parts(w)[1] }}</b>{{ parts(w)[2] }}</li>
      </ul>
    </template>
    <p aria-live="polite">{{ open && debounced && !items.length ? `没有找到「${debounced}」相关结果` : '' }}</p>
  </div>
</template>
```
