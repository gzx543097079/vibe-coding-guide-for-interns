<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'
import SiteIcon from './SiteIcon.vue'
const tab = ref('button')
const status = ref<'idle' | 'loading' | 'done'>('idle')
const enabled = ref(true)
const activeTab = ref('预览')
let timer: ReturnType<typeof setTimeout> | undefined
function submit() {
  if (status.value === 'loading') return
  clearTimeout(timer)
  status.value = 'loading'
  timer = setTimeout(() => {
    status.value = 'done'
  }, 1100)
}
function select(id: string) {
  tab.value = id
  status.value = 'idle'
  clearTimeout(timer)
}
onBeforeUnmount(() => clearTimeout(timer))
const labels = computed(() =>
  tab.value === 'button'
    ? ['默认', '加载中', '成功']
    : tab.value === 'switch'
      ? ['关闭', '开启', '键盘可用']
      : ['预览', '代码', '可切换'],
)
</script>
<template>
  <div class="hero-playground">
    <div class="playground-heading">
      <span><span class="live-indicator" />交互，从试一试开始</span
      ><SiteIcon name="controls" :size="20" />
    </div>
    <div class="playground-tabs" role="group" aria-label="体验组件">
      <button
        v-for="item in [
          { id: 'button', name: '按钮' },
          { id: 'switch', name: '开关' },
          { id: 'tabs', name: '标签页' },
        ]"
        :key="item.id"
        type="button"
        :aria-pressed="tab === item.id"
        @click="select(item.id)"
      >
        {{ item.name }}
      </button>
    </div>
    <div class="playground-canvas">
      <div v-if="tab === 'button'" class="sample-save">
        <span class="sample-icon"><SiteIcon name="book" :size="24" /></span>
        <h3>灵感，准备就绪。</h3>
        <p>体验一次完整的操作反馈。</p>
        <button
          class="sample-primary"
          :class="{ done: status === 'done' }"
          :disabled="status === 'loading'"
          :aria-busy="status === 'loading'"
          @click="submit"
        >
          <span v-if="status === 'loading'" class="loading-spinner" /><SiteIcon
            v-else
            :name="status === 'done' ? 'check' : 'arrow'"
            :size="18"
          />{{
            status === 'loading'
              ? '正在保存'
              : status === 'done'
                ? '已保存，再试一次'
                : '保存这份灵感'
          }}
        </button>
      </div>
      <div v-else-if="tab === 'switch'" class="sample-settings">
        <span class="sample-icon"><SiteIcon name="sun" :size="24" /></span>
        <h3>每个状态，都有回应。</h3>
        <div class="sample-setting-row">
          <span
            ><strong>接收更新</strong
            ><small>{{
              enabled ? '新内容发布时通知我' : '已关闭更新提醒'
            }}</small></span
          ><button
            type="button"
            class="sample-switch"
            role="switch"
            :aria-checked="enabled"
            aria-label="接收更新"
            @click="enabled = !enabled"
          >
            <i />
          </button>
        </div>
      </div>
      <div v-else class="sample-tabs-demo">
        <span class="sample-icon"><SiteIcon name="frontend" :size="24" /></span>
        <h3>换个视角，看同一件事。</h3>
        <div class="sample-tab-row" role="group" aria-label="预览内容">
          <button
            v-for="name in ['预览', '代码']"
            :key="name"
            :aria-pressed="activeTab === name"
            @click="activeTab = name"
          >
            {{ name }}
          </button>
        </div>
        <p>
          {{
            activeTab === '预览'
              ? '从交互开始理解组件。'
              : '从实现看懂状态如何变化。'
          }}
        </p>
      </div>
    </div>
    <div class="playground-state" aria-live="polite">
      <span
        v-for="(label, i) in labels"
        :key="label"
        :class="{
          selected:
            tab === 'button'
              ? i === ['idle', 'loading', 'done'].indexOf(status)
              : tab === 'switch'
                ? i === (enabled ? 1 : 0)
                : i === (activeTab === '预览' ? 0 : 1),
        }"
        ><i />{{ label }}</span
      ><a :href="withBase('/lab')" aria-label="前往交互验证台"
        ><SiteIcon name="arrow" :size="19"
      /></a>
    </div>
  </div>
</template>
