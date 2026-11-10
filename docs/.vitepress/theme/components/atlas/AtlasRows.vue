<script setup lang="ts">
import { withBase } from 'vitepress'
import { levels, type ChapterRef } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'

// 章节行：章节格 + 完整标题 + 摘要，用在需要看摘要的列表里
defineProps<{ items: ChapterRef[]; showLevel?: boolean }>()
const { isComplete } = useLearning()
const pad = (n: number) => String(n).padStart(3, '0')
</script>

<template>
  <ul class="at-rows">
    <li v-for="c in items" :key="c.chapter.id">
      <a :href="withBase(c.chapter.link)" :class="{ read: isComplete(c.chapter.id) }">
        <span class="k" :class="'lv' + (levels.indexOf(c.chapter.level) + 1)">{{ pad(c.order + 1) }}</span>
        <span class="b"><b>{{ c.chapter.title }}</b><span>{{ c.chapter.summary }}</span></span>
        <span class="m">
          <template v-if="isComplete(c.chapter.id)">✓ 读过</template>
          <template v-else-if="showLevel">{{ c.chapter.level }}</template>
        </span>
      </a>
    </li>
  </ul>
</template>
