```vue
<script setup>
import { nextTick, onMounted, ref } from 'vue'

const tabs = ['全部', '待付款', '待发货', '已完成']
const current = ref(0)
const tabEls = [] // 用函数 ref 按下标存，保证顺序
const barStyle = ref({})

function moveIndicator() {
  const el = tabEls[current.value]
  barStyle.value = { transform: `translateX(${el.offsetLeft}px) scaleX(${el.offsetWidth / 100})` }
}

async function select(i) {
  current.value = (i + tabs.length) % tabs.length
  await nextTick()
  tabEls[current.value].focus()
  moveIndicator()
}

function onKeydown(e) {
  const next = { ArrowRight: current.value + 1, ArrowLeft: current.value - 1, Home: 0, End: tabs.length - 1 }[e.key]
  if (next === undefined) return
  e.preventDefault()
  select(next)
}

onMounted(moveIndicator)
</script>

<template>
  <!-- 样式同 HTML 版 -->
  <div role="tablist" aria-label="订单" @keydown="onKeydown">
    <button v-for="(t, i) in tabs" :id="`tab-${i}`" :key="t" :ref="(el) => (tabEls[i] = el)" role="tab"
      :aria-selected="current === i" :aria-controls="current === i ? `panel-${i}` : undefined"
      :tabindex="current === i ? 0 : -1" @click="select(i)">
      {{ t }}
    </button>
    <span class="indicator" :style="barStyle" aria-hidden="true" />
  </div>
  <!-- key 变化时重新挂载，触发 CSS 淡入 -->
  <section :id="`panel-${current}`" :key="current" role="tabpanel" :aria-labelledby="`tab-${current}`" tabindex="0">
    {{ tabs[current] }}订单
  </section>
</template>
```
