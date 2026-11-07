# 续接文档

给下一次接手的人或 agent：读完这一页就能接着干。更新日期：2026-11-06。

## 项目是什么

Vibe Coding 开发指南网站。VitePress 1.6.4 + 自定义主题，部署到 GitHub Pages 子路径 `/vibe-coding-guide-for-interns/`。仓库约定见 [AGENT.md](AGENT.md)，产品定位见 [PRODUCT.md](PRODUCT.md)。

## 当前进度

| 部分 | 状态 |
|---|---|
| 站点骨架、首页（带侧边栏）、深浅色、命令面板、侧边栏折叠 | 完成 |
| 全站结构：9 个模块，约 100 个章节，带「基础 / 进阶 / 精通」分级 | 完成，数据源 `docs/.vitepress/theme/data/modules.ts` |
| 「起步」模块：5 章真实内容 + 富组件版式（样板） | 完成 |
| 「UI 控件与提示词」模块：17 个控件，提示词已做还原验证 | 完成，见下方验证说明 |
| 「AI 与 Agent」模块 | 进行中，AI 基础和 Agent 基础两组在分支 `feat/ai-module-rich` 上由 agent 编写，合并前不在 main |
| Git、前端、跨端、后端、质量、成长 | 仍是占位页，只有「三问」 |

## 怎么跑

```bash
npm ci
npm run dev                                   # 开发
npm run build && npx vitepress preview docs --port 4173   # 构建并预览
```

构建后重启预览服务，否则会读到过期的文件列表，CSS 返回空。只停自己端口的进程，不要用 `pkill -f "vitepress preview"`。

## 目录要点

- `docs/<模块>/<章节>.md`：章节正文，frontmatter 里 `status: draft` 表示占位。
- `docs/.vitepress/theme/data/modules.ts`：模块与章节唯一数据源，侧栏、命令面板、首页、上下章都从它生成。
- `docs/.vitepress/theme/components/rich/`：富组件（RPath、RPoints、RAsk、RCompare、RSteps、RTerm、REditorAgent、RFolderTree、RTbd），样式在 `styles/rich.css`，用法参考 `docs/start/*.md`。
- `docs/.vitepress/theme/components/demos/` 与 `data/controlPrompts.ts`：控件演示和提示词，验证状态记录在后者。
- `docs/snippets/`：控件的多语言代码片段。
- `docs/.vitepress/theme/styles/tokens.css`：设计令牌。动效只用 transform / opacity，必须尊重 `prefers-reduced-motion`。

## 待办

1. 把「起步」的富组件版式铺到其他模块，建议顺序：AI 与 Agent、Git、前端、后端、质量、成长。
2. 合并 `feat/ai-module-rich`（AI 基础与 Agent 基础），再做进阶与精通两组。
3. 清理「待核实」：全站约 29 个文件含此标记，涉及模型与工具的价格和版本、协议年份、各工具规则文件名、鸿蒙 ArkTS 的 API 版本等。写完一项就把标记去掉，不要在没核实时删。
4. 控件页的「待校对」代码片段（鸿蒙、Compose、小程序、uni-app、RN 的部分）需要在真机或模拟器上编译确认。
5. 排查控制台的 Hydration 不匹配报错（`frontend/ios` 页和控件页都有）。
6. 「UI 控件」模块计划补充的 6 个控件（日期选择、无限滚动、页面转场等）还只有草稿提示词，标「未验证」。
7. 校对 `TechCard` 里「新手先学什么」这类小标题的措辞。
8. 在 GitHub 仓库 Settings → Pages 把 Source 设为 GitHub Actions，站点才会部署。

## 已知限制

- 原生代码（iOS、Android、鸿蒙等）都没有编译或真机验证。
- 提示词验证只对网页模拟演示做了截图对比，没有逐项比对动画时长和缓动，也没比对拖动手感。
- 没在 Safari、Firefox、真机上测过。标题的衬线字体依赖系统字体，Windows 和 Linux 需要安装 Noto Serif SC。
- 仓库名里仍有 `interns`，改名会让 Pages 地址和 `base` 路径一起变，是否改由维护者决定。

## 协作约定

- 简体中文，commit 与 PR 也用中文，中英文之间加空格。
- 不直接改 `main`：功能分支，提 PR，审核通过后用 `gh pr merge --merge` 合并。
- commit 前看 `git status` 与 diff，只 add 相关文件，不用 `git add -A`。
- 并行开发时用独立 `git worktree` 和独立预览端口，互不干扰。
- 文案去 AI 腔，不确定的事实标「待核实」，不编造。
