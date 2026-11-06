<script setup lang="ts">
import { onMounted } from 'vue'

// 默认主题的侧边栏无障碍名称是英文，这里改成中文
onMounted(() => {
  const el = document.getElementById('sidebar-aria-label')
  if (el) el.textContent = '章节导航'
})
</script>

<template>
  <span hidden />
</template>
