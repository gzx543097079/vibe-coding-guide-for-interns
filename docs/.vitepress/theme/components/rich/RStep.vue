<script setup lang="ts">
// 单个步骤：标题始终可见，正文（默认插槽，可用 Markdown）展开后显示
// li 承担编号，details 承担展开，避免依赖 JS
defineProps<{ title: string; note?: string; open?: boolean }>()
</script>

<template>
  <li class="rx-step-li">
    <details class="rx-step" :open="open">
      <summary class="rx-step-sum">
        <span class="rx-step-no" aria-hidden="true" />
        <span class="rx-step-title">{{ title }}</span>
        <span v-if="note" class="rx-step-note">{{ note }}</span>
        <span class="rx-step-caret" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" /></svg>
        </span>
      </summary>
      <div class="rx-step-body"><slot /></div>
    </details>
  </li>
</template>
