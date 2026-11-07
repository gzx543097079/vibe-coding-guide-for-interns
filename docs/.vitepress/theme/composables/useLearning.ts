import { computed, onMounted, reactive } from 'vue'
import { allChapters } from '../data/modules'

const state = reactive({ completed: [] as string[], last: '' })
const key = 'vcg:learning:v1'
let loaded = false

export function useLearning() {
  onMounted(() => {
    if (loaded) return
    loaded = true
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? '{}')
      const valid = new Set(allChapters.map((c) => c.chapter.id))
      state.completed = Array.isArray(saved.completed)
        ? ([
            ...new Set(
              saved.completed.filter(
                (id: unknown) => typeof id === 'string' && valid.has(id),
              ),
            ),
          ] as string[])
        : []
      state.last =
        typeof saved.last === 'string' && valid.has(saved.last)
          ? saved.last
          : ''
    } catch {
      /* 存储不可用时，仍可在当前会话记录。 */
    }
  })
  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* 阅读不依赖本地存储可写。 */
    }
  }
  function visit(id: string) {
    state.last = id
    persist()
  }
  function toggle(id: string) {
    state.completed = state.completed.includes(id)
      ? state.completed.filter((x) => x !== id)
      : [...state.completed, id]
    persist()
  }
  const last = computed(() =>
    allChapters.find((c) => c.chapter.id === state.last),
  )
  return {
    state,
    last,
    visit,
    toggle,
    isComplete: (id: string) => state.completed.includes(id),
  }
}
