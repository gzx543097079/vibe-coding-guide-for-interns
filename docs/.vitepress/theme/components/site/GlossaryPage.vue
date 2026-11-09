<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { termCategories, terms, type TermCategory } from '../../data/glossary'
import SiteIcon from './SiteIcon.vue'

const query = ref('')
const active = ref<'全部' | TermCategory>('全部')
const filters: ('全部' | TermCategory)[] = ['全部', ...termCategories]

const normalized = (s: string) => s.toLowerCase().replace(/\s+/g, '')

function weight(t: (typeof terms)[number], q: string) {
  if (!q) return 0
  const name = normalized(`${t.term}${t.en ?? ''}`)
  if (normalized(t.term) === q || normalized(t.en ?? '') === q) return 0
  if (name.startsWith(q)) return 1
  if (name.includes(q)) return 2
  return 3
}

const result = computed(() => {
  const q = normalized(query.value.trim())
  return terms
    .filter((t) => {
      if (active.value !== '全部' && t.category !== active.value) return false
      if (!q) return true
      return normalized(`${t.term}${t.en ?? ''}${t.def}${t.note ?? ''}`).includes(q)
    })
    .sort((a, b) => weight(a, q) - weight(b, q))
})

// 有搜索词时平铺按相关度排；没有搜索词时按分类分组
const grouped = computed(() => {
  if (query.value.trim()) {
    return result.value.length ? [{ category: '搜索结果', items: result.value }] : []
  }
  return termCategories
    .map((category) => ({
      category,
      items: result.value.filter((t) => t.category === category),
    }))
    .filter((g) => g.items.length)
})

const total = terms.length

function jumpToHash() {
  const id = location.hash.slice(1)
  if (!id) return
  nextTick(() => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ block: 'center' })
  })
}
onMounted(jumpToHash)
</script>

<template>
  <div class="kb-glossary">
    <header class="kb-glossary-head">
      <h1>名词解释</h1>
      <p>
        这里收开发中常遇到、又容易混淆的词，按分类排；也可以直接搜中文、英文或缩写。
      </p>
      <div class="kb-glossary-tools">
        <label class="kb-glossary-search">
          <SiteIcon name="search" :size="16" />
          <input v-model="query" type="search" placeholder="搜名词、英文缩写或解释" aria-label="搜索名词" />
          <button v-if="query" type="button" aria-label="清空搜索" @click="query = ''">
            <SiteIcon name="close" :size="14" />
          </button>
        </label>
        <div class="kb-glossary-filters" role="group" aria-label="按分类筛选">
          <button
            v-for="f in filters"
            :key="f"
            type="button"
            :aria-pressed="active === f"
            :class="{ on: active === f }"
            @click="active = f"
          >{{ f }}</button>
        </div>
      </div>
      <p class="kb-glossary-count" aria-live="polite">
        {{ query.trim() || active !== '全部' ? `找到 ${result.length} 条` : `共 ${total} 条` }}
      </p>
    </header>

    <div v-if="grouped.length" class="kb-glossary-body">
      <section v-for="g in grouped" :key="g.category" class="kb-glossary-group">
        <div class="kb-glossary-group-head">
          <h2>{{ g.category }}</h2>
          <span>{{ g.items.length }} 条</span>
        </div>
        <dl class="kb-glossary-list">
          <div v-for="t in g.items" :id="t.id" :key="t.id" class="kb-glossary-item">
            <dt>
              <span class="kb-glossary-term">{{ t.term }}</span>
              <span v-if="t.en" class="kb-glossary-en">{{ t.en }}</span>
            </dt>
            <dd>
              <p class="kb-glossary-def">{{ t.def }}</p>
              <p v-if="t.note" class="kb-glossary-note">{{ t.note }}</p>
              <p v-if="t.links?.length" class="kb-glossary-links">
                <span>相关</span>
                <a v-for="l in t.links" :key="l.href" :href="withBase(l.href)">{{ l.label }}<SiteIcon name="arrow" :size="12" /></a>
              </p>
            </dd>
          </div>
        </dl>
      </section>
    </div>

    <div v-else class="kb-glossary-empty">
      <p>没有匹配的词。换个写法试试，或者清空筛选。</p>
      <button type="button" @click="query = ''; active = '全部'">看全部 {{ total }} 条</button>
    </div>
  </div>
</template>
