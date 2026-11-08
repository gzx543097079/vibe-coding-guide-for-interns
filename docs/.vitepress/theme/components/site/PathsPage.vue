<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'
import { modules } from '../../data/modules'
import { learningPaths } from '../../data/experience'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'
const selected = ref(learningPaths[0].id)
const path = computed(() => learningPaths.find((p) => p.id === selected.value)!)
const courses = computed(() =>
  path.value.modules.map((id) => modules.find((m) => m.id === id)!),
)
const { isComplete } = useLearning()
const next = computed(
  () =>
    courses.value.flatMap((m) => m.chapters).find((c) => !isComplete(c.id)) ??
    courses.value[0].chapters[0],
)
function fromHash() {
  const id = location.hash.slice(1)
  if (learningPaths.some((p) => p.id === id)) selected.value = id
}
function select(id: string) {
  selected.value = id
  history.replaceState(null, '', '#' + id)
}
onMounted(() => {
  fromHash()
  window.addEventListener('hashchange', fromHash)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', fromHash))
</script>
<template>
  <div class="paths-page site-width">
    <header class="page-intro">
      <h1>阅读路线</h1>
      <div>
        <p>一条路线把相关的几组文章放在了一起，不必一次读完整个目录。</p>
        <span>可以随时退出，直接点开想看的那一篇。</span>
      </div>
    </header>
    <div class="paths-layout">
      <nav class="path-selector" aria-label="选择阅读路线">
        <button
          v-for="p in learningPaths"
          :key="p.id"
          :aria-pressed="selected === p.id"
          @click="select(p.id)"
        >
          <SiteIcon :name="p.icon" :size="25" /><span
            ><strong>{{ p.title }}</strong
            ><small>{{ p.modules.length }} 个方向</small></span
          ><SiteIcon name="chevron" :size="17" />
        </button>
      </nav>
      <section class="path-detail" :aria-label="path.title">
        <div class="path-detail-head">
          <h2>{{ path.title }}</h2>
          <p>{{ path.description }}</p>
          <p class="path-outcome-lead"><strong>读完你会：</strong>{{ path.outcome }}</p>
          <a class="action-primary" :href="withBase(next.link)"
            >从下一篇开始<SiteIcon name="arrow" :size="18"
          /></a>
        </div>
        <ol class="path-course-list">
          <li v-for="(course, i) in courses" :key="course.id">
            <span class="path-step">{{ i + 1 }}</span>
            <div>
              <h3>
                <a :href="withBase('/courses/' + course.id)"
                  >{{ course.name }}<SiteIcon name="arrow" :size="18"
                /></a>
              </h3>
              <p>{{ course.intro }}</p>
              <small
                >{{ course.chapters.length }} 篇 · 读过
                {{ course.chapters.filter((c) => isComplete(c.id)).length }}
                篇</small
              >
            </div>
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>
