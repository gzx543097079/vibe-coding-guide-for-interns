// 检查提示词有没有在验证之后被改动。
// 用法：node scripts/verify-prompts/check-snapshots.mjs          有改动时以非零状态退出
//       node scripts/verify-prompts/check-snapshots.mjs --update 重新验证通过后，更新快照
import fs from 'node:fs'
import path from 'node:path'
import { here, ids, loadPrompts } from './prompts.mjs'

const update = process.argv.includes('--update')
const build = await loadPrompts()
let changed = 0
for (const id of ids) {
  const file = path.join(here, 'snapshots', id + '.prompt.txt')
  const now = build(id)
  if (update) {
    fs.writeFileSync(file, now)
    console.log(`已更新 ${id}`)
    continue
  }
  const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  if (old === now) {
    console.log(`一致 ${id}`)
    continue
  }
  changed++
  const a = old.split('\n'), b = now.split('\n')
  console.log(`\n有改动 ${id}`)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) console.log(`  第 ${i + 1} 行\n    验证时：${a[i] ?? '（无）'}\n    现在：  ${b[i] ?? '（无）'}`)
  }
}
if (changed) {
  console.error(`\n${changed} 份提示词和验证时的版本不一样。先按 scripts/verify-prompts/README.md 重新验证，通过后加 --update 更新快照。`)
  process.exit(1)
}
