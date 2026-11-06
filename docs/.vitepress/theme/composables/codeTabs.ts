import { reactive, type InjectionKey } from 'vue'

// 代码标签页的选中项：同一 group 共享，并记忆到 localStorage
export const selectedTab = reactive<Record<string, string>>({})

const KEY = 'vcg-codetabs:'

export function loadTab(group: string): string | null {
  try {
    return window.localStorage.getItem(KEY + group)
  } catch {
    return null
  }
}

export function saveTab(group: string, label: string) {
  selectedTab[group] = label
  try {
    window.localStorage.setItem(KEY + group, label)
  } catch {
    /* 存储不可用时只在本页联动 */
  }
}

/** 当前选中的标签；没有记录时取第一个 */
export function currentTab(group: string, labels: string[]): string {
  const v = selectedTab[group]
  return v && labels.includes(v) ? v : labels[0]
}

/** ControlDemo 向内部的 CodeTabs 提供登记入口，用于得知当前语言 */
export interface TabsHost {
  group: string
  labels: string[]
}
export const tabsHostKey: InjectionKey<TabsHost> = Symbol('tabs-host')
