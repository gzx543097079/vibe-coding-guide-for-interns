<script setup lang="ts">
// 单个要点：图标 + 短标题 + 一两句说明（默认插槽）
// tone：默认中性；warn 表示必须自己把关的事；meta 用于右上角的小注（如快捷键）
import RIcon from './RIcon.vue'

defineProps<{ icon?: string; title: string; tone?: 'warn'; meta?: string }>()
</script>

<template>
  <div class="rx-point" :class="tone && `is-${tone}`">
    <span class="rx-point-ico"><RIcon :name="icon ?? 'bulb'" /></span>
    <div class="rx-point-body">
      <p class="rx-point-title">
        <span>{{ title }}</span>
        <kbd v-if="meta" class="rx-point-meta">{{ meta }}</kbd>
      </p>
      <div class="rx-point-text"><slot /></div>
    </div>
  </div>
</template>
