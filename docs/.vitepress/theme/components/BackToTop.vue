<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const show = ref(false)
const onScroll = () => (show.value = window.scrollY > 640)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function toTop() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  ;(document.activeElement as HTMLElement | null)?.blur()
}
</script>

<template>
  <button type="button" class="tt" :class="{ on: show }" :tabindex="show ? 0 : -1" :aria-hidden="!show" aria-label="回到顶部" @click="toTop">
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </button>
</template>

<style scoped>
.tt {
  position: fixed;
  right: max(20px, env(safe-area-inset-right));
  bottom: max(20px, env(safe-area-inset-bottom));
  z-index: 40;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink);
  box-shadow: var(--shadow-2);
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  transition: opacity var(--dur-2) var(--ease), transform var(--dur-2) var(--ease);
}
.tt.on {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.tt:hover {
  transform: translateY(-2px);
}
.tt:active {
  transform: scale(0.95);
}
</style>
