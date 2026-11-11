// 在无头 Chrome 里对站内演示和独立实现执行同一套操作，输出逐状态的对比结果。
// 用法：先 npm run build，再 node scripts/verify-prompts/run.mjs [效果 id ...]
// Chrome 不在默认位置时用环境变量 CHROME_PATH 指定。
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { here, ids, repo } from './prompts.mjs'

const BASE = '/vibe-coding-guide-for-interns/'
const dist = path.join(repo, 'docs/.vitepress/dist')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
if (!fs.existsSync(path.join(dist, 'lab.html'))) { console.error('没有找到构建产物，先运行 npm run build'); process.exit(1) }
if (!fs.existsSync(chromePath)) { console.error(`没有找到 Chrome：${chromePath}。用 CHROME_PATH 指定它的位置`); process.exit(1) }

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png' }
// 构建产物按站点的 base 路径提供；独立实现挂在 verify/ 下，和站内演示同源，脚本才能同时读两边的 DOM
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (!p.startsWith(BASE)) { res.writeHead(404).end(); return }
  p = p.slice(BASE.length)
  let file = p.startsWith('verify/') ? path.join(here, 'fixtures', p.slice(7)) : path.join(dist, p || 'index.html')
  if (!path.extname(file)) file += '.html'
  if (!file.startsWith(here) && !file.startsWith(dist)) { res.writeHead(403).end(); return }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' }).end(data)
  })
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const origin = `http://127.0.0.1:${server.address().port}`

const debugPort = 9333 + Math.floor(Math.random() * 500)
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vcg-chrome-'))
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, '--window-size=1100,800', '--hide-scrollbars', '--no-first-run', '--disable-gpu', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
try {
  let target
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200)
    try { target = (await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json()).find((t) => t.type === 'page') } catch {}
  }
  if (!target) throw new Error('Chrome 没有启动成功')
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  let seq = 0
  const pending = new Map()
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } }
  const send = (method, params = {}) => new Promise((r) => { pending.set(++seq, r); ws.send(JSON.stringify({ id: seq, method, params })) })
  await send('Page.enable')
  const helpers = fs.readFileSync(path.join(here, 'helpers.js'), 'utf8')
  const wanted = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  for (const id of wanted.length ? wanted : ids) {
    await send('Page.navigate', { url: origin + BASE + 'lab' })
    await sleep(1500)
    await send('Runtime.evaluate', { expression: helpers })
    const code = fs.readFileSync(path.join(here, 'cases', id + '.js'), 'utf8')
    const r = await send('Runtime.evaluate', { expression: `(async()=>{${code}})()`, awaitPromise: true, returnByValue: true })
    console.log(`\n===== ${id}`)
    console.log(r.result?.exceptionDetails ? '脚本出错：' + (r.result.exceptionDetails.exception?.description ?? JSON.stringify(r.result.exceptionDetails)).slice(0, 800) : r.result?.result?.value)
  }
  ws.close()
} finally {
  chrome.kill()
  server.close()
}
