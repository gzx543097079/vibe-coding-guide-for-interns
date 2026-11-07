<script setup lang="ts">
// Agent 循环：观察 → 思考 → 调用工具 → 结果回传，转一圈或几圈后结束
// 左边是循环环，指针用 rotate 指向当前阶段；右边是随步骤增长的上下文，以及当前步骤的说明或报文
// preset：agent（修复失败的测试）/ api（一次工具调用的 API 往返）
import { computed } from 'vue'
import AiStepBar from './AiStepBar.vue'
import { useStepper } from './useStepper'

type Phase = 'observe' | 'think' | 'act' | 'result' | 'done'
interface Ctx {
  kind: 'you' | 'rule' | 'model' | 'tool' | 'result'
  text: string
}
interface Step {
  phase: Phase
  label: string
  text: string
  add?: Ctx[]
  code?: string
  codeTitle?: string
}

const props = defineProps<{ preset?: 'agent' | 'api' }>()

const phases: { key: Exclude<Phase, 'done'>; name: string; sub: string }[] = [
  { key: 'observe', name: '观察', sub: '读上下文' },
  { key: 'think', name: '思考', sub: '决定下一步' },
  { key: 'act', name: '调用工具', sub: '读写文件、跑命令' },
  { key: 'result', name: '结果回传', sub: '输出进上下文' },
]

const presets: Record<'agent' | 'api', { title: string; steps: Step[] }> = {
  agent: {
    title: '任务：让 npm test 通过',
    steps: [
      {
        phase: 'observe',
        label: '收到任务',
        text: '上下文里现在有三样东西：你的一句话、项目规则文件、可用工具清单。模型能「看到」的只有这些。',
        add: [
          { kind: 'you', text: '你：npm test 挂了，帮我修好' },
          { kind: 'rule', text: 'AGENTS.md：测试命令是 npm test' },
        ],
      },
      {
        phase: 'think',
        label: '先看报错',
        text: '还不知道哪里错，模型决定先跑测试看失败信息，于是输出一个执行命令的请求。它只是「请求」，自己不执行任何东西。',
        add: [{ kind: 'model', text: '模型：请求执行 npm test' }],
      },
      {
        phase: 'act',
        label: '跑测试',
        text: 'Agent 程序在你的终端里执行 npm test。是否需要批准，由当前沙箱、审批策略和规则共同决定。',
      },
      {
        phase: 'result',
        label: '读到失败',
        text: '命令输出被原样放回上下文。第一圈结束，模型带着新信息进入下一圈。',
        add: [{ kind: 'result', text: 'sum.test.ts:12 expected 3, received 2' }],
      },
      {
        phase: 'think',
        label: '读实现',
        text: '第二圈：报错指向 sum，模型决定先读源码再改，不靠猜。',
        add: [{ kind: 'model', text: '模型：请求读取 src/sum.ts' }],
      },
      {
        phase: 'result',
        label: '找到原因',
        text: '读到的文件内容进入上下文：循环少加了最后一项。这一圈「调用工具」和「结果回传」一气呵成。',
        add: [{ kind: 'result', text: 'src/sum.ts：for (i = 0; i < n - 1; i++)' }],
      },
      {
        phase: 'act',
        label: '改代码',
        text: '第三圈：模型请求编辑文件，Agent 写入改动，再跑一次测试确认。',
        add: [{ kind: 'model', text: '模型：请求修改 src/sum.ts，再跑 npm test' }],
      },
      {
        phase: 'result',
        label: '测试通过',
        text: '新的测试输出回到上下文。上下文越滚越长，这就是长任务会把窗口占满的原因。',
        add: [{ kind: 'result', text: 'Tests: 12 passed' }],
      },
      {
        phase: 'done',
        label: '结束并汇报',
        text: '模型判断任务完成，不再请求工具，直接回复文字，循环退出。接下来轮到你：看 diff、自己再跑一遍。',
        add: [{ kind: 'model', text: '模型：已修复，改了 src/sum.ts 一行' }],
      },
    ],
  },
  api: {
    title: 'OpenAI Responses API：一次函数调用往返',
    steps: [
      {
        phase: 'observe',
        label: '发请求',
        text: '注册 function 工具，parameters 描述参数结构。这里省略 model 等字段，只演示 OpenAI Responses API；不是 Codex CLI 的内部报文。',
        add: [{ kind: 'you', text: '用户：北京现在多少度？' }],
        codeTitle: '请求体节选',
        code: JSON.stringify({
          tools: [{
            type: 'function',
            name: 'get_weather',
            description: '查询城市的当前天气',
            parameters: {
              type: 'object',
              properties: { city: { type: 'string' } },
              required: ['city'],
              additionalProperties: false,
            },
            strict: true,
          }],
          input: '北京现在多少度？',
        }, null, 2),
      },
      {
        phase: 'think',
        label: '模型要调用',
        text: '响应 output 里出现 function_call。arguments 是 JSON 字符串；call_id 用来关联后续执行结果。响应完成不代表你的函数已经执行。',
        add: [{ kind: 'model', text: 'function_call：get_weather，city 为北京' }],
        codeTitle: '响应节选（ID 为示意）',
        code: JSON.stringify({
          id: 'resp_01',
          output: [{
            type: 'function_call',
            id: 'fc_01',
            call_id: 'call_01',
            name: 'get_weather',
            arguments: JSON.stringify({ city: '北京' }),
          }],
        }, null, 2),
      },
      {
        phase: 'act',
        label: '你的代码执行',
        text: '程序解析参数，检查授权、校验输入，再执行天气查询。模型给出的是调用请求，不会自动替你执行这个函数。',
        codeTitle: '应用侧伪代码',
        code: `const args = JSON.parse(call.arguments)
// 先验证工具名、参数与授权，再执行；示例省略实现
const output = await tools[call.name](args)
// 示例结果：晴，12°C`,
      },
      {
        phase: 'result',
        label: '回传结果',
        text: '用 function_call_output 回传执行结果，call_id 对应刚才的调用。previous_response_id 接续先前响应；也可以自行保留完整输入与输出历史。',
        add: [{ kind: 'result', text: 'function_call_output：晴，12°C（示例）' }],
        codeTitle: '后续请求节选（省略 model、tools）',
        code: JSON.stringify({
          previous_response_id: 'resp_01',
          input: [{
            type: 'function_call_output',
            call_id: 'call_01',
            output: '晴，12°C',
          }],
        }, null, 2),
      },
      {
        phase: 'done',
        label: '模型作答',
        text: '模型根据结果回答。如果 output 里仍有 function_call，就继续检查和处理；没有调用时，还要检查 status、错误与验收条件，不能仅凭文字宣告完成。',
        add: [{ kind: 'model', text: '模型：北京现在晴，12°C。（虚构示例）' }],
        codeTitle: '最终响应节选',
        code: JSON.stringify({
          status: 'completed',
          output: [{
            type: 'message',
            role: 'assistant',
            content: [{ type: 'output_text', text: '北京现在晴，12°C。' }],
          }],
        }, null, 2),
      },
    ],
  },
}

