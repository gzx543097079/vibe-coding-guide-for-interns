<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { getPrompt } from '../data/prompts'

const props = defineProps<{ id: string }>()
const uid = useId()

const p = computed(() => getPrompt(props.id))
const mode = ref<'good' | 'bad'>('good')
const copied = ref(false)
const tabs = ref<HTMLButtonElement[]>([])

const text = computed(() => (p.value ? (mode.value === 'good' ? p.value.good : p.value.bad) : ''))

// 把【占位符】拆出来单独高亮
const parts = computed(() =>
  text.value.split(/(【[^】]*】)/).filter(Boolean).map((t) => ({ t, ph: t.startsWith('【') && t.endsWith('】') })),
)

function setMode(m: 'good' | 'bad', focus = false) {
  mode.value = m
  if (focus) tabs.value[m === 'good' ? 0 : 1]?.focus()
}
function onKey(e: KeyboardEvent) {
  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    e.preventDefault()
    const next = e.key === 'Home' ? 'good' : e.key === 'End' ? 'bad' : mode.value === 'good' ? 'bad' : 'good'
    setMode(next, true)
  }
}

async function copy() {
  try {
    await navigator.clipboard.writeText(text.value)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1600)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <article v-if="p" class="pc" :aria-labelledby="`${uid}-t`">
    <header class="pc-head">
      <span class="pc-stop" aria-hidden="true" />
      <div class="pc-titles">
        <h3 :id="`${uid}-t`" class="pc-title">{{ p.title }}</h3>
        <p class="pc-scene">{{ p.scene }}</p>
      </div>
    </header>

    <div class="pc-tear" aria-hidden="true" />

    <div class="pc-bar">
      <div class="pc-tabs" role="tablist" aria-label="写法对比" @keydown="onKey">
        <button
          ref="tabs"
          type="button"
          role="tab"
          class="pc-tab good"
          :aria-selected="mode === 'good'"
          :aria-controls="`${uid}-p`"
          :tabindex="mode === 'good' ? 0 : -1"
          @click="setMode('good')"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          推荐写法
        </button>
        <button
          ref="tabs"
          type="button"
          role="tab"
          class="pc-tab bad"
          :aria-selected="mode === 'bad'"
          :aria-controls="`${uid}-p`"
          :tabindex="mode === 'bad' ? 0 : -1"
          @click="setMode('bad')"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          反例
        </button>
      </div>
      <button type="button" class="pc-copy" :class="{ done: copied }" @click="copy">
        {{ copied ? '已复制' : mode === 'good' ? '复制模板' : '复制反例' }}
      </button>
    </div>

    <div :id="`${uid}-p`" class="pc-body" role="tabpanel" tabindex="0" :class="mode">
      <pre class="pc-text"><template v-for="(s, i) in parts" :key="i"><mark v-if="s.ph" class="pc-ph">{{ s.t }}</mark><template v-else>{{ s.t }}</template></template></pre>
      <p v-if="mode === 'bad'" class="pc-why"><b>问题在哪：</b>{{ p.why }}</p>
    </div>

    <footer class="pc-foot">
      <p class="pc-foot-title">常见错误</p>
      <ul>
        <li v-for="m in p.mistakes" :key="m">{{ m }}</li>
      </ul>
    </footer>
  </article>
  <p v-else class="pc-missing">提示词模板「{{ id }}」待补充。</p>
</template>

<style scoped>
.pc {
  --pc-line: var(--accent);
  position: relative;
  margin: 22px 0 28px;
  border: 1px solid var(--rule);
  border-radius: 14px;
  background: var(--raised);
  box-shadow: var(--shadow-1);
}
.pc-head {
  display: flex;
  gap: 12px;
  padding: 16px 18px 14px;
}
.pc-stop {
  flex: none;
  width: 12px;
  height: 12px;
  margin-top: 7px;
  border-radius: 3px;
  background: var(--pc-line);
}
.pc-title {
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  font-size: 17px !important;
  line-height: 1.45 !important;
  font-weight: 700;
  color: var(--ink);
}
.pc-scene {
  margin: 2px 0 0 !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: var(--ink-2);
}

/* 标题区与正文区之间的分隔线 */
.pc-tear {
  position: relative;
  height: 0;
  margin: 0 14px;
  border-top: 1.5px dashed var(--rule-strong);
}
.pc-tear::before,
.pc-tear::after {
  content: '';
  position: absolute;
  top: -9px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--paper);
  border: 1px solid var(--rule);
}
.pc-tear::before {
  left: -23px;
  clip-path: inset(0 0 0 50%);
}
.pc-tear::after {
  right: -23px;
  clip-path: inset(0 50% 0 0);
}

.pc-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px 8px;
}
.pc-tabs {
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--paper-2);
  border: 1px solid var(--rule);
}
.pc-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-2);
}
.pc-tab[aria-selected='true'] {
  background: var(--raised);
  color: var(--ink);
  box-shadow: var(--shadow-1);
}
.pc-tab.good svg {
  color: var(--mod-start);
}
.pc-tab.bad svg {
  color: var(--danger);
}
.pc-copy {
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: var(--ink);
  color: var(--paper);
  transition: transform 0.15s var(--ease-out);
}
.pc-copy:active {
  transform: scale(0.96);
}
.pc-copy.done {
  background: var(--mod-start);
  color: var(--on-start);
}

.pc-body {
  margin: 0 18px;
  border-radius: 10px;
  background: var(--paper-2);
}
.pc-body.bad {
  background: color-mix(in oklab, var(--danger) 7%, var(--paper-2));
}
.pc-body:focus-visible {
  outline-offset: 2px;
}
.pc-text {
  margin: 0;
  padding: 14px 16px;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.75;
  color: var(--ink);
  max-height: 420px;
  overflow: auto;
}
.pc-ph {
  padding: 1px 3px;
  border-radius: 4px;
  background: color-mix(in oklab, var(--mod-growth) 26%, transparent);
  color: var(--ink);
  font-weight: 600;
}
.pc-why {
  margin: 0 !important;
  padding: 10px 16px 12px;
  border-top: 1px dashed color-mix(in oklab, var(--danger) 25%, var(--rule));
  font-size: 13.5px !important;
  line-height: 1.65 !important;
  color: var(--ink-2);
}
.pc-why b {
  color: var(--ink);
}

.pc-foot {
  padding: 12px 18px 16px;
}
.pc-foot-title {
  margin: 0 0 4px !important;
  font-size: 13px !important;
  font-weight: 650;
  color: var(--ink-2);
}
.pc-foot ul {
  margin: 0 !important;
  padding-left: 1.2em !important;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--ink-2);
}
.pc-foot li + li {
  margin-top: 2px !important;
}
.pc-missing {
  color: var(--ink-3);
}
@media (max-width: 479px) {
  .pc-bar {
    flex-wrap: wrap;
  }
  .pc-head,
  .pc-bar,
  .pc-foot {
    padding-left: 14px;
    padding-right: 14px;
  }
  .pc-body {
    margin: 0 14px;
  }
}
</style>
