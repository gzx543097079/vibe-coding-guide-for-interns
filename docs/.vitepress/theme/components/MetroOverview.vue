<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { lines, transfers, totalStations, stationCode, transfersOf, type Line, type Station } from '../data/metro'

// 版式参数：列宽、行高与每条线路的起始列（换乘站上下对齐）
const X0 = 214
const STEP = 77
const Y0 = 58
const ROW = 60
const W = 1110
const H = 448
const startCol: Record<string, number> = {
  start: 0,
  git: 3,
  frontend: 0,
  cross: 2,
  backend: 0,
  quality: 1,
  growth: 2,
}

interface Pt {
  x: number
  y: number
}

const pos = new Map<string, Pt>()
lines.forEach((line, row) => {
  line.stations.forEach((st, i) => {
    pos.set(st.id, { x: X0 + (startCol[line.id] + i) * STEP, y: Y0 + row * ROW })
  })
})

const geo = lines.map((line, row) => {
  const y = Y0 + row * ROW
  const first = pos.get(line.stations[0].id)!
  const last = pos.get(line.stations[line.stations.length - 1].id)!
  const badgeX = first.x - 46
  return { line, y, badgeX, x1: badgeX, x2: last.x + 18 }
})

const xferIds = new Set(transfers.flatMap((t) => [t.a, t.b]))
// 换乘通道下端的站点，站名放到线路下方，避开通道
const lowerEnds = new Set(transfers.map((t) => (pos.get(t.a)!.y > pos.get(t.b)!.y ? t.a : t.b)))
const labelY = (id: string) => (lowerEnds.has(id) ? pos.get(id)!.y + 27 : pos.get(id)!.y - 17)
const links = transfers.map((t) => {
  const a = pos.get(t.a)!
  const b = pos.get(t.b)!
  return { key: `${t.a}-${t.b}`, x: a.x, y1: Math.min(a.y, b.y), y2: Math.max(a.y, b.y) }
})

// 悬停或聚焦的站点
const active = ref<{ line: Line; station: Station; index: number } | null>(null)
const activeLine = ref<string | null>(null)

function enter(line: Line, station: Station, index: number) {
  active.value = { line, station, index }
  activeLine.value = line.id
}
function enterLine(line: Line) {
  activeLine.value = line.id
  active.value = null
}
function leave() {
  active.value = null
  activeLine.value = null
}

const activeXfers = computed(() => (active.value ? transfersOf(active.value.station.id) : []))
const activeLineObj = computed(() => lines.find((l) => l.id === activeLine.value) ?? null)

function label(line: Line, st: Station, i: number) {
  return `${line.no} 号线 ${line.name} 第 ${i + 1} 站：${st.title}`
}

