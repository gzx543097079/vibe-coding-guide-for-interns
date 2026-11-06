// 模块与章节数据：首页模块卡片、侧边栏、章节面包屑共用的唯一数据源。
// 只放纯数据和纯函数，不依赖 Vue 或浏览器 API，供 config 与主题同时引用。

export interface Chapter {
  /** 章节 id，在全站唯一 */
  id: string
  /** 章节完整标题 */
  title: string
  /** 卡片上的短标题 */
  short: string
  /** 相对 docs 的路由，不含 base，例如 /start/intro */
  link: string
  /** 一句话摘要 */
  summary: string
  /** 侧边栏子分组名（同一模块内连续的一组章节） */
  group?: string
  /** 方向类标，缺省时使用模块的类标 */
  tag?: Tag
}

export type Tag = '通用' | '前端' | '后端'

export interface Module {
  id: string
  /** 模块编号，从 1 开始 */
  no: number
  name: string
  /** 模块简介 */
  intro: string
  /** 章节目录 */
  dir: string
  /** 默认方向类标 */
  tag: Tag
  chapters: Chapter[]
}

const s = (
  dir: string,
  slug: string,
  title: string,
  short: string,
  summary: string,
  group?: string,
  tag?: Tag,
): Chapter => ({ id: `${dir}/${slug}`, title, short, link: `/${dir}/${slug}`, summary, group, tag })

