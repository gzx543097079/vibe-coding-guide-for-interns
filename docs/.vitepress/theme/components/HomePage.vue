<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import ModuleGrid from './ModuleGrid.vue'
import AskCards from './AskCards.vue'
import { modules, totalChapters } from '../data/modules'
import { getPrompt } from '../data/prompts'
import { copyText } from '../composables/clipboard'
import { useReveal } from '../composables/useReveal'

const REPO = 'https://github.com/gzx543097079/vibe-coding-guide-for-interns'
const page = ref<HTMLElement>()
useReveal(page)

// 首屏代码窗展示一段真实的提示词模板，复制的是完整模板
const sample = getPrompt('bugfix')!
const sampleLines = sample.good.split('\n').slice(0, 12)
const parts = (line: string) => line.split(/(【[^】]*】)/).filter(Boolean).map((t) => ({ t, ph: t.startsWith('【') }))

const copyState = ref<'idle' | 'done' | 'fail'>('idle')
let copyTimer: ReturnType<typeof setTimeout> | undefined
async function copySample() {
  copyState.value = (await copyText(sample.good)) ? 'done' : 'fail'
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copyState.value = 'idle'), 1800)
}

const steps = [
  { t: '先读「起步」', d: '装好环境、配好 AI 工具，养成小步提交的习惯。后面每一章都用得到。' },
  { t: '挑你的方向', d: '做前端看「前端与客户端」「大前端 / 跨端」，做后端看「后端与数据」。「质量与交付」和「提升」人人都要看。' },
  { t: '读完回答三问', d: '答得上来，再把任务交给 AI；答不上来，先回到这一章。' },
]
</script>

<template>
  <div ref="page" class="home">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-text">
        <h1 id="hero-title" class="hero-title">Vibe Coding 开发指南</h1>
        <p class="hero-lead">用 AI 写代码之前，先弄清楚这个方向该懂什么、结果怎么检查。</p>
        <div class="hero-actions">
          <a class="btn btn-primary" :href="withBase('/start/intro')">
            开始阅读
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </a>
          <a class="btn btn-ghost" :href="withBase('/growth/prompt-templates')">看提示词模板</a>
        </div>
        <p class="hero-meta">{{ modules.length }} 个模块、{{ totalChapters }} 章，正文持续补充中，以 MIT 协议开源。</p>
      </div>

      <figure class="hero-code" aria-label="提示词模板示例：修 bug">
        <div class="hc-bar">
          <span class="hc-dots" aria-hidden="true"><i /><i /><i /></span>
          <span class="hc-name">提示词模板 · {{ sample.title }}</span>
          <button type="button" class="hc-copy" :class="copyState" @click="copySample">
            <svg v-if="copyState === 'done'" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <svg v-else width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="5.25" y="5.25" width="8" height="8" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="M10.5 3.2V3a1.25 1.25 0 0 0-1.25-1.25H3A1.25 1.25 0 0 0 1.75 3v6.25A1.25 1.25 0 0 0 3 10.5h.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
            <span>{{ copyState === 'done' ? '已复制' : copyState === 'fail' ? '复制失败，请手动选中' : '复制模板' }}</span>
          </button>
          <span class="sr-only" aria-live="polite">{{ copyState === 'done' ? '模板已复制到剪贴板' : copyState === 'fail' ? '复制失败' : '' }}</span>
        </div>
        <pre class="hc-body"><code><template v-for="(line, i) in sampleLines" :key="i"><span class="hc-ln" aria-hidden="true">{{ i + 1 }}</span><template v-for="(p, j) in parts(line)" :key="j"><mark v-if="p.ph" class="hc-ph">{{ p.t }}</mark><template v-else>{{ p.t }}</template></template>