// 竖排列表中每站的小圆点
const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`
</script>

<template>
  <div class="mo" :class="{ dim: activeLine }">
    <!-- 宽屏：线路总览图 -->
    <div class="mo-wide" @mouseleave="leave">
      <svg
        class="mo-svg"
        :viewBox="`0 0 ${W} ${H}`"
        aria-labelledby="mo-title mo-desc"
        @focusout="leave"
      >
        <title id="mo-title">学习线路总览图</title>
        <desc id="mo-desc">共 {{ lines.length }} 条线路、{{ totalStations }} 个站点，每个站点对应一章，可用 Tab 键逐站浏览。</desc>

        <!-- 线路 -->
        <g
          v-for="(g, gi) in geo"
          :key="g.line.id"
          class="mo-route"
          :class="{ on: activeLine === g.line.id }"
          :data-line="g.line.id"
        >
          <path
            class="mo-path"
            :d="`M ${g.x1} ${g.y} H ${g.x2}`"
            pathLength="1"
            :style="{ animationDelay: `${gi * 70}ms` }"
          />
          <a
            class="mo-term"
            :href="`#line-${g.line.id}`"
            :aria-label="`${g.line.no} 号线 ${g.line.name}，共 ${g.line.stations.length} 站，查看本线详情`"
            @mouseenter="enterLine(g.line)"
            @focus="enterLine(g.line)"
          >
            <rect class="mo-focus" :x="g.badgeX - 17" :y="g.y - 17" width="34" height="34" rx="11" />
            <rect class="mo-badge" :x="g.badgeX - 13" :y="g.y - 13" width="26" height="26" rx="8" />
            <text class="mo-badge-no" :x="g.badgeX" :y="g.y + 0.5">{{ g.line.no }}</text>
            <text class="mo-name" :x="g.badgeX - 24" :y="g.y - 3">{{ g.line.name }}</text>
            <text class="mo-count" :x="g.badgeX - 24" :y="g.y + 14">{{ g.line.stations.length }} 站</text>
          </a>
        </g>

        <!-- 换乘通道 -->
        <g class="mo-links" aria-hidden="true">
          <rect
            v-for="l in links"
            :key="l.key"
            class="mo-link"
            :x="l.x - 8"
            :y="l.y1 - 8"
            width="16"
            :height="l.y2 - l.y1 + 16"
            rx="8"
          />
        </g>

        <!-- 站点 -->
        <g
          v-for="g in geo"
          :key="`st-${g.line.id}`"
          class="mo-stops"
          :class="{ on: activeLine === g.line.id }"
          :data-line="g.line.id"
        >
          <a
            v-for="(st, i) in g.line.stations"
            :key="st.id"
            class="mo-stop"
            :class="{ xfer: xferIds.has(st.id), cur: active?.station.id === st.id }"
            :href="withBase(st.link)"
            :aria-label="label(g.line, st, i)"
            @mouseenter="enter(g.line, st, i)"
            @focus="enter(g.line, st, i)"
          >
            <circle class="mo-hit" :cx="pos.get(st.id)!.x" :cy="pos.get(st.id)!.y" r="15" />
            <circle class="mo-ring-focus" :cx="pos.get(st.id)!.x" :cy="pos.get(st.id)!.y" r="15" />
            <template v-if="xferIds.has(st.id)">
              <circle class="mo-x-outer" :cx="pos.get(st.id)!.x" :cy="pos.get(st.id)!.y" r="9.5" />
              <circle class="mo-x-inner" :cx="pos.get(st.id)!.x" :cy="pos.get(st.id)!.y" r="4" />
            </template>
            <circle v-else class="mo-dot" :cx="pos.get(st.id)!.x" :cy="pos.get(st.id)!.y" r="6.5" />
          </a>
          <text
            v-for="st in g.line.stations"
            :key="`lb-${st.id}`"
            class="mo-label"
            :x="pos.get(st.id)!.x"
            :y="labelY(st.id)"
            aria-hidden="true"
          >{{ st.short }}</text>
        </g>
      </svg>

      <!-- 站牌：显示悬停站点的信息 -->
      <div class="mo-panel" aria-live="polite">
        <template v-if="active">
          <div class="mo-p-head" :data-line="active.line.id">
            <span class="mo-p-badge">{{ active.line.no }}</span>
            <span class="mo-p-line">{{ active.line.name }}</span>
            <span class="mo-p-code">{{ stationCode({ line: active.line, index: active.index }) }}</span>
          </div>
          <p class="mo-p-title">{{ active.station.title }}</p>
          <p class="mo-p-sum">{{ active.station.summary }}</p>
          <p v-if="activeXfers.length" class="mo-p-x">
            换乘
            <span v-for="x in activeXfers" :key="x.ref.station.id" :data-line="x.ref.line.id">
              <i class="mo-p-chip">{{ x.ref.line.no }}</i>{{ x.ref.station.title }}
            </span>
          </p>
        </template>
        <template v-else-if="activeLineObj">
          <div class="mo-p-head" :data-line="activeLineObj.id">
            <span class="mo-p-badge">{{ activeLineObj.no }}</span>
            <span class="mo-p-line">{{ activeLineObj.name }}</span>
            <span class="mo-p-code">{{ activeLineObj.stations.length }} 站</span>
          </div>
          <p class="mo-p-sum">{{ activeLineObj.intro }}</p>
        </template>
        <template v-else>
          <p class="mo-p-title">把光标移到站点上</p>
          <p class="mo-p-sum">每个站点是一章。悬停或用 Tab 键聚焦查看要点，点击进站阅读。</p>
          <div class="mo-legend" aria-hidden="true">
            <span><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="5.5" class="lg-dot" /></svg>站点</span>
            <span><svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" class="lg-x" /><circle cx="10" cy="10" r="3" class="lg-x" /></svg>换乘站</span>
          </div>
        </template>
      </div>
    </div>

    <!-- 窄屏：竖向线路列表 -->
    <ol class="mo-narrow" aria-label="线路总览">
      <li v-for="line in lines" :key="line.id" :data-line="line.id">
        <a :href="`#line-${line.id}`" class="mo-n-row">
          <span class="mo-n-badge" aria-hidden="true">{{ line.no }}</span>
          <span class="mo-n-text">
            <span class="mo-n-name">{{ line.no }} 号线 · {{ line.name }}</span>
            <span class="mo-n-count">{{ line.stations.length }} 站</span>
          </span>
          <span class="mo-n-track" aria-hidden="true">
            <i
              v-for="(st, i) in line.stations"
              :key="st.id"
              :class="{ x: xferIds.has(st.id) }"
              :style="{ left: pct(i, Math.max(line.stations.length - 1, 1)) }"
            />
          </span>
        </a>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.mo {
  position: relative;
}

