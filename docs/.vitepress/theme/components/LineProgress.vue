<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { allStations, findStation, stationCode, transfersOf } from '../data/metro'

const { page } = useData()

const here = computed(() => findStation(page.value.relativePath))
const prev = computed(() => (here.value ? allStations[here.value.order - 1] : undefined))
const next = computed(() => (here.value ? allStations[here.value.order + 1] : undefined))
const xfers = computed(() => (here.value ? transfersOf(here.value.station.id) : []))
</script>

<template>
  <nav v-if="here" class="lp" :data-line="here.line.id" aria-label="线路进度">
    <div class="lp-head">
      <span class="lp-badge" aria-hidden="true">{{ here.line.no }}</span>
      <span class="lp-line">{{ here.line.no }} 号线 · {{ here.line.name }}</span>
      <span class="lp-pos">
        第 <b>{{ here.index + 1 }}</b> 站 / 共 {{ here.line.stations.length }} 站
      </span>
    </div>

    <ol class="lp-track" :style="{ '--n': here.line.stations.length }">
      <li
        v-for="(st, i) in here.line.stations"
        :key="st.id"
        :class="{ passed: i < here.index, current: i === here.index }"
      >
        <a
          :href="withBase(st.link)"
          :aria-current="i === here.index ? 'page' : undefined"
          :aria-label="`第 ${i + 1} 站：${st.title}`"
          :title="st.title"
        >
          <span class="dot" />
        </a>
      </li>
    </ol>

    <div class="lp-foot">
      <a v-if="prev" class="lp-step" :href="withBase(prev.station.link)">
        <span class="lp-dir">上一站</span>
        <span class="lp-name">
          <span v-if="prev.line.id !== here.line.id" class="lp-chip" :data-line="prev.line.id">{{ prev.line.no }}</span>
          {{ prev.station.title }}
        </span>
      </a>
      <span v-else class="lp-step is-end"><span class="lp-dir">起点站</span></span>

      <span v-if="xfers.length" class="lp-xfer">
        <span class="lp-dir">可换乘</span>
        <a v-for="x in xfers" :key="x.ref.station.id" :href="withBase(x.ref.station.link)" :data-line="x.ref.line.id">
          <span class="lp-chip">{{ x.ref.line.no }}</span>{{ x.ref.station.title }}
        </a>
      </span>

      <a v-if="next" class="lp-step to-next" :href="withBase(next.station.link)">
        <span class="lp-dir">{{ next.line.id !== here.line.id ? '本线终点 · 换乘下一线' : '下一站' }}</span>
        <span class="lp-name">
          <span v-if="next.line.id !== here.line.id" class="lp-chip" :data-line="next.line.id">{{ next.line.no }}</span>
          {{ next.station.title }}
        </span>
      </a>
      <span v-else class="lp-step to-next is-end"><span class="lp-dir">终点站</span></span>
    </div>
    <p class="sr-only">当前站点编号 {{ stationCode(here) }}</p>
  </nav>
</template>

<style scoped>
.lp {
  margin: 0 0 30px;
  padding: 14px 16px 12px;
  border: 1px solid var(--rule);
  border-radius: 12px;
  background: var(--paper-2);
  font-size: 13.5px;
  line-height: 1.5;
}
.lp-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.lp-badge {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: var(--line);
  color: var(--on-line);
  font-weight: 750;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.lp-line {
  font-weight: 650;
  color: var(--ink);
}
.lp-pos {
  margin-left: auto;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}
.lp-pos b {
  color: var(--ink);
  font-weight: 700;
}

.lp-track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--n), 1fr);
  list-style: none;
  margin: 14px 0 12px !important;
  padding: 0 !important;
}
.lp-track li {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0 !important;
}
/* 每站右侧的一段轨道，最后一站不画 */
.lp-track li:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 4px;
  margin-top: -2px;
  background: color-mix(in oklab, var(--line) 30%, var(--paper-2));
}
.lp-track li.passed::after,
.lp-track li.current::after {
  background: var(--line);
}
.lp-track li.current::after {
  background: linear-gradient(to right, var(--line) 0 50%, color-mix(in oklab, var(--line) 30%, var(--paper-2)) 50%);
}
.lp-track a {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.lp-track .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid var(--line);
  background: var(--paper-2);
  transition: transform 0.25s var(--ease-out);
}
.lp-track li.passed .dot {
  background: var(--line);
}
.lp-track li.current .dot {
  width: 18px;
  height: 18px;
  border-width: 4px;
  background: var(--paper-2);
  box-shadow: 0 0 0 3px var(--paper-2), 0 0 0 5px color-mix(in oklab, var(--line) 40%, transparent);
}
.lp-track a:hover .dot {
  transform: scale(1.25);
}

.lp-foot {
  display: flex;
  align-items: flex-start;
  gap: 12px 20px;
  flex-wrap: wrap;
}
.lp-step,
.lp-xfer {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-decoration: none !important;
  color: var(--ink) !important;
  font-weight: 500;
}
.lp-xfer {
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 10px;
}
.lp-xfer a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink) !important;
  text-decoration: none !important;
  font-weight: 500;
}
.lp-xfer a:hover {
  text-decoration: underline !important;
  text-underline-offset: 3px;
}
.to-next {
  margin-left: auto;
  text-align: right;
  align-items: flex-end;
}
.lp-dir {
  font-size: 12px;
  color: var(--ink-3);
}
.lp-name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
a.lp-step:hover .lp-name {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.lp-chip {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: var(--line);
  color: var(--on-line);
  font-size: 11px;
  font-weight: 750;
}

@media (max-width: 639px) {
  .lp {
    margin-bottom: 24px;
    padding: 12px 12px 10px;
  }
  .lp-pos {
    margin-left: 0;
    width: 100%;
  }
  .lp-xfer {
    order: 3;
    width: 100%;
  }
}
</style>
