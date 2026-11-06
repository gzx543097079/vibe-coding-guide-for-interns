<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { modules } from '../data/modules'

interface Item {
  id: string
  title: string
  sub: string
  link: string
  mod?: string
  group: string
}

const pages: Item[] = [
  { id: 'p-home', title: '首页', sub: '模块总览与使用方法', link: '/', group: '页面' },
  { id: 'p-controls', title: '控件总览', sub: '控件演示与复制提示词', link: '/frontend/controls', group: '页面' },
  { id: 'p-prompts', title: '场景提示词模板', sub: '写功能、修 bug、重构等模板', link: '/growth/prompt-templates', group: '页面' },
]
const chapters: Item[] = modules.flatMap((m) =>
  m.chapters.map((c) => ({ id: c.id, title: c.title, sub: `${c.level} · ${c.summary}`, link: c.link, mod: m.id, group: m.name })),
)

const open = ref(false)
const q = ref('')
const active = ref(0)
const input = ref<HTMLInputElement>()
const list = ref<HTMLElement>()
const router = useRouter()
let opener: HTMLElement | null = null

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '')
const results = computed(() => {
  const k = norm(q.value)
  const all = [...pages, ...chapters]
  if (!k) return all
  return all
    .map((it) => {
      const t = norm(it.title)
      const score = t.startsWith(k) ? 3 : t.includes(k) ? 2 : norm(it.sub + it.group).includes(k) ? 1 : 0
      return { it, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.it)
})
// 按分组展示，分组顺序跟随第一次出现的顺序
const groups = computed(() => {
  const map = new Map<string, Item[]>()
  for (const it of results.value) {
    if (!map.has(it.group)) map.set(it.group, [])
    map.get(it.group)!.push(it)
  }
  return [...map.entries()]
})
const flat = computed(() => groups.value.flatMap(([, items]) => items))
const activeId = computed(() => (flat.value[active.value] ? `cp-${flat.value[active.value].id}` : undefined))

watch(q, () => (active.value = 0))

async function show() {
  if (open.value) return
  opener = document.activeElement as HTMLElement | null
  q.value = ''
  active.value = 0
  open.value = true
  document.documentElement.style.overflow = 'hidden'
  await nextTick()
  input.value?.focus()
}
function hide(restore = true) {
  if (!open.value) return
  open.value = false
  document.documentElement.style.overflow = ''
  if (restore) opener?.focus?.()
}
function go(it: Item | undefined) {
  if (!it) return fullText()
  hide(false)
  router.go(withBase(it.link))
}
// 交给内置全文搜索：写入搜索词后用 "/" 快捷键打开
function fullText() {
  const text = q.value
  hide(false)
  try {
    sessionStorage.setItem('vitepress:local-search-filter', text)
  } catch {
    /* 存储不可用时只打开搜索框 */
  }
  window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
}

function move(d: number) {
  const n = flat.value.length
  if (!n) return
  active.value = (active.value + d + n) % n
  nextTick(() => list.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }))
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    move(-1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (e.shiftKey) fullText()
    else go(flat.value[active.value])
  } else if (e.key === 'Escape') {
    e.preventDefault()
    hide()
  } else if (e.key === 'Tab') {
    // 焦点留在输入框
    e.preventDefault()
  }
}

// ⌘K / Ctrl K 打开命令面板（在捕获阶段拦截，避免触发内置搜索）
function onGlobalKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    e.stopImmediatePropagation()
    open.value ? hide() : show()
  }
}
const onOpenEvent = () => show()
onMounted(() => {
  window.addEventListener('keydown', onGlobalKey, true)
  window.addEventListener('vcg:palette', onOpenEvent)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKey, true)
  window.removeEventListener('vcg:palette', onOpenEvent)
})

function mark(text: string) {
  const k = q.value.trim()
  if (!k) return [{ t: text, m: false }]
  const i = text.toLowerCase().indexOf(k.toLowerCase())
  if (i < 0) return [{ t: text, m: false }]
  return [
    { t: text.slice(0, i), m: false },
    { t: text.slice(i, i + k.length), m: true },
    { t: text.slice(i + k.length), m: false },
  ]
}
</script>

