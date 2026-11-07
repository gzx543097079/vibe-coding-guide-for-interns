<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Content, useData, useRoute, withBase } from 'vitepress'
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue'
import { allChapters, findChapter, levels } from './data/modules'
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
const before = computed(() =>
  here.value ? allChapters[here.value.order - 1] : undefined,
)
const after = computed(() =>
  here.value ? allChapters[here.value.order + 1] : undefined,
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
            ><SiteIcon name="back" :size="16" />课程概览</a
          >
          <div class="reader-course-name">
            <span><SiteIcon :name="here.module.id" :size="22" /></span
            ><strong>{{ here.module.name }}</strong>
          </div>
          <nav aria-label="当前课程章节">
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
            >探索其他课程<SiteIcon name="arrow" :size="16"
          /></a>
        </aside>
        <main id="main-content" class="reader-main">
          <header class="reader-header">
            <nav aria-label="面包屑">
              <a :href="withBase('/learn')">课程中心</a
              ><SiteIcon name="chevron" :size="12" /><a
                v-if="here"
                :href="withBase('/courses/' + here.module.id)"
                >{{ here.module.name }}</a
              ><SiteIcon v-if="here" name="chevron" :size="12" /><span>{{
                page.title
              }}</span>
            </nav>
            <div v-if="here" class="reader-badges">
              <span>{{ here.chapter.level }}</span
              ><span>{{ here.module.tag }}</span
              ><span
                >第 {{ here.index + 1 }} /
                {{ here.module.chapters.length }} 章</span
              >
            </div>
            <h1>{{ page.title }}</h1>
            <p v-if="frontmatter.description">{{ frontmatter.description }}</p>
            <div v-if="frontmatter.status === 'draft'" class="reader-draft">
              本章仍在编写中，请结合已有内容与项目实际验证。
            </div>
          </header>
          <Content class="vp-doc reader-body" />
          <div v-if="here" class="reading-complete">
            <div>
              <SiteIcon
                :name="isComplete(here.chapter.id) ? 'check' : 'book'"
                :size="24"
              /><span
                ><strong>{{
                  isComplete(here.chapter.id)
                    ? '这一步，已经走过。'
                    : '读完了？把这一步记下来。'
                }}</strong
                ><small>记录仅保存在当前浏览器，可随时取消。</small></span
              >
            </div>
            <button
              :class="{ done: isComplete(here.chapter.id) }"
              @click="toggle(here.chapter.id)"
              :aria-pressed="isComplete(here.chapter.id)"
            >
              <SiteIcon
                v-if="isComplete(here.chapter.id)"
                name="check"
                :size="16"
              />{{ isComplete(here.chapter.id) ? '已完成' : '标记完成' }}
            </button>
          </div>
          <nav class="reader-pagination" aria-label="章节翻页">
            <a v-if="before" :href="withBase(before.chapter.link)"
              ><small>上一章</small
              ><strong
                ><SiteIcon name="back" :size="17" />{{
                  before.chapter.title
                }}</strong
              ></a
            ><span v-else /><a v-if="after" :href="withBase(after.chapter.link)"
              ><small>继续学习</small
              ><strong
                >{{ after.chapter.title
                }}<SiteIcon name="arrow" :size="17" /></strong
            ></a>
          </nav>
          <a
            class="reader-edit"
            :href="`https://github.com/gzx543097079/vibe-coding-guide-for-interns/edit/main/docs/${page.relativePath}`"
            target="_blank"
            rel="noopener"
            >发现问题？在 GitHub 上编辑此页<SiteIcon name="arrow" :size="15"
          /></a>
        </main>
        <aside class="reader-outline">
          <h2>这一章的内容</h2>
          <nav aria-label="本页目录">
            <a
              v-for="h in toc"
              :key="h.link"
              :href="h.link"
              :class="{
                active: activeHeading === h.id,
                'is-child': h.level === 3,
              }"
              >{{ h.title }}</a
            >
          </nav>
          <a class="outline-lab" :href="withBase('/lab')"
            ><SiteIcon name="lab" :size="20" /><strong>不止读，也动手。</strong
            ><span>去组件实验室试一试<SiteIcon name="arrow" :size="15" /></span
          ></a>
        </aside>
      </div>
    </template>
    <main v-else id="main-content" class="website-page"><Content /></main>
    <SiteFooter /><BackToTop /><CommandPalette />
  </div>
</template>
