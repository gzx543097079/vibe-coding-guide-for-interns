<script setup lang="ts">
// 模块插画：统一 2.5 线宽，play 为 true 时播放内部小动画
defineProps<{ id: string; play?: boolean }>()
</script>

<template>
  <svg class="mi" :class="[`mi-${id}`, { on: play }]" viewBox="0 0 120 84" aria-hidden="true">
    <!-- 起步：终端窗口 -->
    <g v-if="id === 'start'">
      <rect x="10" y="10" width="100" height="64" rx="10" class="s" />
      <path d="M10 26h100" class="s" />
      <circle cx="20" cy="18" r="2.5" class="f" /><circle cx="29" cy="18" r="2.5" class="f" /><circle cx="38" cy="18" r="2.5" class="f" />
      <path d="M22 40l8 6-8 6" class="s" />
      <path d="M36 52h40" class="s type" pathLength="1" />
      <rect x="80" y="44" width="6" height="12" rx="1.5" class="f caret" />
    </g>

    <!-- AI 与 Agent：芯片与闪光 -->
    <g v-else-if="id === 'ai'">
      <rect x="34" y="16" width="52" height="52" rx="12" class="s" />
      <path d="M48 8v8M60 8v8M72 8v8M48 68v8M60 68v8M72 68v8M26 30h8M26 42h8M26 54h8M86 30h8M86 42h8M86 54h8" class="s" />
      <path d="M60 28l3.6 9.4L73 41l-9.4 3.6L60 54l-3.6-9.4L47 41l9.4-3.6z" class="f pop" />
    </g>

    <!-- Git：分支线 -->
    <g v-else-if="id === 'git'">
      <path d="M18 62H102" class="s" />
      <path d="M36 62c0-22 14-30 30-30h18" class="s grow" pathLength="1" />
      <circle cx="18" cy="62" r="6" class="dot" />
      <circle cx="36" cy="62" r="6" class="dot" />
      <circle cx="102" cy="62" r="6" class="dot" />
      <circle cx="84" cy="32" r="6" class="dot pop" />
    </g>

    <!-- 前端与客户端：开关与按钮 -->
    <g v-else-if="id === 'frontend'">
      <rect x="14" y="14" width="56" height="30" rx="15" class="s" />
      <rect x="14" y="14" width="56" height="30" rx="15" class="f track" />
      <circle cx="29" cy="29" r="10" class="knob" />
      <rect x="14" y="54" width="92" height="18" rx="9" class="s" />
      <path d="M78 22h28M78 34h18" class="s" />
    </g>

    <!-- UI 控件与提示词：手机里的心形与网页里的滑块 -->
    <g v-else-if="id === 'controls'">
      <rect x="14" y="8" width="40" height="68" rx="9" class="s" />
      <path d="M29 16h10" class="s" />
      <path d="M34 54c-7-4.6-11-8.4-11-12.6a5.4 5.4 0 0 1 11-1.8 5.4 5.4 0 0 1 11 1.8c0 4.2-4 8-11 12.6z" class="f pop" />
      <rect x="62" y="20" width="48" height="42" rx="7" class="s" />
      <path d="M62 31h48M70 47h32" class="s" />
      <circle cx="74" cy="47" r="5" class="knob" />
    </g>

    <!-- 大前端 / 跨端：多设备 -->
    <g v-else-if="id === 'cross'">
      <g class="dev-a">
        <rect x="12" y="16" width="62" height="44" rx="6" class="s" />
        <path d="M30 70h26" class="s" />
      </g>
      <g class="dev-b">
        <rect x="80" y="12" width="28" height="52" rx="7" class="s" />
        <path d="M90 56h8" class="s" />
      </g>
      <path d="M44 38h16m-5-5 5 5-5 5" class="s sync" />
    </g>

    <!-- 后端与数据：数据库与数据流 -->
    <g v-else-if="id === 'backend'">
      <ellipse cx="34" cy="20" rx="20" ry="7" class="s" />
      <path d="M14 20v40c0 4 9 7 20 7s20-3 20-7V20M14 40c0 4 9 7 20 7s20-3 20-7" class="s" />
      <path d="M62 42h44" class="s dash" />
      <circle cx="66" cy="42" r="4" class="f pulse p1" />
      <circle cx="66" cy="42" r="4" class="f pulse p2" />
      <rect x="92" y="28" width="18" height="28" rx="4" class="s" />
    </g>

    <!-- 质量与交付：检查清单 -->
    <g v-else-if="id === 'quality'">
      <rect x="22" y="8" width="76" height="70" rx="9" class="s" />
      <path d="M36 28l5 5 9-9" class="s chk c1" pathLength="1" />
      <path d="M36 46l5 5 9-9" class="s chk c2" pathLength="1" />
      <path d="M36 64l5 5 9-9" class="s chk c3" pathLength="1" />
      <path d="M60 30h26M60 48h26M60 66h18" class="s" />
    </g>

    <!-- 提升：对话气泡与输入光标 -->
    <g v-else>
      <path d="M14 14h92a6 6 0 0 1 6 6v36a6 6 0 0 1-6 6H48l-16 12V62H14a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" class="s" />
      <path d="M24 32h40" class="s type" pathLength="1" />
      <path d="M24 46h24" class="s type t2" pathLength="1" />
      <rect x="52" y="40" width="5" height="12" rx="1.5" class="f caret" />
    </g>
  </svg>
