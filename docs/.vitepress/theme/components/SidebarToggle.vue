<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 桌面端折叠 / 展开整个侧边栏，状态记在 localStorage
const KEY = 'vcg:sidebar-collapsed'
const collapsed = ref(false)

const apply = (v: boolean) => {
  collapsed.value = v
  document.documentElement.classList.toggle('sidebar-collapsed', v)
  try { localStorage.setItem(KEY, v ? '1' : '0') } catch { /* 隐私模式下忽略 */ }
}

onMounted(() => {
  let saved = false
  try { saved = localStorage.getItem(KEY) === '1' } catch { /* 忽略 */ }
  collapsed.value = saved
  document.documentElement.classList.toggle('sidebar-collapsed', saved)
  // 首次渲染完成后才开启过渡，避免进入页面时播放折叠动画
  setTimeout(() => document.documentElement.classList.add('sb-anim'), 80)
})
</script>

<template>
  <button
    type="button"
    class="sb-toggle"
    :aria-label="collapsed ? '展开侧边栏' : '收起侧边栏'"
    :aria-pressed="collapsed"
    :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
    @click="apply(!collapsed)"
  >
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="2" y="3" width="14" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M7 3.5v11" stroke="currentColor" stroke-width="1.5" />
      <path v-if="!collapsed" d="m11.6 7-2 2 2 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path v-else d="m9.6 7 2 2-2 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>

<style scoped>
.sb-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: none;
  margin-right: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--rule);
  background: var(--paper-2);
  color: var(--ink-3);
  transition: color var(--dur-1) var(--ease), border-color var(--dur-1) var(--ease), background-color var(--dur-1) var(--ease);
}
.sb-toggle:hover {
  background: var(--paper-3, var(--paper-2));
  color: var(--ink);
  border-color: var(--rule-strong);
}
.sb-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
/* 固定在顶栏左上角，不放进标题链接里（否则点击会跳回首页） */
@media (min-width: 960px) {
  .sb-toggle {
    display: inline-flex;
    position: fixed;
    z-index: calc(var(--vp-z-index-nav, 30) + 1);
    top: calc((var(--vp-nav-height) - 36px) / 2);
    left: 20px;
    margin: 0;
  }
}
</style>
