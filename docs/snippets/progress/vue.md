```vue
<script setup lang="ts">
// value 传 null 表示不确定进度
const props = defineProps<{ value: number | null; label: string }>()
</script>

<template>
  <div
    class="bar"
    :class="{ indeterminate: props.value === null }"
    role="progressbar"
    :aria-label="props.label"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="props.value ?? undefined"
  >
    <span
      class="fill"
      :style="props.value === null ? undefined : { transform: `scaleX(${props.value / 100})` }"
    />
  </div>
</template>

<style scoped>
.bar { height: 4px; overflow: hidden; border-radius: 2px; background: #e5e7eb; }
.fill { display: block; height: 100%; background: #2563eb; transform-origin: left;
  transition: transform 0.3s ease-out; }
.indeterminate .fill { width: 40%; transform: translateX(-100%); animation: slide 1.2s infinite ease-in-out; }
@keyframes slide { to { transform: translateX(250%); } }
@media (prefers-reduced-motion: reduce) {
  .fill { transition: none; }
  .indeterminate .fill { width: 100%; transform: none; animation: pulse 2s infinite; }
}
@keyframes pulse { 50% { opacity: 0.4; } }
</style>
```

```vue
<!-- 用法；环形进度和旋转指示器的 SVG / CSS 与 HTML 写法相同 -->
<ProgressBar :value="uploaded" label="上传进度" />
<ProgressBar :value="null" label="正在加载" />
```
