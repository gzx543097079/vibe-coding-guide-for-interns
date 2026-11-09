<script setup lang="ts">
import { withBase } from 'vitepress'
import { levelCounts, modules, totalChapters } from '../../data/modules'
import SiteIcon from './SiteIcon.vue'

const search = () => window.dispatchEvent(new CustomEvent('vcg:palette'))
const first = modules[0].chapters[0]
</script>

<template>
  <div class="kb-home">
    <header class="kb-home-head">
      <h1>Vibe Coding 开发指南</h1>
      <p class="kb-home-lead">
        环境、代码、调试和交付时随手查的 {{ totalChapters }} 篇中文笔记，按 {{ modules.length }} 个方向分了组。
      </p>
      <div class="kb-home-actions">
        <button class="kb-btn-primary" type="button" @click="search">
          <SiteIcon name="search" :size="17" />搜索<kbd>⌘ K</kbd>
        </button>
        <a class="kb-btn-secondary" :href="withBase(first.link)">
          从第一篇读起<SiteIcon name="arrow" :size="16" />
        </a>
      </div>
      <p class="kb-home-note">阅读记录只存在这台电脑。</p>
    </header>

    <section class="kb-home-index" aria-labelledby="kb-index-title">
      <div class="kb-home-index-head">
        <h2 id="kb-index-title">目录</h2>
        <a :href="withBase('/learn')">按关键词找 <SiteIcon name="arrow" :size="14" /></a>
      </div>
      <div class="kb-home-grid">
        <section v-for="m in modules" :key="m.id" class="kb-home-module">
          <div class="kb-home-module-head">
            <span class="kb-home-module-no">{{ String(m.no).padStart(2, '0') }}</span>
            <h3><a :href="withBase('/courses/' + m.id)">{{ m.name }}</a></h3>
            <span class="kb-home-module-count">{{ m.chapters.length }} 篇</span>
          </div>
          <p class="kb-home-module-intro">{{ m.intro }}</p>
          <p class="kb-home-module-levels">
            <span v-for="lc in levelCounts(m)" :key="lc.level">{{ lc.level }} {{ lc.count }}</span>
          </p>
          <ul class="kb-home-chapters">
            <li v-for="(c, i) in m.chapters.slice(0, 3)" :key="c.id">
              <span class="kb-home-chapter-no">{{ String(m.no).padStart(2, '0') }}.{{ String(i + 1).padStart(2, '0') }}</span>
              <a :href="withBase(c.link)" :title="c.summary">{{ c.short }}</a>
              <span class="kb-home-chapter-level">{{ c.level }}</span>
            </li>
          </ul>
          <a class="kb-home-module-more" :href="withBase('/courses/' + m.id)">
            看全部 {{ m.chapters.length }} 篇<SiteIcon name="arrow" :size="13" />
          </a>
        </section>
      </div>
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
