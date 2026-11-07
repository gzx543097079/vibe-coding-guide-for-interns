<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Module } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'
defineProps<{ course: Module }>()
const { isComplete } = useLearning()
</script>
<template>
  <a
    class="course-card"
    :href="withBase('/courses/' + course.id)"
  >
    <span class="course-card-no">{{ String(course.no).padStart(2, '0') }}</span>
    <span class="course-card-icon"><SiteIcon :name="course.id" :size="20" /></span>
    <div class="course-card-body">
      <h2>{{ course.name }}</h2>
      <p>{{ course.intro }}</p>
    </div>
    <span class="course-card-tag">{{ course.tag }}</span>
    <span class="course-card-meta">{{ course.chapters.length }} 步</span>
    <span class="course-card-meta">{{
      course.chapters.filter((c) => isComplete(c.id)).length
        ? '已完成 ' + course.chapters.filter((c) => isComplete(c.id)).length + ' 步'
        : course.chapters.some((c) => c.level !== '基础')
          ? '基础 / 进阶 / 精通'
          : '从第一步开始'
    }}</span>
    <SiteIcon name="arrow" :size="17" />
  </a>
</template>
