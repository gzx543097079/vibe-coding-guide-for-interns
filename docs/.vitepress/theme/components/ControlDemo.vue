<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, useId } from 'vue'
import { buildControlPrompt, defaultOptions, optionLabels, type PromptOptions } from '../data/controlPrompts'
import { controlNote } from '../data/approaches'
import { currentTab, tabsHostKey, type TabsHost } from '../composables/codeTabs'
import { copyText } from '../composables/clipboard'
import DemoButton from './demos/DemoButton.vue'
import DemoSwitch from './demos/DemoSwitch.vue'
import DemoModal from './demos/DemoModal.vue'
import DemoList from './demos/DemoList.vue'
import DemoTabBar from './demos/DemoTabBar.vue'

type Control = 'button' | 'switch' | 'modal' | 'list' | 'tabbar'

const props = withDefaults(
  defineProps<{
    control: Control
    frame?: 'phone' | 'browser'
    title?: string
  }>(),
  { frame: 'phone' },
)

const meta: Record<Control, { name: string; hint: string; comp: unknown }> = {
  button: { name: '按钮 Button', hint: '按下看反馈，提交后进入加载状态', comp: DemoButton },
  switch: { name: '开关 Switch', hint: '点击或按空格切换', comp: DemoSwitch },
  modal: { name: '弹窗 Modal / Sheet', hint: '打开底部弹窗或对话框，Esc 关闭', comp: DemoModal },
  list: { name: '列表 List', hint: '向下拖动刷新，向左滑动删除；也可用顶部按钮', comp: DemoList },
  tabbar: { name: '标签栏 TabBar', hint: '切换标签，方向键可移动', comp: DemoTabBar },
}

const info = computed(() => meta[props.control])
const runKey = ref(0)
const play = ref(false)
const root = ref<HTMLElement>()
let io: IntersectionObserver | null = null

// 进入视口后才自动演示一次；系统要求减少动态效果时不自动演示
onMounted(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) return
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        play.value = true
        io?.disconnect()
      }
    },
    { threshold: 0.5 },
  )
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())

// 内部 CodeTabs 登记的分组，用来得知当前选中的语言
const host = reactive<TabsHost>({ group: '', labels: [] })
provide(tabsHostKey, host)
const stackLabel = computed(() => (host.group ? currentTab(host.group, host.labels) : undefined))

const uid = useId()
const opts = reactive<PromptOptions>({ ...defaultOptions })
const prompt = computed(() => buildControlPrompt(props.control, stackLabel.value, opts))
const promptParts = computed(() =>
  prompt.value.split(/(\{[^}]*\})/).filter(Boolean).map((t) => ({ t, ph: t.startsWith('{') })),
)
const copyState = ref<'idle' | 'done' | 'fail'>('idle')
let copyTimer = 0
async function copyPrompt() {
  const ok = await copyText(prompt.value)
  copyState.value = ok ? 'done' : 'fail'
  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => (copyState.value = 'idle'), 2000)
}

// 当前控件在各写法下的实现差异
const notes = computed(() =>
  host.labels.map((label) => ({ label, text: controlNote(props.control, label) })).filter((n) => n.text),
)

function replay() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  runKey.value++
  play.value = !reduce
}
</script>

