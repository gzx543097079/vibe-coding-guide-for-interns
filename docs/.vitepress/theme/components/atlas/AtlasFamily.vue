<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { allChapters, levels, modules } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'
import AtlasFamIndex from './AtlasFamIndex.vue'
import AtlasRows from './AtlasRows.vue'

// 方向页：一个方向的全部章节，按级别分三段
const props = defineProps<{ module: string }>()
const course = computed(() => modules.find((m) => m.id === props.module)!)
const { isComplete } = useLearning()
const mine = computed(() => allChapters.filter((c) => c.module.id === props.module))
const completed = computed(() => mine.value.filter((c) => isComplete(c.chapter.id)).length)
const groups = computed(() =>
  levels
    .map((level) => ({ level, items: mine.value.filter((c) => c.chapter.level === level) }))
    .filter((g) => g.items.length),
)
</script>

<template>
  <div class="at-two" :data-fam="course.no">
    <AtlasFamIndex :current="course.id" />
    <div class="at-article">
      <header class="at-head">
        <div class="at-tile lv3">
          <span class="n">{{ course.no }}</span>
          <span>{{ course.chapters.length }} 篇</span>
        </div>
        <div>
          <p class="where"><a :href="withBase('/')">目录</a> · 方向 {{ course.no }} / {{ modules.length }}</p>
          <h1>{{ course.name }}</h1>
          <p class="deck">
            {{ course.intro }}<template v-if="completed"> 已读过 {{ completed }} / {{ course.chapters.length }} 篇。</template>
          </p>
        </div>
      </header>

      <section v-for="g in groups" :key="g.level" class="at-sec">
        <h2>{{ g.level }}<small>{{ g.items.length }} 篇</small></h2>
        <AtlasRows :items="g.items" />
      </section>
    </div>
  </div>
</template>
