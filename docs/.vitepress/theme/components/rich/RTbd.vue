<script setup lang="ts">
// 行内「待核实」标记：放在不确定的命令、版本、价格或协议后面
defineProps<{ tip?: string }>()
</script>

<template>
  <span class="rx-tbd" :title="tip ?? '这一处还没对照官方资料核实，使用前请以官网为准'">待核实</span>
</template>
