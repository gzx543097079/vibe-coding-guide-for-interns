<script setup lang="ts">
import { withBase } from 'vitepress'
import { modules } from '../../data/modules'

// 九个方向的索引：目录列表页和方向页的左栏共用
defineProps<{ current?: string }>()
</script>

<template>
  <nav class="at-famindex" aria-label="全部方向">
    <a
      v-for="m in modules"
      :key="m.id"
      :data-fam="m.no"
      :href="withBase('/courses/' + m.id)"
      :aria-current="m.id === current ? 'page' : undefined"
    >
      <b>{{ m.no }}</b><span>{{ m.name }}</span><small>{{ m.chapters.length }}</small>
    </a>
    <a class="at-back" :href="withBase('/')">← 回到整张表</a>
  </nav>
</template>
