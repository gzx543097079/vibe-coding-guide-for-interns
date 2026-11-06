<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { findChapter } from '../data/modules'

const { page, frontmatter } = useData()
const here = computed(() => findChapter(page.value.relativePath))
const updated = computed(() => {
  const t = page.value.lastUpdated
  if (!t) return ''
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(t))
})
</script>

<template>
  <header class="dh">
    <nav v-if="here" class="dh-crumb" aria-label="面包屑">
      <a :href="withBase('/')">首页</a>
      <span aria-hidden="true">/</span>
      <a :href="withBase(`/#m-${here.module.id}`)" :data-mod="here.module.id">
        <i class="dh-dot" aria-hidden="true" />{{ here.module.name }}
      </a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{{ page.title }}</span>
    </nav>
    <h1 class="dh-title">{{ page.title }}</h1>
    <p v-if="frontmatter.description" class="dh-lead">{{ frontmatter.description }}</p>
    <p class="dh-meta">
      <span v-if="here">第 {{ here.index + 1 }} / {{ here.module.chapters.length }} 章</span>
      <span v-if="updated">上次更新 {{ updated }}</span>
    </p>
  </header>
</template>

<style scoped>
.dh {
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--rule);
}
.dh-crumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  margin-bottom: 14px;
  font-size: 13.5px;
  color: var(--ink-3);
}
.dh-crumb a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-3);
  text-decoration: none;
  transition: color var(--dur-1) var(--ease);
}
.dh-crumb a:hover {
  color: var(--ink);
}
.dh-crumb [aria-current] {
  color: var(--ink-2);
}
.dh-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--mod);
}
.dh-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 40px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink);
  text-wrap: balance;
}
.dh-lead {
  margin: 12px 0 0;
  font-size: 18px;
  line-height: 1.7;
  color: var(--ink-2);
}
.dh-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  margin: 14px 0 0;
  font-size: 13px;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}
@media (max-width: 639px) {
  .dh-title {
    font-size: 30px;
  }
  .dh-lead {
    font-size: 16.5px;
  }
}
</style>
