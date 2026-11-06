<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { modules } from '../data/modules'
import { buildControlPrompt, controls, defaultOptions, getControl } from '../data/controlPrompts'
import { copyText } from '../composables/clipboard'
import { demos } from './demos/registry'

// 按 modules.ts 里「UI 控件与提示词」模块的子分组排列
const mod = modules.find((m) => m.id === 'controls')
const groups = computed(() => {
  const out: { name: string; level: string; rows: { id: string; title: string; summary: string; link: string }[] }[] = []
  for (const c of mod?.chapters ?? []) {
    if (!c.group) continue
    const id = c.link.split('/').pop()!
    let g = out.find((x) => x.name === c.group)
    if (!g) out.push((g = { name: c.group, level: c.level, rows: [] }))
    g.rows.push({ id, title: c.title, summary: c.summary, link: c.link })
  }
  return out
})
const planned = controls.filter((c) => c.draft)
const badge = (id: string) => getControl(id)?.verify.status ?? '未验证'
const badgeClass = (id: string) => ({ 已验证: 'ok', 部分一致: 'part', 未验证: 'none' })[badge(id)]
const frameText = (id: string) => (demos[id]?.frame === 'browser' ? '网页画布' : '手机画布')

const copied = ref<string | null>(null)
const failed = ref<string | null>(null)
let timer = 0
async function copy(id: string) {
  const ok = await copyText(buildControlPrompt(id, 'HTML + CSS + JS', defaultOptions))
  copied.value = ok ? id : null
  failed.value = ok ? null : id
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    copied.value = null
    failed.value = null
  }, 2000)
}
const nameOf = (id: string) => getControl(id)?.name ?? id
</script>

<template>
  <div class="gc">
    <section v-for="g in groups" :key="g.name" class="gc-group">
      <h3 class="gc-title">
        {{ g.name }}<span v-if="g.level !== '基础'" class="gc-lv">{{ g.level }}</span>
      </h3>
      <ul class="gc-rows">
        <li v-for="r in g.rows" :key="r.id" class="gc-row">
          <a class="gc-link" :href="withBase(r.link)">
            <span class="gc-name">{{ r.title }}</span>
            <span class="gc-sum">{{ r.summary }}</span>
          </a>
          <span class="gc-frame">{{ frameText(r.id) }}</span>
          <span class="gc-badge" :class="badgeClass(r.id)">{{ badge(r.id) }}</span>
          <button type="button" class="gc-copy" :aria-label="`复制${nameOf(r.id)}的提示词（网页写法）`" @click="copy(r.id)">
            {{ copied === r.id ? '已复制' : failed === r.id ? '复制失败' : '复制提示词' }}
          </button>
        </li>
      </ul>
    </section>

    <section class="gc-group">
      <h3 class="gc-title">计划补充</h3>
      <p class="gc-note">还没有演示，提示词是草稿，复制后要先补全占位符。</p>
      <ul class="gc-todo">
        <li v-for="p in planned" :key="p.id">
          {{ p.name }}
          <button type="button" class="gc-todo-copy" :aria-label="`复制${p.name}的提示词（草稿）`" @click="copy(p.id)">
            {{ copied === p.id ? '已复制' : '复制草稿' }}
          </button>
        </li>
      </ul>
    </section>
    <p class="sr-only" aria-live="polite">{{ copied ? `已复制${nameOf(copied)}的提示词` : failed ? '复制失败，请到控件页展开预览手动复制' : '' }}</p>
  </div>
</template>

<style scoped>
.gc-group + .gc-group {
  margin-top: 28px;
}
.gc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px !important;
  font-size: 16px !important;
}
.gc-lv {
  padding: 0 7px;
  border-radius: 999px;
  background: var(--paper-3);
  color: var(--ink-3);
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
}
.gc-rows {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  border-top: 1px solid var(--rule);
}
.gc-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 12px;
  margin: 0 !important;
  padding: 10px 4px;
  border-bottom: 1px solid var(--rule);
}
.gc-link {
  display: grid;
  min-width: 0;
  text-decoration: none !important;
}
.gc-name {
  color: var(--ink);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.5;
}
.gc-link:hover .gc-name {
  color: var(--accent-ink);
}
.gc-sum {
  color: var(--ink-2);
  font-size: 13.5px;
  font-weight: 400;
  line-height: 1.55;
}
.gc-frame {
  color: var(--ink-3);
  font-size: 12.5px;
  white-space: nowrap;
}
.gc-badge {
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
  line-height: 22px;
  white-space: nowrap;
}
.gc-badge.ok {
  background: var(--tip-soft);
  color: var(--tip);
}
.gc-badge.part {
  background: var(--warn-soft);
  color: var(--warn);
}
.gc-badge.none {
  background: var(--paper-3);
  color: var(--ink-3);
}
.gc-copy,
.gc-todo-copy {
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink);
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 150ms var(--ease-out);
}
.gc-copy:hover,
.gc-todo-copy:hover {
  border-color: var(--ink-3);
}
.gc-copy:active,
.gc-todo-copy:active {
  transform: scale(0.96);
}
.gc-note {
  margin: 0 0 8px !important;
  font-size: 13.5px !important;
  color: var(--ink-2);
}
.gc-todo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.gc-todo li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 !important;
  padding: 4px 4px 4px 12px;
  border-radius: 10px;
  background: var(--paper-2);
  color: var(--ink);
  font-size: 14px;
}
@media (max-width: 639px) {
  .gc-row {
    grid-template-columns: 1fr auto;
    gap: 6px 10px;
  }
  .gc-link {
    grid-column: 1 / -1;
  }
  .gc-frame {
    display: none;
  }
  .gc-badge {
    justify-self: start;
  }
}
</style>
