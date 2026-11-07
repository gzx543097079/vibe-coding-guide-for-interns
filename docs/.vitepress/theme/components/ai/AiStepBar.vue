<script setup lang="ts">
// 步骤按钮条 + 播放按钮，配合 useStepper 使用
defineProps<{ labels: string[]; step: number; playing: boolean; label?: string; numbered?: boolean }>()
const emit = defineEmits<{ pick: [i: number]; play: [] }>()
</script>

<template>
  <div class="ax-bar">
    <div class="ax-bar-steps" role="group" :aria-label="label ?? '选择步骤'">
      <button
        v-for="(s, i) in labels"
        :key="i"
        type="button"
        class="ax-chip"
        :aria-pressed="step === i"
        @click="emit('pick', i)"
      >
        <span v-if="numbered !== false" class="ax-chip-no">{{ i + 1 }}</span>{{ s }}
      </button>
    </div>
    <button type="button" class="ax-play" @click="emit('play')">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <path v-if="!playing" d="M5 3.5v9l7-4.5-7-4.5z" />
        <path v-else d="M5 3.5v9M11 3.5v9" />
      </svg>
      {{ playing ? '暂停' : '按顺序播放' }}
    </button>
  </div>
</template>
