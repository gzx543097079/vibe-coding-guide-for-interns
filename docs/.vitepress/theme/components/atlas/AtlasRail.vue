<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { allChapters, levels, modules, type ChapterRef } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'

// 文章页左栏：就是章节表里当前方向的那一列
const props = defineProps<{ here: ChapterRef }>()
const { isComplete } = useLearning()
const pad = (n: number) => String(n).padStart(3, '0')
const groups = computed(() =>
  levels
    .map((level, i) => ({
      level,
      lv: i + 1,
      cells: allChapters.filter((c) => c.module.id === props.here.module.id && c.chapter.level === level),
    }))
    .filter((g) => g.cells.length),
)
</script>

<template>
  <nav class="at-rail" aria-label="本方向章节">
    <div class="at-fams">
      <a
        v-for="m in modules"
        :key="m.id"
        :data-fam="m.no"
        :href="withBase(m.chapters[0].link)"
        :title="m.name"
        :aria-label="m.name"
        :aria-current="m.id === here.module.id ? 'true' : undefined"
      >{{ m.no }}</a>
    </div>
    <h2>
      <a :href="withBase('/courses/' + here.module.id)">{{ here.module.name }}</a>
      <small>{{ here.module.chapters.length }} 篇</small>
    </h2>
    <template v-for="g in groups" :key="g.level">
      <h3>{{ g.level }}</h3>
      <div class="at-cells">
        <a
          v-for="c in g.cells"
          :key="c.chapter.id"
          class="at-cell"
          :class="['lv' + g.lv, { read: isComplete(c.chapter.id) }]"
          :href="withBase(c.chapter.link)"
          :title="c.chapter.title"
          :aria-current="c.chapter.id === here.chapter.id ? 'page' : undefined"
        >
          <span class="n">{{ pad(c.order + 1) }}</span>
          <span class="t">{{ c.chapter.short }}</span>
        </a>
      </div>
    </template>
    <a class="at-back" :href="withBase('/')">← 回到整张表</a>
  </nav>
</template>
