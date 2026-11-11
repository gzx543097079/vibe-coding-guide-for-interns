<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { demos, type Frame } from '../demos/registry'
import {
  buildControlPrompt,
  getControl,
  defaultOptions,
  optionLabels,
} from '../../data/controlPrompts'
import { modules } from '../../data/modules'
import { copyText } from '../../composables/clipboard'
import SiteIcon from './SiteIcon.vue'
const active = ref('button')
const query = ref('')
// 默认用 iPhone 外框；网页外框留作对照
const frame = ref<Frame>('phone')
const replay = ref(0)
const playing = ref(false)
const stack = ref('HTML + CSS + JS')
const options = reactive({ ...defaultOptions })
const copied = ref<'idle' | 'done' | 'fail'>('idle')
const panel = ref('guide')
const info = computed(() => demos[active.value])
const spec = computed(() => getControl(active.value))
const prompt = computed(() =>
  // iPhone 外框用 iOS 系统色，提示词的色值表和画布跟着外框走
  buildControlPrompt(active.value, stack.value, options, {
    palette: frame.value === 'phone' ? 'ios' : 'site',
    canvas: frame.value,
  }),
)
const groups = computed(() => {
  const result: { name: string; items: { id: string; title: string }[] }[] = []
  for (const c of modules.find((m) => m.id === 'controls')!.chapters) {
    const id = c.id.split('/')[1]
    if (
      !demos[id] ||
      (!demos[id].name.includes(query.value.trim()) &&
        !c.title.includes(query.value.trim()))
    )
      continue
    const name = c.group ?? '其他'
    let g = result.find((g) => g.name === name)
    if (!g) result.push((g = { name, items: [] }))
    g.items.push({ id, title: c.short })
  }
  return result
})
function select(id: string) {
  active.value = id
  playing.value = false
  replay.value++
  history.replaceState(null, '', '#' + id)
  copied.value = 'idle'
}
function fromHash() {
  const id = new URLSearchParams(location.search).get('frame') ?? location.hash.slice(1)
  if (demos[id]) {
    active.value = id
  }
}
onMounted(() => {
  fromHash()
  window.addEventListener('hashchange', fromHash)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', fromHash))
watch(
  [active, stack, frame, () => JSON.stringify(options)],
  () => (copied.value = 'idle'),
)
async function copy() {
  copied.value = (await copyText(prompt.value)) ? 'done' : 'fail'
}
function play() {
  playing.value = true
  replay.value++
}
</script>
<template>
  <div class="lab-page site-width">
    <header class="lab-page-heading">
      <div>
        <h1>组件演示</h1>
        <p>17 个组件的交互状态、实现代码与提示词。</p>
      </div>
      <a class="text-link" :href="withBase('/courses/controls')"
        >读相关笔记<SiteIcon name="arrow" :size="18"
      /></a>
    </header>
    <div class="lab-workspace">
      <aside class="lab-library">
        <label class="lab-library-search"
          ><SiteIcon name="search" :size="16" /><input
            v-model="query"
            placeholder="查找组件"
            aria-label="查找组件"
        /></label>
        <nav aria-label="组件列表">
          <section v-for="g in groups" :key="g.name">
            <h2>{{ g.name }}<small>{{ g.items.length }}</small></h2>
            <button
              v-for="c in g.items"
              :key="c.id"
              :aria-pressed="active === c.id"
              @click="select(c.id)"
            >
              {{ c.title
              }}<SiteIcon v-if="active === c.id" name="chevron" :size="15" />
            </button>
          </section>
          <p v-if="!groups.length" class="lab-library-empty">
            没有匹配组件。<button @click="query = ''">清空搜索</button>
          </p>
        </nav>
        <p class="library-note">17 个组件 · 默认 iPhone 外框，也可以切到网页</p>
      </aside>
      <div class="lab-main">
        <div class="lab-demo-bar">
          <div>
            <h2>{{ info.name }}</h2>
            <span>{{ spec?.verify.status }}</span>
          </div>
          <div class="lab-demo-actions">
            <div class="segmented-control" role="group" aria-label="演示外框">
              <button
                :aria-pressed="frame === 'phone'"
                @click="frame = 'phone'"
              >
                iPhone</button
              ><button
                :aria-pressed="frame === 'browser'"
                @click="frame = 'browser'"
              >
                网页
              </button>
            </div>
            <button class="icon-button" aria-label="播放组件演示" @click="play">
              <SiteIcon name="reset" :size="18" />
            </button>
          </div>
        </div>
        <div class="lab-canvas">
          <div class="lab-demo-device" :class="frame">
            <div v-if="frame === 'phone'" class="lab-ios-status" aria-hidden="true">
              <span class="lab-ios-time">9:41</span>
              <span class="lab-ios-island" />
              <span class="lab-ios-icons">
                <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.6" y="5" width="3" height="6" rx="1" /><rect x="9.2" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.8" y="0" width="3" height="11" rx="1" /></svg>
                <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.2c2 0 3.9.8 5.3 2.1l1-1.1A9.2 9.2 0 0 0 7.5.7 9.2 9.2 0 0 0 1.200 3.2l1 1.1a7.700 7.700 0 0 1 5.300-2.100Zm0 3.200c1.200 0 2.300.5 3.100 1.200l1-1.100a6.200 6.200 0 0 0-8.200 0l1 1.100c.8-.7 1.900-1.200 3.100-1.200Zm0 3.100c.6 0 1.100.2 1.500.6l-1.500 1.700L6 9.100c.4-.4.900-.6 1.500-.6Z" /></svg>
                <svg width="25" height="12" viewBox="0 0 25 12"><rect x=".5" y=".5" width="21" height="11" rx="3.300" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="18" height="8" rx="2" /><path d="M23 4v4c.8-.300 1.500-1.100 1.500-2S23.800 4.300 23 4Z" opacity=".45" /></svg>
              </span>
            </div>
            <div v-else class="lab-device-heading">
              <span>网页外框</span><span class="live-indicator" />
            </div>
            <div class="lab-demo-screen">
              <component
                :is="info.comp"
                :key="active + '-' + replay + '-' + frame"
                :play="playing"
                :frame="frame"
              />
            </div>
            <div v-if="frame === 'phone'" class="lab-ios-home" aria-hidden="true" />
          </div>
          <p class="lab-canvas-hint">{{ info.hint }}</p>
        </div>
        <div class="lab-detail">
          <div class="lab-detail-tabs" role="group" aria-label="组件资料">
            <button
              :aria-pressed="panel === 'guide'"
              @click="panel = 'guide'"
            >
              检查行为</button
            ><button :aria-pressed="panel === 'prompt'" @click="panel = 'prompt'">
              复制提示词</button
            ><a :href="withBase('/controls/' + active)"
              >查看实现代码<SiteIcon name="arrow" :size="15"
            /></a>
          </div>
          <div v-if="panel === 'prompt'" class="lab-prompt-section">
            <div>
              <h3>生成一段提示词</h3>
              <p>
                选好技术栈和选项，复制后把占位符换成自己的内容。提示词里的画布和色值跟上面选的外框一致。
              </p>
              <div class="lab-prompt-settings">
                <label
                  >技术栈<select v-model="stack">
                    <option
                      v-for="s in [
                        'HTML + CSS + JS',
                        'React',
                        'Vue',
                        'SwiftUI',
                        'Kotlin (Compose)',
                        'Flutter (Dart)',
                        'React Native (TSX)',
                        'uni-app (Vue)',
                      ]"
                      :key="s"
                    >
                      {{ s }}
                    </option>
                  </select></label
                >
                <div class="lab-prompt-options">
                  <label v-for="[key, label] in optionLabels" :key="key"
                    ><input v-model="options[key]" type="checkbox" />{{
                      label
                    }}</label
                  >
                </div>
              </div>
            </div>
            <div class="lab-prompt-result">
              <div>
                <span>提示词</span
                ><button @click="copy">
                  <SiteIcon
                    :name="copied === 'done' ? 'check' : 'copy'"
                    :size="16"
                  />{{
                    copied === 'done'
                      ? '已复制'
                      : copied === 'fail'
                        ? '复制失败，请手动选择'
                        : '复制提示词'
                  }}
                </button>
              </div>
              <pre tabindex="0">{{ prompt }}</pre>
              <span class="sr-only" aria-live="polite">{{
                copied === 'done'
                  ? '提示词已复制'
                  : copied === 'fail'
                    ? '复制失败，请手动选择提示词'
                    : ''
              }}</span>
            </div>
          </div>
          <div v-else class="lab-validation">
            <h3>可以检查这些行为</h3>
            <ul>
              <li v-for="item in spec?.acceptance" :key="item">{{ item }}</li>
            </ul>
            <p>{{ spec?.verify.note }}</p>
            <p>验证状态针对站内配色的网页演示。iPhone 外框只换了色值表，没有单独验证；原生片段尚未完成编译与真机验证。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
