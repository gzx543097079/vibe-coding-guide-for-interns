<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { levels, modules } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'

const props = defineProps<{ module: string }>()
const course = computed(() => modules.find((m) => m.id === props.module)!)
const { isComplete } = useLearning()
const completed = computed(() => course.value.chapters.filter((c) => isComplete(c.id)).length)
const groups = computed(() =>
  levels
    .map((level) => ({ level, chapters: course.value.chapters.filter((c) => c.level === level) }))
    .filter((g) => g.chapters.length),
)
</script>
<template>
  <div class="topic-page">
    <p class="topic-crumb"><a :href="withBase('/learn')">目录</a> / {{ course.name }}</p>
    <h1>{{ course.name }}</h1>
    <p class="topic-intro">{{ course.intro }}</p>
    <p class="topic-meta">{{ course.chapters.length }} 篇 · 基础 / 进阶 / 精通<span v-if="completed"> · 已读 {{ completed }} 篇</span></p>

    <section v-for="g in groups" :key="g.level" class="topic-group">
      <h2>{{ g.level }}<span>{{ g.chapters.length }} 篇</span></h2>
      <ul>
        <li v-for="c in g.chapters" :key="c.id">
          <a :href="withBase(c.link)">
            <span class="t">{{ c.title }}</span>
            <span class="s">{{ c.summary }}</span>
            <SiteIcon v-if="isComplete(c.id)" name="check" :size="14" class="done" />
            <SiteIcon v-else name="chevron" :size="14" class="ch" />
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
