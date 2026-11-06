<script setup lang="ts">
import { computed } from 'vue'
import { getTech } from '../data/techProfiles'

const props = defineProps<{
  /** 技术 id，多个用英文逗号分隔，见 data/techProfiles.ts */
  ids: string
}>()

const list = computed(() =>
  props.ids
    .split(',')
    .map((s) => getTech(s.trim()))
    .filter((t): t is NonNullable<typeof t> => Boolean(t)),
)
const pending = (v: string) => v.includes('待核实')
const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')
</script>

<template>
  <div class="tc-list">
    <details v-for="(t, i) in list" :key="t.id" class="tc" :open="i === 0">
      <summary class="tc-sum">
        <span class="tc-name">{{ t.name }}</span>
        <span class="tc-what">{{ t.what }}</span>
        <span class="tc-caret" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </summary>

      <div class="tc-body">
        <div class="tc-cols">
          <div>
            <p class="tc-h">常用来做</p>
            <ul>
              <li v-for="u in t.uses" :key="u">{{ u }}</li>
            </ul>
          </div>
          <div>
            <p class="tc-h">不适合</p>
            <ul>
              <li v-for="u in t.notFor" :key="u">{{ u }}</li>
            </ul>
          </div>
        </div>

        <p class="tc-h">新手先学什么</p>
        <p class="tc-p">{{ t.start }}</p>
        <p class="tc-h">和相近技术怎么选</p>
        <p class="tc-p">{{ t.choose }}</p>

        <dl class="tc-meta">
          <div>
            <dt>出品方</dt>
            <dd :class="{ pending: pending(t.vendor) }">{{ t.vendor }}</dd>
          </div>
          <div>
            <dt>首次发布</dt>
            <dd :class="{ pending: pending(t.year) }">{{ t.year }}</dd>
          </div>
          <div>
            <dt>协议</dt>
            <dd :class="{ pending: pending(t.license) }">{{ t.license }}</dd>
          </div>
          <div v-if="t.site || t.docs">
            <dt>链接</dt>
            <dd class="tc-links">
              <a v-if="t.site" :href="t.site" target="_blank" rel="noopener">官网 {{ host(t.site) }}</a>
              <a v-if="t.docs" :href="t.docs" target="_blank" rel="noopener">文档</a>
            </dd>
          </div>
        </dl>
      </div>
    </details>
  </div>
</template>

<style scoped>
.tc-list {
  display: grid;
  gap: 10px;
  margin: 16px 0 8px;
}
.tc {
  border-radius: 14px;
  border: 1px solid var(--rule);
  background: var(--raised);
  box-shadow: 0 1px 2px oklch(0.2 0.02 250 / 0.05);
  overflow: hidden;
}
.tc-sum {
  margin: 0 !important;
}
.tc-sum {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: 4px 14px;
  padding: 14px 16px;
  cursor: pointer;
  list-style: none;
}
.tc-sum::-webkit-details-marker {
  display: none;
}
.tc-sum:hover {
  background: var(--paper-2);
}
.tc-name {
  font-size: 16px;
  font-weight: 720;
  color: var(--ink);
  white-space: nowrap;
}
.tc-what {
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-2);
}
.tc-caret {
  align-self: center;
  color: var(--ink-3);
  transition: transform 0.3s var(--ease-spring);
}
.tc[open] .tc-caret {
  transform: rotate(180deg);
}
.tc:not([open]) .tc-body {
  display: none;
}
.tc-body {
  padding: 2px 16px 16px;
  border-top: 1px dashed var(--rule);
}
.tc-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 24px;
}
.tc-h {
  margin: 14px 0 4px !important;
  font-size: 13px !important;
  font-weight: 700;
  color: var(--ink);
}
.tc-body ul {
  margin: 0 !important;
  padding-left: 1.1em !important;
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-2);
}
.tc-body li + li {
  margin-top: 2px !important;
}
.tc-p {
  margin: 0 !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  color: var(--ink-2);
}
.tc-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin: 16px 0 0;
  padding: 12px;
  border-radius: 10px;
  background: var(--paper-2);
}
.tc-meta dt {
  font-size: 12px;
  color: var(--ink-3);
}
.tc-meta dd {
  margin: 2px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--ink);
}
.tc-meta dd.pending {
  color: var(--ink-2);
  font-style: normal;
  text-decoration: underline dashed var(--warn);
  text-underline-offset: 3px;
}
.tc-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

@media (max-width: 639px) {
  .tc-sum {
    grid-template-columns: 1fr auto;
  }
  .tc-what {
    grid-column: 1 / -1;
    grid-row: 2;
  }
  .tc-cols {
    grid-template-columns: 1fr;
  }
}
</style>
