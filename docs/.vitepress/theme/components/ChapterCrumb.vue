<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import ModuleIcon from './ModuleIcon.vue'
import { allChapters, chapterCode, findChapter } from '../data/modules'

const { page } = useData()
const here = computed(() => findChapter(page.value.relativePath))
const prev = computed(() => (here.value ? allChapters[here.value.order - 1] : undefined))
const next = computed(() => (here.value ? allChapters[here.value.order + 1] : undefined))
</script>

<template>
  <nav v-if="here" class="cb" aria-label="当前位置">
    <a class="cb-mod" :data-mod="here.module.id" :href="withBase(`/#m-${here.module.id}`)">
      <span class="cb-art">
        <span class="cb-ico"><ModuleIcon :id="here.module.id" /></span>
      </span>
      <span class="cb-text">
        <span class="cb-meta">模块 {{ here.module.no }} · 第 {{ here.index + 1 }} / {{ here.module.chapters.length }} 章</span>
        <span class="cb-name">{{ here.module.name }}</span>
        <span class="cb-bar" aria-hidden="true">
          <i
            v-for="(c, i) in here.module.chapters"
            :key="c.id"
            :class="{ done: i < here.index, cur: i === here.index }"
          />
        </span>
      </span>
      <span class="sr-only">，章节编号 {{ chapterCode(here) }}，打开模块章节列表</span>
    </a>

    <a v-if="prev" class="cb-step" :data-mod="prev.module.id" :href="withBase(prev.chapter.link)">
      <span class="cb-dir">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        上一章
      </span>
      <span class="cb-title">{{ prev.chapter.title }}</span>
    </a>
    <span v-else class="cb-step is-empty"><span class="cb-dir">这是第一章</span></span>

    <a v-if="next" class="cb-step to-next" :data-mod="next.module.id" :href="withBase(next.chapter.link)">
      <span class="cb-dir">
        下一章
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <span class="cb-title">{{ next.chapter.title }}</span>
    </a>
    <span v-else class="cb-step to-next is-empty"><span class="cb-dir">这是最后一章</span></span>
  </nav>
</template>

<style scoped>
.cb {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 10px;
  margin: 0 0 30px;
}
.cb-mod,
.cb-step {
  position: relative;
  border-radius: 14px;
  border: 1px solid var(--rule);
  background: var(--raised);
  color: var(--ink);
  text-decoration: none;
  box-shadow: 0 1px 2px oklch(0.2 0.02 250 / 0.05);
  transition: transform 0.35s var(--ease-spring);
}
a.cb-mod:hover,
a.cb-step:hover {
  transform: translateY(-3px);
}
a.cb-mod:active,
a.cb-step:active {
  transform: scale(0.98);
}
.cb-mod {
  display: flex;
  overflow: hidden;
}
.cb-art {
  display: grid;
  place-items: center;
  flex: none;
  width: 76px;
  background: var(--mod);
}
.cb-ico {
  width: 56px;
}
.cb-text {
  display: grid;
  gap: 2px;
  min-width: 0;
  padding: 10px 14px 12px;
}
.cb-meta {
  font-size: 12px;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}
.cb-name {
  font-size: 15.5px;
  font-weight: 720;
}
.cb-bar {
  display: flex;
  gap: 3px;
  margin-top: 6px;
}
.cb-bar i {
  flex: 1;
  height: 5px;
  border-radius: 3px;
  background: color-mix(in oklab, var(--mod) 22%, var(--paper-3));
}
.cb-bar i.done {
  background: color-mix(in oklab, var(--mod) 60%, var(--paper-3));
}
.cb-bar i.cur {
  background: var(--mod);
}
.cb-step {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
  padding: 10px 14px;
}
.to-next {
  text-align: right;
  align-items: flex-end;
}
.cb-dir {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ink-3);
}
.cb-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}
.cb-step.is-empty {
  background: transparent;
  border-style: dashed;
  box-shadow: none;
}

@media (max-width: 639px) {
  .cb {
    grid-template-columns: 1fr 1fr;
    margin-bottom: 24px;
  }
  .cb-mod {
    grid-column: 1 / -1;
  }
}
@media (prefers-reduced-motion: reduce) {
  a.cb-mod:hover,
  a.cb-step:hover,
  a.cb-mod:active,
  a.cb-step:active {
    transform: none;
  }
}
</style>
