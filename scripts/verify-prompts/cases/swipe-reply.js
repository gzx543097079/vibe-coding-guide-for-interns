const { sleep, q, qs, ev, center, key, rect, drag, up } = V
const snap = (r) => V.snap(r).split('\n').filter((l) => !/^(周五|好的|登录页|修了|修好了|button)\|/.test(l) || l.includes('|12px|')).join('\n')
const bubbles = (r) => qs(r, '按回车回复').map((e) => rect(r, e) + ' ' + cs(e).backgroundColor.replace(/ /g, '') + ' ' + cs(e).borderRadius).join(' ; ')
const diff = (a, b) => V.diff(a, b) + ' 气泡一致 ' + (bubbles(A) === bubbles(B))
const out = []
const cs = (e) => e.ownerDocument.defaultView.getComputedStyle(e)
const both = (f) => [A, B].map(f).join('  |  ')
const bubble = (r, t) => qs(r, t)[0]
// 与气泡同一行的回复箭头：28px 圆、不是按钮
const arrow = (r, b) => { const y = b.getBoundingClientRect(); return [...r.querySelectorAll('*')].filter((e) => e.tagName !== 'BUTTON' && e.offsetWidth === 28 && e.offsetHeight === 28).find((e) => { const c = e.getBoundingClientRect(); const m = c.top + c.height / 2; return m > y.top && m < y.bottom }) }
const arrowInfo = (r, b) => { const a = arrow(r, b); if (!a) return '无箭头'; const s = cs(a); const m = s.transform === 'none' ? 1 : +s.transform.split('(')[1].split(',')[0]; return 'op ' + (+s.opacity).toFixed(2) + ' scale ' + m.toFixed(2) + ' bg ' + s.backgroundColor.replace(/ /g, '') + ' pos ' + rect(r, a) }
const tx = (e) => { const s = cs(e).transform; return s === 'none' ? 0 : Math.round(+s.split(',')[4] * 10) / 10 }
const refBar = (r) => q(r, '取消回复')
const refShown = (r) => { const c = refBar(r); if (!c) return false; let p = c; while (p && p !== r) { const s = cs(p); if (s.visibility === 'hidden' || +s.opacity === 0 || s.display === 'none') return false; p = p.parentElement } return true }
const act = (r) => { const a = r.ownerDocument.activeElement; return a?.getAttribute('aria-label') || a?.tagName }
const T = '登录页那个问题'
let [A, B] = await V.pair('swipe-reply')
out.push('默认布局 ' + diff(snap(A), snap(B)))
out.push('箭头初始 ' + both((r) => arrowInfo(r, bubble(r, T))))
for (const r of [A, B]) await drag(bubble(r, T), -50, 0, false)
await sleep(40)
out.push('拖 -50（位移应 -30）' + both((r) => 'tx ' + tx(bubble(r, T)) + ' ' + arrowInfo(r, bubble(r, T))))
for (const r of [A, B]) { const b = bubble(r, T); const [x, y] = center(b); ev(b, 'pointermove', x - 120 - tx(b), y) }
await sleep(350)
out.push('拖到 -120（位移应 -64）' + both((r) => 'tx ' + tx(bubble(r, T)) + ' ' + arrowInfo(r, bubble(r, T))))
for (const r of [A, B]) { const b = bubble(r, T); const [x, y] = center(b); ev(b, 'pointerup', x, y) }
await sleep(120)
out.push('松手 120ms tx ' + both((r) => tx(bubble(r, T)) + ' ' + arrowInfo(r, bubble(r, T))))
await sleep(400)
out.push('松手后 tx ' + both((r) => tx(bubble(r, T))) + ' 引用条 ' + both(refShown) + ' 焦点 ' + both(act))
out.push('引用条布局 ' + diff(snap(A), snap(B)))
for (const r of [A, B]) { const i = q(r, '消息内容'); i.value = '修好了'; i.dispatchEvent(new (r.ownerDocument.defaultView.Event)('input', { bubbles: true })) }
await sleep(100)
out.push('发送按钮可用 ' + both((r) => !q(r, '发送').disabled))
for (const r of [A, B]) q(r, '发送').click()
await sleep(500)
out.push('发送后 引用条 ' + both(refShown) + ' 输入框 "' + both((r) => q(r, '消息内容').value) + '" 布局 ' + diff(snap(A), snap(B)))
for (const r of [A, B]) await drag(bubble(r, '周五的评审'), -70, 0, true)
await sleep(450)
out.push('拖 -70（位移 -42，不够）松手 引用条 ' + both(refShown))
for (const r of [A, B]) await drag(bubble(r, '周五的评审'), 80, 0, false)
await sleep(40)
out.push('向右拖 80 tx ' + both((r) => tx(bubble(r, '周五的评审'))))
for (const r of [A, B]) up(bubble(r, '周五的评审'), 80, 0)
await sleep(350)
for (const r of [A, B]) { const b = bubble(r, '好的，我把演示'); b.focus(); b.click() }
await sleep(350)
out.push('键盘回车回复自己的消息 引用条 ' + both(refShown) + ' 布局 ' + diff(snap(A), snap(B)))
for (const r of [A, B]) await drag(bubble(r, '周五的评审'), -120, 0, true)
await sleep(450)
out.push('再滑另一条后布局 ' + diff(snap(A), snap(B)))
for (const r of [A, B]) q(r, '取消回复').click()
await sleep(350)
out.push('点取消 引用条 ' + both(refShown))
for (const r of [A, B]) { const i = q(r, '消息内容'); i.value = '   '; i.dispatchEvent(new (r.ownerDocument.defaultView.Event)('input', { bubbles: true })) }
await sleep(80)
out.push('只输入空格 发送禁用 ' + both((r) => q(r, '发送').disabled))
out.push('气泡 aria-label ' + both((r) => bubble(r, '好的，我把演示').getAttribute('aria-label')))
;[A, B] = await V.pair('swipe-reply', true)
out.push('深色默认 ' + diff(snap(A), snap(B)))
return out.join('\n')
