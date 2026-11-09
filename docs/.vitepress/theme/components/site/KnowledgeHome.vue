<script setup lang="ts">
import { withBase } from 'vitepress'
import { allChapters, modules, totalChapters } from '../../data/modules'
import SiteIcon from './SiteIcon.vue'

const search = () => window.dispatchEvent(new CustomEvent('vcg:palette'))
const featured = allChapters.find((c) => c.chapter.id === 'start/structure') ?? allChapters[0]
const readIds = ['ai/llm', 'ai/mcp', 'controls/button', 'git/github', 'quality/debugging']
const readNext = allChapters.filter((c) => readIds.includes(c.chapter.id))
</script>

<template>
  <div class="kb-home">
    <section class="kb-hero">
      <p class="kb-eyebrow">DOCS · {{ totalChapters }} POSTS · {{ modules.length }} MODULES</p>
      <h1>Vibe Coding 开发指南</h1>
      <p class="kb-hero-lead">环境、代码、调试和交付时随手查的 {{ totalChapters }} 篇中文笔记，按 {{ modules.length }} 个方向分了组，每一篇都能单独读。</p>
      <div class="kb-hero-actions">
        <button class="kb-btn-primary" type="button" @click="search"><SiteIcon name="search" :size="17" />搜索<kbd>⌘ K</kbd></button>
        <a class="kb-btn-secondary" :href="withBase('/learn')">浏览全部方向</a>
      </div>
    </section>

    <section class="kb-picks">
      <a class="kb-feature" :href="withBase(featured.chapter.link)">
        <p class="kb-kicker">本期推荐</p>
        <h2>{{ featured.chapter.title }}</h2>
        <p class="kb-feature-deck">{{ featured.chapter.summary }}</p>
        <p class="kb-feature-meta">{{ featured.module.name }} · {{ featured.chapter.level }}</p>
        <span class="kb-feature-more">开始阅读 →</span>
      </a>
      <div class="kb-readnext">
        <p class="kb-kicker">接着读</p>
        <a v-for="c in readNext" :key="c.chapter.id" :href="withBase(c.chapter.link)">
          <span class="t">{{ c.chapter.title }}</span>
          <span class="m">{{ c.module.name }} · {{ c.chapter.level }}</span>
        </a>
        <a class="kb-readnext-all" :href="withBase('/learn')">全部 {{ totalChapters }} 篇 →</a>
      </div>
    </section>

    <section class="kb-topics">
      <p class="kb-kicker">按方向浏览</p>
      <div class="kb-topics-grid">
        <a v-for="m in modules" :key="m.id" :href="withBase('/courses/' + m.id)">
          <span class="no">{{ String(m.no).padStart(2, '0') }}</span>
          <span class="nm">{{ m.name }}</span>
          <span class="ct">{{ m.chapters.length }} 篇</span>
        </a>
      </div>
    </section>

    <nav class="kb-home-links" aria-label="其他页面">
      <a :href="withBase('/paths')">阅读路线</a>
      <a :href="withBase('/lab')">组件演示</a>
      <a :href="withBase('/growth/prompt-templates')">需求模板</a>
      <a :href="withBase('/glossary')">名词解释</a>
      <a href="https://github.com/gzx543097079/vibe-coding-guide-for-interns" target="_blank" rel="noopener">在 GitHub 上编辑</a>
    </nav>
  </div>
</template>
