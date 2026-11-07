<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { modules, totalChapters } from '../../data/modules'
import CourseCard from './CourseCard.vue'
import SiteIcon from './SiteIcon.vue'
const filter = ref('全部工作区')
const query = ref('')
const filters = ['全部工作区', '通用', '前端', '后端']
const results = computed(() =>
  modules.filter(
    (m) =>
      (filter.value === '全部工作区' || m.tag === filter.value) &&
      (m.name + m.intro + m.chapters.map((c) => c.title).join(''))
        .toLowerCase()
        .includes(query.value.trim().toLowerCase()),
  ),
)
function reset() {
  query.value = ''
  filter.value = '全部工作区'
}
</script>
<template>
  <div class="catalog-page site-width">
    <header class="page-intro">
      <h1>从手上的问题，<br />找到对应工作区。</h1>
      <div>
        <p>按目标筛选，直接进入章节；内容保持原有地址，随时能回到当前任务。</p>
        <span
          >{{ modules.length }} 个方向，{{
            totalChapters
          }} 篇章节，从基础到独立交付。</span
        >
      </div>
    </header>
    <div class="catalog-toolbar">
      <div class="filter-buttons" role="group" aria-label="工作区方向">
        <button
          v-for="name in filters"
          :key="name"
          :aria-pressed="filter === name"
          @click="filter = name"
        >
          {{
            name === '前端'
              ? '前端与跨端'
              : name === '后端'
                ? '后端与数据'
                : name === '通用'
                  ? '通用与工程'
                  : name
          }}
        </button>
      </div>
      <label class="catalog-search"
        ><SiteIcon name="search" :size="18" /><input
          v-model="query"
          aria-label="搜索工作区"
          placeholder="搜索工作区或章节关键词" /><button
          v-if="query"
          @click="query = ''"
          aria-label="清空工作区搜索"
        >
          <SiteIcon name="close" :size="16" /></button
      ></label>
    </div>
    <p class="result-count" aria-live="polite">
      {{ results.length }} 个工作区{{ query ? ' · 与「' + query + '」相关' : '' }}
    </p>
    <div v-if="results.length" class="course-grid">
      <CourseCard v-for="m in results" :key="m.id" :course="m" />
    </div>
    <div v-else class="empty-state">
      <SiteIcon name="search" :size="34" />
      <h2>没有找到相关工作区</h2>
      <p>试试「AI」「界面」「数据」等关键词，或查看全部工作区。</p>
      <button class="action-primary" @click="reset">查看全部工作区</button>
    </div>
    <aside class="catalog-tip">
      <SiteIcon name="route" :size="25" />
      <div>
        <h2>想要一条更清晰的任务顺序？</h2>
        <p>从真实目标出发，沿着路线组合章节。</p>
      </div>
      <a class="text-link" :href="withBase('/paths')"
        >选择任务线 <SiteIcon name="arrow" :size="18"
      /></a>
    </aside>
  </div>
</template>