export const modules: Module[] = [
  {
    id: 'start',
    no: 1,
    name: '起步',
    intro: '装好开发环境，了解 AI 能做什么，养成基本的工程习惯。',
    dir: 'start',
    tag: '通用',
    chapters: [
      s('start', 'intro', '入门须知', '入门须知', '什么是 Vibe Coding，AI 能帮你做什么、哪些事必须你自己判断。'),
      s('start', 'setup', '软件与环境安装', '环境安装', '终端、包管理器、Node / Python / JDK 等运行时与 Git 的安装。'),
      s('start', 'editor', '编辑器与 AI 工具', '编辑器与 AI', 'VS Code、JetBrains、Cursor、Claude Code 的安装、插件与 AI 配置文件。'),
      s('start', 'conventions', '代码规范与工程素养', '代码规范', '命名、格式化、注释、提交规范与代码审查要点。'),
      s('start', 'structure', '项目结构与文件夹架构', '项目结构', '常见目录约定、分层与模块化、monorepo 与配置文件。'),
    ],
  },
  {
    id: 'git',
    no: 2,
    name: 'Git 与协作',
    intro: '用 Git 保存每一步改动，用 PR 把改动交给同事审查。',
    dir: 'git',
    tag: '通用',
    chapters: [
      s('git', 'basics', 'Git 基础', 'Git 基础', 'init、add、commit、branch、merge、rebase 与冲突处理。'),
      s('git', 'github', 'GitHub 与 PR 协作', 'GitHub 与 PR', '分支策略、PR 描述、Code Review 与 Issue。'),
      s('git', 'ai-git', 'AI 辅助下的 Git 实践', 'AI 辅助 Git', '小步提交、随时能回滚，不让 AI 改范围之外的文件。'),
    ],
  },
  {
    id: 'frontend',
    no: 3,
    name: '前端与客户端',
    intro: 'Web、iOS、Android、鸿蒙和小程序：各端的基础知识和常用控件。',
    dir: 'frontend',
    tag: '前端',
    chapters: [
      s('frontend', 'web', 'Web 前端', 'Web 前端', 'HTML / CSS / JS、React / Vue、构建工具与 DevTools。'),
      s('frontend', 'ui', 'UI 控件与组件', 'UI 控件', '常见控件的行为与组件化思想，附各平台实现对照。'),
      s('frontend', 'controls', '控件总览', '控件总览', '所有控件的缩略演示和提示词入口。'),
      s('frontend', 'ios', 'iOS', 'iOS', 'Swift / SwiftUI 与 Xcode 的基本工作流。'),
      s('frontend', 'android', 'Android', 'Android', 'Kotlin / Compose 与 Android Studio 的基本工作流。'),
      s('frontend', 'harmonyos', '鸿蒙 HarmonyOS', '鸿蒙', 'ArkTS / ArkUI 与 DevEco Studio 的基本工作流。'),
      s('frontend', 'miniprogram', '小程序', '小程序', '微信、支付宝、抖音小程序，以及 uni-app / Taro 跨端。'),
    ],
  },
  {
    id: 'cross',
    no: 4,
    name: '大前端 / 跨端',
    intro: '一套代码运行在多个平台：先比较方案，再学具体框架。',
    dir: 'cross',
    tag: '前端',
    chapters: [
      s('cross', 'overview', '大前端总览', '大前端总览', '什么是大前端，原生、跨端与小程序容器怎么选。'),
      s('cross', 'languages', '语言基础', '语言基础', 'JS / TS、Dart、Kotlin、Swift、ArkTS 的定位与上手路径。'),
      s('cross', 'flutter', 'Flutter', 'Flutter', '用 Dart 写一套 UI，自绘引擎覆盖多端。'),
      s('cross', 'react-native', 'React Native', 'React Native', '用 React + TypeScript 调用原生组件。'),
      s('cross', 'uni-app', 'uni-app', 'uni-app', '基于 Vue，一套代码发布到小程序、H5 与 App。'),
      s('cross', 'taro', 'Taro', 'Taro', '用 React 或 Vue 开发多端小程序。'),
      s('cross', 'others', '其他跨端方案', '其他方案', 'Kotlin Multiplatform、Electron / Tauri、Capacitor 简述。'),
    ],
  },
  {
    id: 'backend',
    no: 5,
    name: '后端与数据',
    intro: '接口设计、数据库和服务架构。',
    dir: 'backend',
    tag: '后端',
    chapters: [
      s('backend', 'frameworks', '后端语言与框架', '语言与框架', 'Spring Boot、Express / NestJS、FastAPI / Django、Go 等。'),
      s('backend', 'api', 'API 设计', 'API 设计', 'HTTP / REST、OpenAPI 接口文档、JWT / OAuth 鉴权。'),
      s('backend', 'database', '常用数据库', '数据库', '关系型与非关系型数据库、ORM、表设计、索引与迁移。'),
      s('backend', 'middleware', '常用中间件与服务', '中间件', '消息队列、缓存、对象存储与搜索服务。'),
      s('backend', 'architecture', '后端架构', '后端架构', '单体与微服务、分层、配置与环境变量、日志与监控。'),
    ],
  },
  {
    id: 'quality',
    no: 6,
    name: '质量与交付',
    intro: '测试、排错、代码审查、部署、安全和性能优化。',
    dir: 'quality',
    tag: '通用',
    chapters: [
      s('quality', 'testing', '测试', '测试', '单元、集成与 E2E 测试，让 AI 先写测试。'),
      s('quality', 'debugging', '调试与排错', '调试与排错', '读报错、看日志、打断点，把问题讲清楚给 AI。'),
      s('quality', 'review', '验证与代码审查', '验证与审查', '不盲信 AI 输出，逐行审 diff，识别不存在的 API。'),
      s('quality', 'devops', 'DevOps 入门', 'DevOps', 'Docker、CI/CD、环境区分与部署。'),
      s('quality', 'security', '安全与规范', '安全与规范', '密钥与敏感数据、依赖与许可证风险、破坏性操作。'),
      s('quality', 'perf-overview', '性能优化总览', '性能总览', '先测量再优化，指标与工具的思路。', '性能优化'),
      s('quality', 'perf-frontend', '前端性能', '前端性能', '加载、渲染、Lighthouse 与 DevTools Performance。', '性能优化', '前端'),
      s('quality', 'perf-mobile', '移动端性能', '移动端性能', 'iOS、Android、鸿蒙、小程序与跨端框架的性能排查。', '性能优化', '前端'),
      s('quality', 'perf-backend', '后端性能', '后端性能', '慢查询、缓存、N+1、并发与连接池、压测入门。', '性能优化', '后端'),
      s('quality', 'perf-database', '数据库性能', '数据库性能', '执行计划 EXPLAIN 与索引设计。', '性能优化', '后端'),
      s('quality', 'perf-ai', '用 AI 做性能优化', 'AI 性能优化', '把测量数据交给 AI，并要求它先给测量方案。', '性能优化'),
    ],
  },
  {
    id: 'growth',
    no: 7,
    name: '提升',
    intro: '提示词怎么写、陌生代码怎么读，以及实战案例和成长路径。',
    dir: 'growth',
    tag: '通用',
    chapters: [
      s('growth', 'prompt-basics', '提示词基础结构', '提示词结构', '目标、上下文、约束、验收标准、输出格式。', '提示词实践'),
      s('growth', 'prompt-templates', '场景提示词模板', '场景模板', '写功能、修 bug、重构、测试、审查等场景的通用模板。', '提示词实践'),
      s('growth', 'prompt-iteration', '迭代与纠偏', '迭代与纠偏', '追问、先方案后动手、拆小步，以及何时停下自己想。', '提示词实践'),
      s('growth', 'prompt-context', '上下文管理', '上下文管理', 'CLAUDE.md / AGENT.md、文件范围与敏感信息。', '提示词实践'),
      s('growth', 'prompt-antipatterns', '提示词反模式', '提示词反模式', '模糊需求、一次塞太多、盲信输出。', '提示词实践'),
      s('growth', 'codebase', '读懂陌生代码库', '读懂代码库', '从入口、目录和调用链读起，让 AI 帮你梳理模块关系。'),
      s('growth', 'data-ai', '数据与 AI 应用入门', '数据与 AI', '可选方向：数据分析与调用大模型 API。'),
      s('growth', 'cases', '实战案例', '实战案例', '完整任务的复盘（建设中）。'),
      s('growth', 'cheatsheet', '速查表与反模式', '速查与反模式', '常用命令、检查清单与常见反模式（建设中）。'),
      s('growth', 'roadmap', '成长路径与资源', '成长路径', '从实习生到独立负责模块的成长路径与资源。'),
    ],
  },
]

