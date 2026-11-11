# AGENT.md

本文件为 AI 编码助手（agent）在本仓库工作时的指引。

## 项目简介

VibeCoding 开发指南：介绍如何借助 AI 编码助手进行高效开发的文档项目。

## 目录结构

- `AGENT.md`：本文件，agent 工作约定
- `docs/`：VitePress 站点源文件，各模块章节按目录存放（`start/`、`ai/`、`git/`、`frontend/`、`controls/`、`cross/`、`backend/`、`quality/`、`growth/`）；`docs/snippets/` 是控件页引用的代码片段
- `docs/.vitepress/`：站点配置与主题；`theme/data/modules.ts` 是模块与章节的唯一数据源
- `.github/workflows/deploy.yml`：push 到 `main` 后构建并部署到 GitHub Pages
- `.github/workflows/check.yml`：PR 上检查提示词快照并构建
- `scripts/verify-prompts/`：提示词还原验证的脚本和材料，改了 `controlPrompts.ts` 里已验证的提示词要按其中的 README 重新验证
- 常用命令：`npm run dev`（本地预览）、`npm run build`（构建）、`npm run preview`（预览构建产物）、`npm run check:prompts`（提示词快照检查）

## 工作约定

- **语言**：文档、注释、commit message、PR 均使用简体中文；代码、命令、路径保持原文。
- **排版**：使用中文全角标点；中英文、数字之间加一个空格；技术术语保留英文。
- **改动范围**：只改与任务相关的文件，不顺手重构或改动无关内容。
- **文档风格**：简洁直接，先结论后细节；示例代码需可运行。

## Git 流程

1. 从 `main` 新建功能分支（`feat/xxx`、`fix/xxx`、`docs/xxx`）。
2. 在功能分支提交并 push，禁止直接向 `main` 提交或合并。
3. 使用 `gh pr create` 提 PR，等待人工审核。
4. 审核通过后使用 `gh pr merge --merge` 合并（不用 squash / rebase / `--auto`）。
5. commit 前先查看 `git status` 与 diff，只添加相关文件，不使用 `git add -A` 或 `git add .`。

## 安全

- 不读取、不输出、不提交 `.env`、密钥、token 等凭据文件。
- `rm -rf`、`git reset --hard`、`git push --force`、删除分支等破坏性操作须先获得确认。

## 完成标准

- 文档链接、示例命令已实际验证。
- 未验证或失败的部分如实说明。
