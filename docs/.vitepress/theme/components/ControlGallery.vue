<script setup lang="ts">
import { withBase } from 'vitepress'

const ready = [
  { key: 'button', name: '按钮', en: 'Button', desc: '按下反馈、加载与禁用状态' },
  { key: 'switch', name: '开关', en: 'Switch', desc: '即时生效的二元设置' },
  { key: 'modal', name: '弹窗', en: 'Modal / Sheet', desc: '底部弹窗与确认对话框' },
  { key: 'list', name: '列表', en: 'List', desc: '下拉刷新与滑动删除' },
  { key: 'tabbar', name: '标签栏', en: 'TabBar', desc: '应用一级导航切换' },
]

const planned = [
  ['输入框', 'Input'],
  ['轻提示', 'Toast'],
  ['加载指示器', 'Loading'],
  ['导航栏', 'NavBar'],
  ['选择器', 'Picker'],
  ['滑块', 'Slider'],
  ['复选框与单选', 'Checkbox / Radio'],
  ['分段控件', 'Segmented'],
  ['进度条', 'Progress'],
  ['搜索栏', 'SearchBar'],
]
</script>

<template>
  <div class="gc">
    <ul class="gc-grid" aria-label="已完成演示的控件">
      <li v-for="c in ready" :key="c.key">
        <a class="gc-card" :href="withBase(`/frontend/ui#${c.key}`)">
          <span class="gc-thumb" :class="`t-${c.key}`" aria-hidden="true">
            <template v-if="c.key === 'button'">
              <i class="b-field" /><i class="b-field short" />
              <i class="b-btn anim" />
            </template>
            <template v-else-if="c.key === 'switch'">
              <i v-for="n in 3" :key="n" class="s-row"><i class="s-label" /><i class="s-track" :class="{ anim: n === 2 }"><i class="s-fill" /><i class="s-thumb" /></i></i>
            </template>
            <template v-else-if="c.key === 'modal'">
              <i class="m-doc" />
              <i class="m-shade anim" />
              <i class="m-sheet anim"><i class="m-grab" /><i class="m-opt" /><i class="m-opt" /></i>
            </template>
            <template v-else-if="c.key === 'list'">
              <i class="l-spin anim" />
              <i class="l-rows anim"><i v-for="n in 4" :key="n" class="l-row"><i class="l-av" /><i class="l-line" /></i></i>
            </template>
            <template v-else>
              <i class="tb-page" />
              <i class="tb-bar"><i class="tb-pill anim" /><i v-for="n in 4" :key="n" class="tb-dot" /></i>
            </template>
          </span>
          <span class="gc-meta">
            <span class="gc-name">{{ c.name }} <span class="gc-en">{{ c.en }}</span></span>
            <span class="gc-desc">{{ c.desc }}</span>
          </span>
        </a>
      </li>
    </ul>

    <h3 class="gc-sub">待补充</h3>
    <ul class="gc-todo">
      <li v-for="p in planned" :key="p[0]">
        <span class="gc-todo-dot" aria-hidden="true" />{{ p[0] }} <span class="gc-en">{{ p[1] }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.gc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.gc-grid li {
  margin: 0 !important;
}
.gc-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--rule);
  border-radius: 14px;
  background: var(--raised);
  color: var(--ink) !important;
  text-decoration: none !important;
  overflow: hidden;
  transition: transform 0.25s var(--ease-out);
}
.gc-card:hover,
.gc-card:focus-visible {
  border-color: var(--rule-strong);
  box-shadow: var(--shadow-1);
  transform: translateY(-2px);
}
.gc-meta {
  display: grid;
  gap: 2px;
  padding: 12px 14px 14px;
}
.gc-name {
  font-size: 15.5px;
  font-weight: 700;
}
.gc-en {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink-3);
}
.gc-desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--ink-2);
}

/* 缩略图：默认暂停，悬停或聚焦时播放 */
.gc-thumb {
  --a: var(--line-frontend);
  position: relative;
  display: block;
  height: 132px;
  overflow: hidden;
  background:
    radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--ink) 8%, transparent) 1px, transparent 1.5px) 0 0 / 14px 14px,
    var(--paper-2);
  border-bottom: 1px solid var(--rule);
}
.gc-thumb i {
  display: block;
  font-style: normal;
}
.gc-thumb .anim {
  animation-duration: 2.4s;
  animation-iteration-count: infinite;
  animation-timing-function: var(--ease-out);
  animation-play-state: paused;
}
.gc-card:hover .anim,
.gc-card:focus-visible .anim {
  animation-play-state: running;
}

/* 按钮 */
.t-button {
  padding: 22px 28px 0;
}
.b-field {
  height: 14px;
  margin-bottom: 8px;
  border-radius: 5px;
  background: var(--paper-3);
}
.b-field.short {
  width: 60%;
}
.b-btn {
  height: 30px;
  margin-top: 16px;
  border-radius: 9px;
  background: var(--a);
  animation-name: press;
}
@keyframes press {
  0%, 30%, 100% { transform: scale(1); }
  38% { transform: scale(0.93); }
  50% { transform: scale(1); }
}

