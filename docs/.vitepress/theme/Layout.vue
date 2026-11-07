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
// 翻页只走当前工作区；最后一步明确回到工作区，不把读者甩到别的模块
const before = computed(() =>
  here.value ? here.value.module.chapters[here.value.index - 1] : undefined,
)
// 做完本工作区最后一步后，回到工作区；不自动跳到另一个领域
const after = computed(() =>
  here.value ? here.value.module.chapters[here.value.index + 1] : undefined,
)
// 只有注册了演示的章节才链接到对应组件；其余章节说明验证台是通用入口
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
            ><SiteIcon name="back" :size="16" />返回工作区</a
          >
          <div class="reader-course-name">
            <span><SiteIcon :name="here.module.id" :size="22" /></span
            ><strong>{{ here.module.name }}</strong>
          </div>
          <nav aria-label="当前工作区任务">
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
            >切换工作区<SiteIcon name="arrow" :size="16"
          /></a>
        </aside>
        <main id="main-content" class="reader-main">
          <div v-if="here" class="reader-taskbar">
            <div class="taskbar-label">
              <span>当前任务</span>
              <strong>{{ here.module.name }} / {{ here.chapter.short }}</strong>
            </div>
            <div class="taskbar-actions">
              <a :href="verificationLink">
                {{ demoSlug ? '验证这个控件' : '打开验证台' }}
                <SiteIcon name="lab" :size="15" />
              </a>
              <button
                type="button"
                :class="{ done: isComplete(here.chapter.id) }"
                :aria-pressed="isComplete(here.chapter.id)"
                @click="toggle(here.chapter.id)"
              >
                <SiteIcon v-if="isComplete(here.chapter.id)" name="check" :size="15" />{{
                  isComplete(here.chapter.id) ? '已完成' : '标记完成'
                }}
              </button>
            </div>
          </div>
          <header class="reader-header">
            <nav aria-label="面包屑">
              <a :href="withBase('/learn')">工作区</a
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
              ><span>第 {{ here.index + 1 }} / {{ here.module.chapters.length }} 步</span>
            </div>
            <h1>{{ page.title }}</h1>
            <p v-if="frontmatter.description">{{ frontmatter.description }}</p>
            <div v-if="frontmatter.status === 'draft'" class="reader-draft">
              这一步仍在编写中，请结合已有内容与项目实际验证。
            </div>
          </header>
          <Content class="vp-doc reader-body" />
          <section v-if="here" class="reading-next" aria-labelledby="reading-next-title">
            <div class="reading-next-head">
              <h2 id="reading-next-title">把这一步收尾</h2>
              <p>先验证，再记录。本地记录可随时取消，不会同步到其他设备。</p>
            </div>
            <ol class="reading-steps">
              <li>
                <span>01</span><strong>动手试一次</strong>
                <a :href="verificationLink">{{ demoSlug ? '检查这个控件' : '打开验证台' }}<SiteIcon name="arrow" :size="14" /></a>
                <small v-if="!demoSlug">通用入口，不对应当前章节的专用组件</small>
              </li>
              <li><span>02</span><strong>对照验收</strong><a :href="withBase('/quality/review')">查看检查顺序<SiteIcon name="arrow" :size="14" /></a></li>
              <li>
                <span>03</span><strong>记下完成</strong>
                <button
                  type="button"
                  :class="{ done: isComplete(here.chapter.id) }"
                  :aria-pressed="isComplete(here.chapter.id)"
                  @click="toggle(here.chapter.id)"
                >{{ isComplete(here.chapter.id) ? '取消完成标记' : '标记这一步完成' }}</button>
              </li>
            </ol>
          </section>
          <nav class="reader-pagination" aria-label="工作区翻页">
            <a v-if="before" :href="withBase(before.link)"
              ><small>上一步</small
              ><strong
                ><SiteIcon name="back" :size="17" />{{ before.title }}</strong
              ></a
            ><span v-else />
            <a v-if="after" :href="withBase(after.link)"
              ><small>继续当前任务</small
              ><strong
                >{{ after.title }}<SiteIcon name="arrow" :size="17" /></strong
              ></a>
            <a v-else-if="here" :href="withBase('/courses/' + here.module.id)"
              ><small>本工作区已走完</small
              ><strong>回到工作区<SiteIcon name="arrow" :size="17" /></strong></a
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
        <aside class="reader-outline">
          <h2>本页定位</h2>
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
          <a class="outline-lab" :href="verificationLink"
            ><SiteIcon name="lab" :size="20" /><strong>动手验证</strong
            ><span>{{ demoSlug ? '检查这个控件的交互状态' : '打开通用验证台' }}<SiteIcon name="arrow" :size="15" /></span
          ></a>
        </aside>
      </div>
    </template>
    <main v-else id="main-content" class="website-page"><Content /></main>
    <SiteFooter /><BackToTop /><CommandPalette />
  </div>
</template>
