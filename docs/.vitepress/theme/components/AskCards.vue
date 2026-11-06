<script setup lang="ts">
import { ref } from 'vue'

const items = [
  {
    q: '必须先懂什么',
    a: '这个方向最少要懂的概念和工具。没有这些底子，你判断不了 AI 给的答案对不对。',
    eg: '比如做接口前，先弄懂 HTTP 状态码和鉴权。',
    d: 'M12 4v16M4 12h16',
  },
  {
    q: '怎么验证',
    a: '跑起来、写测试、对照官方文档。用别人也能重复的办法确认结果，别只看「好像没报错」。',
    eg: '比如改完样式，在手机宽度和深色模式下都看一遍。',
    d: 'M5 12.5l4.5 4.5L19 7.5',
  },
  {
    q: 'AI 常错在哪',
    a: '这个方向上 AI 容易出错的地方，以及你应该在哪一步停下来自己检查。',
    eg: '比如调用了不存在的 API，或者用了你项目里没有的版本写法。',
    d: 'M12 7v6M12 17h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z',
  },
]
const open = ref<boolean[]>([false, false, false])
const toggle = (i: number) => (open.value[i] = !open.value[i])
</script>

<template>
  <ol class="ak-list">
    <li v-for="(it, i) in items" :key="it.q" class="ak" :class="{ flipped: open[i] }" data-reveal>
      <div class="ak-inner">
        <div class="ak-face ak-front" :aria-hidden="open[i]">
          <div class="ak-row">
            <h3 class="ak-q">{{ it.q }}</h3>
            <span class="ak-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22"><path :d="it.d" /></svg>
            </span>
          </div>
          <p class="ak-hint">{{ it.a }}</p>
        </div>
        <div :id="`ak-back-${i}`" class="ak-face ak-back" :aria-hidden="!open[i]" :inert="!open[i] || undefined">
          <p class="ak-eg-label">举个例子</p>
          <p class="ak-eg">{{ it.eg }}</p>
        </div>
      </div>
      <button
        type="button"
        class="ak-btn"
        :aria-expanded="open[i]"
        :aria-controls="`ak-back-${i}`"
        @click="toggle(i)"
      >
        {{ open[i] ? '收起例子' : '看个例子' }}
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4M3.6 1.6 4.2 4.4 1.5 4.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </li>
  </ol>
</template>

<style scoped>
.ak-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin: 32px 0 0;
  padding: 0;
  list-style: none;
  counter-reset: ak;
}
.ak {
  position: relative;
  display: flex;
  flex-direction: column;
}
.ak-inner {
  position: relative;
  flex: 1;
  min-height: 210px;
}
.ak-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 22px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  border: 1px solid var(--rule);
  border-bottom: 0;
  transition: opacity var(--dur-3) var(--ease), transform var(--dur-3) var(--ease);
}
.ak.flipped .ak-front {
  opacity: 0;
  transform: translateY(-6px);
}
.ak-front {
  background: var(--raised);
}
.ak-back {
  background: var(--paper-3);
  color: var(--ink);
  justify-content: center;
  opacity: 0;
  transform: translateY(6px);
}
.ak.flipped .ak-back {
  opacity: 1;
  transform: none;
}
.ak-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.ak-ico {
  flex: none;
  color: var(--ink-3);
}
.ak-ico path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ak-q {
  margin: 0 !important;
  font-family: var(--font-serif);
  font-size: 23px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.ak-hint {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ink-2);
}
.ak-eg-label {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 650;
  opacity: 0.8;
}
.ak-eg {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.7;
  font-weight: 550;
}
.ak-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  border: 1px solid var(--rule);
  background: var(--paper-2);
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
}
.ak-btn:hover {
  background: var(--paper-3);
}
.ak-btn svg {
  transition: transform var(--dur-3) var(--ease);
}
.ak.flipped .ak-btn svg {
  transform: rotate(-180deg);
}

@container home (max-width: 759px) {
  .ak-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .ak-inner {
    min-height: 160px;
  }
}

/* 减少动态效果：只保留淡入淡出 */
@media (prefers-reduced-motion: reduce) {
  .ak-face,
  .ak.flipped .ak-front,
  .ak.flipped .ak-back {
    transform: none;
  }
}
</style>
