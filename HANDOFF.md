# 续接文档

给下一次接手的人或 agent：读完这一页就能接着干。更新日期：2026-11-06。

## 项目是什么

Vibe Coding 开发指南网站。VitePress 1.6.4 + 自定义主题，部署到 GitHub Pages 子路径 `/vibe-coding-guide-for-interns/`。仓库约定见 [AGENT.md](AGENT.md)，产品定位见 [PRODUCT.md](PRODUCT.md)。

## 当前进度

| 部分 | 状态 |
|---|---|
| 站点骨架、首页（带侧边栏）、深浅色、命令面板、侧边栏折叠 | 完成 |
| 全站结构：9 个模块，108 个章节，带「基础 / 进阶 / 精通」分级 | 完成，数据源 `docs/.vitepress/theme/data/modules.ts` |
| 「起步」模块：5 章真实内容 + 富组件版式（样板） | 完成 |
| 「UI 控件与提示词」模块：17 个控件，提示词已做还原验证 | 完成，见下方验证说明 |
| 「AI 与 Agent」模块 | `feat/ai-module-rich` 已完成 AI 基础与 Agent 基础共 10 章，含交互演示；进阶与精通各 5 章仍为草稿，基础正文合并前不在 main |
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

1. 审核 `feat/ai-module-rich` 的 AI 基础与 Agent 基础 10 章，再继续任务拆解、上下文管理、多 Agent、Hooks、评测等进阶内容。
2. 把「起步」的富组件版式铺到 Git、前端、后端、质量、成长等占位模块；跨端模块也仍需正文。
3. 清理「待核实」：全站约 29 个文件含此标记，涉及模型与工具的价格和版本、协议年份、各工具规则文件名、鸿蒙 ArkTS 的 API 版本等。写完一项就把标记去掉，不要在没核实时删。
4. 控件页的「待校对」代码片段（鸿蒙、Compose、小程序、uni-app、RN 的部分）需要在真机或模拟器上编译确认。
5. 排查控制台的 Hydration 不匹配报错：本轮在构建预览的 `frontend/ios`、`controls/button` 页复现；AI 基础 10 页和 `start/editor` 未出现新增控制台警告或错误。
6. 「UI 控件」模块计划补充的 6 个控件（日期选择、无限滚动、页面转场等）还只有草稿提示词，标「未验证」。
7. 校对 `TechCard` 里「新手先学什么」这类小标题的措辞。
8. 在 GitHub 仓库 Settings → Pages 把 Source 设为 GitHub Actions，站点才会部署。

## 本轮续接与验证

- 全站示例统一使用 Codex：安装与启动命令、AGENTS.md、Skills、MCP 配置、权限说明，以及可视化组件和命令面板数据。
- 权限示例使用 Codex 的沙箱、审批策略与 `prefix_rule`；工具调用用 OpenAI Responses API 演示，明确不代表 Codex CLI 的内部报文格式。
- 已运行 `npm run build`、`git diff --check`；权限章节中的 4 个规则样例通过实际 `codex execpolicy check`，检查过程未执行那些命令。
- 构建预览已检查 AI 基础 10 页的 1440 与 390 像素视口，以及规则加载切换、权限匹配、API 报文切换、播放暂停和上下文超限处理。320 像素视口发现的顶栏溢出已修复，复查页面滚动宽度为 320 像素；这是浏览器模拟视口，未验证真机触摸。
- 未安装新 MCP Server、未登录外部服务、未调用付费模型 API；示例报文仅做格式与页面检查，原生平台与其他浏览器仍未验证。

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
