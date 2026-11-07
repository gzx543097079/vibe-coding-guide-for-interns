<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { levels, modules } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'
const props = defineProps<{ module: string }>()
const course = computed(() => modules.find((m) => m.id === props.module)!)
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
  <div class="course-page">
    <section class="course-intro-band">
      <div class="site-width">
        <a class="back-link" :href="withBase('/learn')"
          ><SiteIcon name="back" :size="17" />全部方向</a
        >
        <div class="course-intro-grid">
          <div>
            <h1>{{ course.name }}</h1>
            <p>{{ course.intro }}</p>
            <div class="course-intro-meta">
              <span>{{ course.chapters.length }} 篇</span
              ><span>{{ course.tag }}</span
              ><span>笔记与组件例子</span>
            </div>
            <a class="action-primary" :href="withBase(next.link)"
              >{{
                completed
                  ? completed === course.chapters.length
                    ? '从头再看'
                    : '接着读'
                  : '读第一篇'
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
          <h2>文章</h2>
          <span>{{ groups.length }} 个分组 · 按需要挑着看</span>
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
        <h2>读过的标记</h2>
        <p>看到有用的地方可以留个记号，下次回来接着翻。</p>
        <div class="course-progress-label">
          <span>本机记录</span
          ><strong>{{ completed }} / {{ course.chapters.length }}</strong>
        </div>
        <progress
          :value="completed"
          :max="course.chapters.length"
          aria-label="本方向的阅读进度"
        /><small>在文章页标记，记录只保存在当前浏览器。</small
        ><a :href="withBase('/lab')"
          ><SiteIcon name="lab" :size="20" /><span>看组件例子</span
          ><SiteIcon name="arrow" :size="17" /></a
        ><a :href="withBase('/growth/prompt-templates')"
          ><SiteIcon name="code" :size="20" /><span>看需求模板</span
          ><SiteIcon name="arrow" :size="17"
        /></a>
      </aside>
    </div>
  </div>
</template>
