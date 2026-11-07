import { onBeforeUnmount, watch, type Ref } from 'vue'

/**
 * 演示脚本：play 变为 true 时按时间表依次执行步骤，组件卸载时清理定时器。
 * steps 为 [延迟毫秒, 回调] 列表，延迟从开始播放时算起。
 */
export function useScript(play: Ref<boolean> | (() => boolean), steps: [number, () => void][]) {
  const timers: number[] = []
  const clear = () => {
    timers.forEach((t) => window.clearTimeout(t))
    timers.length = 0
  }
  const stop = watch(
    play,
    (on) => {
      clear()
      if (!on) return
      for (const [ms, fn] of steps) timers.push(window.setTimeout(fn, ms))
    },
    { immediate: true },
  )
  onBeforeUnmount(() => {
    clear()
    stop()
  })
  /** 定时执行一次，随组件卸载清理 */
  const later = (ms: number, fn: () => void) => {
    timers.push(window.setTimeout(fn, ms))
  }
  return { later, clear }
}
