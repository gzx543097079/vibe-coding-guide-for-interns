<script setup lang="ts">
// 对照卡：左边 bad、右边 good 两个插槽，窄屏上下排列
// neutral 时两侧都不带对错含义，用于「两种做法各有适用场景」
import RIcon from './RIcon.vue'

withDefaults(defineProps<{ badTitle?: string; goodTitle?: string; neutral?: boolean }>(), {
  badTitle: '容易出问题的做法',
  goodTitle: '更稳的做法',
  neutral: false,
})
</script>

<template>
  <div class="rx-cmp" :class="{ 'is-neutral': neutral }">
    <section class="rx-cmp-side is-bad">
      <p class="rx-cmp-head">
        <span class="rx-cmp-ico"><RIcon :name="neutral ? 'split' : 'cross'" :size="16" /></span>
        {{ badTitle }}
      </p>
      <div class="rx-cmp-body"><slot name="bad" /></div>
    </section>
    <section class="rx-cmp-side is-good">
      <p class="rx-cmp-head">
        <span class="rx-cmp-ico"><RIcon :name="neutral ? 'layers' : 'check'" :size="16" /></span>
        {{ goodTitle }}
      </p>
      <div class="rx-cmp-body"><slot name="good" /></div>
    </section>
  </div>
</template>