</template>

<style scoped>
.mi {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  color: var(--mod);
}
.s {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.f {
  fill: currentColor;
}
.dot,
.knob {
  fill: var(--raised);
  stroke: currentColor;
  stroke-width: 2.5;
}

/* 动画默认静止，on 时播放 */
.type {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}
.on .type {
  animation: type 1.4s steps(8) both;
}
.on .t2 {
  animation-delay: 0.5s;
}
.caret {
  opacity: 1;
}
.on .caret {
  animation: blink 0.9s steps(1) 3;
}
@keyframes type {
  from {
    stroke-dashoffset: 1;
  }
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.grow {
  stroke-dasharray: 1;
}
.on .grow {
  animation: grow 0.9s var(--ease-out) both;
}
.pop {
  transform-box: fill-box;
  transform-origin: center;
}
.on .pop {
  animation: pop 0.5s var(--ease) 0.7s both;
}
@keyframes grow {
  from {
    stroke-dashoffset: 1;
  }
}
@keyframes pop {
  from {
    transform: scale(0);
  }
}

.track {
  opacity: 0;
  transition: opacity 0.3s var(--ease-out);
}
.knob {
  transition: transform 0.45s var(--ease);
}
.on .track {
  opacity: 0.35;
}
.on .knob {
  transform: translateX(26px);
}
.mi-controls.on .knob {
  transform: translateX(22px);
}

.dev-a,
.dev-b,
.sync {
  transition: transform 0.5s var(--ease);
}
.on .dev-a {
  transform: translateY(4px);
}
.on .dev-b {
  transform: translateY(-4px);
}
.sync {
  transform-box: fill-box;
  transform-origin: center;
}
.on .sync {
  transform: translateX(4px);
}

.dash {
  stroke-dasharray: 3 6;
}
.pulse {
  opacity: 0;
}
.on .pulse {
  animation: flow 1.2s var(--ease-out) infinite;
}
.on .p2 {
  animation-delay: 0.6s;
}
@keyframes flow {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateX(24px);
    opacity: 0;
  }
}

.chk {
  stroke-dasharray: 1;
}
.on .chk {
  animation: grow 0.4s var(--ease-out) both;
}
.on .c2 {
  animation-delay: 0.18s;
}
.on .c3 {
  animation-delay: 0.36s;
}

@media (prefers-reduced-motion: reduce) {
  .on .type,
  .on .grow,
  .on .pop,
  .on .chk,
  .on .caret,
  .on .pulse {
    animation: none;
  }
  .knob,
  .dev-a,
  .dev-b,
  .sync {
    transition: none;
  }
}
</style>
