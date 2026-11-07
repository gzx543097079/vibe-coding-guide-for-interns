---
title: 项目结构与文件夹架构
description: 常见目录约定、分层与模块化、monorepo 与配置文件。
---

<RPath />

新文件放哪，**先看项目里同类文件放在哪**。目录结构没有唯一正确答案，但一个项目内部必须一致。AI 不了解你的项目时，最爱按它「印象中的标准结构」新建目录，这是要拦下来的第一件事。

## 一个典型的前端项目

下面是 Vite 类前端项目的常见布局。目录名是社区常见约定，具体以你的项目为准。点目录可以折叠，「只看重点」会标出最常打交道的几项。

<RFolderTree preset="web-app" caption="示意结构。后端、移动端项目的目录名不同，但「源码、测试、配置、脚本分开放」的思路相同。" />

## 按类型还是按功能组织

源码目录有两种常见组织方式，各有适用场景。看项目已经用了哪种，跟着用。

<RCompare neutral bad-title="按类型：同类文件放一起" good-title="按功能：同一业务放一起">
<template #bad>

```text
src/
  components/  LoginForm.vue  OrderList.vue
  api/         auth.ts        order.ts
  stores/      auth.ts        order.ts
```

小项目直观，找「所有接口」很方便。业务一多，改一个功能要在好几个目录之间来回跳。

</template>
<template #good>

```text
src/
  features/
    auth/   LoginForm.vue  api.ts  store.ts
    order/  OrderList.vue  api.ts  store.ts
  shared/   通用组件与工具
```

改一个功能只看一个目录，删功能也干净。需要约定清楚什么放 `shared/`。

</template>
</RCompare>

## 配置文件一览

根目录的配置文件决定了项目怎么装、怎么跑、怎么构建。AI 改这些文件时要格外小心。

<RPoints>
<RPoint icon="package" title="package.json">依赖列表和 <code>npm run</code> 命令。别的语言对应 <code>pyproject.toml</code>、<code>pom.xml</code>、<code>build.gradle</code>、<code>go.mod</code> 等。</RPoint>
<RPoint icon="key" title="锁文件">如 <code>package-lock.json</code>、<code>pnpm-lock.yaml</code>，锁定依赖的精确版本。要提交，但不要手改。</RPoint>
<RPoint icon="code" title="tsconfig.json">TypeScript 的编译选项和路径别名，比如 <code>@/</code> 指向 <code>src/</code>。</RPoint>
<RPoint icon="shield" title=".env 与 .env.example" tone="warn"><code>.env</code> 放真实密钥，绝不提交；<code>.env.example</code> 只列变量名，供别人照着填。</RPoint>
<RPoint icon="eye" title=".gitignore">列出不进仓库的文件：依赖目录、构建产物、<code>.env</code>、本地缓存。</RPoint>
<RPoint icon="gear" title="CI 配置">如 <code>.github/workflows/</code>，定义每次提交自动跑的检查。改它会影响整个团队。</RPoint>
</RPoints>

## monorepo

一个仓库里放多个相互关联的项目（比如前端、后端、共享组件库），叫 monorepo。根目录通常有一份工作区配置，子项目放在 `apps/`、`packages/` 之类的目录下，各自有自己的 `package.json`。常见工具有 pnpm workspaces、Turborepo、Nx。

在 monorepo 里工作时，先弄清你改的是哪个子项目，命令要在哪个目录下运行。让 AI 动手前，也要明确告诉它子项目的路径。

## 一个真实例子：本指南的仓库

这份指南本身就是一个 VitePress 项目。新增一章时，只需要在 `docs/` 对应模块目录下加一个 `.md` 文件，并在 `modules.ts` 里登记。

<RFolderTree preset="this-repo" caption="节选，省略了部分组件和其他模块目录。" />

## 新文件放哪：四步判断

<RSteps>
<RStep title="找同类文件" note="项目里已有的同类文件放在哪" open>

要加一个组件，先看现有组件在哪个目录、怎么命名；要加一个接口函数，先看现有接口函数放在哪。用编辑器的「按文件名打开」或全局搜索找。

</RStep>
<RStep title="看导入方式" note="相对路径还是别名">

看同类文件是用 `../../utils` 还是 `@/utils` 导入的，新文件照着写。

</RStep>
<RStep title="把结构告诉 AI" note="给它看目录，再让它写">

把相关目录结构和一个同类文件给 AI 看，明确说「放在 xxx 目录，参照 yyy 的写法」。不说，它就会按自己的习惯放。

</RStep>
<RStep title="构建和测试" note="移动或新增文件后，确认没有断掉的导入">

跑一遍构建和测试。移动文件后，检查所有引用它的地方都更新了；再用 `git status` 查看文件列表，确认没有带入 `.env`、构建产物或无关的配置改动。

</RStep>
</RSteps>
