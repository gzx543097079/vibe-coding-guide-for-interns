<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Module } from '../../data/modules'
import { courseVisuals } from '../../data/experience'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'
defineProps<{ course: Module }>()
const { isComplete } = useLearning()
</script>
<template>
  <a
    class="course-card"
    :href="withBase('/courses/' + course.id)"
    :style="{
      '--course-color': courseVisuals[course.id].color,
      '--course-surface': courseVisuals[course.id].surface,
    }"
  >
    <div class="course-card-visual">
      <SiteIcon :name="course.id" :size="35" /><span>{{
        courseVisuals[course.id].phrase
      }}</span
      ><span class="course-card-tag">{{ course.tag }}</span>
    </div>
    <div class="course-card-body">
      <h2>{{ course.name }}</h2>
      <p>{{ course.intro }}</p>
      <div class="course-card-meta">
        <span>{{ course.chapters.length }} 篇指南</span
        ><span>{{
          course.chapters.filter((c) => isComplete(c.id)).length
            ? '已读 ' +
              course.chapters.filter((c) => isComplete(c.id)).length +
              ' 篇'
            : course.chapters.some((c) => c.level !== '基础')
              ? '基础 / 进阶 / 精通'
              : '从基础开始'
        }}</span
        ><SiteIcon name="arrow" :size="18" />
      </div>
    </div>
  </a>
</template>
