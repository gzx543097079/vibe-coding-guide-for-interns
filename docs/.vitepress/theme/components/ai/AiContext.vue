<script setup lang="ts">
// 上下文窗口示意：拖动滑块看规则、工具定义、历史、文件和回答预留怎样占满窗口
// 超出后按所选策略显示结局：直接报错 / 丢掉最早的历史 / 把历史压缩成摘要
// 所有数字都是示意单位，不对应任何具体模型
import { computed, ref, useId } from 'vue'

const uid = useId()
const CAP = 100

const longRules = ref(false)
const servers = ref(2)
const rounds = ref(8)
const files = ref(2)
const mode = ref<'error' | 'drop' | 'compact'>('error')

const PER_ROUND = 3
const PER_FILE = 7
const PER_SERVER = 4
const RESERVE = 10

const raw = computed(() => ({
  rules: longRules.value ? 14 : 4,
  tools: 3 + servers.value * PER_SERVER,
  history: rounds.value * PER_ROUND,
  files: files.value * PER_FILE,
  reserve: RESERVE,
}))
const rawTotal = computed(() => Object.values(raw.value).reduce((a, b) => a + b, 0))
const over = computed(() => rawTotal.value > CAP)

// 按策略算出真正发出去的那一份
const result = computed(() => {
  const r = raw.value
  const fixed = r.rules + r.tools + r.files + r.reserve
  if (!over.value || mode.value === 'error') {
    return { history: r.history, summary: 0, dropped: 0, droppedRounds: 0, fail: fixed > CAP }
  }
  if (mode.value === 'drop') {
    const room = Math.max(0, CAP - fixed)
    const keepRounds = Math.min(rounds.value, Math.floor(room / PER_ROUND))
    return {
      history: keepRounds * PER_ROUND,
      summary: 0,
      dropped: r.history - keepRounds * PER_ROUND,
      droppedRounds: rounds.value - keepRounds,
      fail: fixed > CAP,
    }
  }
  // 压缩：把历史换成一段摘要，约为原来的五分之一，最少 3 个单位
  const summary = Math.max(3, Math.round(r.history / 5))
  return { history: 0, summary, dropped: 0, droppedRounds: 0, fail: fixed + summary > CAP }
})

const segs = computed(() => {
  const r = raw.value
  const res = result.value
  const list = [
    { key: 'rules', name: '系统提示与规则', v: r.rules },
    { key: 'tools', name: '工具定义', v: r.tools },
    { key: 'summary', name: '历史摘要', v: res.summary },
    { key: 'history', name: '对话历史', v: res.history },
    { key: 'files', name: '读入的文件', v: r.files },
    { key: 'reserve', name: '留给回答', v: r.reserve },
  ]
  return list.filter((s) => s.v > 0)
})
const sent = computed(() => segs.value.reduce((a, s) => a + s.v, 0))
// 条形的总刻度：没超出时就是窗口大小；报错模式下超出部分画在窗口线右边
const scale = computed(() => Math.max(CAP, mode.value === 'error' ? rawTotal.value : sent.value))
const pct = (v: number) => `${(v / scale.value) * 100}%`

const verdict = computed(() => {
  if (!over.value) return { tone: 'ok', text: `占用 ${rawTotal.value} / ${CAP}，放得下。每多聊一轮、多读一个文件，这根条就再长一截。` }
  if (result.value.fail)
    return { tone: 'bad', text: '光是规则、工具定义和文件就已经超出窗口，怎么处理历史都放不下。只能少读文件、少接工具，或者开新会话。' }
  if (mode.value === 'error')
    return { tone: 'bad', text: `需要 ${rawTotal.value}，窗口只有 ${CAP}。请求直接被拒（API 返回 400 “prompt is too long”），一个字都不会生成。` }
  if (mode.value === 'drop')
    return { tone: 'warn', text: `最早的 ${result.value.droppedRounds} 轮对话被丢掉了。如果需求就写在那几轮里，模型现在已经看不到它。` }
  return { tone: 'warn', text: `${rounds.value} 轮对话被压成一段摘要，腾出了空间，但具体的报错原文、你说过的细节可能没留下来。` }
})

