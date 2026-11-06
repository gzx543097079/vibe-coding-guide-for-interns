```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const user = ref<{ name: string; bio: string; avatar: string } | null>(null)
onMounted(async () => {
  user.value = await fetch('/api/me').then((r) => r.json())
})
</script>

<template>
  <div class="card" :aria-busy="!user">
    <Transition name="fade" mode="out-in">
      <div v-if="!user" class="row" aria-hidden="true">
        <span class="sk avatar" />
        <span class="sk line" />
        <span class="sk line short" />
      </div>
      <div v-else class="row">
        <img :src="user.avatar" alt="" class="avatar" />
        <strong>{{ user.name }}</strong>
        <span>{{ user.bio }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.row { display: grid; grid-template-columns: 40px 1fr; gap: 8px 12px; align-items: center; }
.avatar { grid-row: span 2; width: 40px; height: 40px; border-radius: 50%; }
.sk { position: relative; overflow: hidden; background: #e5e7eb; border-radius: 4px; }
.sk.avatar { border-radius: 50%; }
.line { height: 12px; width: 80%; }
.line.short { width: 50%; }
.sk::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.6), transparent);
  animation: shimmer 1.4s infinite; }
@keyframes shimmer { to { transform: translateX(100%); } }
.fade-enter-active { transition: opacity 0.3s; }
.fade-enter-from { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .sk::after { display: none; }
}
</style>
