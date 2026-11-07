<script setup lang="ts">
// 学习路径条：前置 / 本章 / 下一步，全部由 modules.ts 推出
// 前置默认取全局顺序上一章，下一步取下一章；可用 pre / next 传章节 id（如 start/setup）覆盖
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { allChapters, chapterCode, findChapter, type ChapterRef } from '../../data/modules'

const props = defineProps<{ pre?: string; next?: string }>()
const { page } = useData()

const byId = (id?: string) => (id ? allChapters.find((r) => r.chapter.id === id) : undefined)
const here = computed(() => findChapter(page.value.relativePath))
const before = computed<ChapterRef | undefined>(() =>
  props.pre ? byId(props.pre) : here.value ? allChapters[here.value.order - 1] : undefined,
)
const after = computed<ChapterRef | undefined>(() =>
  props.next ? byId(props.next) : here.value ? allChapters[here.value.order + 1] : undefined,
)

const cells = computed(() => [
  { key: 'pre', label: '前置', ref: before.value, empty: '从这里开始，不需要前置知识' },
  { key: 'now', label: '本章', ref: here.value, empty: '' },
  { key: 'next', label: '下一步', ref: after.value, empty: '这是最后一章' },
])
</script>

<template>
  <nav v-if="here" class="rx-path" :data-mod="here.module.id" aria-label="学习路径">
    <ol class="rx-path-list">
      <li v-for="c in cells" :key="c.key" class="rx-path-cell" :class="`is-${c.key}`">
        <span class="rx-path-label">{{ c.label }}</span>
        <template v-if="c.ref">
          <span v-if="c.key === 'now'" class="rx-path-link" aria-current="page">
            <span class="rx-path-code">{{ chapterCode(c.ref) }}</span>
            <span class="rx-path-title">{{ c.ref.chapter.title }}</span>
          </span>
          <a v-else class="rx-path-link" :href="withBase(c.ref.chapter.link)">
            <span class="rx-path-code">{{ chapterCode(c.ref) }}</span>
            <span class="rx-path-title">{{ c.ref.chapter.title }}</span>
            <span v-if="c.ref.module.id !== here.module.id" class="rx-path-mod">{{ c.ref.module.name }}</span>
          </a>
        </template>
        <span v-else class="rx-path-empty">{{ c.empty }}</span>
      </li>
    </ol>
  </nav>
</template>
