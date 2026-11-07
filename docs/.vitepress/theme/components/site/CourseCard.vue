<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Module } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'
defineProps<{ course: Module }>()
const { isComplete } = useLearning()
</script>
<template>
  <a class="course-card" :href="withBase('/courses/' + course.id)">
    <div class="course-card-body">
      <h2>{{ course.name }}</h2>
      <p>{{ course.intro }}</p>
    </div>
    <span class="course-card-tag">{{ course.tag }}</span>
    <span class="course-card-meta">{{ course.chapters.length }} 篇</span>
    <span class="course-card-meta">{{
      course.chapters.filter((c) => isComplete(c.id)).length
        ? '读过 ' + course.chapters.filter((c) => isComplete(c.id)).length + ' 篇'
        : course.chapters.some((c) => c.level !== '基础')
          ? '基础 / 进阶 / 精通'
          : '从第一篇开始'
    }}</span>
    <SiteIcon name="arrow" :size="17" />
  </a>
</template>
