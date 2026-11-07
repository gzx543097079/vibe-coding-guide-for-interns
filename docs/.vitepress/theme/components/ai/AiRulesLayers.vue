<script setup lang="ts">
// Codex 规则发现：全局约定、项目路径及同层 override；Skill 按需加载
import { computed, ref } from 'vue'

interface Layer {
  key: string
  name: string
  path: string
  who: string
  when: string
  ondemand?: 'sub' | 'skill'
}

const layers: Layer[] = [
  {
    key: 'user', name: '全局约定', path: '~/.codex/AGENTS.md',
    who: '你的跨项目约定；配置目录可由 CODEX_HOME 调整',
    when: '会话建立时发现；同层有 AGENTS.override.md 时取后者',
  },
  {
    key: 'project', name: '项目约定', path: './AGENTS.md',
    who: '团队共享的项目规则', when: '从项目根目录到启动目录逐层发现，每层最多取一个文件',
  },
  {
    key: 'override', name: '同层替代', path: './AGENTS.override.md',
    who: '替代同一目录的 AGENTS.md', when: '发现时优先于同层 AGENTS.md，不是再加一份',
  },
  {
    key: 'sub', name: '子项目约定', path: 'packages/web/AGENTS.md',
    who: '该子项目的更具体约定', when: '从 packages/web 启动时纳入发现路径', ondemand: 'sub',
  },
  {
    key: 'skill', name: 'Skill', path: '.agents/skills/<名字>/SKILL.md',
    who: '某类任务的工作流程', when: '先发现名称与描述，选用时读取完整说明', ondemand: 'skill',
  },
]

const sel = ref('project')
const cur = computed(() => layers.find((l) => l.key === sel.value)!)
const inSub = ref(false)
const useOverride = ref(false)
const useSkill = ref(false)

// 路径规则与 Skill 分开展示，避免暗示打开子目录即可自动加载规则
const ctx = computed(() => {
  const out: { key: string; text: string; small?: boolean }[] = [
    { key: 'user', text: '全局 AGENTS.md' },
    useOverride.value
      ? { key: 'override', text: '项目 AGENTS.override.md（替代同层 AGENTS.md）' }
      : { key: 'project', text: '项目 AGENTS.md' },
  ]
  if (inSub.value) out.push({ key: 'sub', text: 'packages/web/AGENTS.md' })
  out.push({ key: 'skill', text: useSkill.value ? 'SKILL.md 完整说明' : 'Skill 名称与描述', small: !useSkill.value })
  out.push({ key: 'chat', text: '你的消息、读到的文件……' })
  return out
})
</script>

<template>
  <figure class="ax-fig ax-rl" data-mod="ai">
    <div class="ax-rl-grid">
      <div class="ax-rl-layers" role="group" aria-label="选择一层规则">
        <button
          v-for="l in layers"
          :key="l.key"
          type="button"
          class="ax-rl-layer"
          :class="{ 'is-ondemand': l.ondemand }"
          :aria-pressed="sel === l.key"
          @click="sel = l.key"
        >
          <span class="ax-rl-name">{{ l.name }}</span>
          <code class="ax-rl-path">{{ l.path }}</code>
        </button>
      </div>

      <div class="ax-rl-side">
        <div class="ax-rl-detail" aria-live="polite">
          <p class="ax-rl-detail-name">{{ cur.name }}</p>
          <dl>
            <dt>给谁</dt>
            <dd>{{ cur.who }}</dd>
            <dt>何时进上下文</dt>
            <dd>{{ cur.when }}</dd>
          </dl>
        </div>
        <div class="ax-rl-ctx">
          <p class="ax-rl-ctx-head">本例加载的内容</p>
          <ol>
            <li
              v-for="c in ctx"
              :key="c.key"
              :class="{ 'is-sel': c.key === sel, 'is-small': c.small, 'is-chat': c.key === 'chat' }"
            >
              {{ c.text }}
            </li>
          </ol>
          <div class="ax-rl-toggles">
            <label class="ax-check">
              <input v-model="inSub" type="checkbox" />
              <span>从 packages/web/ 启动新会话</span>
            </label>
            <label class="ax-check">
              <input v-model="useOverride" type="checkbox" />
              <span>项目根目录有 AGENTS.override.md</span>
            </label>
            <label class="ax-check">
              <input v-model="useSkill" type="checkbox" />
              <span>调用这个 Skill</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <figcaption class="ax-cap">
      示意前提：这些文件都存在且在加载上限内。路径规则从全局到启动目录逐层收集，同层 override 替代普通文件；Skill 按需加载。规则不能替代沙箱与审批。
    </figcaption>
  </figure>
</template>