/* ---------- 宽屏 SVG ---------- */
.mo-wide {
  position: relative;
}
.mo-svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.mo-path {
  fill: none;
  stroke: var(--line);
  stroke-width: 9;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1.1s var(--ease-out) forwards;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
.mo-route,
.mo-stops {
  transition: opacity 0.3s var(--ease-out);
}
.mo.dim .mo-route:not(.on),
.mo.dim .mo-stops:not(.on) {
  opacity: 0.22;
}
.mo-stops,
.mo-links {
  animation: fade 0.5s var(--ease-out) 0.55s backwards;
}
@keyframes fade {
  from {
    opacity: 0;
  }
}

.mo-term {
  cursor: pointer;
  outline: none;
}
.mo-badge {
  fill: var(--line);
}
.mo-badge-no {
  fill: var(--on-line);
  font-size: 14px;
  font-weight: 750;
  text-anchor: middle;
  dominant-baseline: central;
  font-variant-numeric: tabular-nums;
}
.mo-name {
  fill: var(--ink);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  letter-spacing: 0.01em;
}
.mo-count {
  fill: var(--ink-3);
  font-size: 12px;
  text-anchor: end;
  font-variant-numeric: tabular-nums;
}
.mo-focus {
  fill: none;
  stroke: var(--focus);
  stroke-width: 2.5;
  opacity: 0;
}
.mo-term:focus-visible .mo-focus {
  opacity: 1;
}

.mo-link {
  fill: var(--station-fill);
  stroke: var(--ink);
  stroke-width: 2.5;
}
.mo.dim .mo-links {
  opacity: 0.35;
  transition: opacity 0.3s;
}

.mo-label {
  fill: var(--ink);
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  paint-order: stroke;
  stroke: var(--paper);
  stroke-width: 4px;
  stroke-linejoin: round;
  opacity: 0;
  transform: translateY(3px);
  transition: opacity 0.25s var(--ease-out), transform 0.3s var(--ease-out);
  pointer-events: none;
}
.mo-stops.on .mo-label {
  opacity: 1;
  transform: none;
}
.mo-stop {
  cursor: pointer;
  outline: none;
}
.mo-hit {
  fill: transparent;
}
.mo-dot {
  fill: var(--station-fill);
  stroke: var(--line);
  stroke-width: 3.5;
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.25s var(--ease-out);
}
.mo-x-outer {
  fill: var(--station-fill);
  stroke: var(--ink);
  stroke-width: 2.5;
}
.mo-x-inner {
  fill: none;
  stroke: var(--ink);
  stroke-width: 2;
}
.mo-ring-focus {
  fill: none;
  stroke: var(--focus);
  stroke-width: 2.5;
  opacity: 0;
}
.mo-stop:focus-visible .mo-ring-focus {
  opacity: 1;
}
.mo-stop:hover .mo-dot,
.mo-stop.cur .mo-dot {
  transform: scale(1.35);
  fill: var(--line);
}

/* 站牌 */
.mo-panel {
  position: absolute;
  left: 67.5%;
  top: 2%;
  width: 31%;
  min-height: 0;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--raised);
  border: 1px solid var(--rule);
  box-shadow: var(--shadow-1);
  font-size: 13.5px;
  line-height: 1.6;
}
.mo-p-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.mo-p-badge,
.mo-p-chip {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: var(--line);
  color: var(--on-line);
  font-size: 12px;
  font-style: normal;
  font-weight: 750;
}
.mo-p-chip {
  width: 17px;
  height: 17px;
  font-size: 11px;
  margin-right: 4px;
  border-radius: 5px;
}
.mo-p-line {
  font-weight: 650;
  color: var(--ink);
}
.mo-p-code {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
}
.mo-p-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}
.mo-p-sum {
  margin: 2px 0 0;
  color: var(--ink-2);
}
.mo-p-x {
  margin: 8px 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  color: var(--ink-3);
  font-size: 12.5px;
}
.mo-p-x span {
  display: inline-flex;
  align-items: center;
  color: var(--ink);
}
.mo-legend {
  display: flex;
  gap: 18px;
  margin-top: 10px;
  color: var(--ink-3);
  font-size: 12.5px;
}
.mo-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.lg-dot {
  fill: var(--station-fill);
  stroke: var(--ink-2);
  stroke-width: 3;
}
.lg-x {
  fill: none;
  stroke: var(--ink);
  stroke-width: 2;
}

