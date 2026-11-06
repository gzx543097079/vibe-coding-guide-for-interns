<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import ModuleGrid from './ModuleGrid.vue'
import AskCards from './AskCards.vue'
import { modules, totalChapters } from '../data/modules'
import { getPrompt } from '../data/prompts'
import { useReveal } from '../composables/useReveal'

const REPO = 'https://github.com/gzx543097079/vibe-coding-guide-for-interns'
const page = ref<HTMLElement>()
useReveal(page)

// 首屏右侧展示一段真实的提示词模板
const sample = getPrompt('bugfix')!
const sampleLines = sample.good.split('\n').slice(0, 12)
const parts = (line: string) => line.split(/(【[^】]*】)/).filter(Boolean).map((t) => ({ t, ph: t.startsWith('【') }))

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
        <h1 id="hero-title" class="hero-title">
          Vibe Coding 开发指南<span class="hero-edition">（实习生版）</span>
        </h1>
        <p class="hero-lead">写给刚入职的实习生。用 AI 写代码之前，先弄清楚这个方向该懂什么、结果怎么检查。</p>
        <div class="hero-actions">
          <a class="btn btn-primary" :href="withBase('/start/intro')">
            从第一章开始
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </a>
          <a class="btn btn-ghost" :href="withBase('/growth/prompt-templates')">看提示词模板</a>
        </div>
        <p class="hero-meta">{{ modules.length }} 个模块 · {{ totalChapters }} 章 · 正文还在写 · MIT 协议开源</p>
      </div>

      <figure class="hero-code" aria-label="提示词模板示例：修 bug">
        <div class="hc-bar" aria-hidden="true">
          <span class="hc-dots"><i /><i /><i /></span>
          <span class="hc-name">提示词模板 · {{ sample.title }}</span>
        </div>
        <pre class="hc-body"><code><template v-for="(line, i) in sampleLines" :key="i"><span class="hc-ln" aria-hidden="true">{{ i + 1 }}</span><template v-for="(p, j) in parts(line)" :key="j"><mark v-if="p.ph" class="hc-ph">{{ p.t }}</mark><template v-else>{{ p.t }}</template></template>
</template></code></pre>
        <figcaption class="hc-cap">
          <span>复制后把【】里的内容换成你的实际情况</span>
          <a :href="withBase('/growth/prompt-templates')">更多模板</a>
        </figcaption>
      </figure>
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

    <section class="sec" aria-labelledby="how-title">
      <div class="sec-head" data-reveal>
        <h2 id="how-title" class="sec-title">这份指南怎么用</h2>
        <p class="sec-lead">遇到具体问题时，按 <kbd>⌘</kbd> <kbd>K</kbd>（Windows 上是 <kbd>Ctrl</kbd> <kbd>K</kbd>）直接搜索章节。</p>
      </div>
      <ol class="steps">
        <li v-for="(s, i) in steps" :key="s.t" class="step" data-reveal>
          <span class="step-no">{{ i + 1 }}</span>
          <h3 class="step-t">{{ s.t }}</h3>
          <p class="step-d">{{ s.d }}</p>
        </li>
      </ol>
    </section>

    <section class="sec" aria-labelledby="oss-title">
      <div class="oss" data-reveal>
        <div>
          <h2 id="oss-title" class="oss-title">一起把每一章写完</h2>
          <p class="oss-lead">
            内容用 Markdown 写，以 MIT 协议开源。发现错误、想补一章，直接提 Issue 或 PR。每页底部也有「在 GitHub 上编辑此页」。
          </p>
        </div>
        <div class="oss-actions">
          <a class="btn btn-primary" :href="REPO" target="_blank" rel="noopener">GitHub 仓库</a>
          <a class="btn btn-dark" :href="`${REPO}/issues/new`" target="_blank" rel="noopener">提 Issue</a>
        </div>
      </div>
    </section>

    <footer class="foot">
      <div class="foot-cols">
        <div>
          <p class="foot-brand">Vibe Coding 开发指南</p>
          <p class="foot-note">写给实习生的 AI 编码实践指南。</p>
        </div>
        <nav aria-label="页脚：内容">
          <p class="foot-h">内容</p>
          <a :href="withBase('/start/intro')">从第一章开始</a>
          <a :href="withBase('/frontend/controls')">控件总览</a>
          <a :href="withBase('/growth/prompt-templates')">提示词模板</a>
        </nav>
        <nav aria-label="页脚：项目">
          <p class="foot-h">项目</p>
          <a :href="REPO" target="_blank" rel="noopener">GitHub 仓库</a>
          <a :href="`${REPO}/issues/new`" target="_blank" rel="noopener">提 Issue</a>
          <a :href="`${REPO}/blob/main/LICENSE`" target="_blank" rel="noopener">MIT 协议</a>
        </nav>
      </div>
      <p class="foot-copy">以 MIT 协议发布</p>
    </footer>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

