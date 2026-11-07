<script setup lang="ts">
import { computed } from 'vue'
import { getStack, pendingCompares } from '../data/approaches'
import { selectedTab } from '../composables/codeTabs'

const props = defineProps<{
  /** 对比数据 id，见 data/approaches.ts */
  stack: string
  /** 联动的 CodeTabs 分组，用于高亮当前写法 */
  group?: string
  /** 分组还没有选中记录时，默认高亮的写法 */
  fallback?: string
}>()

const data = computed(() => getStack(props.stack))
const current = computed(() => {
  if (!props.group || !data.value) return null
  return selectedTab[props.group] ?? props.fallback ?? data.value.approaches[0].label
})
const isCur = (label: string) => current.value === label

const rows: [string, (a: NonNullable<typeof data.value>['approaches'][number]) => string | string[]][] = [
  ['适用场景', (a) => a.scene],
  ['优点', (a) => a.pros],
  ['缺点和坑', (a) => a.cons],
  ['学习成本', (a) => a.cost],
  ['维护与生态', (a) => a.eco],
  ['什么时候选它', (a) => a.when],
]
</script>

<template>
  <section v-if="data" class="ac" :aria-label="data.title">
    <p class="ac-title">{{ data.title }}</p>

    <!-- 宽屏：表格 -->
    <div class="ac-table-wrap">
      <table class="ac-table">
        <thead>
          <tr>
            <th scope="col" class="ac-corner"><span class="sr-only">对比项</span></th>
            <th v-for="a in data.approaches" :key="a.label" scope="col" :class="{ cur: isCur(a.label) }">
              {{ a.name }}
              <span v-if="isCur(a.label)" class="ac-cur">当前写法</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[name, get] in rows" :key="name">
            <th scope="row">{{ name }}</th>
            <td v-for="a in data.approaches" :key="a.label" :class="{ cur: isCur(a.label) }">
              <ul v-if="Array.isArray(get(a))">
                <li v-for="x in get(a)" :key="x">{{ x }}</li>
              </ul>
              <template v-else>{{ get(a) }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 窄屏：纵向卡片 -->
    <ul class="ac-cards">
      <li v-for="a in data.approaches" :key="a.label" class="ac-card" :class="{ cur: isCur(a.label) }">
        <p class="ac-card-name">
          {{ a.name }}
          <span v-if="isCur(a.label)" class="ac-cur">当前写法</span>
        </p>
        <dl>
          <template v-for="[name, get] in rows" :key="name">
            <dt>{{ name }}</dt>
            <dd>{{ Array.isArray(get(a)) ? (get(a) as string[]).join('；') : get(a) }}</dd>
          </template>
        </dl>
      </li>
    </ul>

    <p class="ac-verdict"><b>怎么选：</b>{{ data.verdict }}</p>
  </section>
  <section v-else-if="stack === 'pending'" class="ac">
    <p class="ac-title">这些方向的方案对比还没写</p>
    <ul class="ac-pending">
      <li v-for="p in pendingCompares" :key="p">{{ p }}</li>
    </ul>
  </section>
</template>

<style scoped>
.ac {
  margin: 20px 0 30px;
}
.ac-title {
  margin: 0 0 12px !important;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}
.ac-table-wrap {
  border: 1px solid var(--rule);
  border-radius: 14px;
  overflow: hidden;
  background: var(--raised);
}
.ac-table {
  display: table !important;
  width: 100%;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  table-layout: fixed;
  font-size: 13.5px !important;
}
.ac-table th,
.ac-table td {
  padding: 10px 12px !important;
  vertical-align: top;
  line-height: 1.6;
  border-bottom: 1px solid var(--rule) !important;
}
.ac-table thead th {
  background: var(--paper-2);
  color: var(--ink) !important;
  font-size: 14px !important;
  font-weight: 700 !important;
}
.ac-table tbody th {
  width: 104px;
  background: var(--paper-2);
  color: var(--ink-2) !important;
  font-weight: 600 !important;
  font-size: 13px !important;
}
.ac-corner {
  width: 104px;
}
.ac-table .cur {
  background: var(--accent-soft);
}
.ac-table thead th.cur {
  background: var(--accent-soft);
}
.ac-table ul {
  margin: 0 !important;
  padding-left: 1.1em !important;
}
.ac-table li + li {
  margin-top: 2px !important;
}
.ac-cur {
  display: inline-block;
  margin-left: 6px;
  padding: 0 7px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 650;
  line-height: 20px;
  color: var(--on-accent);
  background: var(--accent);
  vertical-align: 1px;
}
.ac-cards {
  display: none;
}
.ac-verdict {
  margin: 12px 0 0 !important;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--paper-2);
  font-size: 14.5px;
  line-height: 1.7;
}
.ac-verdict b {
  font-weight: 700;
}
.ac-pending {
  margin: 0 !important;
}

@media (max-width: 767px) {
  .ac-table-wrap {
    display: none;
  }
  .ac-cards {
    display: grid;
    gap: 12px;
    margin: 0 !important;
    padding: 0 !important;
    list-style: none !important;
  }
  .ac-card {
    margin: 0 !important;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1px solid var(--rule);
    background: var(--raised);
  }
  .ac-card.cur {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .ac-card-name {
    margin: 0 0 8px !important;
    font-size: 15.5px;
    font-weight: 700;
  }
  .ac-card dl {
    display: grid;
    grid-template-columns: 84px 1fr;
    gap: 6px 10px;
    margin: 0;
    font-size: 13.5px;
    line-height: 1.6;
  }
  .ac-card dt {
    color: var(--ink-3);
    font-weight: 600;
  }
  .ac-card dd {
    margin: 0;
    color: var(--ink-2);
  }
}
</style>
