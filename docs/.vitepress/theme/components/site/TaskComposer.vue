<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { copyText } from '../../composables/clipboard'
import { prompts } from '../../data/prompts'
import SiteIcon from './SiteIcon.vue'

const scenario = ref(prompts[0].id)
const project = ref('')
const scope = ref('')
const evidence = ref('')
const acceptance = ref('')
const copied = ref<'idle' | 'done' | 'fail'>('idle')

const current = computed(
  () => prompts.find((p) => p.id === scenario.value) ?? prompts[0],
)
const placeholders: Record<string, string> = {
  structure: '把目标、上下文、约束和验收标准写清楚。',
  feature: '说明功能、参考实现、可单独验证的步骤和测试。',
  bugfix: '附复现步骤、实际与预期、完整报错和已排除的可能。',
  refactor: '划定行为边界、现有测试和允许改动的文件范围。',
  testing: '写清输入规则、边界值、异常预期和测试框架。',
  review: '附改动目的与 diff，按正确性、安全和 API 逐项检查。',
}
const hint = computed(
  () => placeholders[scenario.value] ?? current.value.scene,
)
const filled = computed(() =>
  [project.value, scope.value, evidence.value, acceptance.value].filter(
    (v) => v.trim().length > 0,
  ).length,
)
const brief = computed(() =>
  [
    `任务：${current.value.title}`,
    `目标：${project.value.trim() || '【一句话说明要完成什么】'}`,
    '',
    '背景与证据：',
    `- 项目 / 技术栈：${scope.value.trim() || '【项目与相关文件】'}`,
    `- 现象 / 依据：${evidence.value.trim() || '【复现、报错、数据或参考实现】'}`,
    '',
    '约束：',
    '- 只修改与任务相关的文件；沿用项目已有约定，不引入未确认的依赖。',
    '- 不确定的 API 或行为明确标出，不编造路径、数据或结果。',
    '',
    '验收标准：',
    `- ${acceptance.value.trim() || '【可以运行或观察到的结果，以及对应检查命令】'}`,
    '',
    `发送前检查：${hint.value}`,
    '完成后报告改动、实际执行过的验证，以及尚未验证的部分。',
  ].join('\n'),
)

async function copy() {
  copied.value = (await copyText(brief.value)) ? 'done' : 'fail'
  window.setTimeout(() => (copied.value = 'idle'), 1800)
}
function reset() {
  project.value = ''
  scope.value = ''
  evidence.value = ''
  acceptance.value = ''
  copied.value = 'idle'
}
</script>

<template>
  <section class="task-composer" aria-labelledby="task-composer-title">
    <div class="task-composer-head">
      <div>
        <h2 id="task-composer-title">把需求写成可验收的任务</h2>
        <p>补齐目标、证据和验收，再交给 Codex。四个字段都留着也可以先复制结构。</p>
      </div>
      <a class="task-composer-link" :href="withBase('/growth/prompt-templates')"
        >查看模板说明<SiteIcon name="arrow" :size="16"
      /></a>
    </div>
    <div class="task-composer-grid">
      <div class="task-fields">
        <label class="task-scenario">
          <span>任务类型</span>
          <select v-model="scenario">
            <option v-for="p in prompts" :key="p.id" :value="p.id">
              {{ p.title }}
            </option>
          </select>
        </label>
        <label>
          <span>目标</span>
          <input v-model="project" placeholder="例如：修复登录页密码含空格时校验失败" />
        </label>
        <label>
          <span>项目与范围</span>
          <input v-model="scope" placeholder="例如：Vue 3，src/views/Login.vue" />
        </label>
        <label>
          <span>现象或依据</span>
          <textarea v-model="evidence" rows="3" placeholder="复现步骤、报错原文、参考实现或测量数据" />
        </label>
        <label>
          <span>怎样算完成</span>
          <textarea v-model="acceptance" rows="3" placeholder="可运行或可观察的结果，以及检查命令" />
        </label>
      </div>
      <div class="task-result">
        <div class="task-result-head">
          <div>
            <strong>任务简报</strong>
            <span>{{ filled }} / 4 项已填写</span>
          </div>
          <button class="task-copy" type="button" @click="copy">
            <SiteIcon :name="copied === 'done' ? 'check' : 'copy'" :size="16" />{{
              copied === 'done'
                ? '已复制'
                : copied === 'fail'
                  ? '复制失败，请手动选择'
                  : '复制简报'
            }}
          </button>
        </div>
        <pre tabindex="0">{{ brief }}</pre>
        <div class="task-result-foot">
          <span>{{ hint }}</span>
          <button type="button" @click="reset">清空填写</button>
        </div>
        <span class="sr-only" aria-live="polite">{{
          copied === 'done' ? '任务简报已复制' : copied === 'fail' ? '复制失败，请手动选择简报' : ''
        }}</span>
      </div>
    </div>
  </section>
</template>
