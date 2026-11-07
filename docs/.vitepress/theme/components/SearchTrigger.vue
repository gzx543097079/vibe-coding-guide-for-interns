<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 打开命令面板的入口：顶栏用紧凑样式，侧边栏顶部用整行样式
defineProps<{ variant?: 'nav' | 'sidebar' }>()
const key = ref('⌘K')

onMounted(() => {
  if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) key.value = 'Ctrl K'
  // 默认主题的侧边栏无障碍名称是英文，这里改成中文
  const label = document.getElementById('sidebar-aria-label')
  if (label) label.textContent = '章节导航'
})
const open = () => window.dispatchEvent(new CustomEvent('vcg:palette'))
</script>

<template>
  <button type="button" class="st" :class="variant ?? 'nav'" aria-label="搜索文档" @click="open">
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
    <span class="st-text">搜索文档</span>
    <kbd class="st-key">{{ key }}</kbd>
  </button>
</template>

<style scoped>
.st {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 8px 0 12px;
  border-radius: var(--radius);
  border: 1px solid var(--rule);
  background: var(--paper-2);
  color: var(--ink-3);
  font-size: 14px;
  transition: transform var(--dur-1) var(--ease);
}
.st:hover {
  border-color: var(--rule-strong);
  color: var(--ink-2);
}
.st:active {
  transform: scale(0.98);
}
.st-text {
  margin-right: 12px;
}
.st-key {
  margin-left: auto;
  padding: 1px 6px;
  border-radius: 5px;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  font-family: var(--font-sans);
  font-size: 11.5px;
  color: var(--ink-3);
}
.st.nav {
  margin-left: 16px;
  min-width: 220px;
}
.st.sidebar {
  display: flex;
  width: 100%;
  margin: 16px 0 10px;
  height: 40px;
}
@media (max-width: 767px) {
  .st.nav {
    min-width: 0;
    width: 44px;
    height: 44px;
    margin-left: 8px;
    padding: 0;
    justify-content: center;
    border-color: transparent;
    background: transparent;
  }
  .st.nav .st-text,
  .st.nav .st-key {
    display: none;
  }
}
@media (max-width: 959px) {
  .st.sidebar {
    height: 44px;
  }
}
@media (pointer: coarse) {
  .st-key {
    display: none;
  }
}
</style>

<style>
/* 宽屏时顶栏入口与侧栏入口二选一：有侧栏的页面只在侧栏显示 */
@media (min-width: 960px) {
  .VPNavBar.has-sidebar .st.nav {
    display: none;
  }
}
</style>
