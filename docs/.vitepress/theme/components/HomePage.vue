<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import HeroCards from './HeroCards.vue'
import ModuleGrid from './ModuleGrid.vue'
import AskCards from './AskCards.vue'
import { modules, totalChapters } from '../data/modules'
import { useReveal } from '../composables/useReveal'

const REPO = 'https://github.com/gzx543097079/vibe-coding-guide-for-interns'
const page = ref<HTMLElement>()
useReveal(page)
</script>

<template>
  <div ref="page" class="home">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-text">
        <h1 id="hero-title" class="hero-title">
          <span class="hero-main">Vibe Coding 开发指南</span><span class="hero-edition">（实习生版）</span>
        </h1>
        <p class="hero-lead">写给刚入职的实习生：用 AI 写代码之前，先弄清楚这个方向该懂什么、结果怎么检查。</p>
        <div class="hero-actions">
          <a class="btn btn-primary" :href="withBase('/start/intro')">
            从第一章开始
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </a>
          <a class="btn btn-ghost" :href="withBase('/growth/prompt-templates')">看提示词模板</a>
        </div>
        <p class="hero-meta">{{ modules.length }} 个模块 · {{ totalChapters }} 章 · 正文还在写</p>
      </div>
      <div class="hero-art">
        <HeroCards />
      </div>
    </section>

    <section id="modules" class="sec" aria-labelledby="mod-title">
      <div class="sec-head" data-reveal>
        <h2 id="mod-title" class="sec-title">七个模块</h2>
        <p class="sec-lead">按顺序读，或者直接点开你正在做的方向。点开卡片能看到这个模块的全部章节。</p>
      </div>
      <ModuleGrid />
    </section>

    <section class="sec" aria-labelledby="ask-title">
      <div class="sec-head" data-reveal>
        <h2 id="ask-title" class="sec-title">每个技术章节最后都回答三个问题</h2>
        <p class="sec-lead">答不上来，就先别把任务交给 AI。</p>
      </div>
      <AskCards />
    </section>

    <section class="sec guide" aria-label="适合谁与怎么用">
      <div class="guide-col" data-reveal>
        <h2 class="sec-title">适合谁</h2>
        <ul class="plain">
          <li>刚入职、日常开发要用 AI 编码助手的实习生。</li>
          <li>基础不一样也没关系：写过前端的、只上过课的，都能找到起点。</li>
          <li>拿到 AI 写的代码，不确定能不能用、该怎么检查的人。</li>
          <li>带实习生的导师：可以把某一章直接发给新人。</li>
        </ul>
      </div>
      <div class="guide-col" data-reveal>
        <h2 class="sec-title">怎么用</h2>
        <ol class="steps">
          <li><b>先读「起步」</b>：环境、工具和基本习惯，后面每章都用得到。</li>
          <li><b>再挑方向</b>：做前端看「前端与客户端」「大前端 / 跨端」，做后端看「后端与数据」。「质量与交付」和「提升」每个人都要看。</li>
          <li><b>读完回答三问</b>：答不上来，先别把任务交给 AI。</li>
          <li><b>遇到具体问题直接搜索</b>：按 <kbd>⌘</kbd> <kbd>K</kbd> 或点顶部的搜索框。</li>
        </ol>
      </div>
    </section>

    <section class="sec oss" aria-labelledby="oss-title" data-reveal>
      <div>
        <h2 id="oss-title" class="sec-title">参与编写</h2>
        <p class="sec-lead">
          内容用 Markdown 写，以 MIT 协议开源。发现错误、想补一章，直接提 Issue 或 PR。每页底部也有「在 GitHub 上编辑此页」。
        </p>
      </div>
      <div class="oss-actions">
        <a class="btn btn-primary" :href="REPO" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" /></svg>
          GitHub 仓库
        </a>
        <a class="btn btn-ghost" :href="`${REPO}/issues/new`" target="_blank" rel="noopener">提 Issue</a>
      </div>
    </section>

    <footer class="foot">
      <div class="foot-stripe" aria-hidden="true">
        <span v-for="m in modules" :key="m.id" :data-mod="m.id" />
      </div>
      <p>以 <a :href="`${REPO}/blob/main/LICENSE`" target="_blank" rel="noopener">MIT 协议</a>发布 · Vibe Coding 开发指南（实习生版）</p>
    </footer>
  </div>
</template>

<style scoped>
.home {
  max-width: 1232px;
  margin: 0 auto;
  padding: 0 32px;
}

