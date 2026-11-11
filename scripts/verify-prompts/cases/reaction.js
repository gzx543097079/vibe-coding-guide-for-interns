const { sleep, snap, diff, q, qs, ev, center, key, rect } = V
const out = []
const cs = (e) => e.ownerDocument.defaultView.getComputedStyle(e)
const both = (f) => [A, B].map(f).join('  |  ')
const bubble = (r, t) => qs(r, t).find((e) => e.getAttribute('aria-haspopup'))
const menu = (r) => r.querySelector('[aria-label="选择回应"]')
const menuOpen = (r) => { const m = menu(r); if (!m) return false; let p = m; while (p && p !== r) { const s = cs(p); if (s.visibility === 'hidden' || s.display === 'none') return false; p = p.parentElement } return m.getBoundingClientRect().width > 0 }
const badges = (r) => qs(r, '取消回应').filter((e) => e.getBoundingClientRect().width > 1).map((e) => e.getAttribute('aria-label').replace('取消回应 ', '') + '@' + rect(r, e)).join(' ')
const scale = (e) => { const s = cs(e).transform; return s === 'none' ? '1.00' : (+s.split('(')[1].split(',')[0]).toFixed(2) }
const dimEl = (r) => [...r.querySelectorAll('*')].find((e) => cs(e).backgroundColor.replace(/ /g, '') === 'rgba(0,0,0,0.28)')
const act = (r) => r.ownerDocument.activeElement?.getAttribute('aria-label')
const T = '辛苦了'
let [A, B] = await V.pair('reaction')
out.push('默认布局 ' + diff(snap(A), snap(B)))
for (const r of [A, B]) { const b = bubble(r, T); ev(b, 'pointerdown', ...center(b)) }
await sleep(100)
for (const r of [A, B]) { const b = bubble(r, T); ev(b, 'pointerup', ...center(b)) }
await sleep(600)
out.push('短按 100ms 表情条 ' + both(menuOpen))
for (const r of [A, B]) { const b = bubble(r, T); ev(b, 'pointerdown', ...center(b)) }
await sleep(380)
out.push('按住 380ms 气泡缩放 ' + both((r) => scale(bubble(r, T))) + ' 表情条 ' + both(menuOpen))
await sleep(200)
out.push('按住 580ms 表情条 ' + both(menuOpen))
for (const r of [A, B]) { const b = bubble(r, T); ev(b, 'pointerup', ...center(b)) }
await sleep(600)
out.push('打开态 表情条位置 ' + both((r) => (menu(r) ? rect(r, menu(r)) : '无')) + ' 遮罩 ' + both((r) => (dimEl(r) ? rect(r, dimEl(r)) + ' op ' + cs(dimEl(r)).opacity : '无')) + ' 焦点 ' + both(act))
out.push('打开态布局 ' + diff(snap(A), snap(B)))
out.push('aria-expanded ' + both((r) => bubble(r, T).getAttribute('aria-expanded')))
for (const r of [A, B]) q(r, '回应 ❤️').click()
await sleep(700)
out.push('选 ❤️ 后 表情条 ' + both(menuOpen) + ' 徽章 ' + both(badges) + ' 焦点 ' + both(act))
out.push('有回应布局 ' + diff(snap(A), snap(B)))
for (const r of [A, B]) { const b = bubble(r, '收到，我来盯'); b.dispatchEvent(new (r.ownerDocument.defaultView.MouseEvent)('contextmenu', { bubbles: true, cancelable: true })) }
await sleep(500)
out.push('右键自己的消息 表情条 ' + both(menuOpen) + ' 位置 ' + both((r) => (menu(r) ? rect(r, menu(r)) : '无')))
for (const r of [A, B]) key(r.ownerDocument.activeElement, 'Escape')
await sleep(400)
out.push('Esc 后 表情条 ' + both(menuOpen) + ' 焦点 ' + both(act))
for (const r of [A, B]) { const b = bubble(r, '新版本今晚'); b.focus(); b.click() }
await sleep(500)
out.push('键盘打开第一条 表情条 ' + both(menuOpen) + ' 位置 ' + both((r) => (menu(r) ? rect(r, menu(r)) : '无')))
for (const r of [A, B]) q(r, '回应 👍').click()
await sleep(700)
out.push('第一条选 👍 徽章 ' + both(badges))
for (const r of [A, B]) { const b = bubble(r, '新版本今晚'); b.focus(); b.click() }
await sleep(500)
out.push('已选表情 aria-pressed ' + both((r) => q(r, '回应 👍').getAttribute('aria-pressed') + ' bg ' + cs(q(r, '回应 👍')).backgroundColor.replace(/ /g, '')))
for (const r of [A, B]) q(r, '回应 😂').click()
await sleep(900)
out.push('换成 😂 徽章 ' + both(badges))
for (const r of [A, B]) { const b = bubble(r, '新版本今晚'); b.focus(); b.click() }
await sleep(500)
for (const r of [A, B]) q(r, '回应 😂').click()
await sleep(700)
out.push('再选同一个 😂 徽章 ' + both(badges))
for (const r of [A, B]) { const b = bubble(r, '新版本今晚'); b.focus(); b.click() }
await sleep(500)
for (const r of [A, B]) dimEl(r).click()
await sleep(400)
out.push('点遮罩 表情条 ' + both(menuOpen) + ' 徽章 ' + both(badges))
for (const r of [A, B]) q(r, '取消回应 ❤️').click()
await sleep(400)
out.push('点徽章取消 徽章 "' + both(badges) + '"')
out.push('气泡 aria-label ' + both((r) => bubble(r, '收到，我来盯').getAttribute('aria-label')))
;[A, B] = await V.pair('reaction', true)
out.push('深色默认 ' + diff(snap(A), snap(B)))
for (const r of [A, B]) { const b = bubble(r, T); b.focus(); b.click() }
await sleep(600)
out.push('深色打开态 ' + diff(snap(A), snap(B)))
return out.join('\n')
