<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Content, useData, withBase } from 'vitepress'
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue'
import { findChapter, levels, totalChapters } from './data/modules'
import { demos } from './components/demos/registry'
import { useLearning } from './composables/useLearning'
import { useRouteTransition } from './composables/useRouteTransition'
import AtlasHeader from './components/atlas/AtlasHeader.vue'
import SiteFooter from './components/site/SiteFooter.vue'
import AtlasRail from './components/atlas/AtlasRail.vue'
import CommandPalette from './components/CommandPalette.vue'
import BackToTop from './components/BackToTop.vue'
import NotFound from './components/NotFound.vue'

const { page, frontmatter } = useData()
const demoIds = new Set(Object.keys(demos))
const pad = (n: number) => String(n).padStart(3, '0')
const here = computed(() => findChapter(page.value.relativePath))
const isHome = computed(() => page.value.relativePath === 'index.md')
const isDoc = computed(
  () => !page.value.isNotFound && frontmatter.value.layout !== 'page',
)
// 翻页只走当前方向；最后一章明确回到该方向目录
const before = computed(() =>
  here.value ? here.value.module.chapters[here.value.index - 1] : undefined,
)
const after = computed(() =>
  here.value ? here.value.module.chapters[here.value.index + 1] : undefined,
)
const demoSlug = computed(() => {
  if (!here.value || here.value.module.id !== 'controls') return ''
  const slug = here.value.chapter.id.split('/')[1]
  return demoIds.has(slug) ? slug : ''
})
const verificationLink = computed(() =>
  demoSlug.value ? withBase('/lab#' + demoSlug.value) : withBase('/lab'),
)
const lv = computed(() => (here.value ? levels.indexOf(here.value.chapter.level) + 1 : 1))
const { visit, toggle, isComplete } = useLearning()
const { phase } = useRouteTransition()
const toc = ref<{ title: string; link: string; id: string; level: number }[]>([])
const activeHeading = ref('')
let observer: IntersectionObserver | undefined

async function setupReading() {
  observer?.disconnect()
  if (here.value) visit(here.value.chapter.id)
  await nextTick()
  if (!isDoc.value) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) activeHeading.value = entry.target.id
    },
    { rootMargin: '-90px 0px -65% 0px' },
  )
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>('.kb-body h2[id],.kb-body h3[id]'),
  )
  toc.value = headings.map((el) => ({
    id: el.id,
    link: '#' + encodeURIComponent(el.id),
    level: Number(el.tagName.slice(1)),
    title: Array.from(el.childNodes)
      .filter(
        (node) =>
          !(node instanceof Element && node.classList.contains('header-anchor')),
      )
      .map((node) => node.textContent ?? '')
      .join('')
      .trim(),
  }))
  headings.forEach((el) => observer?.observe(el))
}
onMounted(setupReading)
watch(
  () => page.value.relativePath,
  () => {
    activeHeading.value = ''
    toc.value = []
    setupReading()
  },
  { flush: 'post' },
)
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <div class="website-shell at-shell" :data-phase="phase">
    <div class="kb-route-line" aria-hidden="true" />
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <AtlasHeader />
    <div class="native-search-host"><VPNavBarSearch /></div>

    <template v-if="page.isNotFound">
      <main id="main-content"><NotFound /></main>
    </template>

    <!-- 首页：整张章节表 -->
    <main v-else-if="isHome" id="main-content" class="at-page"><Content /></main>

    <!-- 章节页：左栏是本方向那一列，中间正文，右侧本页目录 -->
    <div v-else-if="isDoc && here" class="at-page at-read" :data-fam="here.module.no">
      <AtlasRail :here="here" />

      <main id="main-content" class="at-article">
        <header class="at-head">
          <div class="at-tile" :class="'lv' + lv">
            <span class="n">{{ pad(here.order + 1) }}</span>
            <span>{{ here.chapter.level }}</span>
          </div>
          <div>
            <p class="where">
              {{ here.module.no }} · {{ here.module.name }} · 第 {{ here.index + 1 }} / {{ here.module.chapters.length }} 篇
            </p>
            <h1>{{ page.title }}</h1>
            <p v-if="frontmatter.description" class="deck">{{ frontmatter.description }}</p>
          </div>
        </header>
        <div v-if="frontmatter.status === 'draft'" class="at-draft">
          这篇还在写，请结合已有内容和项目实际情况看。
        </div>

        <!-- 窄屏时本页目录可折叠；宽屏在右栏常驻 -->
        <details v-if="toc.length" class="at-inline-toc">
          <summary>本页目录 <span>{{ toc.length }} 个小节</span></summary>
          <nav aria-label="本页目录（窄屏）">
            <a v-for="h in toc" :key="h.link" :href="h.link" :class="{ child: h.level === 3 }">{{ h.title }}</a>
          </nav>
        </details>

        <Content class="vp-doc kb-body" />

        <div class="at-done">
          <button
            type="button"
            :aria-pressed="isComplete(here.chapter.id)"
            @click="toggle(here.chapter.id)"
          >{{ isComplete(here.chapter.id) ? '✓ 已标记读过' : '标记为读过' }}</button>
          <span>{{ isComplete(here.chapter.id) ? '再点一次可以取消。' : '记录只保存在这台设备的浏览器里。' }}</span>
        </div>

        <nav class="at-pager" aria-label="前后篇">
          <a v-if="before" :class="'lv' + (levels.indexOf(before.level) + 1)" :href="withBase(before.link)">
            <small>上一篇 · {{ here.module.name }}</small><b>{{ before.title }}</b>
          </a>
          <span v-else />
          <a v-if="after" :class="'lv' + (levels.indexOf(after.level) + 1)" :href="withBase(after.link)">
            <small>下一篇 · {{ here.module.name }}</small><b>{{ after.title }}</b>
          </a>
          <a v-else class="lv1" :href="withBase('/')">
            <small>这个方向读完了</small><b>回到整张表</b>
          </a>
        </nav>

        <nav class="at-related" aria-label="相关页面">
          <a :href="verificationLink">{{ demoSlug ? '这个组件的演示' : '组件演示' }}</a>
          <a :href="withBase('/glossary')">名词解释</a>
          <a
            :href="`https://github.com/gzx543097079/vibe-coding-guide-for-interns/edit/main/docs/${page.relativePath}`"
            target="_blank"
            rel="noopener"
          >在 GitHub 上编辑此页</a>
        </nav>
      </main>

      <aside class="at-toc" aria-label="本页目录">
        <template v-if="toc.length">
          <h2>本页目录</h2>
          <nav>
            <a
              v-for="h in toc"
              :key="h.link"
              :href="h.link"
              :class="{ child: h.level === 3, on: activeHeading === h.id }"
              :aria-current="activeHeading === h.id ? 'location' : undefined"
            >{{ h.title }}</a>
          </nav>
        </template>
      </aside>
    </div>

    <!-- 其余页面：目录、路线、组件、名词等 -->
    <main v-else id="main-content" class="at-page kb-page"><Content /></main>

    <template v-if="!page.isNotFound">
      <SiteFooter /><BackToTop /><CommandPalette />
    </template>
  </div>
</template>
