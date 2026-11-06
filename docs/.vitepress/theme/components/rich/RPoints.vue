<script setup lang="ts">
// 要点网格：包住若干 RPoint。cols 控制宽屏列数（2 或 3），窄屏自动单列
defineProps<{ cols?: 2 | 3 | '2' | '3' }>()
</script>

<template>
  <div class="rx-points" :data-cols="String(cols ?? 2)">
    <slot />
  </div>
</template>
