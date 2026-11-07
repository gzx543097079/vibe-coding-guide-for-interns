<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { levels, modules } from '../../data/modules'
import { courseVisuals } from '../../data/experience'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'
const props = defineProps<{ module: string }>()
const course = computed(() => modules.find((m) => m.id === props.module)!)
const visual = computed(() => courseVisuals[props.module])
const { isComplete } = useLearning()
const completed = computed(
  () => course.value.chapters.filter((c) => isComplete(c.id)).length,
)
const next = computed(
  () =>
    course.value.chapters.find((c) => !isComplete(c.id)) ??
    course.value.chapters[0],
)
const groups = computed(() =>
  levels
    .map((level) => ({
      level,
      chapters: course.value.chapters.filter((c) => c.level === level),
    }))
    .filter((g) => g.chapters.length),
)
</script>
<template>
  <div
    class="course-page"
    :style="{
      '--course-color': visual.color,
      '--course-surface': visual.surface,
    }"
  >
    <section class="course-intro-band">
      <div class="site-width">
        <a class="back-link" :href="withBase('/learn')"
          ><SiteIcon name="back" :size="17" />全部课程</a
        >
        <div class="course-intro-grid">
          <div>
            <h1>{{ course.name }}</h1>
            <p>{{ course.intro }}</p>
            <div class="course-intro-meta">
              <span>{{ course.chapters.length }} 篇指南</span
              ><span>{{ course.tag }}</span
              ><span>文字 + 实践示例</span>
            </div>
            <a class="action-primary" :href="withBase(next.link)"
              >{{
                completed
                  ? completed === course.chapters.length
                    ? '重新阅读'
                    : '继续学习'
                  : '开始这门课程'
              }}<SiteIcon name="arrow" :size="18"
            /></a>
          </div>
          <div class="course-emblem" aria-hidden="true">
            <SiteIcon :name="course.id" :size="92" />
          </div>
        </div>
      </div>
    </section>
    <div class="site-width course-content-grid">
      <div class="course-curriculum">
        <div class="section-heading">
          <h2>课程内容</h2>
          <span>{{ groups.length }} 个学习阶段</span>
        </div>
        <section v-for="g in groups" :key="g.level" class="curriculum-group">
          <h3>
            {{ g.level }}<span>{{ g.chapters.length }} 篇</span>
          </h3>
          <ol>
            <li v-for="c in g.chapters" :key="c.id">
              <a :href="withBase(c.link)"
                ><span
                  class="chapter-status"
                  :class="{ complete: isComplete(c.id) }"
                  ><SiteIcon
                    v-if="isComplete(c.id)"
                    name="check"
                    :size="15" /><SiteIcon v-else name="book" :size="15"
                /></span>
                <div>
                  <strong>{{ c.title }}</strong>
                  <p>{{ c.summary }}</p>
                </div>
                <SiteIcon name="arrow" :size="17"
              /></a>
            </li>
          </ol>
        </section>
      </div>
      <aside class="course-side-info">
        <h2>把知识变成你的经验</h2>
        <p>
          先理解概念，再运行示例。带着手头的项目阅读，遇到问题就回到对应章节。
        </p>
        <div class="course-progress-label">
          <span>本机学习进度</span
          ><strong>{{ completed }} / {{ course.chapters.length }}</strong>
        </div>
        <progress
          :value="completed"
          :max="course.chapters.length"
          aria-label="课程学习进度"
        /><small>在阅读页标记完成，记录仅保存在当前浏览器。</small
        ><a :href="withBase('/lab')"
          ><SiteIcon name="lab" :size="20" /><span>去实验室动手试试</span
          ><SiteIcon name="arrow" :size="17" /></a
        ><a :href="withBase('/growth/prompt-templates')"
          ><SiteIcon name="code" :size="20" /><span>找到适合任务的提示词</span
          ><SiteIcon name="arrow" :size="17"
        /></a>
      </aside>
    </div>
  </div>
</template>
