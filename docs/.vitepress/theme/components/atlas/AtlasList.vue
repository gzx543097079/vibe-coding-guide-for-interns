<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { allChapters, modules, totalChapters } from '../../data/modules'
import AtlasFamIndex from './AtlasFamIndex.vue'
import AtlasRows from './AtlasRows.vue'

// 目录的列表视图：和首页同一份数据，多了摘要，可以按文字筛选
const query = ref('')
const sections = computed(() => {
  const term = query.value.trim().toLowerCase()
  return modules
    .map((m) => ({
      module: m,
      items: allChapters.filter(
        (c) =>
          c.module.id === m.id &&
          (!term ||
            `${c.chapter.title} ${c.chapter.short} ${c.chapter.summary} ${c.chapter.group ?? ''} ${m.name}`
              .toLowerCase()
              .includes(term)),
      ),
    }))
    .filter((s) => s.items.length)
})
const hits = computed(() => sections.value.reduce((n, s) => n + s.items.length, 0))
</script>

<template>
  <div class="at-two">
    <AtlasFamIndex />
    <div class="at-article">
      <header class="at-head plain">
        <div>
          <p class="where"><a :href="withBase('/')">目录</a> · 列表视图</p>
          <h1>全部 {{ totalChapters }} 篇，带摘要</h1>
          <p class="deck">和首页那张表是同一份内容，这里每篇多一行摘要，适合按关键词找。</p>
        </div>
      </header>

      <div class="at-filter">
        <input v-model="query" type="search" placeholder="按标题或摘要筛选" aria-label="筛选章节" />
        <span aria-live="polite">{{ query.trim() ? `匹配 ${hits} 篇` : `${modules.length} 个方向` }}</span>
      </div>

      <section v-for="s in sections" :key="s.module.id" class="at-sec" :data-fam="s.module.no">
        <h2>
          <b>{{ s.module.no }}</b>
          <a :href="withBase('/courses/' + s.module.id)">{{ s.module.name }}</a>
          <small>{{ s.items.length }} 篇</small>
        </h2>
        <p v-if="!query.trim()" class="at-sec-intro">{{ s.module.intro }}</p>
        <AtlasRows :items="s.items" show-level />
      </section>

      <div v-if="!sections.length" class="at-empty">
        <p>没有匹配的章节。换个词试试，比如「提示词」「性能」「Git」。</p>
        <button type="button" @click="query = ''">看全部 {{ totalChapters }} 篇</button>
      </div>
    </div>
  </div>
</template>
