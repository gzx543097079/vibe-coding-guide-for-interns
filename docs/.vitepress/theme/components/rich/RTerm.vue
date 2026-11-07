<script setup lang="ts">
// 终端命令块：按系统分标签（全站联动并记忆），复制时只复制命令，不含提示符、注释和示例输出
// 用法：<RTerm :mac="['brew install git']" :win="['winget install ...']" :mac-out="['...']" />
// 各系统命令相同时用 cmd / out
import { computed, onMounted, ref, useId } from 'vue'
import { copyText } from '../../composables/clipboard'
import { loadTab, saveTab, selectedTab } from '../../composables/codeTabs'

type Lines = string | string[]
const props = defineProps<{
  cmd?: Lines
  out?: Lines
  mac?: Lines
  win?: Lines
  linux?: Lines
  macOut?: Lines
  winOut?: Lines
  linuxOut?: Lines
  /** 标题栏左侧的说明，如「检查版本」 */
  title?: string
  /** 输出下方的小注，如版本号以本机为准 */
  note?: string
}>()

const GROUP = 'os'
const uid = useId()
const toList = (v?: Lines) => (v === undefined ? [] : Array.isArray(v) ? v : String(v).split('\n'))

interface Tab {
  label: string
  prompt: string
  cmds: string[]
  out: string[]
}
const tabs = computed<Tab[]>(() => {
  if (props.cmd !== undefined) {
    return [{ label: 'macOS / Windows / Linux', prompt: '$', cmds: toList(props.cmd), out: toList(props.out) }]
  }
  const list: Tab[] = []
  if (props.mac !== undefined) list.push({ label: 'macOS', prompt: '$', cmds: toList(props.mac), out: toList(props.macOut) })
  if (props.win !== undefined) list.push({ label: 'Windows', prompt: 'PS>', cmds: toList(props.win), out: toList(props.winOut) })
  if (props.linux !== undefined) list.push({ label: 'Linux', prompt: '$', cmds: toList(props.linux), out: toList(props.linuxOut) })
  return list
})
const multi = computed(() => tabs.value.length > 1)
const current = computed(() => {
  const v = selectedTab[GROUP]
  const i = v ? tabs.value.findIndex((t) => t.label === v) : -1
  return i >= 0 ? i : 0
})
const active = computed(() => tabs.value[current.value])

onMounted(() => {
  if (selectedTab[GROUP]) return
  const stored = loadTab(GROUP)
  if (stored) {
    selectedTab[GROUP] = stored
    return
  }
  // 没有记录时按访问者的系统预选，只在本页生效，不写入存储
  const ua = navigator.userAgent
  if (/Windows/i.test(ua)) selectedTab[GROUP] = 'Windows'
  else if (/Linux/i.test(ua) && !/Android/i.test(ua)) selectedTab[GROUP] = 'Linux'
})

const tabRefs = ref<HTMLButtonElement[]>([])
function select(i: number, focus = false) {
  saveTab(GROUP, tabs.value[i].label)
  if (focus) tabRefs.value[i]?.focus()
}
function onKey(e: KeyboardEvent) {
  const n = tabs.value.length
  let i = current.value
  if (e.key === 'ArrowRight') i = (i + 1) % n
  else if (e.key === 'ArrowLeft') i = (i - 1 + n) % n
  else return
  e.preventDefault()
  select(i, true)
}

const isComment = (line: string) => line.trimStart().startsWith('#')
const copied = ref(false)
async function copy() {
  const text = active.value.cmds.filter((l) => !isComment(l)).join('\n')
  if (await copyText(text)) {
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1800)
  }
}
</script>

<template>
  <figure class="rx-term">
    <div class="rx-term-bar">
      <span class="rx-term-dots" aria-hidden="true"><i /><i /><i /></span>
      <div v-if="multi" class="rx-term-tabs" role="tablist" aria-label="操作系统" @keydown="onKey">
        <button
          v-for="(t, i) in tabs"
          :id="`${uid}-t${i}`"
          :key="t.label"
          ref="tabRefs"
          type="button"
          role="tab"
          class="rx-term-tab"
          :aria-selected="i === current"
          :aria-controls="`${uid}-p`"
          :tabindex="i === current ? 0 : -1"
          @click="select(i)"
        >
          {{ t.label }}
        </button>
      </div>
      <span v-else class="rx-term-os">{{ tabs[0]?.label }}</span>
      <span v-if="title" class="rx-term-title">{{ title }}</span>
      <button type="button" class="rx-term-copy" :class="{ done: copied }" :aria-label="copied ? '已复制命令' : '复制命令'" @click="copy">
        <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
          <template v-if="!copied">
            <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
            <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
          </template>
          <path v-else d="M3 8.5 6.5 12 13 4.5" />
        </svg>
        <span class="rx-term-copy-text">{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    <div
      v-if="active"
      :id="`${uid}-p`"
      :key="active.label"
      class="rx-term-screen"
      :role="multi ? 'tabpanel' : undefined"
      :aria-labelledby="multi ? `${uid}-t${current}` : undefined"
      tabindex="0"
    >
      <pre class="rx-term-pre"><code><template v-for="(line, i) in active.cmds" :key="'c' + i"><span v-if="isComment(line)" class="rx-term-cm">{{ line }}</span><span v-else class="rx-term-line"><span class="rx-term-ps" aria-hidden="true">{{ active.prompt }} </span>{{ line }}</span>
</template></code></pre>
      <div v-if="active.out.length" class="rx-term-out">
        <span class="rx-term-out-label">示例输出</span>
        <pre class="rx-term-pre"><code><span v-for="(line, i) in active.out" :key="'o' + i" class="rx-term-o" :style="{ '--i': i }">{{ line || ' ' }}</span></code></pre>
      </div>
    </div>
    <figcaption v-if="note" class="rx-term-note">{{ note }}</figcaption>
  </figure>
</template>
