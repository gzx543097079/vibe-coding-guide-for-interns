```vue
<template>
  <view class="row">
    <text>Wi-Fi</text>
    <switch :checked="wifiOn" @change="onChange" />
  </view>
</template>

<script setup>
import { ref } from 'vue'

const wifiOn = ref(true)
const onChange = (e) => {
  wifiOn.value = e.detail.value
}
</script>
```