<template>
  <figure ref="root" class="cd" :class="`is-${frame}`" :aria-label="`控件演示：${title ?? info.name}`">
    <div class="cd-stage">
      <div class="cd-head">
        <span class="cd-name">{{ title ?? info.name }}</span>
        <span class="cd-hint">{{ info.hint }}</span>
        <button type="button" class="cd-copy" :class="copyState" :aria-describedby="`${uid}-tip`" @click="copyPrompt">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path v-if="copyState === 'done'" d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
            <path v-else d="M5.5 5.5h7v8h-7zM10.5 3.5V2.5h-8v8h1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
          </svg>
          {{ copyState === 'done' ? '已复制' : copyState === 'fail' ? '复制失败' : '复制提示词' }}
        </button>
        <button type="button" class="cd-replay" @click="replay">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            <path d="M3.6 1.6 4.2 4.4 1.5 4.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          重播
        </button>
      </div>
      <div class="cd-prompt">
        <fieldset class="cd-opts">
          <legend class="sr-only">提示词选项</legend>
          <label v-for="[key, text] in optionLabels" :key="key" class="cd-opt">
            <input v-model="opts[key]" type="checkbox" />
            <span>{{ text }}</span>
          </label>
        </fieldset>
        <p :id="`${uid}-tip`" class="cd-tip">
          提示词按当前选中的写法（{{ stackLabel ?? '未指定' }}）生成，复制后把 <mark class="cd-ph">{…}</mark> 换成你项目的实际内容。
        </p>
        <details class="cd-preview">
          <summary>预览提示词</summary>
          <pre class="cd-pre"><template v-for="(s, i) in promptParts" :key="i"><mark v-if="s.ph" class="cd-ph">{{ s.t }}</mark><template v-else>{{ s.t }}</template></template></pre>
        </details>
        <p class="sr-only" aria-live="polite">{{ copyState === 'done' ? '提示词已复制到剪贴板' : copyState === 'fail' ? '复制失败，请展开预览手动复制' : '' }}</p>
      </div>

      <div class="cd-device" :class="frame">
        <div v-if="frame === 'phone'" class="cd-status" aria-hidden="true">
          <span>9:41</span>
          <span class="cd-island" />
          <span class="cd-sig">
            <i /><i /><i />
          </span>
        </div>
        <div v-else class="cd-chrome" aria-hidden="true">
          <span class="cd-lights"><i /><i /><i /></span>
          <span class="cd-url">localhost:5173</span>
        </div>
        <div class="cd-screen">
          <component :is="info.comp" :key="runKey" :play="play" :frame="frame" />
        </div>
        <div v-if="frame === 'phone'" class="cd-home" aria-hidden="true" />
      </div>
    </div>
    <div v-if="$slots.default" class="cd-code">
      <slot />
      <div v-if="notes.length" class="cd-notes">
        <p class="cd-notes-title">这个控件在各写法下的差异</p>
        <ul>
          <li v-for="n in notes" :key="n.label" :class="{ cur: n.label === stackLabel }">
            <b>{{ n.label }}</b>{{ n.text }}
          </li>
        </ul>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.cd {
  margin: 22px 0 34px;
  display: grid;
  gap: 14px;
}
.cd-stage {
  border: 1px solid var(--rule);
  border-radius: 14px;
  background:
    radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--ink) 9%, transparent) 1px, transparent 1.5px) 0 0 / 18px 18px,
    var(--paper-2);
  padding: 14px 16px 26px;
}
.cd-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-bottom: 18px;
  font-size: 13px;
  line-height: 1.5;
}
.cd-name {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--ink);
}
.cd-hint {
  color: var(--ink-2);
}
.cd-replay {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink);
  font-size: 12.5px;
  font-weight: 550;
  transition: transform 0.15s var(--ease-out);
}
.cd-replay:hover {
  border-color: var(--ink-3);
}
.cd-replay:active {
  transform: scale(0.96);
}
.cd-replay:hover svg {
  transform: rotate(-60deg);
}
.cd-replay svg {
  transition: transform 0.35s var(--ease-out);
}

