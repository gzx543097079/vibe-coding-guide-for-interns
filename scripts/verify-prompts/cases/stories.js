const { sleep, snap, diff, q, tap, ev, center, key } = V
const out = []
const title = (r) => [...r.querySelectorAll('*')].find((e) => e.ownerDocument.defaultView.getComputedStyle(e).fontSize === '22px')?.textContent
const topOp = (r) => { let p = q(r, '暂停') || q(r, '继续播放'); let m = 1; while (p && p !== r) { m = Math.min(m, +p.ownerDocument.defaultView.getComputedStyle(p).opacity); p = p.parentElement } return m.toFixed(2) }
const fill = (r) => [...r.querySelectorAll('*')].filter((e) => e.ownerDocument.defaultView.getComputedStyle(e).backgroundColor === 'rgb(255, 255, 255)' && Math.round(e.getBoundingClientRect().height) === 3).map((e) => Math.round(e.getBoundingClientRect().width)).join(',')
const bg = (r) => [r, ...r.querySelectorAll('*')].map((e) => e.ownerDocument.defaultView.getComputedStyle(e).backgroundColor).find((c) => c.includes('oklch'))
let [A, B] = await V.pair('stories')
await sleep(1000)
out.push('播放 1s 填充宽度 ' + fill(A) + ' | ' + fill(B))
for (const r of [A, B]) q(r, '暂停').click()
await sleep(400)
out.push('按钮暂停态布局 ' + diff(snap(A), snap(B)) + ' 顶部透明度 ' + topOp(A) + '/' + topOp(B))
for (const r of [A, B]) q(r, '继续播放').click()
for (const r of [A, B]) { const e = q(r, '下一条'); ev(e, 'pointerdown', ...center(e)) }
await sleep(500)
const f1 = [fill(A), fill(B)]
out.push('按住 500ms 顶部透明度 ' + topOp(A) + '/' + topOp(B))
await sleep(500)
out.push('按住期间进度不动 ' + (f1[0] === fill(A)) + '/' + (f1[1] === fill(B)))
for (const r of [A, B]) { const e = q(r, '下一条'); ev(e, 'pointerup', ...center(e)) }
await sleep(400)
out.push('长按松开后 ' + title(A) + ' / ' + title(B) + ' 透明度 ' + topOp(A) + '/' + topOp(B))
for (const r of [A, B]) tap(q(r, '下一条'))
await sleep(120)
const mid = (r) => { const e = [...r.querySelectorAll('*')].find((e) => e.ownerDocument.defaultView.getComputedStyle(e).fontSize === '22px'); const b = e.getBoundingClientRect(); return Math.round(b.width) }
out.push('短按右 120ms 标题宽度（缩放中）' + mid(A) + '/' + mid(B))
await sleep(500)
out.push('短按右后 ' + title(A) + ' / ' + title(B) + ' 背景 ' + bg(A) + ' / ' + bg(B) + ' 布局 ' + diff(snap(A), snap(B)))
for (const r of [A, B]) tap(q(r, '上一条'))
await sleep(300)
for (const r of [A, B]) tap(q(r, '上一条'))
await sleep(300)
out.push('短按左两次 ' + title(A) + ' / ' + title(B) + ' 填充 ' + fill(A) + ' | ' + fill(B))
for (const r of [A, B]) { const e = q(r, '下一条'); e.focus(); key(e, 'ArrowRight') }
await sleep(300)
out.push('右方向键 ' + title(A) + ' / ' + title(B))
for (const r of [A, B]) { const e = q(r, '下一条'); key(e, 'ArrowLeft') }
await sleep(300)
out.push('左方向键 ' + title(A) + ' / ' + title(B))
await sleep(4000)
out.push('不操作 4.3s 后 ' + title(A) + ' / ' + title(B) + ' 填充 ' + fill(A) + ' | ' + fill(B))
for (const r of [A, B]) { tap(q(r, '下一条')); tap(q(r, '下一条')) }
await sleep(4300)
out.push('最后一条播完 ' + title(A) + ' / ' + title(B))
out.push('aria: ' + [A, B].map((r) => [...r.querySelectorAll('[role],[aria-live],[aria-pressed]')].map((e) => (e.getAttribute('role') || '') + (e.getAttribute('aria-live') ? 'live' : '') + (e.hasAttribute('aria-pressed') ? 'pressed=' + e.getAttribute('aria-pressed') : '')).join(' ')).join(' | '))
return out.join('\n')
