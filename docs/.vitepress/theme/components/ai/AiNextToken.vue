<script setup lang="ts">
// 下一个 token：给出候选和概率（示意），点一个接上去，或按概率抽一个
// preset：basic（一句闲聊，多种续写都合理）/ facts（常识题和冷门事实的对比）
import { computed, ref } from 'vue'

interface Cand {
  t: string
  p: number
  next?: Cand[]
}
interface Scene {
  name: string
  prefix: string
  cands: Cand[]
  note: string
}

const props = defineProps<{ preset?: 'basic' | 'facts' }>()

const end: Cand[] = [{ t: '。', p: 0.86 }, { t: '！', p: 0.09 }, { t: '……', p: 0.05 }]

const scenes: Record<'basic' | 'facts', Scene[]> = {
  basic: [
    {
      name: '续写一句话',
      prefix: '今天天气很',
      note: '「好」「热」「冷」都说得通，所以概率分散在几个候选上。按概率抽，每次可能不一样，这就是同一个问题多问几次答案会变的原因。',
      cands: [
        { t: '好', p: 0.42, next: [{ t: '，', p: 0.58, next: [{ t: '适合出门', p: 0.5, next: end }, { t: '我们去公园吧', p: 0.3, next: end }, { t: '心情也不错', p: 0.2, next: end }] }, { t: '。', p: 0.42 }] },
        { t: '热', p: 0.24, next: [{ t: '，', p: 0.62, next: [{ t: '记得多喝水', p: 0.55, next: end }, { t: '空调开起来', p: 0.45, next: end }] }, { t: '。', p: 0.38 }] },
        { t: '冷', p: 0.16, next: [{ t: '，', p: 0.6, next: [{ t: '多穿点衣服', p: 0.7, next: end }, { t: '别出门了', p: 0.3, next: end }] }, { t: '。', p: 0.4 }] },
        { t: '不错', p: 0.11, next: end },
        { t: '奇怪', p: 0.07, next: end },
      ],
    },
  ],
  facts: [
    {
      name: '常识题',
      prefix: '中国的首都是',
      note: '训练数据里这句话几乎总是接「北京」，概率高度集中，所以答对很稳。',
      cands: [
        { t: '北京', p: 0.96, next: end },
        { t: '哪里', p: 0.02, next: [{ t: '？', p: 1 }] },
        { t: '南京', p: 0.01, next: end },
        { t: '一座', p: 0.01, next: end },
      ],
    },
    {
      name: '冷门事实',
      prefix: '这个冷门库的最新版本是 v',
      note: '训练数据里几乎没见过，概率摊在一堆「像版本号」的候选上。不管抽中哪个，写出来的语气都一样肯定，这就是幻觉。',
      cands: [
        { t: '2.', p: 0.27, next: [{ t: '1.0', p: 0.38, next: end }, { t: '4.3', p: 0.34, next: end }, { t: '0.7', p: 0.28, next: end }] },
        { t: '3.', p: 0.24, next: [{ t: '0.2', p: 0.4, next: end }, { t: '2.1', p: 0.35, next: end }, { t: '5.0', p: 0.25, next: end }] },
        { t: '1.', p: 0.22, next: [{ t: '8.4', p: 0.36, next: end }, { t: '0.0', p: 0.34, next: end }, { t: '12.3', p: 0.3, next: end }] },
        { t: '4.', p: 0.15, next: [{ t: '0.1', p: 0.6, next: end }, { t: '7.2', p: 0.4, next: end }] },
        { t: '0.', p: 0.12, next: [{ t: '9.6', p: 0.55, next: end }, { t: '3.1', p: 0.45, next: end }] },
      ],
    },
  ],
}

const list = computed(() => scenes[props.preset ?? 'basic'])
const si = ref(0)
const scene = computed(() => list.value[si.value])
const picked = ref<Cand[]>([])

const options = computed<Cand[]>(() => {
  const lastPick = picked.value[picked.value.length - 1]
  if (!lastPick) return scene.value.cands
  return lastPick.next ?? []
})
const finished = computed(() => options.value.length === 0)

function choose(c: Cand) {
  picked.value = [...picked.value, c]
}
function sample() {
  // 按概率加权随机抽一个
  let r = Math.random()
  for (const c of options.value) {
    r -= c.p
    if (r <= 0) return choose(c)
  }
  choose(options.value[options.value.length - 1])
}
function greedy() {
  const best = options.value.reduce((a, b) => (b.p > a.p ? b : a))
  choose(best)
}
function reset() {
  picked.value = []
}
function switchTo(i: number) {
  si.value = i
  reset()
}
const pct = (p: number) => `${Math.round(p * 100)}%`
</script>

<template>
  <figure class="ax-fig ax-nt" data-mod="ai">
    <div v-if="list.length > 1" class="ax-nt-tabs" role="group" aria-label="选择例子">
      <button
        v-for="(s, i) in list"
        :key="s.name"
        type="button"
        class="ax-chip"
        :aria-pressed="si === i"
        @click="switchTo(i)"
      >
        {{ s.name }}
      </button>
    </div>

    <p class="ax-nt-text" aria-live="polite">
      <span class="ax-nt-prefix">{{ scene.prefix }}</span><span
        v-for="(c, i) in picked"
        :key="i"
        class="ax-nt-tok"
      >{{ c.t }}</span><span v-if="!finished" class="ax-nt-caret" aria-hidden="true" />
    </p>

    <div v-if="!finished" class="ax-nt-cands">
      <p class="ax-nt-label">下一个 token 的候选（概率为示意，有的候选为便于阅读合并了几个 token）</p>
      <ul>
        <li v-for="c in options" :key="c.t">
          <button type="button" class="ax-nt-cand" @click="choose(c)">
            <span class="ax-nt-tok-name">{{ c.t }}</span>
            <span class="ax-nt-bar" aria-hidden="true"><i :style="{ transform: `scaleX(${c.p})` }" /></span>
            <span class="ax-nt-p">{{ pct(c.p) }}</span>
          </button>
        </li>
      </ul>
    </div>
    <p v-else class="ax-nt-done">这一句生成结束了，可以点「重来」再试一次。</p>

    <div class="ax-nt-actions">
      <button type="button" class="ax-btn" :disabled="finished" @click="sample">按概率抽一个</button>
      <button type="button" class="ax-btn is-quiet" :disabled="finished" @click="greedy">总选最高的</button>
      <button type="button" class="ax-btn is-quiet" :disabled="!picked.length" @click="reset">重来</button>
    </div>
    <figcaption class="ax-cap">{{ scene.note }}</figcaption>
  </figure>
</template>
