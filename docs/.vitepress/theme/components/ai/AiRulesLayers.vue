<script setup lang="ts">
// 规则文件加载层级（以 Claude Code 为例）：点每一层看路径和作用；
// 两个开关演示「按需加载」：子目录的 CLAUDE.md、skill 的完整内容
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
    key: 'org',
    name: '组织策略',
    path: '由 IT 部署到系统目录',
    who: '公司统一下发，所有人生效',
    when: '每次启动都加载',
  },
  {
    key: 'user',
    name: '用户级',
    path: '~/.claude/CLAUDE.md',
    who: '只给你自己，所有项目生效',
    when: '每次启动都加载',
  },
  {
    key: 'project',
    name: '项目级',
    path: './CLAUDE.md 或 ./.claude/CLAUDE.md',
    who: '提交进仓库，整个团队共享',
    when: '每次启动都加载；没有 CLAUDE.md 时可以读 AGENTS.md',
  },
  {
    key: 'local',
    name: '本地级',
    path: './CLAUDE.local.md',
    who: '只给你自己、只在这个项目；加进 .gitignore',
    when: '每次启动都加载',
  },
  {
    key: 'sub',
    name: '子目录',
    path: 'packages/web/CLAUDE.md',
    who: '只管这个子目录',
    when: '读到这个目录里的文件时才加载',
    ondemand: 'sub',
  },
  {
    key: 'skill',
    name: 'Skill',
    path: '.claude/skills/<名字>/SKILL.md',
    who: '一套具体做法，比如发布流程',
    when: '平时只加载 description；被调用时才加载全文',
    ondemand: 'skill',
  },
]

const sel = ref('project')
const cur = computed(() => layers.find((l) => l.key === sel.value)!)
const inSub = ref(false)
const useSkill = ref(false)

// 右侧上下文：按加载顺序，后加载的排在后面
const ctx = computed(() => {
  const out: { key: string; text: string; small?: boolean }[] = [
    { key: 'org', text: '组织策略' },
    { key: 'user', text: '用户级 CLAUDE.md' },
    { key: 'project', text: '项目级 CLAUDE.md' },
    { key: 'local', text: 'CLAUDE.local.md' },
    { key: 'skill', text: useSkill.value ? 'SKILL.md 全文' : 'skill 的 description', small: !useSkill.value },
  ]
  if (inSub.value) out.push({ key: 'sub', text: 'packages/web/CLAUDE.md' })
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
          <p class="ax-rl-ctx-head">上下文里的顺序</p>
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
              <span>Agent 读到 packages/web/ 里的文件</span>
            </label>
            <label class="ax-check">
              <input v-model="useSkill" type="checkbox" />
              <span>调用这个 skill</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <figcaption class="ax-cap">
      从宽到窄依次加载，后加载的排在上下文更后面。所有这些都只是「上下文」，模型会参考，但不保证照做；要硬性拦住某个操作，用权限规则。
    </figcaption>
  </figure>
</template>
