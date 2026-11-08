<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { allChapters, modules, totalChapters } from '../../data/modules'
import { learningPaths } from '../../data/experience'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'
import TaskComposer from './TaskComposer.vue'

const problemEntrances = [
  { title: '刚开始一个项目', detail: '环境、AI 协作和 Git 的第一轮准备', href: '/paths#first-project' },
  { title: '正在改界面', detail: '前端基础、组件状态和多端实现', href: '/paths#interface' },
  { title: '准备提交 PR', detail: '分支、审查、测试和交付检查', href: '/git/github' },
]

const { last, state, isComplete } = useLearning()
const completed = computed(() => state.completed.length)
const percent = computed(() => Math.round((completed.value / totalChapters) * 100))
const nextStep = computed(() => {
  if (last.value) {
    // 上次打开但尚未标记读过的章节优先；读完后再找下一篇
    if (!isComplete(last.value.chapter.id)) return last.value
    const next = allChapters[last.value.order + 1]
    if (next && next.module.id === last.value.module.id) return next
  }
  return allChapters.find((c) => !isComplete(c.chapter.id)) ?? allChapters[0]
})
const continued = computed(() => Boolean(last.value))
const href = (link: string) => (link.startsWith('#') ? link : withBase(link))
</script>
<template>
  <div class="desk-page">
    <section class="desk-hero site-width" aria-labelledby="desk-title">
      <div class="desk-intro">
        <h1 id="desk-title">写代码时，随手翻两页。</h1>
        <p class="desk-lead">
          这里整理了环境配置、Git、前后端、调试和交付相关的 108 篇笔记，也放了一些能直接操作的组件例子。遇到问题时按目录查，想从头看可以挑一条阅读路线。
        </p>
        <p class="desk-meta">{{ totalChapters }} 篇笔记 · 9 个方向 · 阅读记录只存在这台电脑</p>
        <div class="desk-problem-entry" aria-labelledby="problem-entry-title">
          <div class="desk-problem-head">
            <strong id="problem-entry-title">你现在更像哪一种情况？</strong>
            <span>选一个入口，直接开始。</span>
          </div>
          <div class="desk-problem-list">
            <a v-for="entry in problemEntrances" :key="entry.title" :href="href(entry.href)">
              <strong>{{ entry.title }}</strong>
              <small>{{ entry.detail }}</small>
              <SiteIcon name="arrow" :size="15" />
            </a>
          </div>
        </div>
        <nav class="desk-quick-links" aria-label="常用入口">
          <a :href="href('/learn')">翻目录<SiteIcon name="arrow" :size="16" /></a>
          <a :href="href('/paths')">挑条路线<SiteIcon name="arrow" :size="16" /></a>
          <a :href="href('/lab')">看组件<SiteIcon name="arrow" :size="16" /></a>
        </nav>
      </div>
      <aside class="desk-current" aria-labelledby="resume-title">
        <div class="desk-panel-head">
          <h2 id="resume-title">{{ continued ? '接着读' : '从这里开始' }}</h2>
          <span>{{ continued ? '上次停留' : '第一篇' }}</span>
        </div>
        <h3>{{ nextStep.chapter.title }}</h3>
        <p class="desk-current-module">{{ nextStep.module.name }} · {{ nextStep.chapter.level }}</p>
        <p class="desk-current-summary">{{ nextStep.chapter.summary }}</p>
        <div class="desk-progress-row">
          <span>已读</span><strong>{{ completed }} / {{ totalChapters }}</strong>
        </div>
        <div class="desk-progress" role="img" :aria-label="`已完成 ${percent}%`">
          <span :style="{ width: percent + '%' }" />
        </div>
        <a class="desk-primary" :href="href(nextStep.chapter.link)">
          {{ continued ? '接着读' : '开始读' }}<SiteIcon name="arrow" :size="18" />
        </a>
        <a class="desk-secondary" :href="href('/courses/' + nextStep.module.id)">
          查看该方向的其他笔记<SiteIcon name="chevron" :size="16" />
        </a>
      </aside>
    </section>

    <section class="desk-main site-width">
      <div class="desk-section-head">
        <h2>目录</h2>
        <a :href="href('/learn')">看全部 {{ modules.length }} 个方向<SiteIcon name="arrow" :size="16" /></a>
      </div>
      <div class="desk-workspaces">
        <div class="desk-workspace-list">
          <a v-for="m in modules" :key="m.id" :href="href('/courses/' + m.id)">
            <strong>{{ m.name }}</strong>
            <small>{{ m.intro }}</small>
            <span class="desk-workspace-count">{{ m.chapters.length }} 篇</span>
            <SiteIcon name="chevron" :size="16" />
          </a>
        </div>
      </div>
      <aside class="desk-side">
        <div class="desk-side-panel">
          <h2>阅读路线</h2>
          <p v-for="p in learningPaths" :key="p.id">
            <a :href="href('/paths#' + p.id)">{{ p.title }}</a>
          </p>
          <a class="desk-side-more" :href="href('/paths')">查看路线<SiteIcon name="arrow" :size="16" /></a>
        </div>
        <div class="desk-side-panel">
          <h2>需求模板</h2>
          <p>写功能、修 bug 或准备审查前，把已知信息整理成一段能直接使用的文字。</p>
          <a class="desk-side-more" :href="href('/growth/prompt-templates')">查看模板<SiteIcon name="arrow" :size="16" /></a>
        </div>
        <p class="desk-note"><a :href="href('#task-composer-entry')">在下面直接写一份</a>，填写时会同步生成文本。</p>
      </aside>
    </section>

    <div class="site-width">
      <details class="desk-composer-disclosure">
        <summary id="task-composer-entry">写一份需求<span>把已知信息整理成一段可复制的文字</span><SiteIcon name="chevron" :size="16" /></summary>
        <TaskComposer />
      </details>
    </div>
  </div>
</template>
