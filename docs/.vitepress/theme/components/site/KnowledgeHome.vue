<script setup lang="ts">
import { withBase } from 'vitepress'
import { modules, totalChapters } from '../../data/modules'
import SiteIcon from './SiteIcon.vue'

const search = () => window.dispatchEvent(new CustomEvent('vcg:palette'))
const first = modules[0].chapters[0]
</script>

<template>
  <div class="kb-home">
    <section class="kb-hero">
      <p class="kb-eyebrow">DOCS · {{ totalChapters }} POSTS · {{ modules.length }} MODULES</p>
      <h1>Vibe Coding 开发指南</h1>
      <p class="kb-hero-lead">环境、代码、调试和交付时随手查的 {{ totalChapters }} 篇中文笔记，按 {{ modules.length }} 个方向分了组，每一篇都能单独读。</p>
      <div class="kb-hero-actions">
        <button class="kb-btn-primary" type="button" @click="search">
          <SiteIcon name="search" :size="17" />搜索<kbd>⌘ K</kbd>
        </button>
        <a class="kb-btn-secondary" :href="withBase(first.link)">从第一篇读起<SiteIcon name="arrow" :size="16" /></a>
      </div>
    </section>

    <section class="kb-cards" aria-label="全部方向">
      <a v-for="m in modules" :key="m.id" class="kb-card" :href="withBase('/courses/' + m.id)">
        <span class="kb-card-ic">{{ String(m.no).padStart(2, '0') }}</span>
        <h3>{{ m.name }}<span class="kb-card-count">{{ m.chapters.length }} 篇</span></h3>
        <p>{{ m.intro }}</p>
      </a>
    </section>

    <nav class="kb-home-links" aria-label="其他页面">
      <a :href="withBase('/learn')">目录</a>
      <a :href="withBase('/paths')">阅读路线</a>
      <a :href="withBase('/lab')">组件演示</a>
      <a :href="withBase('/growth/prompt-templates')">需求模板</a>
      <a :href="withBase('/glossary')">名词解释</a>
      <a href="https://github.com/gzx543097079/vibe-coding-guide-for-interns" target="_blank" rel="noopener">在 GitHub 上编辑</a>
    </nav>
  </div>
</template>
