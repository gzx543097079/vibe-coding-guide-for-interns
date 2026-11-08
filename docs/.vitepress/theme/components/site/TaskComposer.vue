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
  structure: '写清目标、已知情况、范围和检查方式。',
  feature: '说明功能、参考实现、能单独运行的小步骤和测试。',
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
    `要做什么：${current.value.title}。${project.value.trim() || '【一句话说明要完成什么】'}`,
    '',
    '已知情况：',
    `- 项目与文件：${scope.value.trim() || '【项目与相关文件】'}`,
    `- 现象或依据：${evidence.value.trim() || '【复现、报错、数据或参考实现】'}`,
    '',
    '改动范围：',
    '- 只修改与任务相关的文件；沿用项目已有约定，不引入未确认的依赖。',
    '- 不确定的 API 或行为明确标出，不编造路径、数据或结果。',
    '',
    '怎么检查：',
    `- ${acceptance.value.trim() || '【可以运行或观察到的结果，以及对应检查命令】'}`,
    '',
    `写之前再看一眼：${hint.value}`,
    '回复里请写：改了哪些文件、实际执行过的检查，以及还没验证的部分。',
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
        <h2 id="task-composer-title">把需求写清楚</h2>
        <p>把已知的情况填进去，右边会跟着变成一段完整的话。没填的地方会留成待补的提示。</p>
      </div>
      <a class="task-composer-link" :href="withBase('/growth/prompt-templates')"
        >看看别的写法<SiteIcon name="arrow" :size="16"
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
          <span>已知情况</span>
          <textarea v-model="evidence" rows="3" placeholder="复现步骤、报错原文、参考实现或测量数据" />
        </label>
        <label>
          <span>怎么检查</span>
          <textarea v-model="acceptance" rows="3" placeholder="可运行或可观察的结果，以及检查命令" />
        </label>
      </div>
      <div class="task-result">
        <div class="task-result-head">
          <div>
            <strong>写好的内容</strong>
            <span>{{ filled }} / 4 项已填</span>
          </div>
          <button class="task-copy" type="button" @click="copy">
            <SiteIcon :name="copied === 'done' ? 'check' : 'copy'" :size="16" />{{
              copied === 'done'
                ? '已复制'
                : copied === 'fail'
                  ? '复制失败，请手动选中'
                  : '复制文字'
            }}
          </button>
        </div>
        <pre tabindex="0">{{ brief }}</pre>
        <div class="task-result-foot">
          <span>{{ hint }}</span>
          <button type="button" @click="reset">清空</button>
        </div>
        <span class="sr-only" aria-live="polite">{{
          copied === 'done' ? '文字已复制' : copied === 'fail' ? '复制失败，请手动选中文字' : ''
        }}</span>
      </div>
    </div>
  </section>
</template>
