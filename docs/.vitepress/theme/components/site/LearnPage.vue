<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { modules, totalChapters } from '../../data/modules'
import CourseCard from './CourseCard.vue'
import SiteIcon from './SiteIcon.vue'
const filter = ref('全部方向')
const query = ref('')
const filters = ['全部方向', '通用', '前端', '后端']
const results = computed(() =>
  modules.filter(
    (m) =>
      (filter.value === '全部方向' || m.tag === filter.value) &&
      (m.name + m.intro + m.chapters.map((c) => c.title).join(''))
        .toLowerCase()
        .includes(query.value.trim().toLowerCase()),
  ),
)
function reset() {
  query.value = ''
  filter.value = '全部方向'
}
</script>
<template>
  <div class="catalog-page site-width">
    <header class="page-intro">
      <h1>目录</h1>
      <div>
        <p>按方向筛选，或者直接搜章节标题。原来的网址都还在。</p>
        <span
          >{{ modules.length }} 个方向、{{
            totalChapters
          }} 篇笔记，按基础、进阶和精通分了组。</span
        >
      </div>
    </header>
    <div class="catalog-toolbar">
      <div class="filter-buttons" role="group" aria-label="按方向筛选">
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
                  ? '通用'
                  : name
          }}
        </button>
      </div>
      <label class="catalog-search"
        ><SiteIcon name="search" :size="18" /><input
          v-model="query"
          aria-label="搜索方向或章节"
          placeholder="搜索方向或章节" /><button
          v-if="query"
          @click="query = ''"
          aria-label="清空搜索"
        >
          <SiteIcon name="close" :size="16" /></button
      ></label>
    </div>
    <p class="result-count" aria-live="polite">
      {{ results.length }} 个方向{{ query ? ' · 与「' + query + '」相关' : '' }}
    </p>
    <div v-if="results.length" class="course-grid">
      <CourseCard v-for="m in results" :key="m.id" :course="m" />
    </div>
    <div v-else class="empty-state">
      <SiteIcon name="search" :size="34" />
      <h2>没有找到相关内容</h2>
      <p>换个关键词试试，比如「AI」「界面」「数据」，也可以看全部方向。</p>
      <button class="action-primary" @click="reset">看全部方向</button>
    </div>
    <aside class="catalog-tip">
      <SiteIcon name="route" :size="25" />
      <div>
        <h2>想按顺序读？</h2>
        <p>几条路线把相关章节放在了一起。</p>
      </div>
      <a class="text-link" :href="withBase('/paths')"
        >看阅读路线 <SiteIcon name="arrow" :size="18"
      /></a>
    </aside>
  </div>
</template>
