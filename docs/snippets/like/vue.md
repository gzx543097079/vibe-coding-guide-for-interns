```vue
<script setup>
import { ref } from 'vue'
const props = defineProps({ initial: { type: Number, default: 0 } })
const liked = ref(false)
const count = ref(props.initial)
const anim = ref('') // 'pop' | 'shrink'
const tick = ref(0) // 变化时作为 key 让动画重新播放

function toggle() {
  liked.value = !liked.value
  count.value += liked.value ? 1 : -1
  anim.value = liked.value ? 'pop' : 'shrink' // 取消点赞不爆发
  tick.value++
}
</script>

<template>
  <!-- 样式与 keyframes 沿用 html 版本的 .like / .pop / .shrink / .roll -->
  <button type="button" class="like" :class="anim" :aria-pressed="liked" @click="toggle">
    <span :key="`b${tick}`" class="burst" aria-hidden="true">
      <i v-for="i in 8" :key="i" :style="{ '--i': i - 1 }" />
    </span>
    <svg :key="`h${tick}`" class="heart" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21 3.5 12.5a5 5 0 0 1 7-7L12 7l1.5-1.5a5 5 0 0 1 7 7Z" />
    </svg>
    <span class="sr-only">赞</span>
    <span class="count">
      <span :key="count" :class="{ roll: tick > 0 }">{{ count }}</span>
    </span>
  </button>
</template>
```
