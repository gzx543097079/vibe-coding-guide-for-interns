<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { appEffects, demos, type Frame } from '../demos/registry'
import {
  buildControlPrompt,
  getControl,
  defaultOptions,
  optionLabels,
} from '../../data/controlPrompts'
import { modules } from '../../data/modules'
import { copyText } from '../../composables/clipboard'
import SiteIcon from './SiteIcon.vue'
import IosStatusBar from './IosStatusBar.vue'
const active = ref('button')
const query = ref('')
// 默认用 iPhone 外框；网页外框留作对照
const picked = ref<Frame>('phone')
const replay = ref(0)
const playing = ref(false)
const stack = ref('HTML + CSS + JS')
const options = reactive({ ...defaultOptions })
const copied = ref<'idle' | 'done' | 'fail'>('idle')
const panel = ref('guide')
const info = computed(() => demos[active.value])
// 手势类效果只有手机外框
const frame = computed<Frame>(() => (info.value.phoneOnly ? 'phone' : picked.value))
const total = Object.keys(demos).length
const hasChapter = computed(() => !appEffects.some((e) => e.id === active.value))
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
  const extra = appEffects.filter((e) => e.title.includes(query.value.trim()))
  if (extra.length) result.push({ name: 'App 里的效果', items: extra })
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
        <p>{{ total }} 个组件和效果，可以直接操作，附验证过的提示词。</p>
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
        <p class="library-note">{{ total }} 个演示 · 默认 iPhone 外框，组件可以切到网页</p>
      </aside>
      <div class="lab-main">
        <div class="lab-demo-bar">
          <div>
            <h2>{{ info.name }}</h2>
            <span>{{ spec?.verify.status }}</span>
          </div>
          <div class="lab-demo-actions">
            <div v-if="!info.phoneOnly" class="segmented-control" role="group" aria-label="演示外框">
              <button
                :aria-pressed="frame === 'phone'"
                @click="picked = 'phone'"
              >
                iPhone</button
              ><button
                :aria-pressed="frame === 'browser'"
                @click="picked = 'browser'"
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
            <IosStatusBar v-if="frame === 'phone'" />
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
            ><a v-if="hasChapter" :href="withBase('/controls/' + active)"
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
            <p v-if="spec?.verify.palette === 'ios'">验证用的是 iPhone 外框和 iOS 配色的网页写法，比对的是各状态下元素的位置、尺寸、颜色和透明度；原生片段尚未完成编译与真机验证。</p>
            <p v-if="spec?.verify.swiftui">SwiftUI 版：{{ spec.verify.swiftui }}没有在真机上验证。</p>
            <p v-else>验证状态针对站内配色的网页演示。iPhone 外框只换了色值表，没有单独验证；原生片段尚未完成编译与真机验证。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