/* 首屏 */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;
  padding: 72px 0 88px;
}
.hero-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(40px, 4.6vw, 60px);
  line-height: 1.12;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  word-break: keep-all;
}
.hero-edition {
  display: block;
  margin: 6px 0 0 -0.5em;
  font-size: 0.5em;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--ink-3);
}
.hero-lead {
  margin: 22px 0 0;
  max-width: 27em;
  font-size: 18px;
  line-height: 1.75;
  color: var(--ink-2);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}
.hero-meta {
  margin: 18px 0 0;
  font-size: 13px;
  color: var(--ink-3);
}
.hero-text > *,
.hero-code {
  animation: rise var(--dur-3) var(--ease) backwards;
}
.hero-lead {
  animation-delay: 50ms;
}
.hero-actions {
  animation-delay: 100ms;
}
.hero-meta {
  animation-delay: 140ms;
}
.hero-code {
  animation-delay: 120ms;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 20px;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform var(--dur-1) var(--ease);
}
.btn:hover {
  transform: translateY(-1px);
}
.btn:active {
  transform: scale(0.98);
}
.btn-primary {
  background: var(--accent);
  color: var(--on-accent);
}
.btn-primary:hover {
  background: var(--accent-hover);
}
.btn-ghost {
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink);
}
.btn-ghost:hover {
  border-color: var(--ink-3);
}
.btn-dark {
  border: 1px solid #4a463f;
  background: #2a2824;
  color: #f3efe7;
}
.btn-primary svg {
  transition: transform var(--dur-2) var(--ease);
}
.btn-primary:hover svg {
  transform: translateX(3px);
}

/* 首屏右侧：深色代码窗 */
.hero-code {
  margin: 0;
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
  height: 42px;
  padding: 0 16px;
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
  font-size: 12.5px;
  color: #a7a196;
}
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
.hc-ln {
  display: inline-block;
  width: 40px;
  padding-right: 14px;
  text-align: right;
  color: #8f897e;
  user-select: none;
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
  color: #f0a587;
  text-decoration: none;
}
.hc-cap a:hover {
  text-decoration: underline;
}

/* 通用小节 */
.sec {
  padding: 80px 0;
  border-top: 1px solid var(--rule);
}
.sec-head {
  max-width: 40em;
  margin-bottom: 32px;
}
.sec-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 36px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink);
  text-wrap: balance;
}
.sec-lead {
  margin: 12px 0 0;
  font-size: 16.5px;
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
}

/* 三步 */
.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.step {
  padding: 22px 22px 20px;
  border-radius: var(--radius-lg);
  background: var(--paper-2);
}
.step-no {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 600;
  color: var(--accent-ink);
}
.step-t {
  margin: 14px 0 6px;
  font-size: 17px;
  font-weight: 650;
  color: var(--ink);
}
.step-d {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ink-2);
}

/* 开源共建：深色带 */
.oss {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) auto;
  gap: 24px 48px;
  align-items: end;
  padding: 44px 44px;
  border-radius: var(--radius-xl);
  background: #1f1e1b;
  color: #d6d0c5;
}
.oss-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
  color: #f3efe7;
}
.oss-lead {
  margin: 12px 0 0;
  max-width: 34em;
  font-size: 15.5px;
  line-height: 1.75;
  color: #c9c2b6;
}
.oss-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.oss .btn-primary {
  background: #e08b6b;
  color: #1b1a17;
}
.oss .btn-primary:hover {
  background: #eaa085;
}

/* 页脚 */
.foot {
  padding: 48px 0 40px;
  border-top: 1px solid var(--rule);
  font-size: 14px;
}
.foot-cols {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 32px;
}
.foot-brand {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
}
.foot-note {
  margin: 6px 0 0;
  color: var(--ink-3);
}
.foot nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.foot-h {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}
.foot nav a {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  color: var(--ink-2);
  text-decoration: none;
}
.foot nav a:hover {
  color: var(--accent-ink);
}
.foot-copy {
  margin: 32px 0 0;
  font-size: 13px;
  color: var(--ink-3);
}

@media (max-width: 959px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 48px 0 64px;
  }
  .oss {
    grid-template-columns: 1fr;
    align-items: start;
  }
}
@media (max-width: 767px) {
  .home {
    padding: 0 16px;
  }
  .hero {
    padding: 32px 0 48px;
    gap: 32px;
  }
  .hero-title {
    font-size: 36px;
  }
  .hero-lead {
    font-size: 16.5px;
  }
  .btn {
    flex: 1 1 auto;
    justify-content: center;
  }
  .hc-body {
    font-size: 12px;
  }
  .hc-ln {
    width: 32px;
    padding-right: 10px;
  }
  .sec {
    padding: 56px 0;
  }
  .sec-title {
    font-size: 28px;
  }
  .steps {
    grid-template-columns: 1fr;
  }
  .oss {
    padding: 28px 22px;
  }
  .oss-title {
    font-size: 26px;
  }
  .foot-cols {
    grid-template-columns: 1fr 1fr;
  }
  .foot-cols > div:first-child {
    grid-column: 1 / -1;
  }
  .foot nav a {
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .btn:hover,
  .btn:active {
    transform: none;
  }
}
</style>