/* 设备外框 */
.cd-device {
  --app-bg: #fffefb;
  --app-ink: #141413;
  --app-ink-2: #66635c;
  --app-line: #e6dfd8;
  --app-soft: #f5f0e8;
  --app-accent: #b3573a;
  --app-on-accent: #fff;
  --app-danger: #b0413a;
  position: relative;
  margin: 0 auto;
  background: var(--app-bg);
  color: var(--app-ink);
  box-shadow: var(--shadow-2);
}
:root.dark .cd-device {
  --app-bg: #24221f;
  --app-ink: #f3efe7;
  --app-ink-2: #a7a196;
  --app-line: #34312c;
  --app-soft: #2a2824;
  --app-accent: #e08b6b;
  --app-on-accent: #1b1a17;
  --app-danger: #e38d84;
}
.cd-device.phone {
  width: 268px;
  height: 500px;
  border-radius: 40px;
  padding: 10px;
  background: var(--app-bg);
  outline: 9px solid #2a2824;
  outline-offset: -1px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
:root.dark .cd-device.phone {
  outline-color: #3d3a34;
}
.cd-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 26px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.cd-island {
  width: 74px;
  height: 20px;
  border-radius: 12px;
  background: #141413;
}
.cd-sig {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 10px;
}
.cd-sig i {
  width: 3px;
  border-radius: 1px;
  background: currentColor;
}
.cd-sig i:nth-child(1) { height: 4px; }
.cd-sig i:nth-child(2) { height: 7px; }
.cd-sig i:nth-child(3) { height: 10px; }
.cd-home {
  width: 96px;
  height: 4px;
  margin: 6px auto 2px;
  border-radius: 3px;
  background: var(--app-ink);
  opacity: 0.85;
}
.cd-device.browser {
  width: 100%;
  max-width: 560px;
  height: 360px;
  border-radius: 12px;
  border: 1px solid var(--rule-strong);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.cd-chrome {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 36px;
  padding: 0 12px;
  border-bottom: 1px solid var(--app-line);
  background: var(--app-soft);
}
.cd-lights {
  display: inline-flex;
  gap: 6px;
}
.cd-lights i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--app-line);
  border: 1px solid color-mix(in oklab, var(--app-ink) 15%, transparent);
}
.cd-url {
  flex: 1;
  max-width: 280px;
  padding: 3px 10px;
  border-radius: 6px;
  background: var(--app-bg);
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--app-ink-2);
}
.cd-screen {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 0 0 30px 30px;
}
.cd-device.browser .cd-screen {
  border-radius: 0;
}

.cd-code {
  min-width: 0;
}

/* 复制提示词 */
.cd-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 9px;
  background: var(--ink);
  color: var(--paper);
  font-size: 13px;
  font-weight: 650;
  transition: transform 0.3s var(--ease);
}
.cd-copy:hover {
  transform: translateY(-1px);
}
.cd-copy:active {
  transform: scale(0.96);
}
.cd-copy.done {
  background: var(--mod-start);
  color: var(--on-start);
}
.cd-copy.fail {
  background: var(--danger);
  color: #fff;
}
.cd-copy + .cd-replay {
  margin-left: 0;
}
.cd-prompt {
  margin: -6px 0 18px;
  font-size: 13px;
}
.cd-opts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  border: 0;
}
.cd-opt {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.cd-opt input {
  position: absolute;
  opacity: 0;
  inset: 0;
  margin: 0;
  cursor: pointer;
}
.cd-opt span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--rule-strong);
  background: var(--raised);
  color: var(--ink-2);
  font-size: 12.5px;
}
.cd-opt span::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 3px;
  border: 1.5px solid var(--ink-3);
}
.cd-opt input:checked + span {
  color: var(--ink);
  border-color: var(--ink);
}
.cd-opt input:checked + span::before {
  border-color: var(--ink);
  background: var(--ink);
  box-shadow: inset 0 0 0 2px var(--raised);
}
.cd-opt input:focus-visible + span {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
.cd-tip {
  margin: 8px 0 0 !important;
  font-size: 12.5px !important;
  line-height: 1.6 !important;
  color: var(--ink-2);
}
.cd-ph {
  padding: 0 3px;
  border-radius: 4px;
  background: color-mix(in oklab, var(--mod-growth) 28%, transparent);
  color: var(--ink);
  font-weight: 600;
}
.cd-preview {
  margin-top: 6px;
}
.cd-preview summary {
  margin: 0 !important;
  display: inline-block;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--rule-strong);
}
.cd-pre {
  margin: 8px 0 0;
  max-height: 320px;
  overflow: auto;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--raised);
  border: 1px solid var(--rule);
  white-space: pre-wrap;
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink);
}

/* 各写法的实现差异 */
.cd-notes {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--paper-2);
}
.cd-notes-title {
  margin: 0 0 6px !important;
  font-size: 13px !important;
  font-weight: 700;
  color: var(--ink);
}
.cd-notes ul {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.cd-notes li {
  text-wrap: pretty;
  margin: 0 !important;
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-2);
}
.cd-notes li.cur {
  background: var(--accent-soft);
  color: var(--ink);
}
.cd-notes b {
  margin-right: 8px;
  color: var(--ink);
  font-weight: 650;
}

@media (max-width: 479px) {
  .cd-stage {
    padding: 12px 10px 22px;
  }
  .cd-device.phone {
    width: 252px;
    height: 480px;
  }
}
</style>