/* 首屏 */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 32px 48px;
  align-items: center;
  min-height: min(620px, calc(100vh - var(--vp-nav-height)));
  padding: 32px 0 40px;
}
.hero-title {
  margin: 0;
  font-size: clamp(36px, 4.2vw, 56px);
  line-height: 1.12;
  font-weight: 790;
  letter-spacing: -0.03em;
  color: var(--ink);
}
.hero-main {
  word-break: keep-all;
}
.hero-edition {
  display: block;
  margin: 8px 0 0 -0.5em;
  font-size: 0.5em;
  font-weight: 650;
  letter-spacing: 0;
  color: var(--ink-3);
}
.hero-lead {
  margin: 18px 0 0;
  max-width: 28em;
  font-size: 17.5px;
  line-height: 1.7;
  color: var(--ink-2);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.hero-meta {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}
.hero-text > * {
  animation: rise 0.55s var(--ease-spring) backwards;
}
.hero-lead {
  animation-delay: 60ms;
}
.hero-actions {
  animation-delay: 120ms;
}
.hero-meta {
  animation-delay: 160ms;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
.hero-art {
  position: relative;
  height: 420px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 650;
  text-decoration: none;
  transition: transform 0.3s var(--ease-spring);
}
.btn:hover {
  transform: translateY(-2px);
}
.btn:active {
  transform: translateY(0) scale(0.97);
  transition-duration: 0.12s;
}
.btn-primary {
  background: var(--ink);
  color: var(--paper);
  box-shadow: 0 1px 2px oklch(0.2 0.02 250 / 0.2), 0 8px 18px -8px oklch(0.2 0.02 250 / 0.4);
}
.btn-ghost {
  border: 1px solid var(--rule-strong);
  color: var(--ink);
  background: var(--raised);
}
.btn svg {
  transition: transform 0.3s var(--ease-spring);
}
.btn-primary:hover svg {
  transform: translateX(3px);
}

/* 通用小节 */
.sec {
  padding: 64px 0;
  border-top: 1px solid var(--rule);
}
.sec-head {
  max-width: 44em;
  margin-bottom: 28px;
}
.sec-title {
  margin: 0;
  font-size: 30px;
  line-height: 1.3;
  font-weight: 760;
  letter-spacing: -0.015em;
  color: var(--ink);
  text-wrap: balance;
}
.sec-lead {
  margin: 10px 0 0;
  font-size: 16px;
  line-height: 1.75;
  color: var(--ink-2);
}

/* 适合谁 / 怎么用 */
.guide {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px 72px;
}
.plain,
.steps {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  font-size: 15.5px;
  line-height: 1.75;
  color: var(--ink-2);
}
.plain li,
.steps li {
  position: relative;
  padding: 10px 0 10px 30px;
  border-bottom: 1px solid var(--rule);
}
.plain li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 20px;
  width: 9px;
  height: 9px;
  border-radius: 3px;
  background: var(--ink-3);
}
.steps {
  counter-reset: step;
}
.steps li {
  counter-increment: step;
}
.steps li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 13px;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: var(--ink);
  color: var(--paper);
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}
.steps b {
  color: var(--ink);
  font-weight: 650;
}
kbd {
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  font-family: var(--font-sans);
  font-size: 13px;
}

/* 参与编写 */
.oss {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) auto;
  gap: 24px 56px;
  align-items: end;
}
.oss-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.foot {
  padding: 0 0 40px;
  font-size: 13.5px;
  color: var(--ink-3);
}
.foot-stripe {
  display: flex;
  gap: 4px;
  height: 8px;
  margin-bottom: 20px;
}
.foot-stripe span {
  flex: 1;
  border-radius: 3px;
  background: var(--mod);
}
.foot p {
  margin: 0;
}
.foot a {
  color: var(--ink-2);
  text-underline-offset: 3px;
}

@media (max-width: 959px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: 0;
    padding-top: 28px;
  }
  .hero-art {
    height: auto;
  }
  .guide,
  .oss {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .home {
    padding: 0 16px;
  }
  .hero {
    gap: 24px;
    padding: 24px 0 36px;
  }
  .hero-title {
    font-size: 32px;
  }
  .hero-lead {
    font-size: 16px;
  }
  .hero-actions {
    margin-top: 22px;
  }
  .sec {
    padding: 48px 0;
  }
  .sec-title {
    font-size: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-text > * {
    animation: fade 0.3s linear backwards;
  }
  .btn:hover,
  .btn:active {
    transform: none;
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
</style>
