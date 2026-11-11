<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { findChapter, totalChapters } from '../../data/modules'

const { isDark, page } = useData()
const nav = [
  { name: '目录', link: '/', key: 'index' },
  { name: '阅读路线', link: '/paths', key: 'paths' },
  { name: '组件演示', link: '/lab', key: 'lab' },
  { name: '需求模板', link: '/growth/prompt-templates', key: 'briefs' },
  { name: '名词解释', link: '/glossary', key: 'glossary' },
]
// 章节页、方向页都归到「目录」，顶栏当前态始终明确
const current = computed(() => {
  const path = page.value.relativePath
  if (path === 'paths.md') return 'paths'
  if (path === 'lab.md') return 'lab'
  if (path === 'growth/prompt-templates.md') return 'briefs'
  if (path === 'glossary.md') return 'glossary'
  if (path === 'index.md' || path === 'learn.md' || path.startsWith('courses/')) return 'index'
  return findChapter(path) ? 'index' : ''
})
const search = () => window.dispatchEvent(new CustomEvent('vcg:palette'))
</script>

<template>
  <header class="at-top">
    <a class="at-brand" :href="withBase('/')">Vibe Coding 开发指南</a>
    <nav class="at-nav" aria-label="主导航">
      <a
        v-for="item in nav"
        :key="item.key"
        :href="withBase(item.link)"
        :aria-current="current === item.key ? 'page' : undefined"
      >{{ item.name }}</a>
    </nav>
    <button class="at-search" type="button" @click="search">
      <span>搜索 {{ totalChapters }} 篇章节</span><kbd>⌘ K</kbd>
    </button>
    <button
      class="at-theme"
      type="button"
      aria-label="切换深色和浅色模式"
      @click="isDark = !isDark"
    >
      <!-- 两个文字都渲染，由样式按当前模式显示其中一个：服务端输出和客户端首帧一致，不会有水合不匹配 -->
      <span class="at-when-light">深色</span><span class="at-when-dark">浅色</span>
    </button>
    <a
      class="at-theme"
      href="https://github.com/gzx543097079/vibe-coding-guide-for-interns"
      target="_blank"
      rel="noopener"
    >GitHub</a>
  </header>
</template>
