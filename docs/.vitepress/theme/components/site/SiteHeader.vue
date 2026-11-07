<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { findChapter } from '../../data/modules'
import SiteIcon from './SiteIcon.vue'
const { isDark, page } = useData()
const route = useRoute()
const menu = ref(false)
const nav = [
  { name: '工作台', link: '/', key: 'home' },
  { name: '工作区', link: '/learn', key: 'learn' },
  { name: '任务线', link: '/paths', key: 'paths' },
  { name: '实验室', link: '/lab', key: 'lab' },
  { name: '任务简报', link: '/growth/prompt-templates', key: 'briefs' },
]
const current = computed(() => {
  const path = page.value.relativePath
  if (path === 'index.md' || page.value.isNotFound) return 'home'
  if (path === 'learn.md' || path.startsWith('courses/')) return 'learn'
  if (path === 'paths.md') return 'paths'
  if (path === 'lab.md') return 'lab'
  if (path === 'growth/prompt-templates.md') return 'briefs'
  return ''
})
const chapter = computed(() => findChapter(page.value.relativePath))
watch(
  () => route.path,
  () => {
    menu.value = false
  },
)
const search = () => window.dispatchEvent(new CustomEvent('vcg:palette'))
</script>
<template>
  <header class="site-header">
    <div class="header-inner">
      <a
        class="site-brand"
        :href="withBase('/')"
        aria-label="Vibe Coding 工程交付台首页"
      >
        <span class="brand-symbol" aria-hidden="true"
          ><SiteIcon name="code" :size="23"
        /></span>
        <span>Vibe Coding<span class="brand-caption">工程交付台</span></span>
      </a>
      <nav class="site-nav" aria-label="主导航">
        <a
          v-for="item in nav"
          :key="item.key"
          :href="withBase(item.link)"
          :class="{ active: current === item.key }"
          :aria-current="current === item.key ? 'page' : undefined"
          >{{ item.name }}</a
        >
      </nav>
      <div class="header-tools">
        <a
          v-if="chapter"
          class="header-context"
          :href="withBase('/courses/' + chapter.module.id)"
          >当前工作区 · {{ chapter.module.name }}</a
        >
        <button class="site-search" type="button" @click="search">
          <SiteIcon name="search" :size="17" /><span>快速跳转</span
          ><kbd>⌘ K</kbd>
        </button>
        <button
          class="icon-button"
          type="button"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          @click="isDark = !isDark"
        >
          <SiteIcon :name="isDark ? 'sun' : 'moon'" :size="19" />
        </button>
        <a
          class="icon-button github-link"
          href="https://github.com/gzx543097079/vibe-coding-guide-for-interns"
          target="_blank"
          rel="noopener"
          aria-label="GitHub 仓库"
          ><SiteIcon name="github" :size="20"
        /></a>
        <button
          class="icon-button compact-menu"
          type="button"
          :aria-expanded="menu"
          aria-controls="compact-navigation"
          aria-label="展开导航"
          @click="menu = !menu"
        >
          <SiteIcon :name="menu ? 'close' : 'menu'" />
        </button>
      </div>
    </div>
    <nav
      v-if="menu"
      id="compact-navigation"
      class="compact-navigation"
      aria-label="折叠导航"
    >
      <a v-for="item in nav" :key="item.key" :href="withBase(item.link)">{{
        item.name
      }}</a>
    </nav>
  </header>
</template>
