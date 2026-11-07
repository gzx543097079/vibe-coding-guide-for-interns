<script setup lang="ts">
import { withBase } from 'vitepress'
import { modules, totalChapters } from '../data/modules'
import { useLearning } from '../composables/useLearning'
import { learningPaths } from '../data/experience'
import SiteIcon from './site/SiteIcon.vue'
import HeroPlayground from './site/HeroPlayground.vue'
const { last, state } = useLearning()
const featured = ['ai', 'frontend', 'backend'].map(
  (id) => modules.find((m) => m.id === id)!,
)
</script>
<template>
  <div class="website-home">
    <section class="home-hero site-width" aria-labelledby="home-title">
      <div class="home-hero-copy">
        <h1 id="home-title">
          把想法写成作品，<br />把代码<span>交付出去。</span>
        </h1>
        <p class="hero-description">
          学会和 AI 一起开发，也学会判断它的结果。<br />从基础知识到动手实践，走好创造的每一步。
        </p>
        <div class="hero-actions">
          <a
            class="action-primary"
            :href="withBase(last?.chapter.link ?? '/start/intro')"
            >{{ last ? '继续学习' : '开始学习'
            }}<SiteIcon name="arrow" :size="19" /></a
          ><a class="action-secondary" :href="withBase('/lab')"
            ><SiteIcon name="lab" :size="19" />探索组件实验室</a
          >
        </div>
        <p class="hero-footnote">
          <span class="mini-avatars" aria-hidden="true"
            ><SiteIcon name="book" :size="15" /><SiteIcon
              name="code"
              :size="15" /><SiteIcon name="check" :size="15" /></span
          >{{ totalChapters }} 篇指南 · 可操作的演示 · 开源共建
        </p>
      </div>
      <HeroPlayground />
    </section>
    <div class="learning-ribbon">
      <div class="site-width">
        <strong>好的开发，不止生成代码。</strong
        ><span><SiteIcon name="start" :size="19" />理解问题</span
        ><SiteIcon name="arrow" :size="15" /><span
          ><SiteIcon name="ai" :size="19" />与 AI 协作</span
        ><SiteIcon name="arrow" :size="15" /><span
          ><SiteIcon name="code" :size="19" />动手构建</span
        ><SiteIcon name="arrow" :size="15" /><span
          ><SiteIcon name="quality" :size="19" />验证与交付</span
        >
      </div>
    </div>
    <section v-if="last" class="resume-strip site-width">
      <div>
        <SiteIcon name="book" /><span
          >上次读到 <strong>{{ last.chapter.title }}</strong></span
        ><small>已完成 {{ state.completed.length }} 篇</small>
      </div>
      <a :href="withBase(last.chapter.link)"
        >接着读 <SiteIcon name="arrow" :size="17"
      /></a>
    </section>
    <section class="home-courses site-width" aria-labelledby="courses-title">
      <div class="section-heading">
        <div>
          <h2 id="courses-title">从你正在做的事开始。</h2>
          <p>选一个方向，把知识用在真实的开发任务里。</p>
        </div>
        <a class="text-link" :href="withBase('/learn')"
          >探索全部 {{ modules.length }} 门课程
          <SiteIcon name="arrow" :size="18"
        /></a>
      </div>
      <div class="featured-courses">
        <a
          v-for="(m, i) in featured"
          :key="m.id"
          class="featured-course"
          :class="'featured-' + m.id"
          :href="withBase('/courses/' + m.id)"
          ><div class="featured-top">
            <SiteIcon :name="m.id" :size="32" /><strong
              class="featured-course-name"
              >{{ m.name }}</strong
            ><span>{{ m.chapters.length }} 章</span>
          </div>
          <h3>
            {{
              i === 0
                ? '把 AI 变成\n可靠的开发搭档。'
                : i === 1
                  ? '构建界面，\n也理解界面。'
                  : '让每个请求，\n得到可靠回应。'
            }}
          </h3>
          <p>{{ m.intro }}</p>
          <div class="featured-bottom">
            <strong>浏览课程</strong
            ><span class="round-arrow"
              ><SiteIcon name="arrow" :size="20"
            /></span></div
        ></a>
      </div>
    </section>
    <section class="home-lab">
      <div class="site-width lab-invitation">
        <div>
          <SiteIcon name="lab" :size="34" />
          <h2>别只看效果，<br />亲手试一试。</h2>
          <p>
            按钮如何反馈，输入如何校验，弹层如何收起。<br />17
            个可操作组件，连接交互、提示词与实现。
          </p>
          <a class="action-primary" :href="withBase('/lab')"
            >进入组件实验室<SiteIcon name="arrow" :size="19"
          /></a>
        </div>
        <div class="lab-sampler" aria-label="实验室内容预览">
          <a :href="withBase('/lab#button')" class="sampler-button"
            ><span>按钮与反馈</span>
            <div>
              <span class="sampler-primary"
                >保存更改 <SiteIcon name="check" :size="16" /></span
              ><span class="sampler-outline">取消</span>
            </div>
            <small>默认、加载、成功，每一步都清楚。</small></a
          ><a :href="withBase('/lab#switch')" class="sampler-switch"
            ><span>开关与设置</span>
            <div>
              <span class="preview-toggle on" /><span class="preview-toggle" />
            </div>
            <small>明确的状态，即时的反馈。</small></a
          ><a :href="withBase('/lab#tabs')" class="sampler-tabs"
            ><span>导航与切换</span>
            <div><strong>概览</strong><span>活动</span><span>设置</span></div>
            <small>连贯地切换，而不迷失位置。</small></a
          >
        </div>
      </div>
    </section>
    <section class="home-paths site-width">
      <div class="section-heading">
        <div>
          <h2>不确定从哪开始？</h2>
          <p>跟着一条路线，把零散的知识连成自己的能力。</p>
        </div>
        <a class="text-link" :href="withBase('/paths')"
          >查看学习路线 <SiteIcon name="arrow" :size="18"
        /></a>
      </div>
      <div class="path-links">
        <a
          v-for="path in learningPaths"
          :key="path.id"
          :href="withBase('/paths#' + path.id)"
          ><SiteIcon :name="path.icon" :size="25" />
          <div>
            <h3>{{ path.title }}</h3>
            <p>{{ path.description }}</p>
          </div>
          <SiteIcon name="arrow" :size="20"
        /></a>
      </div>
    </section>
    <section class="open-source-banner site-width">
      <div>
        <h2>一起，把开发经验变成共同的知识。</h2>
        <p>指南以 MIT 协议开源。欢迎纠错、补充实践，或验证你熟悉的平台。</p>
      </div>
      <a
        href="https://github.com/gzx543097079/vibe-coding-guide-for-interns"
        target="_blank"
        rel="noopener"
        >在 GitHub 参与共建 <SiteIcon name="arrow" :size="19"
      /></a>
    </section>
  </div>
</template>
