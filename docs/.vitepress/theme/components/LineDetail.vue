<script setup lang="ts">
import { withBase } from 'vitepress'
import { stationCode, transfersOf, type Line } from '../data/metro'

const props = defineProps<{ line: Line }>()

// 宽屏按固定列数排布：7 站以内一行，更长的线路平均分成两行
const n = props.line.stations.length
const cols = n <= 7 ? n : Math.ceil(n / 2)
const wrapEnd = (i: number) => (i + 1) % cols === 0 && i < n - 1
const wrapStart = (i: number) => i > 0 && i % cols === 0
</script>

<template>
  <section :id="`line-${line.id}`" class="ld" :data-line="line.id" :aria-labelledby="`ld-h-${line.id}`">
    <header class="ld-head">
      <span class="ld-badge" aria-hidden="true">{{ line.no }}</span>
      <div class="ld-titles">
        <h3 :id="`ld-h-${line.id}`" class="ld-title">
          <span class="ld-no">{{ line.no }} 号线</span>{{ line.name }}
        </h3>
        <p class="ld-intro">{{ line.intro }}</p>
      </div>
      <span class="ld-count">{{ line.stations.length }} 站</span>
    </header>

    <ol class="ld-stops" :style="{ '--cols': cols }">
      <li
        v-for="(st, i) in line.stations"
        :key="st.id"
        class="ld-stop"
        :class="{ 'wrap-end': wrapEnd(i), 'wrap-start': wrapStart(i) }"
      >
        <span class="ld-dot" :class="{ x: transfersOf(st.id).length }" aria-hidden="true" />
        <a class="ld-link" :href="withBase(st.link)">
          <span class="ld-code">{{ stationCode({ line, index: i }) }}</span>
          <span class="ld-name">{{ st.title }}</span>
        </a>
        <p class="ld-sum">{{ st.summary }}</p>
        <p v-for="x in transfersOf(st.id)" :key="x.ref.station.id" class="ld-x" :data-line="x.ref.line.id">
          <span class="ld-x-chip" aria-hidden="true">{{ x.ref.line.no }}</span>
          <span><span class="sr-only">可换乘 {{ x.ref.line.no }} 号线：</span>{{ x.ref.station.title }}</span>
        </p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.ld {
  scroll-margin-top: calc(var(--vp-nav-height) + 24px);
  padding: 36px 0 30px;
  border-top: 1px solid var(--rule);
}
.ld-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: start;
  margin-bottom: 26px;
}
.ld-badge {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: var(--line);
  color: var(--on-line);
  font-size: 22px;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
}
.ld-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.3;
  font-weight: 750;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.ld-no {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-3);
  margin-right: 10px;
  letter-spacing: 0.02em;
}
.ld-intro {
  margin: 4px 0 0;
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.6;
  max-width: 40em;
}
.ld-count {
  padding-top: 4px;
  font-size: 13px;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}

.ld-stops {
  --dot: 16px;
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  row-gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.ld-stop {
  position: relative;
  padding: calc(var(--dot) + 14px) 18px 0 0;
  min-width: 0;
}
/* 站点之间的轨道段 */
.ld-stop::before {
  content: '';
  position: absolute;
  top: calc(var(--dot) / 2 - 3px);
  left: calc(var(--dot) / 2);
  right: 0;
  height: 6px;
  background: var(--line);
}
.ld-stop:last-child::before {
  display: none;
}
/* 换行处：轨道从行尾伸出、在下一行开头接回 */
.ld-stop.wrap-end::before {
  right: -16px;
  border-radius: 0 3px 3px 0;
}
.ld-stop.wrap-start::after {
  content: "";
  position: absolute;
  top: calc(var(--dot) / 2 - 3px);
  left: -16px;
  width: 16px;
  height: 6px;
  border-radius: 3px 0 0 3px;
  background: var(--line);
}
.ld-dot {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: var(--dot);
  height: var(--dot);
  border-radius: 50%;
  background: var(--station-fill);
  border: 3.5px solid var(--line);
  transition: transform 0.25s var(--ease-out);
}
.ld-dot.x {
  border-color: var(--ink);
  box-shadow: inset 0 0 0 2.5px var(--station-fill), inset 0 0 0 4.5px var(--ink);
}
.ld-stop:hover .ld-dot:not(.x),
.ld-stop:focus-within .ld-dot:not(.x) {
  transform: scale(1.25);
  background: var(--line);
}
.ld-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--ink);
  text-decoration: none;
}
.ld-link::after {
  /* 整个站点区域可点击 */
  content: '';
  position: absolute;
  inset: -6px 6px -6px -6px;
  border-radius: 10px;
}
.ld-link:focus-visible {
  outline: none;
}
.ld-link:focus-visible::after {
  outline: 2px solid var(--focus);
  outline-offset: 0;
}
.ld-code {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  letter-spacing: 0.02em;
}
.ld-name {
  font-size: 16px;
  font-weight: 680;
  line-height: 1.4;
  text-wrap: balance;
}
.ld-stop:hover .ld-name {
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 4px;
  text-decoration-color: var(--line);
}
.ld-sum {
  margin: 6px 0 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-2);
}
.ld-x {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0 0;
  font-size: 12.5px;
  color: var(--ink-2);
}
.ld-x-chip {
  display: inline-grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border-radius: 5px;
  background: var(--line);
  color: var(--on-line);
  font-size: 11px;
  font-weight: 750;
}

/* 窄屏：竖向线路 */
@media (max-width: 1099px) {
  .ld-stop.wrap-start::after {
    display: none;
  }
  .ld-stop.wrap-end::before {
    right: auto;
    border-radius: 0;
  }
}
@media (max-width: 1099px) {
  .ld {
    padding: 28px 0 22px;
  }
  .ld-head {
    grid-template-columns: auto 1fr;
    gap: 12px;
  }
  .ld-badge {
    width: 36px;
    height: 36px;
    font-size: 18px;
    border-radius: 11px;
  }
  .ld-title {
    font-size: 20px;
  }
  .ld-count {
    display: none;
  }
  .ld-stops {
    display: block;
  }
  .ld-stop {
    padding: 0 0 22px 34px;
  }
  .ld-stop::before {
    top: calc(var(--dot) / 2);
    bottom: calc(var(--dot) / -2);
    left: calc(var(--dot) / 2 - 3px);
    right: auto;
    width: 6px;
    height: auto;
  }
  .ld-dot {
    top: 2px;
  }
  .ld-link {
    flex-direction: row;
    align-items: baseline;
    gap: 10px;
  }
  .ld-sum {
    margin-top: 2px;
  }
}
</style>
