// 把 controlPrompts.ts 转成可以直接 import 的模块，供下面两个脚本使用
import { transform } from 'esbuild'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// 用 fileURLToPath 而不是 URL.pathname：仓库路径里有中文时后者是编码过的
export const here = path.dirname(fileURLToPath(import.meta.url))
export const repo = path.resolve(here, '../..')
/** 做过还原验证的效果；验证时用的是网页写法、默认选项、iPhone 外框和 iOS 色值表 */
export const ids = ['swipe-reply', 'reaction', 'stories', 'zoom']

export async function loadPrompts() {
  const src = fs.readFileSync(path.join(repo, 'docs/.vitepress/theme/data/controlPrompts.ts'), 'utf8')
  const { code } = await transform(src, { loader: 'ts', format: 'esm' })
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'vcg-prompts-')), 'controlPrompts.mjs')
  fs.writeFileSync(file, code)
  const m = await import(pathToFileURL(file).href)
  return (id) => m.buildControlPrompt(id, 'HTML + CSS + JS', m.defaultOptions, { palette: 'ios', canvas: 'phone' })
}
