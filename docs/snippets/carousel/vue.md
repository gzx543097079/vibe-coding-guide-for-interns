```vue
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
const props = defineProps({ slides: { type: Array, required: true } })
const index = ref(0), dx = ref(0), dragging = ref(false), paused = ref(false)
const viewport = ref(null)
let startX = 0, timer
const go = (i) => { index.value = (i + props.slides.length) % props.slides.length }
const offset = computed(() => `translateX(calc(${-index.value * 100}% + ${dx.value}px))`)

function down(e) { startX = e.clientX; dragging.value = true; e.currentTarget.setPointerCapture(e.pointerId) }
function move(e) { if (dragging.value) dx.value = e.clientX - startX }
function up() {
  dragging.value = false
  if (Math.abs(dx.value) > viewport.value.clientWidth / 5) go(index.value - Math.sign(dx.value))
  dx.value = 0
}
onMounted(() => {
  // 减少动态效果时不自动播放
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => { if (!paused.value) go(index.value + 1) }, 4000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="carousel" aria-roledescription="carousel" aria-label="精选内容"
    @mouseenter="paused = true" @mouseleave="paused = false"
    @focusin="paused = true" @focusout="paused = false">
    <div ref="viewport" class="viewport">
      <div class="track" :class="{ dragging }" :style="{ transform: offset }" :aria-live="paused ? 'polite' : 'off'"
        @pointerdown="down" @pointermove="move" @pointerup="up">
        <div v-for="(s, i) in slides" :key="i" class="slide" role="group"
          aria-roledescription="slide" :aria-label="`${i + 1} / ${slides.length}`">{{ s }}</div>
      </div>
    </div>
    <button type="button" class="prev" aria-label="上一张" @click="go(index - 1)">‹</button>
    <button type="button" class="next" aria-label="下一张" @click="go(index + 1)">›</button>
    <div class="dots">
      <button v-for="(_, i) in slides" :key="i" type="button" :aria-label="`第 ${i + 1} 张`"
        :aria-current="i === index" @click="go(i)" />
    </div>
  </section>
</template>
```
