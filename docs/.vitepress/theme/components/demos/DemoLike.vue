<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useScript } from './useScript'

const props = defineProps<{ play: boolean; frame: 'phone' | 'browser' }>()

const liked = ref(false)
const count = ref(128)
const dir = ref<'up' | 'down'>('up')
// 每次点赞换一个 key，让心形和粒子的动画重新播放
const burst = ref(0)
const unburst = ref(0)
const bigHeart = ref(0)

function toggle() {
  liked.value = !liked.value
  dir.value = liked.value ? 'up' : 'down'
  count.value += liked.value ? 1 : -1
  if (liked.value) burst.value++
  else unburst.value++
}
// 双击图片点赞：只点赞、不取消
function onDouble() {
  bigHeart.value++
  if (!liked.value) toggle()
}

const dots = Array.from({ length: 8 }, (_, i) => i)

useScript(toRef(props, 'play'), [
  [700, () => toggle()],
  [2600, () => onDouble()],
])
</script>

<template>
  <div class="dlk" :class="frame">
    <div class="dlk-bar">动态</div>
    <article class="dlk-post">
      <header class="dlk-head">
        <span class="dlk-avatar" aria-hidden="true">林</span>
        <span class="dlk-who"><b>林夕</b><span>10 分钟前</span></span>
      </header>
      <p class="dlk-text">新版控件演示上线了，双击图片也能点赞。</p>
      <div class="dlk-media" @dblclick="onDouble">
        <svg v-if="bigHeart" :key="bigHeart" class="dlk-big" width="64" height="64" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20.5c-5.3-3.5-8.5-6.6-8.5-10A4.5 4.5 0 0 1 12 7.3a4.5 4.5 0 0 1 8.5 3.2c0 3.4-3.2 6.5-8.5 10z" />
        </svg>
      </div>
      <div class="dlk-actions">
        <button
          type="button"
          class="dlk-like"
          :class="{ on: liked }"
          :aria-pressed="liked"
          :aria-label="`点赞，${count} 人已赞`"
          @click="toggle"
        >
          <span class="dlk-heart-wrap">
            <svg :key="liked ? `on-${burst}` : `off-${unburst}`" class="dlk-heart" :class="liked ? 'pop' : unburst ? 'shrink' : ''" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.5c-5.3-3.5-8.5-6.6-8.5-10A4.5 4.5 0 0 1 12 7.3a4.5 4.5 0 0 1 8.5 3.2c0 3.4-3.2 6.5-8.5 10z" />
            </svg>
            <span v-if="liked && burst" :key="`b-${burst}`" class="dlk-burst" aria-hidden="true">
              <i v-for="d in dots" :key="d" :style="{ '--a': `${d * 45}deg` }" />
            </span>
          </span>
          <span class="dlk-count" aria-hidden="true">
            <Transition :name="`dlk-roll-${dir}`">
              <span :key="count" class="dlk-num">{{ count }}</span>
            </Transition>
          </span>
        </button>
        <span class="dlk-meta">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h15v10h-8l-4 3.5v-3.5h-3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" /></svg>
          24
        </span>
      </div>
    </article>
  </div>
</template>

<style scoped>
.dlk {
  --like: #d93f4c;
  height: 100%;
  font-size: 14px;
}
:root.dark .dlk {
  --like: #ff6b78;
}
.dlk-bar {
  padding: 12px 18px 10px;
  font-size: 17px;
  font-weight: 700;
}
.dlk.browser .dlk-bar {
  font-size: 16px;
  border-bottom: 1px solid var(--app-line);
}
.dlk-post {
  padding: 4px 16px;
}
.dlk.browser .dlk-post {
  max-width: 380px;
  padding: 14px 18px;
}
.dlk-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dlk-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: oklch(0.92 0.05 30);
  color: oklch(0.38 0.12 30);
  font-weight: 700;
}
:root.dark .dlk-avatar {
  background: oklch(0.34 0.06 30);
  color: oklch(0.9 0.08 30);
}
.dlk-who {
  display: grid;
  line-height: 1.3;
}
.dlk-who b {
  font-size: 14px;
}
.dlk-who span {
  font-size: 12px;
  color: var(--app-ink-2);
}
.dlk-text {
  margin: 10px 0 !important;
  font-size: 14px;
  line-height: 1.6;
}
.dlk-media {
  position: relative;
  display: grid;
  place-items: center;
  height: 150px;
  border-radius: 14px;
  background: oklch(0.9 0.04 250);
  user-select: none;
}
:root.dark .dlk-media {
  background: oklch(0.34 0.05 250);
}
.dlk.browser .dlk-media {
  height: 120px;
}
.dlk-big {
  fill: #fff;
  filter: drop-shadow(0 4px 12px rgb(20 20 19 / 0.3));
  animation: dlk-big 700ms var(--ease-out) forwards;
}
.dlk-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}
.dlk-like {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px 0 8px;
  border-radius: 18px;
  color: var(--app-ink-2);
}
.dlk-like:hover {
  background: var(--app-soft);
}
.dlk-like.on {
  color: var(--like);
}
.dlk-heart-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
}
.dlk-heart {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linejoin: round;
}
.dlk-like.on .dlk-heart {
  fill: currentColor;
}
.dlk-heart.pop {
  animation: dlk-pop 450ms var(--ease-out);
}
.dlk-heart.shrink {
  animation: dlk-shrink 200ms var(--ease-out);
}
.dlk-burst {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.dlk-burst i {
  position: absolute;
  left: 8.5px;
  top: 8.5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--like);
  opacity: 0;
  animation: dlk-fly 500ms var(--ease-out) 120ms;
}
.dlk-burst i:nth-child(even) {
  background: var(--app-accent);
}
.dlk-count {
  position: relative;
  display: inline-block;
  height: 20px;
  min-width: 28px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
  text-align: left;
}
.dlk-num {
  display: block;
}
.dlk-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--app-ink-2);
}
.dlk-roll-up-enter-active,
.dlk-roll-up-leave-active,
.dlk-roll-down-enter-active,
.dlk-roll-down-leave-active {
  transition: transform 260ms var(--ease-out), opacity 260ms var(--ease-out);
}
.dlk-roll-up-leave-active,
.dlk-roll-down-leave-active {
  position: absolute;
  left: 0;
  top: 0;
}
.dlk-roll-up-enter-from,
.dlk-roll-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.dlk-roll-up-leave-to,
.dlk-roll-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
@keyframes dlk-pop {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.7);
  }
  60% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes dlk-shrink {
  50% {
    transform: scale(0.85);
  }
}
@keyframes dlk-fly {
  0% {
    opacity: 1;
    transform: rotate(var(--a)) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--a)) translateY(-18px) scale(0.4);
  }
}
@keyframes dlk-big {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  30% {
    opacity: 1;
    transform: scale(1.1);
  }
  45% {
    transform: scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .dlk-burst,
  .dlk-big {
    display: none;
  }
}
</style>
