// 导出四个效果在 SwiftUI 技术栈下的提示词原文（默认选项、iPhone 画布、iOS 色值表）
// 用法：node scripts/verify-prompts/swiftui/export-prompts.mjs
import { transform } from 'esbuild'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { ids, repo } from '../prompts.mjs'

const src = fs.readFileSync(path.join(repo, 'docs/.vitepress/theme/data/controlPrompts.ts'), 'utf8')
const { code } = await transform(src, { loader: 'ts', format: 'esm' })
const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'vcg-prompts-')), 'controlPrompts.mjs')
fs.writeFileSync(file, code)
const m = await import(pathToFileURL(file).href)
for (const id of ids) {
  const text = m.buildControlPrompt(id, 'SwiftUI', m.defaultOptions, { palette: 'ios', canvas: 'phone' })
  fs.writeFileSync(path.join(repo, 'scripts/verify-prompts/swiftui', id + '.prompt.txt'), text)
  console.log(id, text.length, '字')
}
