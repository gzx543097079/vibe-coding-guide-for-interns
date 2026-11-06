<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 每张卡片的位置（百分比）、视差深度与漂浮周期
const cards = [
  { k: 'git', mod: 'git', x: 4, y: 6, d: 0.9, t: 7.2 },
  { k: 'prompt', mod: 'growth', x: 46, y: 0, d: 0.5, t: 8.4 },
  { k: 'ui', mod: 'frontend', x: 0, y: 44, d: 0.6, t: 6.6 },
  { k: 'api', mod: 'backend', x: 56, y: 36, d: 1, t: 7.8 },
  { k: 'test', mod: 'quality', x: 14, y: 74, d: 0.75, t: 9 },
  { k: 'diff', mod: 'start', x: 58, y: 70, d: 0.45, t: 6.9 },
]

const box = ref<HTMLElement>()
let raf = 0
let host: HTMLElement | null = null

function move(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || !box.value) return
  const r = (host ?? box.value).getBoundingClientRect()
  const mx = ((e.clientX - r.left) / r.width - 0.5) * 2
  const my = ((e.clientY - r.top) / r.height - 0.5) * 2
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    box.value?.style.setProperty('--mx', mx.toFixed(3))
    box.value?.style.setProperty('--my', my.toFixed(3))
  })
}
function reset() {
  box.value?.style.setProperty('--mx', '0')
  box.value?.style.setProperty('--my', '0')
}

// 视差跟随整个首屏区域的指针
onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  host = box.value?.closest('.hero') as HTMLElement | null
  host?.addEventListener('pointermove', move)
  host?.addEventListener('pointerleave', reset)
})
onBeforeUnmount(() => {
  host?.removeEventListener('pointermove', move)
  host?.removeEventListener('pointerleave', reset)
})
</script>

<template>
  <div ref="box" class="hc" aria-hidden="true">
    <div
      v-for="(c, i) in cards"
      :key="c.k"
      class="hc-slot"
      :class="`k-${c.k}`"
      :data-mod="c.mod"
      :style="{ left: `${c.x}%`, top: `${c.y}%`, '--d': c.d, '--t': `${c.t}s`, '--n': i }"
    >
      <div class="hc-float">
        <div class="hc-card">
          <template v-if="c.k === 'git'">
            <span class="hc-label"><i class="hc-chip" />Git</span>
            <svg viewBox="0 0 150 46" class="hc-svg">
              <path d="M8 34H142" class="ln" />
              <path d="M40 34c0-16 10-22 24-22h30" class="ln acc" />
              <circle cx="8" cy="34" r="5" class="nd" /><circle cx="40" cy="34" r="5" class="nd" />
              <circle cx="94" cy="12" r="5" class="nd acc" /><circle cx="142" cy="34" r="5" class="nd" />
            </svg>
            <span class="hc-mono">feat/login</span>
          </template>
          <template v-else-if="c.k === 'prompt'">
            <span class="hc-label"><i class="hc-chip" />提示词</span>
            <span class="hc-text">【目标】实现登录表单校验</span>
            <span class="hc-text dim">【验收】空值时给出提示<i class="hc-caret" /></span>
          </template>
          <template v-else-if="c.k === 'ui'">
            <span class="hc-label"><i class="hc-chip" />前端控件</span>
            <span class="hc-row">
              <span class="hc-switch"><i /></span>
              <span class="hc-btn">提交</span>
            </span>
          </template>
          <template v-else-if="c.k === 'api'">
            <span class="hc-label"><i class="hc-chip" />后端接口</span>
            <span class="hc-mono"><b>GET</b> /api/users/:id</span>
            <span class="hc-status">200 OK</span>
          </template>
          <template v-else-if="c.k === 'test'">
            <span class="hc-label"><i class="hc-chip" />测试</span>
            <span v-for="n in ['空输入', '格式错误', '正常提交']" :key="n" class="hc-check">
              <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5 6.5 12 13 4.5" class="ck" /></svg>{{ n }}
            </span>
          </template>
          <template v-else>
            <span class="hc-label"><i class="hc-chip" />代码审查</span>
            <span class="hc-diff del">- if (user) save()</span>
            <span class="hc-diff add">+ if (user?.id) save(user)</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hc {
  --mx: 0;
  --my: 0;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 380px;
}
.hc-slot {
  position: absolute;
  transform: translate(calc(var(--mx) * var(--d) * 16px), calc(var(--my) * var(--d) * 12px));
  transition: transform 0.6s var(--ease-out);
  animation: hc-in 0.6s var(--ease-spring) calc(0.15s + var(--n) * 70ms) backwards;
}
.hc-float {
  animation: hc-float var(--t) ease-in-out calc(var(--n) * -1.3s) infinite alternate;
}
@keyframes hc-in {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.94);
  }
}
@keyframes hc-float {
  from {
    transform: translateY(-5px) rotate(-0.6deg);
  }
  to {
    transform: translateY(6px) rotate(0.6deg);
  }
}