const modes = [
  { key: 'error', name: '直接报错', who: '模型 API 的行为' },
  { key: 'drop', name: '丢掉最早的', who: '部分聊天应用的做法' },
  { key: 'compact', name: '压缩成摘要', who: 'Agent 工具常见做法' },
] as const
</script>

<template>
  <figure class="ax-fig ax-ctxw" data-mod="ai">
    <div class="ax-ctxw-meter">
      <div class="ax-ctxw-scale">
        <span>上下文窗口</span>
        <span class="ax-ctxw-num">{{ over && mode === 'error' ? rawTotal : sent }} / {{ CAP }}</span>
      </div>
      <div class="ax-ctxw-track" role="img" :aria-label="`上下文占用 ${over && mode === 'error' ? rawTotal : sent}，窗口 ${CAP}`">
        <span
          v-for="s in segs"
          :key="s.key"
          class="ax-ctxw-seg"
          :class="`s-${s.key}`"
          :style="{ width: pct(s.v) }"
        />
        <span class="ax-ctxw-limit" :class="{ 'is-end': scale === CAP }" :style="{ left: pct(CAP) }" aria-hidden="true">
          <span class="ax-ctxw-limit-label">窗口上限</span>
        </span>
        <span
          v-if="over && mode === 'error'"
          class="ax-ctxw-over"
          :style="{ left: pct(CAP), width: pct(rawTotal - CAP) }"
          aria-hidden="true"
        />
      </div>
      <ul class="ax-ctxw-legend">
        <li v-for="s in segs" :key="s.key" :class="`s-${s.key}`">
          <i />{{ s.name }} <span class="ax-ctxw-num">{{ s.v }}</span>
        </li>
        <li v-if="result.dropped" class="s-dropped"><i />已丢弃的历史（不再发送） <span class="ax-ctxw-num">{{ result.dropped }}</span></li>
      </ul>
    </div>

    <div class="ax-ctxw-ctrl">
      <label class="ax-range">
        <span class="ax-range-top"><span>对话轮数</span><output :for="`${uid}-r`">{{ rounds }} 轮</output></span>
        <input :id="`${uid}-r`" v-model.number="rounds" type="range" min="0" max="30" step="1" />
      </label>
      <label class="ax-range">
        <span class="ax-range-top"><span>读入的文件</span><output :for="`${uid}-f`">{{ files }} 个</output></span>
        <input :id="`${uid}-f`" v-model.number="files" type="range" min="0" max="10" step="1" />
      </label>
      <label class="ax-range">
        <span class="ax-range-top"><span>接入的工具服务</span><output :for="`${uid}-s`">{{ servers }} 个</output></span>
        <input :id="`${uid}-s`" v-model.number="servers" type="range" min="0" max="8" step="1" />
      </label>
      <label class="ax-check">
        <input v-model="longRules" type="checkbox" />
        <span>规则文件写成长篇说明书</span>
      </label>
    </div>

    <fieldset class="ax-seg">
      <legend>超出窗口时<span v-if="!over" class="ax-seg-hint">（先把滑块拉到超出，再切换看看）</span></legend>
      <label v-for="m in modes" :key="m.key" class="ax-seg-opt">
        <input v-model="mode" type="radio" :name="`${uid}-mode`" :value="m.key" />
        <span class="ax-seg-name">{{ m.name }}</span>
        <span class="ax-seg-who">{{ m.who }}</span>
      </label>
    </fieldset>

    <figcaption class="ax-cap ax-verdict" :class="`is-${verdict.tone}`" aria-live="polite">
      {{ verdict.text }}
    </figcaption>
    <p class="ax-note">数字是示意单位，用来看比例，不对应任何具体模型。三种结局由谁负责：报错是模型 API 的行为，丢弃和压缩是在 API 之外由聊天应用或 Agent 工具做的。</p>
  </figure>
</template>
