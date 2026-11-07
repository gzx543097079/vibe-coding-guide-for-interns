import { nextTick, onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * 进入视口时错落淡入：root 内带 data-reveal 的元素进入视口后加上 data-in 属性（不用 class，避免被组件的 class 绑定覆盖）。
 * 同一批进入视口的元素按顺序设置 --i，形成错落效果。
 * 返回 refresh，在内容变化后重新登记新元素。
 */
export function useReveal(root: Ref<HTMLElement | undefined>) {
  let io: IntersectionObserver | null = null

  function observe() {
    const el = root.value
    if (!el || !io) return
    el.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])').forEach((n) => io!.observe(n))
  }

  onMounted(() => {
    const el = root.value
    if (!el) return
    if (!('IntersectionObserver' in window)) return
    el.classList.add('reveal-on')
    io = new IntersectionObserver(
      (entries) => {
        let i = 0
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const t = e.target as HTMLElement
          t.style.setProperty('--i', String(Math.min(i++, 8)))
          t.dataset.in = ''
          io?.unobserve(t)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    observe()
  })

  onBeforeUnmount(() => io?.disconnect())

  return {
    refresh: () => nextTick(observe),
  }
}