/* 开关 */
.t-switch {
  padding: 20px 26px;
  display: grid !important;
  gap: 12px;
}
.s-row {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
}
.s-label {
  width: 52%;
  height: 10px;
  border-radius: 5px;
  background: var(--paper-3);
}
.s-track {
  position: relative;
  width: 34px;
  height: 20px;
  border-radius: 10px;
  background: var(--rule-strong);
}
.s-fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--line-start);
  opacity: 0;
}
.s-row:first-child .s-fill {
  opacity: 1;
}
.s-row:first-child .s-thumb {
  transform: translateX(14px);
}
.s-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.25);
}
.s-track.anim .s-fill {
  animation: track 2.4s var(--ease-out) infinite paused;
}
.gc-card:hover .s-track.anim .s-fill,
.gc-card:focus-visible .s-track.anim .s-fill {
  animation-play-state: running;
}
.s-track.anim .s-thumb {
  animation: knob 2.4s var(--ease-out) infinite paused;
}
.gc-card:hover .s-track.anim .s-thumb,
.gc-card:focus-visible .s-track.anim .s-thumb {
  animation-play-state: running;
}
@keyframes track {
  0%, 25% { opacity: 0; }
  40%, 75% { opacity: 1; }
  90%, 100% { opacity: 0; }
}
@keyframes knob {
  0%, 25% { transform: translateX(0); }
  40%, 75% { transform: translateX(14px); }
  90%, 100% { transform: translateX(0); }
}

/* 弹窗 */
.m-doc {
  position: absolute;
  inset: 18px 26px auto;
  height: 46px;
  border-radius: 8px;
  background: var(--paper-3);
}
.m-shade {
  position: absolute;
  inset: 0;
  background: oklch(0.15 0.02 250 / 0.35);
  opacity: 0;
  animation-name: shade;
}
.m-sheet {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 6px;
  height: 70px;
  padding: 6px 12px;
  border-radius: 12px;
  background: var(--raised);
  transform: translateY(110%);
  animation-name: sheet;
}
.m-grab {
  width: 22px;
  height: 3px;
  margin: 0 auto 8px;
  border-radius: 2px;
  background: var(--rule-strong);
}
.m-opt {
  height: 10px;
  margin-bottom: 7px;
  border-radius: 5px;
  background: var(--paper-3);
}
@keyframes sheet {
  0%, 15% { transform: translateY(110%); }
  35%, 75% { transform: translateY(0); }
  92%, 100% { transform: translateY(110%); }
}
@keyframes shade {
  0%, 15% { opacity: 0; }
  35%, 75% { opacity: 1; }
  92%, 100% { opacity: 0; }
}

/* 列表 */
.l-spin {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border-radius: 50%;
  border: 2px solid var(--a);
  border-right-color: transparent;
  opacity: 0;
  animation-name: lspin;
}
.l-rows {
  padding: 12px 22px 0;
  animation-name: lpull;
}
.l-row {
  display: flex !important;
  align-items: center;
  gap: 8px;
  height: 26px;
}
.l-av {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: color-mix(in oklab, var(--a) 30%, var(--paper-3));
}
.l-line {
  flex: 1;
  height: 9px;
  border-radius: 5px;
  background: var(--paper-3);
}
@keyframes lpull {
  0%, 10% { transform: translateY(0); }
  30%, 60% { transform: translateY(24px); }
  80%, 100% { transform: translateY(0); }
}
@keyframes lspin {
  0%, 15% { opacity: 0; transform: rotate(0); }
  30% { opacity: 1; }
  60% { opacity: 1; transform: rotate(540deg); }
  75%, 100% { opacity: 0; transform: rotate(720deg); }
}

/* 标签栏 */
.tb-page {
  position: absolute;
  inset: 16px 22px 50px;
  border-radius: 8px;
  background: var(--paper-3);
}
.tb-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 38px;
  display: grid !important;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  justify-items: center;
  padding: 0 10px;
  background: var(--raised);
  border-top: 1px solid var(--rule);
}
.tb-dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: var(--rule-strong);
}
.tb-pill {
  position: absolute;
  left: 10px;
  top: 7px;
  width: calc((100% - 20px) / 4);
  height: 24px;
  border-radius: 12px;
  background: color-mix(in oklab, var(--a) 22%, transparent);
  animation-name: pill;
}
@keyframes pill {
  0%, 20% { transform: translateX(0); }
  30%, 45% { transform: translateX(100%); }
  55%, 70% { transform: translateX(200%); }
  80%, 100% { transform: translateX(0); }
}

/* 待补充清单 */
.gc-sub {
  margin: 36px 0 10px !important;
  font-size: 16px !important;
}
.gc-todo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.gc-todo li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 !important;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px dashed var(--rule-strong);
  font-size: 13.5px;
  color: var(--ink-2);
}
.gc-todo-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 2px solid var(--ink-3);
}

@media (prefers-reduced-motion: reduce) {
  .gc-thumb .anim,
  .gc-thumb .anim * {
    animation: none !important;
  }
}
</style>
