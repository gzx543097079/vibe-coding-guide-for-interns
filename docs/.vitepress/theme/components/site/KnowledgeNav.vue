<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import { findChapter, levels, modules, totalChapters } from '../../data/modules'
import { useLearning } from '../../composables/useLearning'
import SiteIcon from './SiteIcon.vue'

const props = defineProps<{ mobileOpen?: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { page } = useData()
const { isComplete } = useLearning()
const here = computed(() => findChapter(page.value.relativePath))
const activeModuleId = computed(() => {
  if (here.value) return here.value.module.id
  const m = page.value.relativePath.match(/^courses\/([^/]+)\.md$/)
  return m ? m[1] : ''
})
const navEl = ref<HTMLElement | null>(null)

// 每个方向下的三级分组，空组不显示
const tree = computed(() =>
  modules.map((m) => ({
    module: m,
    groups: levels
      .map((level) => ({
        level,
        chapters: m.chapters
          .map((chapter, index) => ({ chapter, index }))
          .filter((x) => x.chapter.level === level),
      }))
      .filter((g) => g.chapters.length),
  })),
)

const STORE_KEY = 'vcg:kb-open-modules'
// 初始只展开当前方向，SSR 与客户端首帧一致
const open = ref<Set<string>>(
  new Set(activeModuleId.value ? [activeModuleId.value] : [modules[0].id]),
)
function toggleModule(id: string) {
  const next = new Set(open.value)
  next.has(id) ? next.delete(id) : next.add(id)
  open.value = next
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...next]))
  } catch {
    /* 存储不可用时仍可在当前会话展开 */
  }
}
function code(moduleNo: number, index: number) {
  return `${moduleNo}.${String(index + 1).padStart(2, '0')}`
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null')
    if (Array.isArray(saved)) {
      const valid = new Set(modules.map((m) => m.id))
      const next = new Set<string>(saved.filter((id: unknown) => typeof id === 'string' && valid.has(id)))
      // 当前方向始终展开，保证「我在哪」可见
      if (activeModuleId.value) next.add(activeModuleId.value)
      open.value = next
    }
  } catch {
    /* 忽略损坏的存储 */
  }
  scrollCurrentIntoView()
})

// 只滚动目录容器，不带动整页
async function scrollCurrentIntoView() {
  await nextTick()
  const box = navEl.value
  const el = box?.querySelector<HTMLElement>('.kb-nav-item.is-current')
  if (!box || !el) return
  const target = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2
  box.scrollTop = Math.max(0, target)
}
watch(() => page.value.relativePath, () => {
  if (activeModuleId.value && !open.value.has(activeModuleId.value)) toggleModule(activeModuleId.value)
  scrollCurrentIntoView()
  emit('close')
})
</script>

<template>
  <div id="kb-nav-panel" class="kb-nav" :class="{ 'is-open': mobileOpen }">
    <div class="kb-nav-head">
      <a class="kb-nav-title" :href="withBase('/')">
        <span class="kb-nav-mark" aria-hidden="true"><SiteIcon name="book" :size="17" /></span>
        <span><strong>Vibe Coding 开发指南</strong><small>共 {{ totalChapters }} 篇 · {{ modules.length }} 个方向</small></span>
      </a>
      <button class="kb-nav-close" type="button" aria-label="关闭目录" @click="emit('close')">
        <SiteIcon name="close" :size="18" />
      </button>
    </div>

    <div ref="navEl" class="kb-nav-scroll">
      <nav aria-label="全站目录">
        <section v-for="item in tree" :key="item.module.id" class="kb-nav-group">
          <button
            class="kb-nav-module"
            type="button"
            :aria-expanded="open.has(item.module.id)"
            :aria-controls="'kb-group-' + item.module.id"
            :class="{ 'is-active': activeModuleId === item.module.id }"
            @click="toggleModule(item.module.id)"
          >
            <span class="kb-nav-no">{{ String(item.module.no).padStart(2, '0') }}</span>
            <span class="kb-nav-module-name">{{ item.module.name }}</span>
            <span class="kb-nav-count">{{ item.module.chapters.length }}</span>
            <SiteIcon name="chevron" :size="14" />
          </button>

          <div v-show="open.has(item.module.id)" :id="'kb-group-' + item.module.id" class="kb-nav-chapters">
            <div v-for="g in item.groups" :key="g.level" class="kb-nav-level">
              <p class="kb-nav-level-name">{{ g.level }}</p>
              <a
                v-for="x in g.chapters"
                :key="x.chapter.id"
                class="kb-nav-item"
                :class="{ 'is-current': here?.chapter.id === x.chapter.id }"
                :href="withBase(x.chapter.link)"
                :aria-current="here?.chapter.id === x.chapter.id ? 'page' : undefined"
                :title="x.chapter.title"
              >
                <span class="kb-nav-item-name">{{ x.chapter.short }}</span>
              </a>
            </div>
          </div>
        </section>
      </nav>

      <div class="kb-nav-foot">
        <a :href="withBase('/learn')" :class="{ 'is-current': page.relativePath === 'learn.md' }">全部目录 <SiteIcon name="arrow" :size="14" /></a>
        <a :href="withBase('/paths')" :class="{ 'is-current': page.relativePath === 'paths.md' }">阅读路线 <SiteIcon name="arrow" :size="14" /></a>
        <a :href="withBase('/glossary')" :class="{ 'is-current': page.relativePath === 'glossary.md' }">名词解释 <SiteIcon name="arrow" :size="14" /></a>
      </div>
    </div>
  </div>
</template>
