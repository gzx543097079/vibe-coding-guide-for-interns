<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import { findStation, totalStations } from '../data/metro'

const { page } = useData()
const here = computed(() => findStation(page.value.relativePath))

// 默认主题的侧边栏无障碍名称是英文，这里改成中文
onMounted(() => {
  const el = document.getElementById('sidebar-aria-label')
  if (el) el.textContent = '章节导航'
})
</script>

<template>
  <div v-if="here" class="sh" :data-line="here.line.id">
    <span class="sh-badge" aria-hidden="true">{{ here.line.no }}</span>
    <span class="sh-text">
      <span class="sh-label">你在这里</span>
      <span class="sh-pos">{{ here.line.name }}</span>
      <span class="sh-n">第 {{ here.index + 1 }}/{{ here.line.stations.length }} 站 · 全程 {{ here.order + 1 }}/{{ totalStations }}</span>
    </span>
  </div>
</template>

<style scoped>
.sh {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 14px 0 6px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--paper);
  border: 1px solid var(--rule);
}
.sh-badge {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--line);
  color: var(--on-line);
  font-weight: 750;
  font-size: 13.5px;
}
.sh-text {
  display: grid;
  min-width: 0;
  line-height: 1.35;
}
.sh-label {
  font-size: 11.5px;
  color: var(--ink-3);
}
.sh-pos {
  font-size: 13px;
  font-weight: 650;
  color: var(--ink);
}
.sh-n {
  white-space: nowrap;
  font-size: 12px;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}
</style>
