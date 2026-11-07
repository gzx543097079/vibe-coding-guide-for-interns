<script setup lang="ts">
// 提示词拼装：逐项勾选目标 / 上下文 / 约束 / 验收，看提示词怎么变长、AI 要猜的事怎么变少
import { computed, reactive } from 'vue'

interface Part {
  key: string
  name: string
  hint: string
  line: string
  solves: string[]
}

const base = '给登录页加一个「记住我」。'
const parts: Part[] = [
  {
    key: 'goal',
    name: '目标',
    hint: '做成什么样',
    line: '勾选「记住我」后，7 天内重新打开网站不用再登录；不勾选时关掉浏览器就退出。',
    solves: ['记住多久', '不勾选时怎么办'],
  },
  {
    key: 'ctx',
    name: '上下文',
    hint: '相关代码在哪',
    line: '登录页在 src/pages/Login.vue，登录接口在 src/api/auth.ts，token 现在存在 sessionStorage。',
    solves: ['改哪个文件', '现在 token 存在哪'],
  },
  {
    key: 'limit',
    name: '约束',
    hint: '不能动什么',
    line: '不改后端接口，不引入新依赖，复选框用现有的 Checkbox 组件。',
    solves: ['能不能改接口', '能不能装新包'],
  },
  {
    key: 'done',
    name: '验收',
    hint: '怎样算完成',
    line: '先列出要改的文件给我确认。完成后说明怎么手动验证这两种情况。',
    solves: ['怎样算做完', '要不要先给方案'],
  },
]

const on = reactive<Record<string, boolean>>({})
const guesses = parts.flatMap((p) => p.solves.map((s) => ({ s, by: p.key })))
const left = computed(() => guesses.filter((g) => !on[g.by]).length)
const lines = computed(() => parts.filter((p) => on[p.key]))
</script>

<template>
  <figure class="ax-fig ax-pb" data-mod="ai">
    <fieldset class="ax-pb-parts">
      <legend>往提示词里加上</legend>
      <label v-for="p in parts" :key="p.key" class="ax-pb-part" :class="{ 'is-on': on[p.key] }">
        <input v-model="on[p.key]" type="checkbox" />
        <span class="ax-pb-box" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
        </span>
        <span class="ax-pb-name">{{ p.name }}</span>
        <span class="ax-pb-hint">{{ p.hint }}</span>
      </label>
    </fieldset>

    <div class="ax-pb-grid">
      <div class="ax-pb-prompt">
        <p class="ax-pb-label">提示词</p>
        <div class="ax-pb-text">
          <p>{{ base }}</p>
          <p v-for="p in lines" :key="p.key" class="ax-pb-line">
            <span class="ax-pb-tag">{{ p.name }}</span>{{ p.line }}
          </p>
        </div>
      </div>
      <div class="ax-pb-guess">
        <p class="ax-pb-label" aria-live="polite">
          AI 还要猜 <strong class="ax-pb-count">{{ left }}</strong> 件事
        </p>
        <ul>
          <li v-for="g in guesses" :key="g.s" :class="{ 'is-solved': on[g.by] }">
            <span class="ax-pb-dot" aria-hidden="true" />
            {{ g.s }}<span v-if="on[g.by]" class="ax-sr">（已说明）</span>
          </li>
        </ul>
      </div>
    </div>
    <figcaption class="ax-cap">
      每猜一件事，就多一次猜错的机会。四项都写上，提示词长了三四行，但你检查结果时也有了明确的标准。
    </figcaption>
  </figure>
</template>
