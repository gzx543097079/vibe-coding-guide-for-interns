<script setup lang="ts">
// 三问：必须先懂什么 / 怎么验证 / AI 常错在哪。内容写在 know、verify、pitfall 三个插槽里（可用 Markdown）
// 用原生 details，无 JS 也能展开；默认展开第一问
import { useSlots } from 'vue'
import RIcon from './RIcon.vue'

const slots = useSlots()
const items = [
  { slot: 'know', q: '必须先懂什么', hint: '没有这些底子，判断不了 AI 的答案', icon: 'book' },
  { slot: 'verify', q: '怎么验证', hint: '用别人也能重复的办法确认结果', icon: 'check' },
  { slot: 'pitfall', q: 'AI 常错在哪', hint: '在这些地方停下来自己检查', icon: 'warn' },
] as const
</script>

<template>
  <div class="rx-ask">
    <template v-for="(it, i) in items" :key="it.slot">
      <details v-if="slots[it.slot]" class="rx-ask-item" :class="`is-${it.slot}`" :open="i === 0">
        <summary class="rx-ask-sum">
          <span class="rx-ask-ico"><RIcon :name="it.icon" /></span>
          <span class="rx-ask-q">{{ it.q }}</span>
          <span class="rx-ask-hint">{{ it.hint }}</span>
          <span class="rx-ask-caret" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" /></svg>
          </span>
        </summary>
        <div class="rx-ask-body"><slot :name="it.slot" /></div>
      </details>
    </template>
  </div>
</template>