const data = computed(() => presets[props.preset ?? 'agent'])
const steps = computed(() => data.value.steps)
const { step, playing, play, pick } = useStepper(() => steps.value.length, { interval: 2800 })
const cur = computed(() => steps.value[step.value])

// 指针角度：只朝顺时针方向累加，第二圈继续转而不是倒回去
const order: Phase[] = ['observe', 'think', 'act', 'result']
const angles = computed(() => {
  let a = 0
  let last = 0
  return steps.value.map((s, i) => {
    if (s.phase === 'done') return a
    const idx = order.indexOf(s.phase)
    if (i === 0) {
      a = idx * 90
    } else {
      let d = idx - last
      if (d <= 0) d += 4
      a += d * 90
    }
    last = idx
    return a
  })
})
const angle = computed(() => angles.value[step.value])

// 第几圈：每经过一次「结果回传 → 思考」算新的一圈
const round = computed(() => {
  let r = 1
  for (let i = 1; i <= step.value; i++) {
    const p = order.indexOf(steps.value[i - 1].phase)
    const q = order.indexOf(steps.value[i].phase)
    if (q >= 0 && p >= 0 && q <= p) r++
  }
  return r
})

const ctx = computed(() => {
  const out: (Ctx & { fresh: boolean })[] = []
  steps.value.forEach((s, i) => {
    if (i > step.value || !s.add) return
    s.add.forEach((c) => out.push({ ...c, fresh: i === step.value }))
  })
  return out
})

const kindName: Record<Ctx['kind'], string> = {
  you: '你的话',
  rule: '规则',
  model: '模型输出',
  tool: '工具',
  result: '工具结果',
}
</script>

<template>
  <figure class="ax-fig ax-loop" data-mod="ai" :class="{ 'is-done': cur.phase === 'done' }">
    <div class="ax-loop-main">
      <div class="ax-loop-ring-wrap">
        <div class="ax-loop-ring">
          <svg class="ax-loop-track" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="78" />
            <!-- 四个顺时针箭头，位于相邻两个阶段之间 -->
            <path
              v-for="r in [-45, 45, 135, 225]"
              :key="r"
              class="ax-loop-head"
              d="M172.5 96h11l-5.5 7z"
              :transform="`rotate(${r} 100 100)`"
            />
          </svg>
          <div class="ax-loop-arm" :style="{ transform: `rotate(${angle}deg)` }" aria-hidden="true">
            <span class="ax-loop-dot" />
          </div>
          <div class="ax-loop-hub">
            <span class="ax-loop-round">第 {{ round }} 圈</span>
            <span class="ax-loop-hub-sub">上下文 {{ ctx.length }} 条</span>
          </div>
          <div
            v-for="(p, i) in phases"
            :key="p.key"
            class="ax-loop-node"
            :class="[`at-${i}`, { 'is-on': cur.phase === p.key }]"
          >
            <span class="ax-loop-node-name">{{ p.name }}</span>
            <span class="ax-loop-node-sub">{{ p.sub }}</span>
          </div>
        </div>
        <p class="ax-loop-exit" :class="{ 'is-on': cur.phase === 'done' }">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
          不再调用工具 → 回复并退出循环
        </p>
      </div>

      <div class="ax-loop-side">
        <p class="ax-loop-title">{{ data.title }}</p>
        <div v-if="cur.code" class="ax-code">
          <p class="ax-code-head">{{ cur.codeTitle }}</p>
          <pre><code>{{ cur.code }}</code></pre>
        </div>
        <ol v-else class="ax-ctx" aria-label="当前上下文">
          <li v-for="(c, i) in ctx" :key="i" class="ax-ctx-item" :class="[`k-${c.kind}`, { 'is-fresh': c.fresh }]">
            <span class="ax-ctx-kind">{{ kindName[c.kind] }}</span>
            <span class="ax-ctx-text">{{ c.text }}</span>
          </li>
        </ol>
      </div>
    </div>

    <AiStepBar
      :labels="steps.map((s) => s.label)"
      :step="step"
      :playing="playing"
      label="选择循环中的步骤"
      @pick="pick"
      @play="play"
    />
    <figcaption class="ax-cap" aria-live="polite">{{ cur.text }}</figcaption>
  </figure>
</template>
