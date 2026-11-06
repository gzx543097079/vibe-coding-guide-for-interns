<script setup lang="ts">
import { withBase } from 'vitepress'
import MetroOverview from './MetroOverview.vue'
import LineDetail from './LineDetail.vue'
import { lines, totalStations } from '../data/metro'

const REPO = 'https://github.com/gzx543097079/vibe-coding-guide-for-interns'

const questions = [
  {
    q: '必须先懂什么',
    a: '这个方向最低限度的概念和工具。不懂这些，就无法判断 AI 给的答案是否合理。',
  },
  {
    q: '怎么验证',
    a: '运行、测试、对照官方文档，用能复现的方式确认结果，而不是「看起来没问题」。',
  },
  {
    q: 'AI 常错在哪',
    a: '这个方向上 AI 容易出错的地方，以及你该在哪一步停下来自己检查。',
  },
]
</script>

<template>
  <div class="home">
    <!-- 首屏：标题 + 线路总览 -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-text">
        <h1 id="hero-title" class="hero-title">
          <span class="hero-main">Vibe Coding 开发指南</span><span class="hero-edition">（实习生版）</span>
        </h1>
        <p class="hero-lead">
          用 AI 写代码不难，难的是判断它写得对不对。这份指南把要经过的每一站排成了线路：先打基础，再学协作、验证与提示词。
        </p>
      </div>
      <div class="hero-actions">
        <a class="btn btn-primary" :href="withBase('/start/intro')">
          从 1 号线出发
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </a>
        <a class="btn btn-ghost" :href="withBase('/growth/prompt-templates')">看提示词模板</a>
        <p class="hero-meta">{{ lines.length }} 条线路 · {{ totalStations }} 站 · 内容持续建设中</p>
      </div>
    </section>

    <section id="map" class="map" aria-label="线路图">
      <a class="skip" href="#lines">跳过线路图</a>
      <MetroOverview />
    </section>

    <!-- 每条线路的详细站点 -->
    <section id="lines" class="lines" aria-labelledby="lines-title">
      <div class="sec-head">
        <h2 id="lines-title" class="sec-title">各线站点</h2>
        <p class="sec-lead">按顺序乘坐，或者从任意一站上车。带双环标记的是换乘站，两条线在这里内容衔接。</p>
      </div>
      <LineDetail v-for="line in lines" :key="line.id" :line="line" />
    </section>

    <!-- 三问 -->
    <section class="ask" aria-labelledby="ask-title">
      <div class="sec-head">
        <h2 id="ask-title" class="sec-title">每个方向都用三个问题收尾</h2>
        <p class="sec-lead">技术方向的每一章，最后都会回答这三个问题。答得上来，再让 AI 替你干活。</p>
      </div>
      <ol class="ask-line">
        <li v-for="(item, i) in questions" :key="item.q" class="ask-stop">
          <span class="ask-dot" aria-hidden="true" />
          <h3 class="ask-q">{{ item.q }}</h3>
          <p class="ask-a">{{ item.a }}</p>
        </li>
      </ol>
    </section>

    <!-- 适合谁 / 怎么用 -->
    <section class="guide" aria-label="适合谁与怎么用">
      <div class="guide-col">
        <h2 class="sec-title">适合谁</h2>
        <ul class="plain">
          <li>刚入职、在团队里借助 AI 编码助手做日常开发的实习生。</li>
          <li>技术基础参差：有人写过前端，有人只上过课，都能找到起点。</li>
          <li>想知道 AI 给的代码能不能用、该怎么检查的新人。</li>
          <li>带实习生的导师：可以直接把某一站发给新人。</li>
        </ul>
      </div>
      <div class="guide-col">
        <h2 class="sec-title">怎么用</h2>
        <ol class="steps">
          <li><b>从 1 号线开始</b>：环境、工具和习惯是后面所有站的前提。</li>
          <li><b>按方向换乘</b>：做前端就走 3、4 号线，做后端走 5 号线，6、7 号线人人都要坐。</li>
          <li><b>每站读完回答三问</b>：答不上来，就别急着把任务交给 AI。</li>
          <li><b>边做边查</b>：遇到具体任务，直接搜索或翻到对应站点。</li>
        </ol>
      </div>
    </section>

    <!-- 开源共建 -->
    <section class="oss" aria-labelledby="oss-title">
      <div class="oss-text">
        <h2 id="oss-title" class="sec-title">一起把每一站写完</h2>
        <p class="sec-lead">
          这份指南用 Markdown 维护，以 MIT 许可证开源。发现错误、想补一站，或者有更好的讲法，都欢迎提 Issue 或 PR。每页底部也有「在 GitHub 上编辑此页」。
        </p>
      </div>
      <div class="oss-actions">
        <a class="btn btn-primary" :href="REPO" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" /></svg>
          在 GitHub 上查看
        </a>
        <a class="btn btn-ghost" :href="`${REPO}/issues/new`" target="_blank" rel="noopener">提一个 Issue</a>
      </div>
    </section>

    <footer class="foot">
      <div class="foot-stripe" aria-hidden="true">
        <span v-for="line in lines" :key="line.id" :data-line="line.id" />
      </div>
      <p>以 <a :href="`${REPO}/blob/main/LICENSE`" target="_blank" rel="noopener">MIT 许可证</a>发布 · Vibe Coding 开发指南（实习生版）</p>
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
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 20px 56px;
  align-items: end;
  padding: 44px 0 22px;
}
.hero-title {
  margin: 0;
  font-size: clamp(34px, 3.6vw, 48px);
  line-height: 1.16;
  font-weight: 780;
  letter-spacing: -0.025em;
  color: var(--ink);
  text-wrap: balance;
}
.hero-main {
  word-break: keep-all;
}
.hero-edition {
  display: block;
  margin-top: 6px;
  margin-left: -0.5em;
  font-size: 0.56em;
  font-weight: 650;
  color: var(--ink-3);
  letter-spacing: 0;
}
.hero-lead {
  margin: 14px 0 0;
  max-width: 34em;
  font-size: 17px;
  line-height: 1.7;
  color: var(--ink-2);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-bottom: 6px;
}
.hero-meta {
  flex-basis: 100%;
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 650;
  text-decoration: none;
  transition: transform 0.2s var(--ease-out);
}
.btn:active {
  transform: translateY(1px) scale(0.985);
}
.btn-primary {
  background: var(--ink);
  color: var(--paper);
  box-shadow: 0 1px 2px oklch(0.2 0.02 250 / 0.2), 0 4px 14px oklch(0.2 0.02 250 / 0.12);
}
.btn-primary:hover {
  background: color-mix(in oklab, var(--ink) 86%, var(--paper));
}
.btn-ghost {
  border: 1px solid var(--rule-strong);
  color: var(--ink);
  background: var(--raised);
}
.btn-ghost:hover {
  border-color: var(--ink-3);
}
.btn svg {
  transition: transform 0.25s var(--ease-out);
}
.btn-primary:hover svg {
  transform: translateX(3px);
}

