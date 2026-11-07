// 步进器：几个 AI 可视化组件共用的「点选步骤 / 按顺序播放」逻辑
// 只在用户点击时播放，不自动开始；定时器只在浏览器里创建，SSR 安全
import { onBeforeUnmount, ref } from 'vue'

export function useStepper(count: () => number, opts: { interval?: number; start?: number; loop?: boolean } = {}) {
  const step = ref(opts.start ?? 0)
  const playing = ref(false)
  let timer: number | undefined

  function stop() {
    if (timer !== undefined) window.clearInterval(timer)
    timer = undefined
    playing.value = false
  }

  function next() {
    if (step.value < count() - 1) step.value++
    else if (opts.loop) step.value = 0
  }

  function prev() {
    if (step.value > 0) step.value--
  }

  function play() {
    if (playing.value) return stop()
    playing.value = true
    // 已经在最后一步时从头播放
    if (step.value >= count() - 1) step.value = opts.start ?? 0
    timer = window.setInterval(() => {
      if (step.value >= count() - 1 && !opts.loop) return stop()
      next()
    }, opts.interval ?? 2400)
  }

  function pick(i: number) {
    stop()
    step.value = i
  }

  onBeforeUnmount(stop)
  return { step, playing, play, stop, pick, next, prev }
}
