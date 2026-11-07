<script setup lang="ts">
// MCP 时序图：你、Host 里的 Client、模型、MCP Server、外部系统五条泳道
// 点任一条消息或按顺序播放；已经发生的消息正常显示，后面的淡化。窄屏改成竖排卡片
import { computed } from 'vue'
import { useStepper } from './useStepper'

const lanes = [
  { key: 'you', name: '你' },
  { key: 'client', name: 'Host / Client', sub: '如 Codex' },
  { key: 'model', name: '模型' },
  { key: 'server', name: 'MCP Server' },
  { key: 'ext', name: '外部系统', sub: '如工单系统 API' },
] as const
type Lane = (typeof lanes)[number]['key']

interface Msg {
  from: Lane
  to: Lane
  label: string
  phase: string
  text: string
  code?: string
}

const msgs: Msg[] = [
  {
    from: 'client',
    to: 'server',
    label: 'tools/list',
    phase: '发现',
    text: 'Client 问 MCP Server 有哪些工具。通常在启动或连接时做一次，不等你开口。',
    code: `{ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }`,
  },
  {
    from: 'server',
    to: 'client',
    label: '工具清单',
    phase: '发现',
    text: '服务器返回每个工具的名字、说明和参数结构（inputSchema）。这些说明会进入模型的上下文，也会占用 token。',
    code: `{
  "jsonrpc": "2.0", "id": 1,
  "result": {
    "tools": [{
      "name": "get_issue",
      "description": "按编号读取一条工单",
      "inputSchema": {
        "type": "object",
        "properties": { "number": { "type": "integer" } },
        "required": ["number"]
      }
    }]
  }
}`,
  },
  { from: 'you', to: 'client', label: '「看下 #42 讲了什么」', phase: '提问', text: '你在 Host 里提问。' },
  {
    from: 'client',
    to: 'model',
    label: '问题 + 工具清单',
    phase: '提问',
    text: 'Client 把你的问题和工具说明一起交给模型。模型和 MCP Server 之间没有直接连接。',
  },
  {
    from: 'model',
    to: 'client',
    label: '要调用 get_issue',
    phase: '选择',
    text: '模型判断需要这条工单的内容，输出一个调用意图：工具名和参数。它自己不发请求。',
    code: `{ "name": "get_issue", "arguments": { "number": 42 } }`,
  },
  {
    from: 'client',
    to: 'you',
    label: '是否允许？',
    phase: '选择',
    text: '规范建议始终有人能拒绝工具调用，并在调用前让用户看到参数。很多 Host 会在这里弹窗确认。',
  },
  {
    from: 'client',
    to: 'server',
    label: 'tools/call',
    phase: '调用',
    text: 'Client 按模型给的名字和参数，向 MCP Server 发起调用。',
    code: `{
  "jsonrpc": "2.0", "id": 2,
  "method": "tools/call",
  "params": { "name": "get_issue", "arguments": { "number": 42 } }
}`,
  },
  {
    from: 'server',
    to: 'ext',
    label: '调用工单 API',
    phase: '调用',
    text: '真正干活的是 MCP Server：它用自己的凭据去访问外部系统。它能做什么，取决于这份凭据的权限。',
  },
  { from: 'ext', to: 'server', label: '工单数据', phase: '调用', text: '外部系统返回数据。' },
  {
    from: 'server',
    to: 'client',
    label: 'content + isError',
    phase: '调用',
    text: '结果放在 content 里。工具本身执行失败（比如接口限流）时，isError 为 true，错误说明也会交给模型，方便它换个参数重试。',
    code: `{
  "jsonrpc": "2.0", "id": 2,
  "result": {
    "content": [{ "type": "text", "text": "#42 登录页在 Safari 下白屏……" }],
    "isError": false
  }
}`,
  },
  {
    from: 'client',
    to: 'model',
    label: '工具结果',
    phase: '回答',
    text: '结果进入模型的上下文。注意：这段内容来自外部，里面要是写着「忽略之前的指令」，模型也会读到。',
  },
  { from: 'model', to: 'you', label: '整理后的回答', phase: '回答', text: '模型基于工具结果回答你，经 Client 显示出来。' },
]

const { step, playing, play, pick } = useStepper(() => msgs.length, { interval: 2200 })
const cur = computed(() => msgs[step.value])
const col = (k: Lane) => lanes.findIndex((l) => l.key === k)
const laneName = (k: Lane) => lanes[col(k)].name

function rowStyle(m: Msg) {
  const a = col(m.from)
  const b = col(m.to)
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  return { gridColumn: `${lo + 1} / ${hi + 2}`, '--k': hi - lo + 1 }
}
</script>

<template>
  <figure class="ax-fig ax-seq" data-mod="ai">
    <div class="ax-seq-head" aria-hidden="true">
      <span v-for="l in lanes" :key="l.key" class="ax-seq-lane">
        <span class="ax-seq-lane-name">{{ l.name }}</span>
        <span v-if="'sub' in l" class="ax-seq-lane-sub">{{ l.sub }}</span>
      </span>
    </div>
    <ol class="ax-seq-body">
      <li v-for="(l, i) in lanes" :key="l.key" class="ax-seq-life" :style="{ '--c': i }" aria-hidden="true" />
      <li v-for="(m, i) in msgs" :key="i" class="ax-seq-row" :class="{ 'is-past': i < step, 'is-cur': i === step, 'is-future': i > step }">
        <button
          type="button"
          class="ax-seq-msg"
          :class="col(m.to) < col(m.from) ? 'is-left' : 'is-right'"
          :style="rowStyle(m)"
          :aria-pressed="i === step"
          :aria-label="`第 ${i + 1} 步：${laneName(m.from)} 到 ${laneName(m.to)}，${m.label}`"
          @click="pick(i)"
        >
          <span class="ax-seq-label">
            <span class="ax-seq-no">{{ i + 1 }}</span>
            <span class="ax-seq-route">{{ laneName(m.from) }} → {{ laneName(m.to) }}</span>
            <span class="ax-seq-text">{{ m.label }}</span>
          </span>
          <span class="ax-seq-line" aria-hidden="true" />
        </button>
      </li>
    </ol>

    <div class="ax-seq-foot">
      <span class="ax-seq-phase">{{ cur.phase }} · 第 {{ step + 1 }} / {{ msgs.length }} 步</span>
      <button type="button" class="ax-play" @click="play">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path v-if="!playing" d="M5 3.5v9l7-4.5-7-4.5z" />
          <path v-else d="M5 3.5v9M11 3.5v9" />
        </svg>
        {{ playing ? '暂停' : '按顺序播放' }}
      </button>
    </div>
    <figcaption class="ax-cap" aria-live="polite">{{ cur.text }}</figcaption>
    <div v-if="cur.code" class="ax-code">
      <p class="ax-code-head">报文节选：省略了 _meta、resultType 等字段，工具是虚构的示例</p>
      <pre><code>{{ cur.code }}</code></pre>
    </div>
  </figure>
</template>