export interface ChapterRef {
  module: Module
  chapter: Chapter
  /** 在本模块中的序号，从 0 开始 */
  index: number
  /** 全局序号，从 0 开始 */
  order: number
}

/** 按全局顺序展开的所有章节 */
export const allChapters: ChapterRef[] = (() => {
  const out: ChapterRef[] = []
  for (const module of modules) {
    module.chapters.forEach((chapter, index) => {
      out.push({ module, chapter, index, order: out.length })
    })
  }
  return out
})()

export const totalChapters = allChapters.length

/** 规范化路由：去掉 .md / .html、末尾斜杠与 index */
export function normalizePath(path: string): string {
  let p = path.replace(/\.(md|html)$/, '').replace(/\/index$/, '').replace(/\/$/, '')
  if (!p.startsWith('/')) p = '/' + p
  return p
}

/** 根据页面相对路径（如 start/intro.md）查找章节 */
export function findChapter(relativePath: string): ChapterRef | undefined {
  const p = normalizePath(relativePath)
  return allChapters.find((r) => r.chapter.link === p)
}

/** 章节编号，例如 3.04 */
export function chapterCode(ref: { module: Module; index: number }): string {
  return `${ref.module.no}.${String(ref.index + 1).padStart(2, '0')}`
}

/** 章节的方向类标 */
export function chapterTag(ref: { module: Module; chapter: Chapter }): Tag {
  return ref.chapter.tag ?? ref.module.tag
}
