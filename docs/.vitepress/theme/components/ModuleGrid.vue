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

// 用 View Transition 在卡片与模块页之间过渡，不支持时直接切换
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

// 卡片倾斜与光泽跟随指针
let raf = 0
function tilt(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || reduce()) return
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`)
    el.style.setProperty('--sx', `${(e.clientX - r.left).toFixed(0)}px`)
    el.style.setProperty('--sy', `${(e.clientY - r.top).toFixed(0)}px`)
  })
}
function untilt(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  cancelAnimationFrame(raf)
  el.style.removeProperty('--rx')
  el.style.removeProperty('--ry')
  if (playing.value === el.dataset.card) playing.value = null
}

// 触摸设备上，卡片进入视口时播放一次插画动画
let playIo: IntersectionObserver | null = null
onMounted(() => {
  if (canHover() || reduce() || !('IntersectionObserver' in window)) return
  playIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).dataset.card!
          playing.value = id
          playIo?.unobserve(e.target)
        }
      }
    },
    { threshold: 0.6 },
  )
  root.value?.querySelectorAll('[data-card]').forEach((n) => playIo!.observe(n))
})
onBeforeUnmount(() => playIo?.disconnect())

const previewTags = (m: Module) => m.chapters.slice(0, 4).map((c) => c.short)
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
          @pointermove="tilt"
          @pointerenter="playing = m.id"
          @pointerleave="untilt"
          @focus="playing = m.id"
          @blur="playing = null"
        >
          <span class="mc-art" :style="morphId === m.id ? { viewTransitionName: 'mod-art' } : undefined">
            <span class="mc-no">{{ String(m.no).padStart(2, '0') }}</span>
            <span class="mc-ico"><ModuleIcon :id="m.id" :play="playing === m.id" /></span>
          </span>
          <span class="mc-body">
            <span class="mc-head">
              <span class="mc-name">{{ m.name }}</span>
              <span class="mc-count">{{ m.chapters.length }} 章</span>
            </span>
            <span class="mc-intro">{{ m.intro }}</span>
            <span class="mc-tags" aria-hidden="true">
              <span v-for="t in previewTags(m)" :key="t" class="mc-tag">{{ t }}</span>
              <span v-if="m.chapters.length > 4" class="mc-tag more">+{{ m.chapters.length - 4 }}</span>
            </span>
          </span>
          <span class="mc-sheen" aria-hidden="true" />
        </button>
      </li>
    </ul>

    <!-- 模块章节页 -->
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

      <header class="mv-head" :style="morphId === active.id ? { viewTransitionName: 'mod-art' } : undefined">
        <div class="mv-text">
          <span class="mv-no">模块 {{ String(active.no).padStart(2, '0') }} · {{ active.chapters.length }} 章</span>
          <h3 id="mv-title" ref="viewHead" class="mv-title" tabindex="-1">{{ active.name }}</h3>
          <p class="mv-intro">{{ active.intro }}</p>
        </div>
        <span class="mv-ico"><ModuleIcon :id="active.id" play /></span>
      </header>

      <ol class="cc-list">
        <li v-for="(c, i) in active.chapters" :key="c.id" data-reveal>
          <a class="cc" :href="withBase(c.link)">
            <span class="cc-top">
              <span class="cc-code">{{ chapterCode({ module: active, index: i }) }}</span>
              <span class="cc-arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
            </span>
            <span class="cc-title">{{ c.title }}</span>
            <span class="cc-sum">{{ c.summary }}</span>
            <span class="cc-chips">
              <span class="cc-chip wip">建设中</span>
              <span class="cc-chip">{{ chapterTag({ module: active, chapter: c }) }}</span>
              <span v-if="c.group" class="cc-chip">{{ c.group }}</span>
            </span>
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

/* 模块卡片网格：首张卡片占两列 */
.mg-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.mg-grid li.wide {
  grid-column: span 2;
}

.mc {
  --rx: 0deg;
  --ry: 0deg;
  --sx: 50%;
  --sy: 0px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: left;
  border-radius: 18px;
  background: var(--raised);
  border: 1px solid var(--rule);
  box-shadow:
    0 1px 1px oklch(0.2 0.02 250 / 0.06),
    0 2px 4px oklch(0.2 0.02 250 / 0.05),
    0 10px 24px -12px oklch(0.2 0.02 250 / 0.16);
  overflow: hidden;
  isolation: isolate;
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.45s var(--ease-spring);
  will-change: transform;
}
.mc::after {
  /* 悬停时更深的投影层，用透明度切换 */
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  box-shadow: 0 22px 40px -18px oklch(0.2 0.03 250 / 0.35);
  opacity: 0;
  transition: opacity 0.3s var(--ease-out);
}
:root.dark .mc::after {
  box-shadow: 0 22px 40px -16px oklch(0 0 0 / 0.65);
}
.mc:hover,
.mc:focus-visible {
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-6px);
}
.mc:hover::after,
.mc:focus-visible::after {
  opacity: 1;
}
.mc:active {
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-2px) scale(0.985);
  transition-duration: 0.15s;
}
.mc:focus-visible {
  outline: 2.5px solid var(--focus);
  outline-offset: 3px;
}

.mc-art {
  position: relative;
  box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.2);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 148px;
  padding: 16px 18px 14px;
  background: var(--mod);
  color: var(--on-mod);
  border-bottom: 1px solid color-mix(in oklab, var(--mod) 70%, var(--ink));
}
.mc-no {
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 7px;
  border: 1.5px solid color-mix(in oklab, var(--on-mod) 55%, transparent);
}
.mc-ico {
  width: 128px;
  margin: 0 -4px -6px 0;
}
.wide .mc-ico {
  width: 150px;
}

.mc-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding: 16px 18px 18px;
}
.mc-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.mc-name {
  font-size: 20px;
  font-weight: 760;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.mc-count {
  margin-left: auto;
  font-size: 13px;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}
.mc-intro {
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-2);
}
.mc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 6px;
}
.mc-tag {
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;
  color: var(--ink-2);
  background: color-mix(in oklab, var(--mod) 10%, var(--paper-2));
  border: 1px solid color-mix(in oklab, var(--mod) 22%, var(--rule));
}
.mc-tag.more {
  color: var(--ink-3);
  background: transparent;
}

/* 光泽：一个固定的径向高光层，只用位移跟随指针 */
.mc-sheen {
  position: absolute;
  top: -170px;
  left: -170px;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(closest-side, oklch(1 0 0 / 0.2), transparent);
  opacity: 0;
  transform: translate3d(var(--sx), var(--sy), 0);
  transition: opacity 0.3s var(--ease-out);
}
.mc:hover .mc-sheen {
  opacity: 1;
}

/* 模块章节页 */
.mv-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}
.mv-back,
.mv-pg {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.3s var(--ease-spring);
}
.mv-back:hover,
.mv-pg:hover {
  transform: translateY(-2px);
}
.mv-back:active,
.mv-pg:active {
  transform: scale(0.97);
}
.mv-pager {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
}
.mv-pg {
  font-weight: 500;
  color: var(--ink-2);
}

.mv-head {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 26px 28px;
  border-radius: 20px;
  background: var(--mod);
  color: var(--on-mod);
  box-shadow: 0 14px 30px -18px oklch(0.2 0.03 250 / 0.5);
}
.mv-text {
  flex: 1;
  min-width: 0;
}
.mv-no {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 0.03em;
}
.mv-title {
  margin: 6px 0 6px;
  font-size: 34px;
  line-height: 1.2;
  font-weight: 780;
  letter-spacing: -0.02em;
  outline: none;
}
.mv-intro {
  margin: 0;
  max-width: 34em;
  font-size: 16px;
  line-height: 1.65;
}
.mv-ico {
  flex: none;
  width: 170px;
}

.cc-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}
.cc {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 16px 18px 16px;
  border-radius: 16px;
  background: var(--raised);
  border: 1px solid var(--rule);
  box-shadow: 0 1px 2px oklch(0.2 0.02 250 / 0.05);
  color: var(--ink);
  text-decoration: none;
  position: relative;
  transition: transform 0.4s var(--ease-spring);
}
.cc::before {
  /* 顶部模块色条 */
  content: '';
  position: absolute;
  left: 18px;
  right: 18px;
  top: 0;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: var(--mod);
}
.cc::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  box-shadow: 0 16px 30px -16px oklch(0.2 0.03 250 / 0.32);
  opacity: 0;
  transition: opacity 0.3s var(--ease-out);
}
:root.dark .cc::after {
  box-shadow: 0 16px 30px -14px oklch(0 0 0 / 0.6);
}
.cc:hover,
.cc:focus-visible {
  transform: translateY(-5px);
}
.cc:hover::after,
.cc:focus-visible::after {
  opacity: 1;
}
.cc:active {
  transform: translateY(-1px) scale(0.985);
}
.cc-top {
  display: flex;
  align-items: center;
}
.cc-code {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--ink-3);
}
.cc-arrow {
  margin-left: auto;
  color: var(--ink-3);
  transition: transform 0.35s var(--ease-spring);
}
.cc:hover .cc-arrow {
  transform: translateX(4px);
}
.cc-title {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
}
.cc-sum {
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-2);
}
.cc-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 4px;
}
.cc-chip {
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 20px;
  color: var(--ink-2);
  background: var(--paper-2);
  border: 1px solid var(--rule);
}
.cc-chip.wip {
  color: var(--ink);
  border-style: dashed;
  border-color: color-mix(in oklab, var(--warn) 55%, var(--rule));
  background: color-mix(in oklab, var(--warn) 10%, var(--paper));
}

@media (max-width: 1099px) {
  .mg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 639px) {
  .mg-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .mg-grid li.wide {
    grid-column: auto;
  }
  .mc-art {
    height: 128px;
  }
  .mc-ico,
  .wide .mc-ico {
    width: 118px;
  }
  .mv-head {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 10px;
    padding: 20px;
  }
  .mv-ico {
    width: 120px;
  }
  .mv-title {
    font-size: 28px;
  }
  .mv-pager {
    margin-left: 0;
  }
  .cc-list {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mc,
  .mc:hover,
  .mc:focus-visible,
  .mc:active,
  .cc:hover,
  .cc:focus-visible {
    transform: none;
  }
}
</style>

<style>
::view-transition-group(mod-art) {
  animation-duration: 0.45s;
  animation-timing-function: cubic-bezier(0.34, 1.2, 0.64, 1);
}
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.25s;
}
</style>
