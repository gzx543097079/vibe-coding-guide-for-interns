<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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
        <button type="button" class="cd-replay" @click="replay">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            <path d="M3.6 1.6 4.2 4.4 1.5 4.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          重播
        </button>
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
  --app-bg: oklch(0.99 0.003 230);
  --app-ink: oklch(0.24 0.02 252);
  --app-ink-2: oklch(0.47 0.016 252);
  --app-line: oklch(0.91 0.006 230);
  --app-soft: oklch(0.955 0.006 230);
  --app-accent: oklch(0.5 0.15 258);
  --app-on-accent: #fff;
  --app-danger: oklch(0.55 0.2 27);
  position: relative;
  margin: 0 auto;
  background: var(--app-bg);
  color: var(--app-ink);
  box-shadow: var(--shadow-2);
}
:root.dark .cd-device {
  --app-bg: oklch(0.2 0.012 250);
  --app-ink: oklch(0.94 0.008 240);
  --app-ink-2: oklch(0.76 0.012 240);
  --app-line: oklch(0.3 0.014 250);
  --app-soft: oklch(0.25 0.014 250);
  --app-accent: oklch(0.74 0.13 255);
  --app-on-accent: oklch(0.18 0.03 255);
  --app-danger: oklch(0.7 0.16 27);
}
.cd-device.phone {
  width: 268px;
  height: 500px;
  border-radius: 40px;
  padding: 10px;
  background: var(--app-bg);
  outline: 9px solid oklch(0.22 0.012 250);
  outline-offset: -1px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
:root.dark .cd-device.phone {
  outline-color: oklch(0.36 0.012 250);
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
  background: oklch(0.15 0.01 250);
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
