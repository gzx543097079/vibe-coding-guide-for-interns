---
title: DevOps 入门
description: Docker、CI/CD、环境区分与部署。
---

交付流程应让同一份代码以可追踪的方式完成安装、检查、构建和部署。先把本地步骤写成命令，再放进 CI，避免把某个人机器里的隐含状态当作环境配置。

## 构建与部署分开

CI 在提交或 PR 上安装依赖、运行检查并保存构建产物；CD 把获准的产物发布到指定环境。生产发布需要追踪源码 commit、产物版本、配置和操作者。重新拉源码再构建可能得到不同依赖，不能默认与审核时的产物相同。

在本仓库的干净检出目录中，构建步骤是：

```bash
npm ci
npm run build
```

`npm ci` 使用锁文件安装，会重新准备依赖目录；执行前确认所在项目。构建产物位于 `docs/.vitepress/dist`，部署还需要匹配配置中的子路径。构建成功证明静态产物生成，并不证明 Pages 的权限、路由或线上资源都正确。

## 理解容器边界

镜像描述运行环境，容器是运行实例。Docker 可以减少依赖差异，但宿主架构、卷、网络和外部服务仍会影响结果。不要把数据库唯一副本留在临时容器文件系统；持久数据需要单独的存储和恢复方案。

编写 Dockerfile 时先确认基础镜像来源、依赖锁定、运行用户和构建上下文。凭据不应复制进镜像层，即使后来删文件，旧层也可能保留它。容器隔离也不能替代权限设计。

## CI 权限跟着任务走

PR 检查一般不需要生产写权限。来自不可信分支的脚本不能带着部署凭据运行；第三方 action 也属于执行代码，应审查来源并固定可信引用。发布凭据由平台管理，日志里不打印环境变量全集。

让 Codex 写工作流前，提供实际 package scripts、产物目录和发布环境，要求失败即停止并保留必要诊断。上线前在测试环境验证一次产物路径、健康检查与回退步骤。没有部署权限时，交付构建和待执行步骤，如实说明线上尚未验证。

## 工具速查

<TechCard ids="docker,github-actions" />

继续查阅：[Docker 容器概念](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)、[GitHub Actions 安全](https://docs.github.com/en/actions/reference/security/secure-use)。
