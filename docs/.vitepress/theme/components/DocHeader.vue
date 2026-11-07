<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { findChapter, chapterTag } from '../data/modules'

const { page, frontmatter, theme } = useData()
const here = computed(() => findChapter(page.value.relativePath))
const tag = computed(() => (here.value ? chapterTag(here.value) : ''))
const draft = computed(() => frontmatter.value.status === 'draft')
// 编辑链接沿用 config 里的 editLink.pattern
const editUrl = computed(() => {
  const pattern: string | undefined = theme.value.editLink?.pattern
  return pattern ? pattern.replace(':path', page.value.relativePath) : ''
})
const updated = computed(() => {
  const t = page.value.lastUpdated
  if (!t) return ''
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(t))
})
</script>

<template>
  <header class="dh" :data-mod="here?.module.id">
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
      <span v-if="here" class="dh-lv" :data-lv="here.chapter.level">{{ here.chapter.level }}</span>
      <span v-if="tag" class="dh-tag">{{ tag }}</span>
      <span v-if="here">第 {{ here.index + 1 }} / {{ here.module.chapters.length }} 章</span>
      <span v-if="updated">上次更新 {{ updated }}</span>
    </p>
    <div v-if="draft" class="dh-draft" role="note">
      <span class="dh-draft-badge">编写中</span>
      <p class="dh-draft-text">正文还没写完，下面先列出本章的三问。</p>
      <a v-if="editUrl" class="dh-draft-link" :href="editUrl" target="_blank" rel="noopener">
        参与编写
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </a>
    </div>
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
.dh-meta {
  align-items: center;
}
.dh-lv {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--mod-soft);
  color: var(--ink);
  font-size: 12px;
  font-weight: 650;
}
.dh-lv[data-lv='精通'] {
  background: var(--mod);
  color: var(--on-mod);
}
.dh-tag {
  padding: 1px 8px;
  border-radius: 999px;
  border: 1px solid var(--rule-strong);
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-2);
}

/* 草稿状态条：中性底色 + 细描边，不用色条 */
.dh-draft {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-top: 20px;
  padding: 10px 12px 10px 14px;
  border-radius: var(--radius);
  border: 1px solid var(--rule);
  background: var(--paper-2);
}
.dh-draft-badge {
  flex: none;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--warn-soft);
  color: var(--warn);
  font-size: 12px;
  font-weight: 650;
}
.dh-draft-text {
  flex: 1 1 260px;
  margin: 0 !important;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-2);
}
.dh-draft-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--accent-ink) !important;
  text-decoration: none !important;
  transition: background-color var(--dur-1) var(--ease);
}
.dh-draft-link:hover {
  background: var(--accent-soft);
}
.dh-draft-link svg {
  transition: transform var(--dur-2) var(--ease);
}
.dh-draft-link:hover svg {
  transform: translateX(2px);
}

@media (max-width: 639px) {
  .dh-draft-link {
    min-height: 44px;
    margin-left: -10px;
  }
  .dh-title {
    font-size: 30px;
  }
  .dh-lead {
    font-size: 16.5px;
  }
}
</style>
