<script setup lang="ts">
// 文件夹树：进入视口时逐行展开；点目录折叠 / 展开子项；「只看重点」把 hl 行之外的淡化
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import RIcon from './RIcon.vue'
import { trees, type TreeNode } from './trees'

const props = defineProps<{ preset?: string; nodes?: TreeNode[]; title?: string; caption?: string }>()

const data = computed(() => {
  const p = props.preset ? trees[props.preset] : undefined
  return { title: props.title ?? p?.title ?? '', nodes: props.nodes ?? p?.nodes ?? [] }
})

const closed = reactive<Record<number, boolean>>({})
const focus = ref(false)

/** 每行的父目录下标 */
const parents = computed(() => {
  const stack: number[] = []
  return data.value.nodes.map((node, i) => {
    while (stack.length && data.value.nodes[stack[stack.length - 1]].depth >= node.depth) stack.pop()
    const parent = stack.length ? stack[stack.length - 1] : -1
    if (node.dir) stack.push(i)
    return parent
  })
})
const hasChildren = (i: number) => data.value.nodes[i + 1]?.depth > data.value.nodes[i].depth
const hidden = (i: number) => {
  let p = parents.value[i]
  while (p >= 0) {
    if (closed[p]) return true
    p = parents.value[p]
  }
  return false
}
const hasHl = computed(() => data.value.nodes.some((x) => x.hl))

// 逐行出现：只在支持 IntersectionObserver 时启用，默认就是完整可见的
const root = ref<HTMLElement>()
const armed = ref(false)
const shown = ref(false)
const done = ref(false)
let io: IntersectionObserver | null = null
onMounted(() => {
  if (!root.value || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  armed.value = true
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        shown.value = true
        io?.disconnect()
        // 逐行出现结束后去掉延迟，之后的折叠、聚焦即时响应
        window.setTimeout(() => (done.value = true), 400 + data.value.nodes.length * 35)
      }
    },
    { threshold: 0.2 },
  )
  io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <figure ref="root" class="rx-tree" :class="{ 'is-armed': armed, 'is-shown': shown, 'is-done': done, 'is-focus': focus }">
    <div class="rx-tree-bar">
      <span class="rx-tree-root">
        <RIcon name="folder" :size="16" />
        {{ data.title }}
      </span>
      <button v-if="hasHl" type="button" class="rx-tree-btn" :aria-pressed="focus" @click="focus = !focus">
        {{ focus ? '显示全部' : '只看重点' }}
      </button>
    </div>
    <ul class="rx-tree-list">
      <template v-for="(node, i) in data.nodes" :key="i">
        <li
          v-show="!hidden(i)"
          class="rx-tree-row"
          :class="{ 'is-dir': node.dir, 'is-hl': node.hl }"
          :style="{ '--d': node.depth, '--i': i }"
        >
          <button
            v-if="node.dir && hasChildren(i)"
            type="button"
            class="rx-tree-name"
            :aria-expanded="!closed[i]"
            @click="closed[i] = !closed[i]"
          >
            <span class="rx-tree-caret" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg>
            </span>
            <RIcon name="folder" :size="16" />
            <code>{{ node.name }}</code>
          </button>
          <span v-else class="rx-tree-name">
            <span class="rx-tree-caret" aria-hidden="true" />
            <RIcon :name="node.dir ? 'folder' : 'file'" :size="16" />
            <code>{{ node.name }}</code>
          </span>
          <span v-if="node.note" class="rx-tree-note">{{ node.note }}</span>
        </li>
      </template>
    </ul>
    <figcaption v-if="caption" class="rx-tree-cap">{{ caption }}</figcaption>
  </figure>
</template>
