<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Content, useData, withBase } from 'vitepress'
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue'
import { chapterCode, findChapter, totalChapters } from './data/modules'
import { demos } from './components/demos/registry'
import { useLearning } from './composables/useLearning'
import { useRouteTransition } from './composables/useRouteTransition'
import SiteHeader from './components/site/SiteHeader.vue'
import SiteFooter from './components/site/SiteFooter.vue'
import SiteIcon from './components/site/SiteIcon.vue'
import KnowledgeNav from './components/site/KnowledgeNav.vue'
import CommandPalette from './components/CommandPalette.vue'
import BackToTop from './components/BackToTop.vue'
import NotFound from './components/NotFound.vue'

const { page, frontmatter } = useData()
const demoIds = new Set(Object.keys(demos))
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
const { visit, toggle, isComplete } = useLearning()
const { phase } = useRouteTransition()
const toc = ref<{ title: string; link: string; id: string; level: number }[]>([])
const activeHeading = ref('')
const mobileNav = ref(false)
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
  <div class="website-shell" :class="{ 'kb-has-shell': !isHome }" :data-phase="phase">
    <div class="kb-route-line" aria-hidden="true" />
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <SiteHeader />
    <div class="native-search-host"><VPNavBarSearch /></div>

    <template v-if="page.isNotFound">
      <main id="main-content"><NotFound /></main>
    </template>

    <!-- 首页：全宽知识库索引 -->
    <template v-else-if="isHome">
      <main id="main-content" class="kb-home-page"><Content /></main>
      <SiteFooter /><BackToTop /><CommandPalette />
    </template>

    <!-- 其余页面：左侧全站目录常驻 -->
    <div v-else class="kb-shell">
      <div class="kb-shell-nav">
        <KnowledgeNav :mobile-open="mobileNav" @close="mobileNav = false" />
      </div>
      <div class="kb-shell-body">
        <button
          class="kb-nav-toggle"
          type="button"
          :aria-expanded="mobileNav"
          aria-controls="kb-nav-panel"
          @click="mobileNav = !mobileNav"
        >
          <SiteIcon name="menu" :size="17" />目录<span>全部 {{ totalChapters }} 篇</span>
        </button>

        <template v-if="isDoc && here">
          <div class="kb-doc-layout">
            <main id="main-content" class="kb-doc-main">
              <!-- 面包屑：明确「我在哪」 -->
              <nav class="kb-crumb" aria-label="当前位置">
                <a :href="withBase('/')">知识库</a>
                <SiteIcon name="chevron" :size="12" />
                <a :href="withBase('/courses/' + here.module.id)">{{ here.module.name }}</a>
                <SiteIcon name="chevron" :size="12" />
                <span>{{ here.chapter.level }}</span>
                <SiteIcon name="chevron" :size="12" />
                <strong aria-current="page">{{ chapterCode(here) }}</strong>
              </nav>

              <header class="kb-doc-head">
                <p class="kb-doc-code">{{ chapterCode(here) }} · {{ here.module.name }}</p>
                <h1>{{ page.title }}</h1>
                <p v-if="frontmatter.description" class="kb-doc-deck">{{ frontmatter.description }}</p>
                <div class="kb-doc-meta">
                  <span>本方向第 {{ here.index + 1 }} / {{ here.module.chapters.length }} 篇</span>
                  <span>{{ here.chapter.level }}</span>
                  <span>全站第 {{ here.order + 1 }} / {{ totalChapters }} 篇</span>
                </div>
                <div v-if="frontmatter.status === 'draft'" class="kb-doc-draft">
                  这篇还在写，请结合已有内容和项目实际情况看。
                </div>
              </header>

              <!-- 窄屏时本页目录可折叠；宽屏在右栏常驻 -->
              <details v-if="toc.length" class="kb-doc-inline-toc">
                <summary>本页目录 <span>{{ toc.length }} 个小节</span></summary>
                <nav aria-label="本页目录（窄屏）">
                  <a v-for="h in toc" :key="h.link" :href="h.link" :class="{ 'is-child': h.level === 3 }">{{ h.title }}</a>
                </nav>
              </details>

              <Content class="vp-doc kb-body" />

              <nav class="kb-related" aria-label="相关页面">
                <span>相关</span>
                <a :href="verificationLink">{{ demoSlug ? '这个组件的演示' : '组件演示' }}</a>
                <a :href="withBase('/quality/review')">代码审查</a>
                <a :href="withBase('/learn')">目录</a>
              </nav>

              <nav class="kb-pager" aria-label="前后篇">
                <a v-if="before" class="kb-pager-link" :href="withBase(before.link)">
                  <small><SiteIcon name="back" :size="14" />上一篇 · {{ here.module.name }}</small>
                  <strong>{{ before.title }}</strong>
                </a>
                <span v-else class="kb-pager-empty"><small>已经是本方向第一篇</small></span>
                <a v-if="after" class="kb-pager-link is-next" :href="withBase(after.link)">
                  <small>下一篇 · {{ here.module.name }}<SiteIcon name="arrow" :size="14" /></small>
                  <strong>{{ after.title }}</strong>
                </a>
                <a v-else class="kb-pager-link is-next" :href="withBase('/courses/' + here.module.id)">
                  <small>这个方向读完了</small>
                  <strong>回到 {{ here.module.name }} 目录<SiteIcon name="arrow" :size="14" /></strong>
                </a>
              </nav>

              <a
                class="kb-edit"
                :href="`https://github.com/gzx543097079/vibe-coding-guide-for-interns/edit/main/docs/${page.relativePath}`"
                target="_blank"
                rel="noopener"
              >在 GitHub 上编辑此页<SiteIcon name="arrow" :size="14" /></a>
            </main>

            <!-- 右栏：本页目录 + 这一篇的信息 -->
            <aside class="kb-doc-aside" aria-label="本页导航">
              <div class="kb-aside-block" v-if="toc.length">
                <h2>本页目录</h2>
                <nav aria-label="本页目录">
                  <a
                    v-for="h in toc"
                    :key="h.link"
                    :href="h.link"
                    :class="{ 'is-child': h.level === 3, 'is-active': activeHeading === h.id }"
                    :aria-current="activeHeading === h.id ? 'location' : undefined"
                  >{{ h.title }}</a>
                </nav>
              </div>
              <div class="kb-aside-block">
                <h2>本篇</h2>
                <p class="kb-aside-line">{{ chapterCode(here) }} · {{ here.module.name }} · {{ here.chapter.level }} · {{ here.index + 1 }}/{{ here.module.chapters.length }}</p>
                <button
                  class="kb-mark-btn"
                  type="button"
                  :class="{ done: isComplete(here.chapter.id) }"
                  :aria-pressed="isComplete(here.chapter.id)"
                  @click="toggle(here.chapter.id)"
                >
                  <SiteIcon v-if="isComplete(here.chapter.id)" name="check" :size="15" />
                  {{ isComplete(here.chapter.id) ? '已读过 · 取消' : '记一下读过' }}
                </button>
                <p class="kb-aside-note">只记在这台电脑。</p>
                <a class="kb-aside-link" :href="verificationLink">
                  {{ demoSlug ? '组件演示' : '组件实验室' }}<SiteIcon name="arrow" :size="13" />
                </a>
                <a class="kb-aside-link" :href="withBase('/glossary')">
                  名词解释<SiteIcon name="arrow" :size="13" />
                </a>
              </div>
            </aside>
          </div>
        </template>

        <main v-else id="main-content" class="kb-page"><Content /></main>
      </div>
    </div>

    <template v-if="!isHome">
      <SiteFooter /><BackToTop /><CommandPalette />
    </template>
  </div>
</template>
