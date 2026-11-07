<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 顶部阅读进度细条，只用 scaleX 变化
const bar = ref<HTMLElement>()
let raf = 0
function update() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
    bar.value?.style.setProperty('transform', `scaleX(${p.toFixed(4)})`)
  })
}
onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div class="rp" aria-hidden="true"><div ref="bar" class="rp-bar" /></div>
</template>

<style scoped>
.rp {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 2px;
  pointer-events: none;
}
.rp-bar {
  height: 100%;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
}
</style>
