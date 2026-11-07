<script setup lang="ts">
// 概念图：编辑器、AI Agent、模型服务与你之间的关系。用 CSS 绘制，点步骤高亮对应部分
import { computed, onBeforeUnmount, ref } from 'vue'
import RIcon from './RIcon.vue'

interface Step {
  label: string
  text: string
  on: string[]
}
const steps: Step[] = [
  { label: '总览', text: '编辑器是你看代码、改代码的地方；Agent 住在编辑器里（插件）或旁边的终端里（命令行工具），替你读文件、改文件、跑命令；真正「想」下一步的是云端的模型服务。', on: [] },
  { label: '描述任务', text: '你用自然语言说清目标、范围和验收标准。Agent 只知道你告诉它的和它自己读到的。', on: ['you', 'a1', 'agent'] },
  { label: '读规则和文件', text: 'Codex 读取 AGENTS.md 等已加载的规则和相关源码，作为上下文。', on: ['agent', 'rules', 'files'] },
  { label: '发给模型', text: '读到的内容会连同你的话一起发送到模型服务。所以不该外发的代码和密钥，不要让它读。', on: ['agent', 'a2', 'model'] },
  { label: '修改代码', text: '模型给出修改方案，Agent 把改动写进文件。多数工具会先让你确认。', on: ['agent', 'code'] },
  { label: '运行命令', text: 'Agent 在终端里跑构建、测试或 lint，读输出，再决定下一步。', on: ['agent', 'term'] },
  { label: '你审 diff', text: '最后由你逐行看改动、自己跑一遍，再决定要不要提交。这一步不能省。', on: ['you', 'a1', 'code'] },
]

const step = ref(0)
const cur = computed(() => steps[step.value])
const cls = (k: string) => {
  if (step.value === 0) return ''
  return cur.value.on.includes(k) ? 'is-on' : 'is-dim'
}

// 依次播放各步骤；尊重减少动态效果的设置时仍可播放，只是没有过渡
let timer: number | undefined
const playing = ref(false)
function stop() {
  window.clearInterval(timer)
  timer = undefined
  playing.value = false
}
function play() {
  if (playing.value) return stop()
  playing.value = true
  step.value = 1
  timer = window.setInterval(() => {
    if (step.value >= steps.length - 1) {
      stop()
      return
    }
    step.value++
  }, 2600)
}
function pick(i: number) {
  stop()
  step.value = i
}
onBeforeUnmount(stop)
</script>

<template>
  <figure class="rx-ea" :class="{ 'is-focus': step > 0 }">
    <div class="rx-ea-stage">
      <div class="rx-ea-node is-you" :class="cls('you')">
        <span class="rx-ea-ico"><RIcon name="user" /></span>
        <span class="rx-ea-name">你</span>
        <span class="rx-ea-sub">提需求、审改动、决定合并</span>
      </div>

      <div class="rx-ea-link" :class="cls('a1')" aria-hidden="true">
        <svg viewBox="0 0 48 16"><path d="M2 5h40M36 1l6 4-6 4M46 11H6M12 7l-6 4 6 4" /></svg>
      </div>

      <div class="rx-ea-editor">
        <p class="rx-ea-editor-head">
          <RIcon name="code" :size="16" />
          编辑器 / IDE
        </p>
        <div class="rx-ea-panes">
          <div class="rx-ea-pane is-files" :class="cls('files')">
            <span class="rx-ea-pane-name">文件</span>
            <i /><i /><i class="short" /><i />
          </div>
          <div class="rx-ea-pane is-code" :class="cls('code')">
            <span class="rx-ea-pane-name">代码</span>
            <i /><i class="add" /><i class="del" /><i class="short" />
          </div>
          <div class="rx-ea-pane is-term" :class="cls('term')">
            <span class="rx-ea-pane-name">终端</span>
            <i class="short" /><i class="ok" />
          </div>
        </div>
        <div class="rx-ea-agent" :class="cls('agent')">
          <span class="rx-ea-ico"><RIcon name="bot" /></span>
          <span class="rx-ea-name">AI Agent</span>
          <span class="rx-ea-sub">读文件 · 改文件 · 跑命令</span>
        </div>
        <span class="rx-ea-rules" :class="cls('rules')">
          <RIcon name="file" :size="14" />
          AGENTS.md
        </span>
      </div>

      <div class="rx-ea-link" :class="cls('a2')" aria-hidden="true">
        <svg viewBox="0 0 48 16"><path d="M2 5h40M36 1l6 4-6 4M46 11H6M12 7l-6 4 6 4" /></svg>
      </div>

      <div class="rx-ea-node is-model" :class="cls('model')">
        <span class="rx-ea-ico"><RIcon name="cloud" /></span>
        <span class="rx-ea-name">模型服务</span>
        <span class="rx-ea-sub">云端，根据上下文生成下一步</span>
      </div>
    </div>

    <div class="rx-ea-ctrl">
      <div class="rx-ea-steps" role="group" aria-label="选择步骤">
        <button
          v-for="(s, i) in steps"
          :key="s.label"
          type="button"
          class="rx-ea-step"
          :aria-pressed="step === i"
          @click="pick(i)"
        >
          <span v-if="i > 0" class="rx-ea-step-no">{{ i }}</span>{{ s.label }}
        </button>
      </div>
      <button type="button" class="rx-ea-play" @click="play">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path v-if="!playing" d="M5 3.5v9l7-4.5-7-4.5z" />
          <path v-else d="M5 3.5v9M11 3.5v9" />
        </svg>
        {{ playing ? '暂停' : '按顺序播放' }}
      </button>
    </div>
    <figcaption class="rx-ea-cap" aria-live="polite">{{ cur.text }}</figcaption>
  </figure>
</template>
