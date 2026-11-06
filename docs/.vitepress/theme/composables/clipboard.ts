/**
 * 写入剪贴板：优先使用 Clipboard API，失败时退回到隐藏 textarea + execCommand。
 * 返回是否成功。
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* 继续尝试降级方案 */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '0'
    ta.style.left = '0'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    const active = document.activeElement as HTMLElement | null
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    active?.focus({ preventScroll: true })
    return ok
  } catch {
    return false
  }
}
