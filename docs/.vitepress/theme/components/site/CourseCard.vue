<script setup lang="ts">
import { withBase } from 'vitepress'
import { levelCounts, type Module } from '../../data/modules'
import SiteIcon from './SiteIcon.vue'
defineProps<{ course: Module }>()
</script>
<template>
  <a class="course-card" :href="withBase('/courses/' + course.id)">
    <div class="cc-top">
      <span class="cc-no">{{ String(course.no).padStart(2, '0') }}</span>
      <h2>{{ course.name }}</h2>
      <span class="cc-count">{{ course.chapters.length }} 篇</span>
    </div>
    <p class="cc-intro">{{ course.intro }}</p>
    <div class="cc-levels">
      <span v-for="lc in levelCounts(course)" :key="lc.level">{{ lc.level }} {{ lc.count }}</span>
      <SiteIcon name="arrow" :size="15" class="cc-arrow" />
    </div>
  </a>
</template>