<template>
  <Teleport to="body">
    <Transition name="cp">
      <div v-if="open" class="cp" @mousedown.self="hide()">
        <div class="cp-panel" role="dialog" aria-modal="true" aria-label="跳转到章节">
          <div class="cp-input-row">
            <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
            <input
              ref="input"
              v-model="q"
              class="cp-input"
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="cp-list"
              aria-autocomplete="list"
              :aria-activedescendant="activeId"
              placeholder="输入章节名或关键词，例如：Git、数据库、性能"
              autocomplete="off"
              spellcheck="false"
              @keydown="onKey"
            />
            <kbd class="cp-esc">Esc</kbd>
          </div>

          <div id="cp-list" ref="list" class="cp-list" role="listbox" aria-label="搜索结果">
            <div v-for="[name, items] in groups" :key="name" role="group" :aria-label="name" class="cp-group">
              <p class="cp-group-name" aria-hidden="true">{{ name }}</p>
              <div
                v-for="it in items"
                :id="`cp-${it.id}`"
                :key="it.id"
                class="cp-item"
                role="option"
                :aria-selected="flat[active]?.id === it.id"
                :data-mod="it.mod"
                @mousemove="active = flat.indexOf(it)"
                @click="go(it)"
              >
                <span class="cp-dot" :class="{ page: !it.mod }" aria-hidden="true" />
                <span class="cp-text">
                  <span class="cp-title"><template v-for="(p, i) in mark(it.title)" :key="i"><mark v-if="p.m">{{ p.t }}</mark><template v-else>{{ p.t }}</template></template></span>
                  <span class="cp-sub">{{ it.sub }}</span>
                </span>
                <svg class="cp-enter" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 3v5a2 2 0 0 1-2 2H4m3-3-3 3 3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </div>
            </div>
            <div v-if="!flat.length" class="cp-empty">
              <p>没有匹配的章节。</p>
              <button type="button" class="cp-full" @click="fullText">在全文中搜索「{{ q }}」</button>
            </div>
          </div>

          <div class="cp-foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
            <span><kbd>↵</kbd> 打开</span>
            <button type="button" class="cp-foot-btn" @click="fullText"><kbd>⇧</kbd><kbd>↵</kbd> 全文搜索</button>
          </div>
          <p class="sr-only" aria-live="polite">{{ q ? `找到 ${flat.length} 个结果` : '' }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cp {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 16px 16px;
  background: rgb(20 20 19 / 0.32);
}
.cp-panel {
  display: flex;
  flex-direction: column;
  width: min(640px, 100%);
  max-height: min(560px, 76vh);
  border-radius: var(--radius-lg);
  border: 1px solid var(--rule-strong);
  background: var(--paper);
  box-shadow: var(--shadow-3);
  overflow: hidden;
}
.cp-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px 0 16px;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-3);
}
.cp-input {
  flex: 1;
  min-width: 0;
  height: 56px;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--ink);
}
.cp-input::placeholder {
  color: var(--ink-3);
}
kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  font-family: var(--font-sans);
  font-size: 11.5px;
  color: var(--ink-2);
}
.cp-list {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px 8px 8px;
}
.cp-group-name {
  margin: 10px 10px 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-3);
}
.cp-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 7px 10px;
  border-radius: var(--radius);
  cursor: pointer;
}
.cp-item[aria-selected='true'] {
  background: var(--accent-soft);
}
.cp-dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--mod);
}
.cp-dot.page {
  background: var(--ink-3);
}
.cp-text {
  display: grid;
  flex: 1;
  min-width: 0;
}
.cp-title {
  font-size: 14.5px;
  font-weight: 550;
  color: var(--ink);
}
.cp-title mark {
  background: transparent;
  color: var(--accent-ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.cp-sub {
  font-size: 12.5px;
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cp-enter {
  flex: none;
  color: var(--accent-ink);
  opacity: 0;
}
.cp-item[aria-selected='true'] .cp-enter {
  opacity: 1;
}
.cp-empty {
  padding: 28px 16px;
  text-align: center;
  color: var(--ink-3);
  font-size: 14px;
}
.cp-empty p {
  margin: 0 0 12px;
}
.cp-full {
  min-height: 40px;
  padding: 0 14px;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 600;
}
.cp-foot {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  border-top: 1px solid var(--rule);
  background: var(--paper-2);
  font-size: 12.5px;
  color: var(--ink-3);
}
.cp-foot span,
.cp-foot-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.cp-foot-btn {
  margin-left: auto;
  color: var(--ink-2);
  font-size: 12.5px;
}
.cp-foot-btn:hover {
  color: var(--accent-ink);
}

.cp-enter-active,
.cp-leave-active {
  transition: opacity var(--dur-2) var(--ease);
}
.cp-enter-active .cp-panel,
.cp-leave-active .cp-panel {
  transition: transform var(--dur-2) var(--ease), opacity var(--dur-2) var(--ease);
}
.cp-enter-from,
.cp-leave-to {
  opacity: 0;
}
.cp-enter-from .cp-panel,
.cp-leave-to .cp-panel {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

@media (max-width: 639px) {
  .cp {
    padding: 10px 10px 0;
  }
  .cp-panel {
    max-height: calc(100dvh - 20px);
  }
  .cp-foot span {
    display: none;
  }
}
</style>