/* ---------- 窄屏列表 ---------- */
.mo-narrow {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
}
.mo-narrow li + li {
  border-top: 1px solid var(--rule);
}
.mo-n-row {
  display: grid;
  grid-template-columns: 30px 1fr;
  grid-template-areas:
    'badge text'
    'badge track';
  gap: 6px 14px;
  align-items: center;
  padding: 14px 4px;
  color: var(--ink);
  text-decoration: none;
}
.mo-n-badge {
  grid-area: badge;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--line);
  color: var(--on-line);
  font-weight: 750;
  font-variant-numeric: tabular-nums;
}
.mo-n-text {
  grid-area: text;
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.mo-n-name {
  font-weight: 650;
  font-size: 15.5px;
}
.mo-n-count {
  margin-left: auto;
  color: var(--ink-3);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.mo-n-track {
  grid-area: track;
  position: relative;
  height: 14px;
  margin: 0 7px;
}
.mo-n-track::before {
  content: '';
  position: absolute;
  left: -7px;
  right: -7px;
  top: 5px;
  height: 4px;
  border-radius: 4px;
  background: var(--line);
}
.mo-n-track i {
  position: absolute;
  top: 1px;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  border-radius: 50%;
  background: var(--station-fill);
  border: 2.5px solid var(--line);
}
.mo-n-track i.x {
  border-color: var(--ink);
}

@media (max-width: 1023px) {
  .mo-wide {
    display: none;
  }
  .mo-narrow {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mo-path {
    animation: none;
    stroke-dashoffset: 0;
  }
  .mo-stops,
  .mo-links {
    animation: none;
  }
}
</style>
