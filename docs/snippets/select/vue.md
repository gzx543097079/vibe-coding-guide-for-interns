```vue
<script setup>
import { computed, nextTick, ref } from 'vue'

const props = defineProps({ options: Array }) // [{ value, label, disabled }]
const model = defineModel()
const open = ref(false)
const active = ref(model.value)
const btn = ref(null)
const list = ref(null)
const enabled = computed(() => props.options.filter((o) => !o.disabled))
const current = computed(() => props.options.find((o) => o.value === model.value))

async function show() {
  active.value = model.value
  open.value = true
  await nextTick()
  list.value.focus()
}
function close(refocus = true) {
  open.value = false
  if (refocus) btn.value.focus() // Esc 或选中后焦点回到触发按钮
}
function choose(o) {
  if (!o || o.disabled) return
  model.value = o.value
  close()
}
// 方向键只在可用项之间移动
function move(step) {
  const items = enabled.value
  const i = items.findIndex((o) => o.value === active.value)
  active.value = items[Math.min(Math.max(i + step, 0), items.length - 1)].value
}
</script>

<template>
  <!-- 样式同 HTML 版 -->
  <div class="select">
    <span id="city-label">城市</span>
    <button id="city-btn" ref="btn" type="button" aria-haspopup="listbox" :aria-expanded="open"
      aria-labelledby="city-label city-btn" @mousedown.prevent @click="open ? close() : show()">
      {{ current?.label }} <span class="arrow" aria-hidden="true">▾</span>
    </button>
    <ul v-if="open" ref="list" role="listbox" tabindex="-1" aria-labelledby="city-label"
      :aria-activedescendant="`city-${active}`"
      @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="choose(enabled.find((o) => o.value === active))"
      @keydown.esc.prevent="close()" @blur="(e) => e.relatedTarget !== btn && close(false)">
      <li v-for="o in options" :id="`city-${o.value}`" :key="o.value" role="option"
        :aria-selected="o.value === model" :aria-disabled="o.disabled || undefined"
        :class="{ active: o.value === active }" @click="choose(o)">
        {{ o.label }}
      </li>
    </ul>
  </div>
</template>
```
