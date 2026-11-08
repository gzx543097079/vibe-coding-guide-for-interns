<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Content, useData, useRoute, withBase } from 'vitepress'
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue'
import { findChapter, levels } from './data/modules'
import { demos } from './components/demos/registry'
import { useLearning } from './composables/useLearning'
import SiteHeader from './components/site/SiteHeader.vue'
import SiteFooter from './components/site/SiteFooter.vue'
import SiteIcon from './components/site/SiteIcon.vue'
import CommandPalette from './components/CommandPalette.vue'
import BackToTop from './components/BackToTop.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import NotFound from './components/NotFound.vue'

const { page, frontmatter } = useData()
const route = useRoute()
const demoIds = new Set(Object.keys(demos))
const here = computed(() => findChapter(page.value.relativePath))
const isDoc = computed(
  () => !page.value.isNotFound && frontmatter.value.layout !== 'page',
)
const groups = computed(() =>
  levels
    .map((level) => ({
      level,
      chapters:
        here.value?.module.chapters.filter((c) => c.level === level) ?? [],
    }))
    .filter((g) => g.chapters.length),
)
// 翻页只走当前方向；最后一章明确回到目录，不自动跳到另一个方向
const before = computed(() =>
  here.value ? here.value.module.chapters[here.value.index - 1] : undefined,
)
// 读完一个方向的最后一章后，回到该方向目录
const after = computed(() =>
  here.value ? here.value.module.chapters[here.value.index + 1] : undefined,
)
// 只有注册了演示的章节才链接到对应组件；其余章节使用组件页入口
const demoSlug = computed(() => {
  if (!here.value || here.value.module.id !== 'controls') return ''
  const slug = here.value.chapter.id.split('/')[1]
  return demoIds.has(slug) ? slug : ''
})
const verificationLink = computed(() =>
  demoSlug.value ? withBase('/lab#' + demoSlug.value) : withBase('/lab'),
)
const { visit, toggle, isComplete } = useLearning()
const toc = ref<{ title: string; link: string; id: string; level: number }[]>(
  [],
)
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
    document.querySelectorAll<HTMLElement>(
      '.reader-body h2[id],.reader-body h3[id]',
    ),
  )
  toc.value = headings.map((el) => ({
    id: el.id,
    link: '#' + encodeURIComponent(el.id),
    level: Number(el.tagName.slice(1)),
    title: Array.from(el.childNodes)
      .filter(
        (node) =>
          !(
            node instanceof Element && node.classList.contains('header-anchor')
          ),
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
  <div class="website-shell">
    <a class="skip-link" href="#main-content">跳到主要内容</a><SiteHeader />
    <div class="native-search-host"><VPNavBarSearch /></div>
    <template v-if="page.isNotFound"
      ><main id="main-content"><NotFound /></main
    ></template>
    <template v-else-if="isDoc">
      <ReadingProgress />
      <div class="reader-layout">
        <aside v-if="here" class="reader-sidebar">
          <a class="reader-back" :href="withBase('/courses/' + here.module.id)"
            ><SiteIcon name="back" :size="16" />返回目录</a
          >
          <div class="reader-course-name">
            <strong>{{ here.module.name }}</strong>
          </div>
          <nav aria-label="本方向的章节">
            <section v-for="group in groups" :key="group.level">
              <h2>
                {{ group.level }}<span>{{ group.chapters.length }}</span>
              </h2>
              <a
                v-for="c in group.chapters"
                :key="c.id"
                :href="withBase(c.link)"
                :class="{ current: c.id === here.chapter.id }"
                :aria-current="c.id === here.chapter.id ? 'page' : undefined"
                ><span>{{ c.short }}</span
                ><SiteIcon v-if="isComplete(c.id)" name="check" :size="14"
              /></a>
            </section>
          </nav>
          <a class="reader-all" :href="withBase('/learn')"
            >换个方向<SiteIcon name="arrow" :size="16"
          /></a>
        </aside>
        <main id="main-content" class="reader-main">
          <div v-if="here" class="reader-taskbar">
            <div class="taskbar-label">
              <span>正在读</span>
              <strong>{{ here.module.name }} / {{ here.chapter.short }}</strong>
            </div>
            <div class="taskbar-actions">
              <a v-if="demoSlug" :href="verificationLink">
                {{ demoSlug ? '看这个组件' : '看组件' }}
                <SiteIcon name="lab" :size="15" />
              </a>
              <button
                type="button"
                :class="{ done: isComplete(here.chapter.id) }"
                :aria-pressed="isComplete(here.chapter.id)"
                @click="toggle(here.chapter.id)"
              >
                <SiteIcon v-if="isComplete(here.chapter.id)" name="check" :size="15" />{{
                  isComplete(here.chapter.id) ? '已读' : '记一下读过'
                }}
              </button>
            </div>
          </div>
          <header class="reader-header">
            <div v-if="here" class="reader-badges">
              <span>{{ here.chapter.level }}</span
              ><span>{{ here.module.tag }}</span
              ><span>第 {{ here.index + 1 }} / {{ here.module.chapters.length }} 篇</span>
            </div>
            <h1>{{ page.title }}</h1>
            <p v-if="frontmatter.description">{{ frontmatter.description }}</p>
            <details v-if="toc.length" class="reader-inline-toc">
              <summary>本页目录 <span>{{ toc.length }} 个小节</span></summary>
              <nav aria-label="本页目录">
                <a v-for="h in toc" :key="h.link" :href="h.link" :class="{ 'is-child': h.level === 3 }">{{ h.title }}</a>
              </nav>
            </details>
            <div v-if="frontmatter.status === 'draft'" class="reader-draft">
              这篇还在写，请结合已有内容和项目实际情况看。
            </div>
          </header>
          <Content class="vp-doc reader-body" />
          <section v-if="here" class="reading-next" aria-labelledby="reading-next-title">
            <div class="reading-next-head">
              <h2 id="reading-next-title">读完以后</h2>
              <p>想试的话，可以看看对应组件或相关的检查文章。读过的标记只记在这台电脑，也能随时取消。</p>
            </div>
            <div class="reading-steps">
              <li>
                <strong>看看实际效果</strong>
                <a :href="verificationLink">{{ demoSlug ? '打开这个组件' : '打开组件页' }}<SiteIcon name="arrow" :size="14" /></a>
                <small v-if="!demoSlug">组件页里有 17 个例子</small>
              </li>
              <li><strong>相关的检查文章</strong><a :href="withBase('/quality/review')">代码审查<SiteIcon name="arrow" :size="14" /></a></li>
              <li>
                <strong>留个记号</strong>
                <button
                  type="button"
                  :class="{ done: isComplete(here.chapter.id) }"
                  :aria-pressed="isComplete(here.chapter.id)"
                  @click="toggle(here.chapter.id)"
                >{{ isComplete(here.chapter.id) ? '取消标记' : '记一下读过' }}</button>
              </li>
            </div>
          </section>
          <nav class="reader-pagination" aria-label="前后篇">
            <a v-if="before" :href="withBase(before.link)"
              ><small>上一篇</small
              ><strong
                ><SiteIcon name="back" :size="17" />{{ before.title }}</strong
              ></a
            ><span v-else />
            <a v-if="after" :href="withBase(after.link)"
              ><small>下一篇</small
              ><strong
                >{{ after.title }}<SiteIcon name="arrow" :size="17" /></strong
              ></a>
            <a v-else-if="here" :href="withBase('/courses/' + here.module.id)"
              ><small>这个方向读完了</small
              ><strong>回到目录<SiteIcon name="arrow" :size="17" /></strong></a
            ><span v-else />
          </nav>
          <a
            class="reader-edit"
            :href="`https://github.com/gzx543097079/vibe-coding-guide-for-interns/edit/main/docs/${page.relativePath}`"
            target="_blank"
            rel="noopener"
            >发现问题？在 GitHub 上编辑此页<SiteIcon name="arrow" :size="15"
          /></a>
        </main>
      </div>
    </template>
    <main v-else id="main-content" class="website-page"><Content /></main>
    <SiteFooter /><BackToTop /><CommandPalette />
  </div>
</template>
