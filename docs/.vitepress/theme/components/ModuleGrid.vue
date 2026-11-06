<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import ModuleIcon from './ModuleIcon.vue'
import { modules, chapterCode, chapterTag, type Module } from '../data/modules'
import { useReveal } from '../composables/useReveal'

const root = ref<HTMLElement>()
const viewHead = ref<HTMLElement>()
const { refresh } = useReveal(root)

const activeId = ref<string | null>(null)
const morphId = ref<string | null>(null)
const playing = ref<string | null>(null)
const active = computed(() => modules.find((m) => m.id === activeId.value) ?? null)
const activeIndex = computed(() => modules.findIndex((m) => m.id === activeId.value))

const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const canHover = () => window.matchMedia?.('(hover: hover)').matches

// 用 View Transition 在卡片与模块章节列表之间过渡，不支持时直接切换
async function swap(id: string | null, morph: string | null) {
  morphId.value = morph
  const apply = async () => {
    activeId.value = id
    await nextTick()
  }
  const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } }
  if (doc.startViewTransition && !reduce()) {
    await doc.startViewTransition(apply).finished.catch(() => {})
  } else {
    await apply()
  }
  morphId.value = null
}

async function open(m: Module, push = true) {
  if (push) history.pushState({ module: m.id }, '', `#m-${m.id}`)
  await swap(m.id, m.id)
  refresh()
  const top = root.value?.getBoundingClientRect().top ?? 0
  if (top < 0) root.value?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' })
  viewHead.value?.focus({ preventScroll: true })
}

async function close(push = true) {
  const from = activeId.value
  if (push) history.pushState(null, '', location.pathname + location.search)
  await swap(null, from)
  refresh()
  // 等过渡结束后的下一帧再还原焦点
  if (from) requestAnimationFrame(() => root.value?.querySelector<HTMLElement>(`[data-card="${from}"]`)?.focus())
}

function syncFromHash() {
  const m = location.hash.match(/^#m-([\w-]+)$/)
  const target = m ? modules.find((x) => x.id === m[1]) : undefined
  if (target && target.id !== activeId.value) open(target, false)
  else if (!target && activeId.value) close(false)
}

onMounted(() => {
  syncFromHash()
  window.addEventListener('popstate', syncFromHash)
})
onBeforeUnmount(() => window.removeEventListener('popstate', syncFromHash))

// 触摸设备没有悬停：卡片进入视口时播放一次图标动画
let playIo: IntersectionObserver | null = null
onMounted(() => {
  if (canHover() || reduce() || !('IntersectionObserver' in window)) return
  playIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          playing.value = (e.target as HTMLElement).dataset.card!
          playIo?.unobserve(e.target)
        }
      }
    },
    { threshold: 0.6 },
  )
  root.value?.querySelectorAll('[data-card]').forEach((n) => playIo!.observe(n))
})
onBeforeUnmount(() => playIo?.disconnect())

const previewTags = (m: Module) => m.chapters.slice(0, 3).map((c) => c.short)
</script>

<template>
  <div ref="root" class="mg">
    <!-- 模块卡片 -->
    <ul v-if="!active" class="mg-grid" aria-label="全部模块">
      <li v-for="(m, i) in modules" :key="m.id" :class="{ wide: i === 0 }" data-reveal>
        <button
          type="button"
          class="mc"
          :data-mod="m.id"
          :data-card="m.id"
          :aria-label="`${m.name}，${m.chapters.length} 章，查看章节`"
          @click="open(m)"
          @pointerenter="playing = m.id"
          @pointerleave="playing = null"
          @focus="playing = m.id"
          @blur="playing = null"
        >
          <span class="mc-top">
            <span class="mc-ico" :style="morphId === m.id ? { viewTransitionName: 'mod-art' } : undefined">
              <ModuleIcon :id="m.id" :play="playing === m.id" />
            </span>
            <span class="mc-no">{{ String(m.no).padStart(2, '0') }}</span>
          </span>
          <span class="mc-name">{{ m.name }}</span>
          <span class="mc-intro">{{ m.intro }}</span>
          <span class="mc-tags" aria-hidden="true">
            <span v-for="t in previewTags(m)" :key="t" class="mc-tag">{{ t }}</span>
          </span>
          <span class="mc-foot">
            <span>{{ m.chapters.length }} 章</span>
            <span class="mc-go">
              查看章节
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
          </span>
        </button>
      </li>
    </ul>

    <!-- 模块章节列表 -->
    <section v-else id="module-view" class="mv" :data-mod="active.id" aria-labelledby="mv-title">
      <div class="mv-top">
        <button type="button" class="mv-back" @click="close()">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          全部模块
        </button>
        <span class="mv-pager">
          <button v-if="activeIndex > 0" type="button" class="mv-pg" @click="open(modules[activeIndex - 1])">
            上一个：{{ modules[activeIndex - 1].name }}
          </button>
          <button v-if="activeIndex < modules.length - 1" type="button" class="mv-pg" @click="open(modules[activeIndex + 1])">
            下一个：{{ modules[activeIndex + 1].name }}
          </button>
        </span>
      </div>

      <header class="mv-head">
        <span class="mv-ico" :style="morphId === active.id ? { viewTransitionName: 'mod-art' } : undefined">
          <ModuleIcon :id="active.id" play />
        </span>
        <div class="mv-text">
          <h3 id="mv-title" ref="viewHead" class="mv-title" tabindex="-1">{{ active.name }}</h3>
          <p class="mv-intro">{{ active.intro }} 共 {{ active.chapters.length }} 章。</p>
        </div>
      </header>

      <ol class="cc-list">
        <li v-for="(c, i) in active.chapters" :key="c.id" data-reveal>
          <a class="cc" :href="withBase(c.link)">
            <span class="cc-top">
              <span class="cc-code">{{ chapterCode({ module: active, index: i }) }}</span>
              <span class="cc-chip wip">建设中</span>
              <span class="cc-chip">{{ chapterTag({ module: active, chapter: c }) }}</span>
            </span>
            <span class="cc-title">{{ c.title }}</span>
            <span class="cc-sum">{{ c.summary }}</span>
            <span v-if="c.group" class="cc-group">{{ c.group }}</span>
          </a>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.mg {
  scroll-margin-top: calc(var(--vp-nav-height) + 16px);
}
/* 窄屏顶栏下还有一条「目录」栏 */
@media (max-width: 959px) {
  .mg {
    scroll-margin-top: calc(var(--vp-nav-height) + 64px);
  }
}

