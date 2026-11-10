<script setup lang="ts">
import { withBase } from 'vitepress'
import { allChapters, levels, modules } from '../../data/modules'
import { learningPaths } from '../../data/experience'
import { useLearning } from '../../composables/useLearning'

// 阅读路线：每条路线按顺序串起几个方向，每个方向直接摆出它的章节格
const { isComplete } = useLearning()
const pad = (n: number) => String(n).padStart(3, '0')
const routes = learningPaths.map((p) => ({
  ...p,
  steps: p.modules
    .map((id) => modules.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m) => ({ module: m, cells: allChapters.filter((c) => c.module.id === m.id) })),
}))
</script>

<template>
  <div class="at-paths">
    <header class="at-head plain">
      <div>
        <p class="where"><a :href="withBase('/')">目录</a> · 阅读路线</p>
        <h1>不知道从哪开始，就挑一条路线</h1>
        <p class="deck">每条路线把几个方向按顺序排好，从左到右、从浅到深读；也可以随时跳去单篇。</p>
      </div>
    </header>

    <section v-for="p in routes" :id="p.id" :key="p.id" class="at-route">
      <div class="at-route-head">
        <h2>{{ p.title }}</h2>
        <p>{{ p.description }}</p>
        <p class="out"><b>读完能做到</b>{{ p.outcome }}</p>
      </div>
      <ol>
        <li v-for="(s, i) in p.steps" :key="s.module.id" :data-fam="s.module.no">
          <div class="step">
            <span class="i">第 {{ i + 1 }} 步</span>
            <a :href="withBase('/courses/' + s.module.id)"><b>{{ s.module.no }}</b>{{ s.module.name }}</a>
            <small>{{ s.cells.length }} 篇</small>
          </div>
          <div class="at-cells">
            <a
              v-for="c in s.cells"
              :key="c.chapter.id"
              class="at-cell"
              :class="['lv' + (levels.indexOf(c.chapter.level) + 1), { read: isComplete(c.chapter.id) }]"
              :href="withBase(c.chapter.link)"
              :title="c.chapter.title"
            >
              <span class="n">{{ pad(c.order + 1) }}</span><span class="t">{{ c.chapter.short }}</span>
            </a>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>