/* 线路图 */
.map {
  position: relative;
  padding: 8px 0 40px;
}
.skip {
  position: absolute;
  left: 0;
  top: -4px;
  z-index: 3;
  padding: 6px 12px;
  border-radius: 8px;
  background: var(--ink);
  color: var(--paper);
  font-size: 13px;
  text-decoration: none;
  transform: translateY(-140%);
  opacity: 0;
}
.skip:focus-visible {
  transform: none;
  opacity: 1;
}

/* 通用小节标题 */
.sec-head {
  max-width: 44em;
  margin-bottom: 8px;
}
.sec-title {
  margin: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 750;
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

.lines {
  padding: 56px 0 32px;
  border-top: 1px solid var(--rule);
}
.lines > .sec-head {
  margin-bottom: 28px;
}

/* 三问 */
.ask {
  padding: 72px 0 64px;
  border-top: 1px solid var(--rule);
}
.ask-line {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  list-style: none;
  margin: 36px 0 0;
  padding: 0;
}
.ask-stop {
  position: relative;
  padding: 40px 32px 0 0;
}
.ask-stop::before {
  content: '';
  position: absolute;
  top: 9px;
  left: 10px;
  right: 0;
  height: 4px;
  border-radius: 2px;
  background: var(--ink);
}
.ask-stop:last-child::before {
  right: auto;
  width: 0;
}
.ask-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--paper);
  border: 3px solid var(--ink);
  box-shadow: inset 0 0 0 3px var(--paper), inset 0 0 0 5px var(--ink);
}
.ask-q {
  margin: 2px 0 8px;
  font-size: 24px;
  line-height: 1.35;
  font-weight: 750;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.ask-a {
  margin: 0;
  max-width: 22em;
  font-size: 15px;
  line-height: 1.75;
  color: var(--ink-2);
}

/* 适合谁 / 怎么用 */
.guide {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px 72px;
  padding: 64px 0;
  border-top: 1px solid var(--rule);
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
  padding: 10px 0 10px 28px;
  border-bottom: 1px solid var(--rule);
}
.plain li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 19px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2.5px solid var(--ink-3);
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
  top: 12px;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: var(--ink);
  color: var(--paper);
  font-size: 11.5px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}
.steps b {
  color: var(--ink);
  font-weight: 650;
}

/* 开源 */
.oss {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) auto;
  gap: 24px 56px;
  align-items: end;
  padding: 64px 0;
  border-top: 1px solid var(--rule);
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
  height: 6px;
  margin-bottom: 20px;
  border-radius: 3px;
  overflow: hidden;
}
.foot-stripe span {
  flex: 1;
  background: var(--line);
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
    align-items: start;
    padding-top: 32px;
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
    gap: 18px;
    padding: 24px 0 8px;
  }
  .hero-title {
    font-size: 30px;
  }
  .hero-lead {
    font-size: 16px;
  }
  .btn {
    height: 44px;
    padding: 0 16px;
  }
  .sec-title {
    font-size: 23px;
  }
  .lines {
    padding-top: 40px;
  }
  .ask {
    padding: 52px 0 44px;
  }
  .ask-line {
    grid-template-columns: 1fr;
    margin-top: 24px;
  }
  .ask-stop {
    padding: 0 0 26px 40px;
  }
  .ask-stop::before {
    top: 11px;
    bottom: -11px;
    left: 9px;
    right: auto;
    width: 4px;
    height: auto;
  }
  .ask-stop:last-child::before {
    display: none;
  }
  .ask-q {
    font-size: 20px;
  }
  .guide,
  .oss {
    padding: 48px 0;
  }
}
</style>
