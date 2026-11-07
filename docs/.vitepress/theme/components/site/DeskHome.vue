<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { allChapters, modules, totalChapters } from '../../data/modules'
import { learningPaths } from '../../data/experience'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'
import TaskComposer from './TaskComposer.vue'

const { last, state, isComplete } = useLearning()
const completed = computed(() => state.completed.length)
const percent = computed(() => Math.round((completed.value / totalChapters) * 100))
const nextStep = computed(() => {
  if (last.value) {
    // 只打开过、尚未完成的章节仍是当前任务；完成后才继续下一步
    if (!isComplete(last.value.chapter.id)) return last.value
    const next = allChapters[last.value.order + 1]
    if (next && next.module.id === last.value.module.id) return next
  }
  return allChapters.find((c) => !isComplete(c.chapter.id)) ?? allChapters[0]
})
const continued = computed(() => Boolean(last.value))
const pathNames = learningPaths.map((p) => p.title).join(' · ')
const stages = [
  { id: 'start', name: '准备', note: '环境与工程习惯', icon: 'start' },
  { id: 'ai', name: '协作', note: '上下文与任务拆解', icon: 'ai' },
  { id: 'controls', name: '界面', note: '控件与交互实现', icon: 'controls' },
  { id: 'quality', name: '质量', note: '验证、审查与发布', icon: 'quality' },
]
const quickActions = [
  {
    title: '动手验证交互',
    note: '17 个组件，先看状态再看实现',
    link: '/lab#button',
    icon: 'lab',
  },
  {
    title: '准备一份任务简报',
    note: '复制前补齐证据与验收标准',
    link: '#task-composer-title',
    icon: 'code',
  },
  {
    title: '按问题找工作区',
    note: '按当前目标定位，不必从头翻目录',
    link: '/learn',
    icon: 'search',
  },
]
const href = (link: string) => (link.startsWith('#') ? link : withBase(link))
</script>
<template>
  <div class="desk-page">
    <section class="desk-hero site-width" aria-labelledby="desk-title">
      <div class="desk-intro">
        <h1 id="desk-title">今天要交付什么，<br />从这里继续。</h1>
        <p class="desk-lead">
          把要解决的问题放到前面：读对应章节、试真实交互、写好验收，再让 Codex 动手。每一步都能回到手上的任务。
        </p>
        <p class="desk-meta">桌面工作台 · {{ totalChapters }} 个章节 · 本机保存进度</p>
      </div>
      <aside class="desk-current" aria-labelledby="current-title">
        <div class="desk-panel-head">
          <h2 id="current-title">{{ continued ? '接着做' : '先做第一步' }}</h2>
          <span>{{ continued ? '当前任务' : '建议起点' }}</span>
        </div>
        <h3>{{ nextStep.chapter.title }}</h3>
        <p class="desk-current-module">{{ nextStep.module.name }} · {{ nextStep.chapter.level }}</p>
        <p class="desk-current-summary">{{ nextStep.chapter.summary }}</p>
        <div class="desk-progress-row">
          <span>本机记录</span><strong>{{ completed }} / {{ totalChapters }}</strong>
        </div>
        <div class="desk-progress" role="img" :aria-label="`已完成 ${percent}%`">
          <span :style="{ width: percent + '%' }" />
        </div>
        <a class="desk-primary" :href="href(nextStep.chapter.link)">
          打开当前任务<SiteIcon name="arrow" :size="18" />
        </a>
        <a class="desk-secondary" :href="href('/courses/' + nextStep.module.id)">
          查看这个工作区<SiteIcon name="chevron" :size="16" />
        </a>
      </aside>
    </section>

    <section class="desk-flow" aria-label="工作区入口">
      <div class="site-width desk-flow-inner">
        <div class="desk-flow-label">
          <strong>按任务进入工作区</strong>
          <span>当前问题属于哪一段，就从哪一段开始</span>
        </div>
        <ol class="desk-stage-list">
          <li v-for="(stage, i) in stages" :key="stage.id">
            <a :href="href('/courses/' + stage.id)">
              <span class="desk-stage-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <SiteIcon :name="stage.icon" :size="21" />
              <div><strong>{{ stage.name }}</strong><small>{{ stage.note }}</small></div>
            </a>
          </li>
        </ol>
      </div>
    </section>

    <section class="desk-main site-width">
      <div class="desk-section-head">
        <h2>现在可以做的三件事</h2>
        <p>入口按动作组织；内容与工具都从当前任务进入。</p>
      </div>
      <div class="desk-action-grid">
        <a v-for="action in quickActions" :key="action.title" :href="href(action.link)">
          <div class="desk-action-icon"><SiteIcon :name="action.icon" :size="21" /></div>
          <div><h3>{{ action.title }}</h3><p>{{ action.note }}</p></div>
          <SiteIcon name="arrow" :size="18" />
        </a>
      </div>
    </section>

    <div class="site-width">
      <TaskComposer />
    </div>

    <section class="desk-lower site-width">
      <div class="desk-workspaces">
        <div class="desk-section-head">
          <h2>按领域进入工作区</h2>
          <a :href="href('/learn')">全部 {{ modules.length }} 个工作区<SiteIcon name="arrow" :size="16" /></a>
        </div>
        <div class="desk-workspace-list">
          <a v-for="m in modules" :key="m.id" :href="href('/courses/' + m.id)">
            <span class="desk-workspace-no">{{ String(m.no).padStart(2, '0') }}</span>
            <SiteIcon :name="m.id" :size="21" />
            <div>
              <strong>{{ m.name }}</strong>
              <small>{{ m.intro }}</small>
            </div>
            <span class="desk-workspace-count">{{ m.chapters.length }} 章</span>
            <SiteIcon name="chevron" :size="16" />
          </a>
        </div>
      </div>
      <aside class="desk-side">
        <div class="desk-side-panel">
          <h2>三条任务线</h2>
          <p>{{ pathNames }}</p>
          <a :href="href('/paths')">选择一条开始<SiteIcon name="arrow" :size="16" /></a>
        </div>
        <div class="desk-side-panel desk-side-tip">
          <SiteIcon name="quality" :size="23" />
          <h2>验证先于信任</h2>
          <p>复制提示词、运行示例或合并改动前，先写下能观察到的结果和检查方法。</p>
          <a :href="href('/quality/review')">查看验证与审查<SiteIcon name="arrow" :size="16" /></a>
        </div>
      </aside>
    </section>
  </div>
</template>
