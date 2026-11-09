<script setup lang="ts">
import { withBase } from 'vitepress'
import { modules } from '../../data/modules'
import { learningPaths } from '../../data/experience'
import SiteIcon from './SiteIcon.vue'

const courses = (p: { modules: string[] }) =>
  p.modules.map((id) => modules.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => Boolean(m))
</script>
<template>
  <div class="topic-page">
    <p class="topic-crumb"><a :href="withBase('/learn')">目录</a> / 阅读路线</p>
    <h1>阅读路线</h1>
    <p class="topic-intro">把相关的几组文章串在一起，按顺序读；也可以随时跳去单篇。</p>

    <section v-for="p in learningPaths" :key="p.id" class="topic-group route-group">
      <h2>{{ p.title }}<span>{{ p.modules.length }} 个方向</span></h2>
      <p class="route-desc">{{ p.description }}</p>
      <p class="route-outcome">{{ p.outcome }}</p>
      <ul>
        <li v-for="m in courses(p)" :key="m.id">
          <a :href="withBase('/courses/' + m.id)">
            <span class="t">{{ m.name }}</span>
            <span class="s">{{ m.intro }}</span>
            <SiteIcon name="chevron" :size="14" class="ch" />
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
