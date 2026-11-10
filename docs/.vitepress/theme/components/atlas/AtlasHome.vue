<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { allChapters, levels, modules, totalChapters, type Level } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'

const { last, isComplete, state } = useLearning()
const lv = (level: Level) => levels.indexOf(level) + 1
const pad = (n: number) => String(n).padStart(3, '0')

// 每列一个方向；格子带全站编号
const columns = modules.map((m) => ({
  module: m,
  cells: allChapters.filter((c) => c.module.id === m.id),
}))

// 右侧详情卡显示的章节：默认第一篇，有阅读记录时显示上次那篇
const shown = ref(0)
const card = computed(() => allChapters[shown.value])
onMounted(() => {
  if (last.value) shown.value = last.value.order
})

// 级别筛选：不匹配的格子变淡，表的形状不变
const filter = ref<Level | ''>('')
const matches = (level: Level) => !filter.value || filter.value === level
const hint = computed(() =>
  filter.value
    ? `${filter.value}共 ${allChapters.filter((c) => c.chapter.level === filter.value).length} 篇`
    : `${modules.length} 个方向各占一列，从上到下由浅入深。`,
)
function setFilter(level: Level | '') {
  filter.value = level
  const first = allChapters.find((c) => matches(c.chapter.level))
  if (level && first && !matches(card.value.chapter.level)) shown.value = first.order
}
const more = [
  { name: '阅读路线', note: '不知道从哪开始时，按问题挑一条路线', link: '/paths' },
  { name: '组件演示', note: '常用控件可以直接操作，附提示词', link: '/lab' },
  { name: '需求模板', note: '把要写清楚的信息整理成一段文字', link: '/growth/prompt-templates' },
  { name: '名词解释', note: '常见术语，支持中英文和缩写搜索', link: '/glossary' },
]
</script>

<template>
  <div class="at-home">
    <div class="at-main">
      <div class="at-intro">
        <div>
          <h1>{{ totalChapters }} 篇开发笔记，一张表看全</h1>
          <p aria-live="polite">{{ hint }}</p>
        </div>
        <div class="at-levels" role="group" aria-label="按级别筛选">
          <button type="button" :aria-pressed="filter === ''" @click="setFilter('')">全部</button>
          <button
            v-for="level in levels"
            :key="level"
            type="button"
            :aria-pressed="filter === level"
            @click="setFilter(level)"
          >{{ level }}</button>
        </div>
      </div>

      <div class="at-table">
        <section v-for="col in columns" :key="col.module.id" class="at-col" :data-fam="col.module.no">
          <h2>
            <b>{{ col.module.no }}</b>
            <a :href="withBase('/courses/' + col.module.id)">{{ col.module.name }}</a>
            <small>{{ col.cells.length }} 篇</small>
          </h2>
          <div class="at-cells">
            <a
              v-for="c in col.cells"
              :key="c.chapter.id"
              class="at-cell"
              :class="[
                'lv' + lv(c.chapter.level),
                { on: shown === c.order, read: isComplete(c.chapter.id), dim: !matches(c.chapter.level) },
              ]"
              :href="withBase(c.chapter.link)"
              :title="c.chapter.title"
              :tabindex="matches(c.chapter.level) ? undefined : -1"
              @mouseenter="matches(c.chapter.level) && (shown = c.order)"
              @focus="shown = c.order"
            >
              <span class="n">{{ pad(c.order + 1) }}</span>
              <span class="t">{{ c.chapter.short }}</span>
            </a>
          </div>
        </section>
      </div>
    </div>

    <aside class="at-side" aria-label="章节详情">
      <div class="at-card" :data-fam="card.module.no" aria-live="polite">
        <div class="meta">
          <span class="n">{{ pad(card.order + 1) }}</span>
          <span class="lv" :class="'lv' + lv(card.chapter.level)">{{ card.chapter.level }}</span>
        </div>
        <h3>{{ card.chapter.title }}</h3>
        <div class="dir">
          {{ card.module.no }} · {{ card.module.name }}<template v-if="card.chapter.group"> · {{ card.chapter.group }}</template>
        </div>
        <p>{{ card.chapter.summary }}</p>
        <a class="go" :href="withBase(card.chapter.link)">{{ isComplete(card.chapter.id) ? '再读一遍' : '开始阅读' }}</a>
      </div>
      <div>
        <h4>颜色深浅表示级别</h4>
        <div class="at-legend" data-fam="6">
          <div><i />基础：浅底</div>
          <div><i class="lv2" />进阶：中间色</div>
          <div><i class="lv3" />精通：实心</div>
        </div>
        <h4>上次读到</h4>
        <div v-if="last" class="at-cells" :data-fam="last.module.no">
          <a
            class="at-cell"
            :class="['lv' + lv(last.chapter.level), { read: isComplete(last.chapter.id) }]"
            :href="withBase(last.chapter.link)"
          >
            <span class="n">{{ pad(last.order + 1) }}</span>
            <span class="t">{{ last.chapter.title }}</span>
          </a>
        </div>
        <p class="at-note">
          <template v-if="state.completed.length">已读过 {{ state.completed.length }} / {{ totalChapters }} 篇，</template>
          <template v-else-if="!last">还没有记录。</template>
          读过的章节会在表里打上 ✓，记录只存在这台设备的浏览器里。
        </p>
      </div>
    </aside>

    <nav class="at-more" aria-label="其他入口">
      <a v-for="m in more" :key="m.link" :href="withBase(m.link)"><b>{{ m.name }}</b><span>{{ m.note }}</span></a>
    </nav>
  </div>
</template>
