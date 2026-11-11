(() => {
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const patch = (win) => { win.Element.prototype.setPointerCapture = function () {}; win.Element.prototype.releasePointerCapture = function () {}; win.Element.prototype.hasPointerCapture = function () { return true } }
patch(window)
window.V = {
  sleep,
  snap(root) {
    const win = root.ownerDocument.defaultView, R = root.getBoundingClientRect(), out = []
    root.querySelectorAll('*').forEach((el) => {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join('')
      const tag = el.tagName.toLowerCase()
      if (!own && !['svg', 'button', 'input'].includes(tag)) return
      const r = el.getBoundingClientRect()
      if (r.width <= 1 || r.height <= 1) return
      const cs = win.getComputedStyle(el)
      if (cs.visibility === 'hidden') return
      out.push([own.slice(0, 8) || tag, Math.round(r.left - R.left), Math.round(r.top - R.top), Math.round(r.width), Math.round(r.height), cs.color.replace(/ /g, ''), cs.backgroundColor.replace(/ /g, ''), cs.fontSize, cs.fontWeight, cs.borderRadius, (+cs.opacity).toFixed(2)].join('|'))
    })
    return out.sort((a, b) => { const A = a.split('|'), B = b.split('|'); return A[2] - B[2] || A[1] - B[1] || (a < b ? -1 : 1) }).join('\n')
  },
  diff(a, b) {
    const A = a.split('\n'), B = b.split('\n')
    if (A.length !== B.length) return 'COUNT ' + A.length + ' vs ' + B.length + '\nA:\n' + a + '\nB:\n' + b
    const d = []
    A.forEach((l, i) => { if (l !== B[i]) d.push('  A ' + l + '\n  B ' + B[i]) })
    return d.length ? '\n' + d.join('\n') : 'SAME(' + A.length + ')'
  },
  async frame(id, q = '') {
    document.getElementById('vf')?.remove()
    const f = document.createElement('iframe')
    f.id = 'vf'; f.src = '/vibe-coding-guide-for-interns/verify/' + id + '.html' + q
    f.style.cssText = 'position:fixed;right:0;top:70px;width:300px;height:480px;border:0;z-index:9999'
    document.body.append(f)
    await new Promise((r) => (f.onload = r))
    patch(f.contentWindow)
    await sleep(300)
    return f.contentDocument.querySelector('#canvas')
  },
  ev(el, type, x, y) {
    const win = el.ownerDocument.defaultView
    el.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true, composed: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: type === 'pointerup' ? 0 : 1, clientX: x, clientY: y }))
  },
  center(el) { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] },
  async drag(el, dx, dy, release) {
    const [x, y] = V.center(el)
    V.ev(el, 'pointerdown', x, y)
    for (let i = 1; i <= 6; i++) { V.ev(el, 'pointermove', x + (dx * i) / 6, y + (dy * i) / 6); await sleep(25) }
    if (release) V.ev(el, 'pointerup', x + dx, y + dy)
  },
  up(el, dx = 0, dy = 0) { const [x, y] = V.center(el); V.ev(el, 'pointerup', x + dx, y + dy) },
  tap(el) { const [x, y] = V.center(el); V.ev(el, 'pointerdown', x, y); V.ev(el, 'pointerup', x, y) },
  q(root, label) { return root.querySelector('[aria-label="' + label + '"]') },
  qs(root, part) { return [...root.querySelectorAll('[aria-label]')].filter((e) => e.getAttribute('aria-label').includes(part)) },
  key(el, key) { el.dispatchEvent(new (el.ownerDocument.defaultView.KeyboardEvent)('keydown', { key, bubbles: true, cancelable: true })) },
  // 元素相对画布的矩形
  rect(root, el) { const R = root.getBoundingClientRect(), r = el.getBoundingClientRect(); return [r.left - R.left, r.top - R.top, r.width, r.height].map((n) => Math.round(n * 10) / 10).join(',') },
  async pair(id, dark) {
    if (dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark')
    location.hash = '#button'; await sleep(150); location.hash = '#' + id; await sleep(400)
    const A = document.querySelector('.lab-demo-screen'); A.scrollIntoView({ block: 'center' })
    const B = await V.frame(id, dark ? '?dark' : '')
    return [A, B]
  },
}
})()
