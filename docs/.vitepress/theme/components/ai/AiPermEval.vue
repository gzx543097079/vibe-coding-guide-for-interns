<script setup lang="ts">
// 权限规则求值：选一条命令，按 deny → ask → allow 的顺序找第一条命中的规则
// 简化版匹配：Bash(…) 里的 * 匹配任意字符；cat / head / tail 读文件时套用 Read 规则
import { computed, ref, useId } from 'vue'

const uid = useId()
const rules = {
  deny: ['Read(./.env)', 'Bash(git push *)', 'Bash(rm *)'],
  ask: ['Bash(npm install *)'],
  allow: ['Bash(npm run *)', 'Bash(git commit *)'],
}
type Stage = keyof typeof rules

const samples: { cmd: string; note?: string }[] = [
  { cmd: 'npm run test' },
  { cmd: 'npm install lodash' },
  { cmd: 'git push origin main', note: '想推送只能你自己在终端里执行，allow 规则也开不了这个口子。' },
  { cmd: 'rm -rf dist' },
  { cmd: 'cat .env', note: 'cat、head、tail 这类能认出来的读文件命令，也受 Read 规则约束。' },
  {
    cmd: 'node scripts/print-env.js',
    note: '脚本自己去打开 .env 时，Read(./.env) 拦不住：规则只管认得出的文件命令。要从系统层面挡住，得开沙箱。',
  },
  { cmd: 'curl https://example.com' },
]

const cmd = ref(samples[0].cmd)

function toRegex(glob: string) {
  return new RegExp('^' + glob.split('*').map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$')
}
function matches(rule: string, command: string) {
  const m = rule.match(/^(\w+)\((.*)\)$/)
  if (!m) return false
  const [, tool, spec] = m
  const c = command.trim()
  if (tool === 'Bash') return toRegex(spec).test(c)
  if (tool === 'Read') {
    const f = c.match(/^(?:cat|head|tail|less)\s+(?:-\S+\s+)*(\S+)$/)
    if (!f) return false
    const norm = (p: string) => p.replace(/^\.\//, '')
    return norm(f[1]) === norm(spec)
  }
  return false
}

const trace = computed(() => {
  const out: { stage: Stage; hit?: string }[] = []
  for (const stage of ['deny', 'ask', 'allow'] as Stage[]) {
    const hit = rules[stage].find((r) => matches(r, cmd.value))
    out.push({ stage, hit })
    if (hit) break
  }
  return out
})
const final = computed(() => trace.value.find((t) => t.hit))
const verdict = computed(() => {
  const f = final.value
  if (!f) return { tone: 'ask', text: '三类规则都没命中，按当前权限模式处理。默认模式下，跑命令前会先问你。' }
  if (f.stage === 'deny') return { tone: 'deny', text: `命中 deny 规则 ${f.hit}，直接拒绝，后面的规则不再看。` }
  if (f.stage === 'ask') return { tone: 'ask', text: `命中 ask 规则 ${f.hit}，每次都弹窗问你。` }
  return { tone: 'allow', text: `命中 allow 规则 ${f.hit}，不用问你就执行。` }
})
const note = computed(() => samples.find((s) => s.cmd === cmd.value.trim())?.note)
const stageName: Record<Stage, string> = { deny: '拒绝 deny', ask: '询问 ask', allow: '允许 allow' }
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
        v-for="stage in (['deny', 'ask', 'allow'] as const)"
        :key="stage"
        class="ax-perm-stage"
        :class="[
          `is-${stage}`,
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
          <li v-for="r in rules[stage]" :key="r" :class="{ 'is-rule-hit': final?.hit === r }">
            <code>{{ r }}</code>
          </li>
        </ul>
      </li>
    </ol>

    <figcaption class="ax-cap ax-verdict" :class="`is-${verdict.tone}`" aria-live="polite">
      {{ verdict.text }}<template v-if="note"> {{ note }}</template>
    </figcaption>
    <p class="ax-note">简化演示：只模拟了 * 通配和几个读文件命令。真实的匹配规则更细，以 Claude Code 权限文档为准。</p>
  </figure>
</template>
