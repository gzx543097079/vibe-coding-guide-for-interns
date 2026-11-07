<script setup lang="ts">
// 步骤条：包住若干 RStep，自动编号；右上角可一键展开 / 收起全部
import { onMounted, ref } from 'vue'

const root = ref<HTMLElement>()
const allOpen = ref(false)

function sync() {
  const list = root.value?.querySelectorAll<HTMLDetailsElement>(':scope > .rx-steps-list > li > .rx-step')
  if (!list?.length) return
  allOpen.value = Array.from(list).every((d) => d.open)
}

function toggleAll() {
  const next = !allOpen.value
  root.value
    ?.querySelectorAll<HTMLDetailsElement>(':scope > .rx-steps-list > li > .rx-step')
    .forEach((d) => (d.open = next))
  allOpen.value = next
}

onMounted(() => {
  sync()
  root.value?.addEventListener('toggle', sync, true)
})
</script>

<template>
  <div ref="root" class="rx-steps">
    <div class="rx-steps-bar">
      <button type="button" class="rx-steps-all" :aria-pressed="allOpen" @click="toggleAll">
        {{ allOpen ? '全部收起' : '全部展开' }}
      </button>
    </div>
    <ol class="rx-steps-list">
      <slot />
    </ol>
  </div>
</template>
