<script setup lang="ts">
// 工具类型选择：选一个场景，看对话助手 / 编辑器补全 / Agent 哪个更合适以及原因
import { computed, ref } from 'vue'

type Kind = 'chat' | 'complete' | 'agent'
type Fit = 'best' | 'ok' | 'no'

const kinds: { key: Kind; name: string; sees: string; does: string }[] = [
  { key: 'chat', name: '对话助手', sees: '只看得到你贴进去的内容', does: '回答、解释、起草，不碰你的文件' },
  { key: 'complete', name: '编辑器补全', sees: '光标附近的代码和打开的文件', does: '边写边给下一行、下一段的建议' },
  { key: 'agent', name: 'Agent', sees: '整个项目目录，自己搜文件', does: '读写文件、跑命令，循环到做完' },
]

const scenes: { name: string; fit: Record<Kind, Fit>; why: string }[] = [
  {
    name: '搞懂一个概念',
    fit: { chat: 'best', complete: 'no', agent: 'ok' },
    why: '不涉及项目代码，对话助手最直接。用 Agent 也行，但它可能顺手去翻你的项目，没必要。',
  },
  {
    name: '解释一段报错',
    fit: { chat: 'ok', complete: 'no', agent: 'best' },
    why: 'Agent 能自己去读报错指向的文件、复现一次；用对话助手要你把报错和相关代码都贴全。',
  },
  {
    name: '写函数时补全下一行',
    fit: { chat: 'no', complete: 'best', agent: 'no' },
    why: '你清楚要写什么，只想打字快一点。补全延迟低、不打断思路，逐条看建议再按 Tab 接受。',
  },
  {
    name: '跨几个文件加个小功能',
    fit: { chat: 'no', complete: 'ok', agent: 'best' },
    why: '要改多个文件、跑测试确认，正是 Agent 循环擅长的。先让它列计划，你确认再动手。',
  },
  {
    name: '写个一次性脚本',
    fit: { chat: 'best', complete: 'ok', agent: 'ok' },
    why: '脚本独立于项目，对话助手写完你复制运行即可。要它直接在项目里跑，就用 Agent。',
  },
  {
    name: '大范围改名重构',
    fit: { chat: 'no', complete: 'no', agent: 'best' },
    why: '机械但量大，Agent 能搜出所有引用、改完跑一遍构建。改完逐个看 diff。',
  },
]

const si = ref(3)
const scene = computed(() => scenes[si.value])
const fitName: Record<Fit, string> = { best: '最合适', ok: '也可以', no: '不太合适' }
</script>

<template>
  <figure class="ax-fig ax-tp" data-mod="ai">
    <div class="ax-tp-scenes" role="group" aria-label="选择场景">
      <button
        v-for="(s, i) in scenes"
        :key="s.name"
        type="button"
        class="ax-chip"
        :aria-pressed="si === i"
        @click="si = i"
      >
        {{ s.name }}
      </button>
    </div>
    <ul class="ax-tp-kinds">
      <li v-for="k in kinds" :key="k.key" class="ax-tp-kind" :class="`is-${scene.fit[k.key]}`">
        <p class="ax-tp-head">
          <span class="ax-tp-name">{{ k.name }}</span>
          <span class="ax-tp-fit">{{ fitName[scene.fit[k.key]] }}</span>
        </p>
        <p class="ax-tp-line"><span>看得到</span>{{ k.sees }}</p>
        <p class="ax-tp-line"><span>能做</span>{{ k.does }}</p>
      </li>
    </ul>
    <figcaption class="ax-cap" aria-live="polite">{{ scene.why }}</figcaption>
  </figure>
</template>
