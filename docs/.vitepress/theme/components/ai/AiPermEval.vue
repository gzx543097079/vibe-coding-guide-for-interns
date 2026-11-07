<script setup lang="ts">
// 只演示 Codex prefix_rule 对简单命令的匹配，不执行任何输入
import { computed, ref, useId } from 'vue'

const uid = useId()
const rules = {
  forbidden: [['rm']],
  prompt: [['git', 'push'], ['npm', 'install']],
  allow: [['npm', 'run', 'build']],
}
type Stage = keyof typeof rules

const samples: { cmd: string; note?: string }[] = [
  { cmd: 'npm run build', note: 'allow 仅是前缀规则的决策，实际执行还要结合沙箱和其他限制。' },
  { cmd: 'npm install lodash' },
  { cmd: 'git push origin main', note: '这里只检查前缀，不会推送。本仓库仍要求在功能分支上提 PR。' },
  { cmd: 'rm -rf dist' },
  { cmd: 'git status', note: '没有显式命中，并不表示禁止或允许，要结合当前会话设置。' },
  { cmd: 'node scripts/check.js', note: '命令前缀不分析脚本的内容；要审查脚本和执行边界。' },
]
const cmd = ref(samples[0].cmd)
const tokens = computed(() => {
  const text = cmd.value.trim()
  // 引号、转义、重定向和命令组合需要真正的 shell 解析，本演示不模拟
  return text && /^[a-zA-Z0-9_./:=@%+,\s-]+$/.test(text) ? text.split(/\s+/) : null
})
const ruleText = (stage: Stage, pattern: string[]) =>
  `prefix_rule(pattern=${JSON.stringify(pattern)}, decision="${stage}")`
const trace = computed(() => {
  const out: { stage: Stage; hit?: string }[] = []
  if (!tokens.value) return out
  // 按严格程度检查，等价于对本例所有匹配规则取最严格的决策
  for (const stage of ['forbidden', 'prompt', 'allow'] as Stage[]) {
    const pattern = rules[stage].find((p) => p.every((t, i) => tokens.value![i] === t))
    out.push({ stage, hit: pattern ? ruleText(stage, pattern) : undefined })
    if (pattern) break
  }
  return out
})
const final = computed(() => trace.value.find((t) => t.hit))
const verdict = computed(() => {
  if (!tokens.value) return { tone: 'ask', text: '请输入简单命令。本演示不解析空输入、引号、变量或复合 shell 语法；不要用这里的结果判断真实命令安全。' }
  const f = final.value
  if (!f) return { tone: 'ask', text: '未命中本例规则，实际行为还要看沙箱、审批策略和其他规则。' }
  if (f.stage === 'forbidden') return { tone: 'deny', text: '命中 forbidden：这条规则禁止该调用。' }
  if (f.stage === 'prompt') return { tone: 'ask', text: '命中 prompt：规则要求进入审批流程，不等于已经批准。' }
  return { tone: 'allow', text: '命中 allow：前缀规则允许该调用；仍需结合执行环境的其他限制。' }
})
const note = computed(() => samples.find((s) => s.cmd === cmd.value.trim())?.note)
const stageName: Record<Stage, string> = { forbidden: '禁止 forbidden', prompt: '询问 prompt', allow: '允许 allow' }
</script>

<template>
  <figure class="ax-fig ax-perm" data-mod="ai">
    <div class="ax-perm-input">
      <label :for="`${uid}-cmd`" class="ax-perm-label">Agent 想执行</label>
      <div class="ax-perm-field">
        <span class="ax-perm-ps" aria-hidden="true">$</span>
        <input :id="`${uid}-cmd`" v-model="cmd" type="text" spellcheck="false" autocomplete="off" />
      </div>
      <div class="ax-perm-samples" role="group" aria-label="换一条命令">
        <button
          v-for="s in samples"
          :key="s.cmd"
          type="button"
          class="ax-chip is-code"
          :aria-pressed="cmd.trim() === s.cmd"
          @click="cmd = s.cmd"
        >
          {{ s.cmd }}
        </button>
      </div>
    </div>

    <ol class="ax-perm-stages">
      <li
        v-for="stage in (['forbidden', 'prompt', 'allow'] as const)"
        :key="stage"
        class="ax-perm-stage"
        :class="[
          `is-${stage === 'forbidden' ? 'deny' : stage === 'prompt' ? 'ask' : 'allow'}`,
          {
            'is-hit': final?.stage === stage,
            'is-skip': !trace.some((t) => t.stage === stage),
            'is-miss': trace.some((t) => t.stage === stage && !t.hit),
          },
        ]"
      >
        <p class="ax-perm-stage-head">
          <span>{{ stageName[stage] }}</span>
          <span class="ax-perm-state">
            {{ final?.stage === stage ? '命中' : trace.some((t) => t.stage === stage) ? '未命中' : '不再检查' }}
          </span>
        </p>
        <ul>
          <li v-for="r in rules[stage]" :key="r.join(' ')" :class="{ 'is-rule-hit': final?.hit === ruleText(stage, r) }">
            <code>{{ ruleText(stage, r) }}</code>
          </li>
        </ul>
      </li>
    </ol>

    <figcaption class="ax-cap ax-verdict" :class="`is-${verdict.tone}`" aria-live="polite">
      {{ verdict.text }}<template v-if="note"> {{ note }}</template>
    </figcaption>
    <p class="ax-note">只做简单参数前缀匹配，不会执行命令。真实 Codex 会解析更多 shell 结构；请用 codex execpolicy check 检查实际规则。</p>
  </figure>
</template>