</template></code></pre>
        <figcaption class="hc-cap">
          <span>把【】里的内容换成你的实际情况</span>
          <a :href="withBase('/growth/prompt-templates')">全部模板</a>
        </figcaption>
      </figure>
    </section>

    <section id="modules" class="sec" aria-labelledby="mod-title">
      <div class="sec-head" data-reveal>
        <h2 id="mod-title" class="sec-title">七个模块</h2>
        <p class="sec-lead">目录里列出了全部章节。不知道从哪看起，就点开离你手上工作最近的模块。</p>
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

    <div class="sec split">
      <section class="how" aria-labelledby="how-title">
        <h2 id="how-title" class="sec-title" data-reveal>怎么读</h2>
        <ol class="steps">
          <li v-for="s in steps" :key="s.t" class="step" data-reveal>
            <h3 class="step-t">{{ s.t }}</h3>
            <p class="step-d">{{ s.d }}</p>
          </li>
        </ol>
        <p class="how-tip" data-reveal>
          找具体问题时按 <kbd>⌘</kbd> <kbd>K</kbd>（Windows 上是 <kbd>Ctrl</kbd> <kbd>K</kbd>）搜索章节。
        </p>
      </section>

      <section class="oss" aria-labelledby="oss-title" data-reveal>
        <h2 id="oss-title" class="oss-title">一起把每一章写完</h2>
        <p class="oss-lead">
          内容用 Markdown 写，以 MIT 协议开源。发现错误或想补一章，直接提 Issue 或 PR；每页底部也有「在 GitHub 上编辑此页」。
        </p>
        <div class="oss-actions">
          <a class="btn btn-primary" :href="REPO" target="_blank" rel="noopener">GitHub 仓库</a>
          <a class="btn btn-dark" :href="`${REPO}/issues/new`" target="_blank" rel="noopener">提 Issue</a>
        </div>
      </section>
    </div>

    <footer class="foot">
      <p class="foot-brand">Vibe Coding 开发指南</p>
      <nav class="foot-links" aria-label="页脚">
        <a :href="withBase('/frontend/controls')">控件总览</a>
        <a :href="withBase('/growth/prompt-templates')">提示词模板</a>
        <a :href="REPO" target="_blank" rel="noopener">GitHub</a>
        <a :href="`${REPO}/blob/main/LICENSE`" target="_blank" rel="noopener">MIT 协议</a>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
/* 首页放在侧边栏右侧的主栏里，按主栏宽度（容器查询）而不是视口宽度排版 */
.home {
  container: home / inline-size;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 48px;
}

/* ---------- 首屏：宽主栏左文右码，窄主栏上下排 ---------- */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 36px;
  padding: 56px 0 64px;
}
@container home (min-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 48px;
    align-items: center;
    padding: 64px 0 72px;
  }
}
.hero-title {
  margin: 0;
  max-width: 11em;
  font-family: var(--font-serif);
  font-size: clamp(34px, 5.2cqi, 54px);
  line-height: 1.12;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  word-break: keep-all;
  text-wrap: balance;
}
.hero-lead {
  margin: 20px 0 0;
  max-width: 26em;
  font-size: 17.5px;
  line-height: 1.75;
  color: var(--ink-2);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.hero-meta {
  margin: 20px 0 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-3);
}

/* 首屏是全页唯一的入场动效 */
.hero-text > *,
.hero-code {
  animation: rise var(--dur-3) var(--ease) backwards;
}
.hero-lead { animation-delay: 40ms; }
.hero-actions { animation-delay: 80ms; }
.hero-meta { animation-delay: 120ms; }
.hero-code { animation-delay: 100ms; }
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

