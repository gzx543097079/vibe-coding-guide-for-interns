<script setup lang="ts">
import { computed, nextTick, provide, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import DocHeader from './components/DocHeader.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import BackToTop from './components/BackToTop.vue'
import CommandPalette from './components/CommandPalette.vue'
import SearchTrigger from './components/SearchTrigger.vue'

const { isDark, frontmatter } = useData()
const route = useRoute()
const isDoc = computed(() => frontmatter.value.layout !== 'home')
const reduce = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// 深浅色切换：支持 View Transition 时交叉淡化
provide('toggle-appearance', async () => {
  const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => { ready: Promise<void> } }
  if (!doc.startViewTransition || reduce()) {
    isDark.value = !isDark.value
    return
  }
  await doc.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready
})

// 页面切换时内容区淡入
watch(
  () => route.path,
  () => {
    if (reduce()) return
    const el = document.documentElement
    el.classList.remove('page-enter')
    void el.offsetWidth
    el.classList.add('page-enter')
  },
)
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <ReadingProgress v-if="isDoc" />
    </template>
    <template #nav-bar-content-before>
      <SearchTrigger variant="nav" />
    </template>
    <template #sidebar-nav-before>
      <SearchTrigger variant="sidebar" />
    </template>
    <template #doc-before>
      <DocHeader />
    </template>
    <template #layout-bottom>
      <BackToTop />
      <CommandPalette />
    </template>
  </DefaultTheme.Layout>
</template>
