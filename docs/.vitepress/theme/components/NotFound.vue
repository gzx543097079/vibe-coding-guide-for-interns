<script setup lang="ts">
import { withBase } from 'vitepress'
import { modules } from '../data/modules'

// 404：说明原因，给出回首页、开始阅读和按模块直达的入口
const openPalette = () => window.dispatchEvent(new CustomEvent('vcg:palette'))
</script>

<template>
  <div class="nf">
    <h1 class="nf-title">这个页面不存在</h1>
    <p class="nf-lead">404：链接可能写错了，或者章节已经改名。可以搜索章节标题，或者从下面的模块重新进入。</p>
    <div class="nf-actions">
      <a class="nf-btn nf-primary" :href="withBase('/')">回到首页</a>
      <button type="button" class="nf-btn nf-ghost" @click="openPalette">
        搜索章节
        <kbd>⌘K</kbd>
      </button>
    </div>
    <ul class="nf-mods" aria-label="全部模块">
      <li v-for="m in modules" :key="m.id">
        <a :href="withBase(m.chapters[0].link)" :data-mod="m.id">
          <span class="nf-no" aria-hidden="true">{{ m.no }}</span>
          {{ m.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.nf {
  max-width: 560px;
  margin: 0 auto;
  padding: 96px 24px 120px;
  text-align: center;
}
.nf-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(30px, 6vw, 40px);
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink);
}
.nf-lead {
  margin: 14px auto 0;
  max-width: 30em;
  font-size: 16px;
  line-height: 1.75;
  color: var(--ink-2);
  text-wrap: pretty;
}
.nf-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}
.nf-btn {
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
.nf-btn:active {
  transform: scale(0.98);
}
.nf-primary {
  background: var(--accent);
  color: var(--on-accent);
}
.nf-primary:hover {
  background: var(--accent-hover);
}
.nf-ghost {
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink);
}
.nf-ghost:hover {
  border-color: var(--ink-3);
}
.nf-ghost kbd {
  padding: 0 5px;
  border-radius: 4px;
  border: 1px solid var(--rule-strong);
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink-3);
}
.nf-mods {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 40px 0 0;
  padding: 28px 0 0;
  border-top: 1px solid var(--rule);
  list-style: none;
}
.nf-mods a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px 0 6px;
  border-radius: 999px;
  border: 1px solid var(--rule);
  background: var(--raised);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  text-decoration: none;
  transition: border-color var(--dur-1) var(--ease), color var(--dur-1) var(--ease);
}
.nf-mods a:hover {
  border-color: var(--mod-line);
  color: var(--ink);
}
.nf-no {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--mod);
  color: var(--on-mod);
  font-size: 12px;
  font-weight: 700;
}
@media (max-width: 639px) {
  .nf {
    padding: 56px 16px 80px;
  }
  .nf-mods a {
    min-height: 44px;
  }
}
</style>