/* 模块卡片：4 列，首张占两列 */
.mg-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.mg-grid li.wide {
  grid-column: span 2;
}
.mc {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 20px 20px 16px;
  text-align: left;
  border-radius: var(--radius-lg);
  border: 1px solid var(--rule);
  background: var(--raised);
  box-shadow: var(--shadow-1);
  transition: transform var(--dur-2) var(--ease);
}
.mc::after {
  /* 悬停时更深的投影层，用透明度切换 */
  content: '';
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  box-shadow: var(--shadow-2);
  opacity: 0;
  transition: opacity var(--dur-2) var(--ease);
}
.mc::before {
  /* 悬停时的模块色描边，用透明度切换 */
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  border: 1px solid var(--mod-line);
  opacity: 0;
  transition: opacity var(--dur-2) var(--ease);
  pointer-events: none;
}
.mg-grid li {
  position: relative;
  z-index: 0;
}
.mc:hover,
.mc:focus-visible {
  transform: translateY(-3px);
}
.mc:hover::after,
.mc:focus-visible::after,
.mc:hover::before,
.mc:focus-visible::before {
  opacity: 1;
}
.mc:active {
  transform: translateY(-1px) scale(0.99);
}
.mc-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}
.mc-ico {
  display: grid;
  place-items: center;
  width: 64px;
  height: 46px;
  padding: 6px 8px;
  border-radius: var(--radius);
  background: var(--mod-soft);
}
.mc-no {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
}
.mc-name {
  font-family: var(--font-serif);
  font-size: 21px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ink);
}
.mc-intro {
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-2);
}
.mc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.mc-tag {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;
  color: var(--ink-2);
  background: var(--mod-soft);
}
.mc-foot {
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--rule-soft);
  font-size: 13px;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}
.mc-go {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  color: var(--ink-2);
  font-weight: 500;
}
.mc-go svg {
  transition: transform var(--dur-2) var(--ease);
}
.mc:hover .mc-go {
  color: var(--accent-ink);
}
.mc:hover .mc-go svg {
  transform: translateX(3px);
}

/* 模块章节列表 */
.mv-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.mv-back,
.mv-pg {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: var(--radius);
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink);
  font-size: 14px;
  font-weight: 500;
  transition: transform var(--dur-1) var(--ease);
}
.mv-back:hover,
.mv-pg:hover {
  border-color: var(--ink-3);
}
.mv-back:active,
.mv-pg:active {
  transform: scale(0.98);
}
.mv-pager {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
}
.mv-pg {
  color: var(--ink-2);
}
.mv-head {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--mod-soft);
}
.mv-ico {
  flex: none;
  display: grid;
  place-items: center;
  width: 96px;
  height: 70px;
  padding: 8px 10px;
  border-radius: var(--radius);
  background: var(--raised);
}
.mv-title {
  margin: 0 0 4px;
  font-family: var(--font-serif);
  font-size: 32px;
  line-height: 1.2;
  font-weight: 600;
  color: var(--ink);
  outline: none;
}
.mv-intro {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--ink-2);
}
.cc-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.cc-list li {
  position: relative;
  z-index: 0;
}
.cc {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  padding: 16px 18px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--rule);
  background: var(--raised);
  color: var(--ink);
  text-decoration: none;
  transition: transform var(--dur-2) var(--ease);
}
.cc::after {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  box-shadow: var(--shadow-2);
  opacity: 0;
  transition: opacity var(--dur-2) var(--ease);
}
.cc:hover,
.cc:focus-visible {
  transform: translateY(-3px);
  border-color: var(--mod-line);
}
.cc:hover::after,
.cc:focus-visible::after {
  opacity: 1;
}
.cc:active {
  transform: translateY(-1px) scale(0.99);
}
.cc-top {
  display: flex;
  align-items: center;
  gap: 6px;
}
.cc-code {
  margin-right: auto;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--ink-3);
}
.cc-chip {
  padding: 0 7px;
  border-radius: 999px;
  font-size: 11.5px;
  line-height: 20px;
  color: var(--ink-2);
  background: var(--mod-soft);
}
.cc-chip.wip {
  color: var(--warn);
  background: var(--warn-soft);
}
.cc-title {
  font-size: 16.5px;
  font-weight: 650;
  line-height: 1.45;
}
.cc-sum {
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-2);
}
.cc-group {
  margin-top: auto;
  font-size: 12px;
  color: var(--ink-3);
}

@container home (max-width: 899px) {
  .mg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@container home (max-width: 539px) {
  .mg-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .mg-grid li.wide {
    grid-column: auto;
  }
  .mv-head {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
  .mv-title {
    font-size: 26px;
  }
  .mv-pager {
    margin-left: 0;
  }
  .cc-list {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mc:hover,
  .mc:focus-visible,
  .mc:active,
  .cc:hover,
  .cc:focus-visible,
  .cc:active {
    transform: none;
  }
}
</style>

<style>
::view-transition-group(mod-art) {
  animation-duration: 0.32s;
  animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
}
</style>