/* ---------- 按钮 ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 20px;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform var(--dur-1) var(--ease);
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: scale(0.98); }
.btn-primary {
  background: var(--accent);
  color: var(--on-accent);
}
.btn-primary:hover { background: var(--accent-hover); }
.btn-ghost {
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink);
}
.btn-ghost:hover { border-color: var(--ink-3); }
.btn-dark {
  border: 1px solid #4a463f;
  background: #2a2824;
  color: #f3efe7;
}
.btn-dark:hover { border-color: #6b665d; }
.btn-primary svg { transition: transform var(--dur-2) var(--ease); }
.btn-primary:hover svg { transform: translateX(3px); }

/* ---------- 首屏代码窗 ---------- */
.hero-code {
  margin: 0;
  min-width: 0;
  border-radius: var(--radius-xl);
  background: var(--code-bg);
  border: 1px solid var(--code-rule);
  box-shadow: var(--shadow-3);
  overflow: hidden;
  color: #ece8df;
}
.hc-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 44px;
  padding: 0 8px 0 16px;
  background: var(--code-head);
  border-bottom: 1px solid var(--code-rule);
}
.hc-dots {
  display: inline-flex;
  gap: 6px;
}
.hc-dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4a463f;
}
.hc-name {
  overflow: hidden;
  font-size: 12.5px;
  color: #a7a196;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hc-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  margin-left: auto;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  font-weight: 550;
  color: #cfc8bc;
  transition: background-color var(--dur-1) var(--ease), color var(--dur-1) var(--ease);
}
.hc-copy:hover {
  background: #34312c;
  color: #f3efe7;
}
.hc-copy.done { color: #a9c9a4; }
.hc-copy.fail { color: #f0a587; }
.hc-copy:focus-visible { outline-color: #f0a587; }
.hc-body {
  margin: 0;
  padding: 16px 18px 18px 0;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
}
.hc-body ::selection {
  background: rgb(224 139 107 / 0.35);
  color: #fff;
}
.hc-ln {
  display: inline-block;
  width: 40px;
  padding-right: 14px;
  text-align: right;
  color: #8f897e;
  user-select: none;
  font-variant-numeric: tabular-nums;
}
.hc-ph {
  padding: 0 2px;
  border-radius: 3px;
  background: rgb(224 139 107 / 0.18);
  color: #f0a587;
}
.hc-cap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-top: 1px solid var(--code-rule);
  font-size: 12.5px;
  color: #a7a196;
}
.hc-cap a {
  margin-left: auto;
  flex: none;
  color: #f0a587;
  text-decoration: none;
  text-underline-offset: 3px;
}
.hc-cap a:hover { text-decoration: underline; }

/* ---------- 通用小节 ---------- */
.sec {
  padding: 64px 0;
  border-top: 1px solid var(--rule);
}
.sec-head {
  max-width: 38em;
  margin-bottom: 28px;
}
.sec-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(26px, 3.2cqi, 32px);
  line-height: 1.25;
  font-weight: 600;
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
kbd {
  padding: 1px 6px;
  border-radius: 5px;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
}

/* ---------- 怎么读 + 参与：宽主栏并排，窄主栏上下排 ---------- */
.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 48px;
}
@container home (min-width: 840px) {
  .split {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 56px;
    align-items: start;
  }
}

/* 步骤：竖排时间线，序号由 CSS 计数器生成 */
.steps {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}
.step {
  position: relative;
  padding: 0 0 22px 46px;
  counter-increment: step;
}
.step::before {
  content: counter(step);
  position: absolute;
  top: -2px;
  left: 0;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-ink);
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 30px;
  bottom: 2px;
  left: 14px;
  width: 1px;
  background: var(--rule-strong);
}
.step-t {
  margin: 0 0 4px;
  font-size: 16.5px;
  line-height: 1.5;
  font-weight: 650;
  color: var(--ink);
}
.step-d {
  margin: 0;
  max-width: 34em;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ink-2);
}
.how-tip {
  margin: 6px 0 0;
  padding-left: 46px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--ink-3);
}

/* 参与：深色面板，深浅色下都用代码窗的底色 */
.oss {
  padding: 32px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--code-rule);
  background: var(--code-bg);
  color: #d6d0c5;
}
.oss-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 26px;
  line-height: 1.3;
  font-weight: 600;
  color: #f3efe7;
  text-wrap: balance;
}
.oss-lead {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.75;
  color: #c9c2b6;
}
.oss-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}
.oss .btn-primary {
  background: #e08b6b;
  color: #1b1a17;
}
.oss .btn-primary:hover { background: #eaa085; }
.oss .btn:focus-visible { outline-color: #f0a587; }

/* ---------- 页脚：一行，导航已在侧边栏 ---------- */
.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  padding: 28px 0 40px;
  border-top: 1px solid var(--rule);
  font-size: 14px;
}
.foot-brand {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}
.foot-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
}
.foot-links a {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  color: var(--ink-2);
  text-decoration: none;
}
.foot-links a:hover { color: var(--accent-ink); }

/* ---------- 窄主栏（手机） ---------- */
@media (max-width: 1100px) {
  .home { padding: 0 40px; }
}
@media (max-width: 767px) {
  .home { padding: 0 16px; }
  .hero { padding: 28px 0 48px; gap: 32px; }
  .hero-lead { font-size: 16.5px; }
  .hero-actions .btn { flex: 1 1 auto; }
  .hc-name { display: none; }
  .hc-body { font-size: 12px; }
  .hc-ln { width: 32px; padding-right: 10px; }
  .sec { padding: 48px 0; }
  .oss { padding: 24px 20px; }
  .oss-title { font-size: 23px; }
  .oss-actions .btn { flex: 1 1 auto; }
  .foot-links a { min-height: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  .btn:hover,
  .btn:active,
  .btn-primary:hover svg {
    transform: none;
  }
}
</style>
