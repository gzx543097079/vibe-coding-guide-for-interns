<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { findChapter } from '../data/modules'

// 文末：同一模块的其他章节，数据全部来自 modules.ts
const { page } = useData()
const here = computed(() => findChapter(page.value.relativePath))
const siblings = computed(() => {
  const h = here.value
  if (!h) return []
  return h.module.chapters.map((c, i) => ({ c, i })).filter(({ c }) => c.id !== h.chapter.id)
})
</script>

<template>
  <section v-if="here && siblings.length" class="cm" :data-mod="here.module.id" aria-labelledby="cm-title">
    <h2 id="cm-title" class="cm-title">
      <i class="cm-dot" aria-hidden="true" />「{{ here.module.name }}」的其他章节
    </h2>
    <ul class="cm-list">
      <li v-for="{ c, i } in siblings" :key="c.id">
        <a class="cm-link" :href="withBase(c.link)">
          <span class="cm-no" aria-hidden="true">{{ here.module.no }}.{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="cm-body">
            <span class="cm-name">{{ c.title }}</span>
            <span class="cm-sum">{{ c.summary }}</span>
          </span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.cm {
  margin: 56px 0 32px;
  padding-top: 28px;
  border-top: 1px solid var(--rule);
}
.cm-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 650;
  color: var(--ink);
}
.cm-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--mod);
}
.cm-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cm-link {
  display: flex;
  gap: 12px;
  height: 100%;
  padding: 10px 12px;
  border-radius: var(--radius);
  text-decoration: none;
  transition: background-color var(--dur-1) var(--ease);
}
.cm-link:hover {
  background: var(--paper-2);
}
.cm-no {
  flex: none;
  min-width: 2.6em;
  padding-top: 1px;
  font-size: 12.5px;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}
.cm-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.cm-name {
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--ink);
}
.cm-link:hover .cm-name {
  color: var(--accent-ink);
}
.cm-sum {
  font-size: 13px;
  line-height: 1.6;
  color: var(--ink-3);
}
@media (max-width: 639px) {
  .cm-list {
    grid-template-columns: 1fr;
  }
}
</style>