.hc-card {
  display: grid;
  gap: 8px;
  min-width: 168px;
  padding: 12px 14px 13px;
  border-radius: 14px;
  background: var(--raised);
  border: 1px solid var(--rule);
  box-shadow:
    0 1px 2px oklch(0.2 0.02 250 / 0.08),
    0 14px 28px -14px oklch(0.2 0.03 250 / 0.3);
  font-size: 13px;
  color: var(--ink);
}
:root.dark .hc-card {
  box-shadow:
    0 1px 2px oklch(0 0 0 / 0.4),
    0 16px 30px -14px oklch(0 0 0 / 0.7);
}
.hc-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 650;
  color: var(--ink-2);
}
.hc-chip {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: var(--mod);
}
.hc-svg {
  width: 150px;
  height: 46px;
}
.ln {
  fill: none;
  stroke: var(--ink-3);
  stroke-width: 2.5;
  stroke-linecap: round;
}
.ln.acc {
  stroke: var(--mod);
}
.nd {
  fill: var(--raised);
  stroke: var(--ink-3);
  stroke-width: 2.5;
}
.nd.acc {
  stroke: var(--mod);
}
.hc-mono {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-2);
}
.hc-mono b {
  color: var(--mod);
  font-weight: 700;
}
.hc-status {
  justify-self: start;
  padding: 1px 8px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 650;
  color: var(--on-start);
  background: var(--mod-start);
}
.hc-text {
  font-size: 13px;
}
.hc-text.dim {
  color: var(--ink-2);
}
.hc-caret {
  display: inline-block;
  width: 2px;
  height: 14px;
  margin-left: 2px;
  vertical-align: -2px;
  background: var(--mod);
  animation: hc-blink 1s steps(1) 0.8s 4;
}
@keyframes hc-blink {
  50% {
    opacity: 0;
  }
}
.hc-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hc-switch {
  position: relative;
  width: 40px;
  height: 24px;
  border-radius: 12px;
  background: var(--mod);
}
.hc-switch i {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--on-mod);
  animation: hc-knob 3.2s var(--ease-spring) infinite;
}
@keyframes hc-knob {
  0%,
  40% {
    transform: translateX(0);
  }
  50%,
  90% {
    transform: translateX(16px);
  }
}
.hc-btn {
  padding: 4px 14px;
  border-radius: 8px;
  background: var(--ink);
  color: var(--paper);
  font-size: 12.5px;
  font-weight: 650;
}
.hc-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ink-2);
}
.ck {
  fill: none;
  stroke: var(--mod-start);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.hc-diff {
  font-family: var(--font-mono);
  font-size: 11.5px;
  padding: 2px 6px;
  border-radius: 5px;
}
.hc-diff.del {
  background: color-mix(in oklab, var(--danger) 12%, transparent);
}
.hc-diff.add {
  background: color-mix(in oklab, var(--mod-start) 14%, transparent);
}

@media (max-width: 959px) {
  .hc {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    min-height: 0;
  }
  .hc-slot {
    position: static;
    transform: none;
  }
  .hc-card {
    min-width: 0;
    height: 100%;
  }
  .k-diff,
  .k-test {
    display: none;
  }
  .hc-svg {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hc-slot {
    animation: hc-fade 0.4s linear backwards;
    transform: none;
  }
  .hc-float,
  .hc-switch i,
  .hc-caret {
    animation: none;
  }
}
@keyframes hc-fade {
  from {
    opacity: 0;
  }
}
</style>
