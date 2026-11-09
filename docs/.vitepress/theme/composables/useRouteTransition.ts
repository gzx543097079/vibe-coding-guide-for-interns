// 页面跳转过渡：淡出当前内容 → 切页 → 淡入新内容。
// 只驱动最外层的 data-phase，具体动画交给 CSS；不拦截或改写 VitePress 的导航。
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vitepress'

const LEAVE_MS = 110
const ENTER_MS = 300

export type RoutePhase = 'idle' | 'leaving' | 'entering'

export function useRouteTransition() {
  const router = useRouter()
  const phase = ref<RoutePhase>('idle')
  let timer: number | undefined
  let seq = 0
  let saved: {
    before?: typeof router.onBeforeRouteChange
    after?: typeof router.onAfterRouteChange
  } | null = null

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

  const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
  const nextFrame = () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )

  onMounted(() => {
    const before = router.onBeforeRouteChange
    const after = router.onAfterRouteChange
    saved = { before, after }

    router.onBeforeRouteChange = async (to) => {
      const original = await before?.(to)
      if (original === false) return false
      if (reduced()) return true
      const mine = ++seq
      phase.value = 'leaving'
      await delay(LEAVE_MS)
      // 期间又发生了新导航，别覆盖它的状态
      if (mine !== seq) return true
      return true
    }

    router.onAfterRouteChange = async (to) => {
      await after?.(to)
      if (reduced()) {
        phase.value = 'idle'
        return
      }
      // 常规跳转：before 已经停在淡出态，等新内容渲染完再淡入
      // 浏览器前进 / 后退不经过 before，直接淡入即可
      const wasLeaving = phase.value === 'leaving'
      if (wasLeaving) {
        phase.value = 'leaving'
        await nextFrame()
      }
      phase.value = 'entering'
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        phase.value = 'idle'
      }, ENTER_MS)
    }
  })

  onBeforeUnmount(() => {
    if (saved) {
      router.onBeforeRouteChange = saved.before
      router.onAfterRouteChange = saved.after
    }
    clearTimeout(timer)
  })

  return { phase }
}
