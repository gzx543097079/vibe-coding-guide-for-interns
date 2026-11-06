// 线路与站点数据：首页线路图、侧边栏、章节进度条共用的唯一数据源。
// 只放纯数据和纯函数，不依赖 Vue 或浏览器 API，供 config 与主题同时引用。

export interface Station {
  /** 站点 id，在全站唯一 */
  id: string
  /** 章节完整标题 */
  title: string
  /** 线路图上的短站名 */
  short: string
  /** 相对 docs 的路由，不含 base，例如 /start/intro */
  link: string
  /** 一句话摘要，用于悬停面板与线路详情 */
  summary: string
  /** 侧边栏子分组名（同一线路内连续的一组站点） */
  group?: string
}

export interface Line {
  id: string
  /** 线路编号，从 1 开始 */
  no: number
  name: string
  /** 线路简介 */
  intro: string
  /** 章节目录 */
  dir: string
  stations: Station[]
}

export interface Transfer {
  /** 两个换乘站点的 id */
  a: string
  b: string
  /** 换乘理由，一句话 */
  note: string
}

const s = (
  dir: string,
  slug: string,
  title: string,
  short: string,
  summary: string,
  group?: string,
): Station => ({ id: `${dir}/${slug}`, title, short, link: `/${dir}/${slug}`, summary, group })

export const lines: Line[] = [
  {
    id: 'start',
    no: 1,
    name: '起步',
    intro: '装好环境、认清 AI 的定位，建立最基本的工程习惯。',
    dir: 'start',
    stations: [
      s('start', 'intro', '入门须知', '入门须知', '什么是 Vibe Coding，为什么 AI 是副驾，它能做什么、不能做什么。'),
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
    intro: '学会用 Git 保存每一步，用 PR 把改动交给团队审。',
    dir: 'git',
    stations: [
      s('git', 'basics', 'Git 基础', 'Git 基础', 'init、add、commit、branch、merge、rebase 与冲突处理。'),
      s('git', 'github', 'GitHub 与 PR 协作', 'GitHub 与 PR', '分支策略、PR 描述、Code Review 与 Issue。'),
      s('git', 'ai-git', 'AI 辅助下的 Git 实践', 'AI 辅助 Git', '小步提交、随时回滚，不让 AI 越界改动。'),
    ],
  },
  {
    id: 'frontend',
    no: 3,
    name: '前端与客户端',
    intro: '从 Web 到原生客户端与小程序，先懂各端的基本盘。',
    dir: 'frontend',
    stations: [
      s('frontend', 'web', 'Web 前端', 'Web 前端', 'HTML / CSS / JS、React / Vue、构建工具与 DevTools。'),
      s('frontend', 'ui', 'UI 控件与组件', 'UI 控件', '常见控件的行为与组件化思想，附各平台实现对照。'),
      s('frontend', 'controls', '控件总览', '控件总览', '所有控件的缩略演示，一眼找到要看的那一个。'),
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
    intro: '一套代码跑多端：先比较方案，再进具体框架。',
    dir: 'cross',
    stations: [
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
    intro: '接口、数据库与服务架构：后端代码出错的代价更高。',
    dir: 'backend',
    stations: [
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
    intro: '验证先于信任：测试、排错、审查、安全与性能。',
    dir: 'quality',
    stations: [
      s('quality', 'testing', '测试', '测试', '单元、集成与 E2E 测试，让 AI 先写测试。'),
      s('quality', 'debugging', '调试与排错', '调试与排错', '读报错、看日志、打断点，把问题讲清楚给 AI。'),
      s('quality', 'review', '验证与代码审查', '验证与审查', '不盲信 AI 输出，逐行审 diff，识别不存在的 API。'),
      s('quality', 'devops', 'DevOps 入门', 'DevOps', 'Docker、CI/CD、环境区分与部署。'),
      s('quality', 'security', '安全与规范', '安全与规范', '密钥与敏感数据、依赖与许可证风险、破坏性操作。'),
      s('quality', 'perf-overview', '性能优化总览', '性能总览', '先测量再优化，指标与工具的思路。', '性能优化'),
      s('quality', 'perf-frontend', '前端性能', '前端性能', '加载、渲染、Lighthouse 与 DevTools Performance。', '性能优化'),
      s('quality', 'perf-mobile', '移动端性能', '移动端性能', 'iOS、Android、鸿蒙、小程序与跨端框架的性能排查。', '性能优化'),
      s('quality', 'perf-backend', '后端性能', '后端性能', '慢查询、缓存、N+1、并发与连接池、压测入门。', '性能优化'),
      s('quality', 'perf-database', '数据库性能', '数据库性能', '执行计划 EXPLAIN 与索引设计。', '性能优化'),
      s('quality', 'perf-ai', '用 AI 做性能优化', 'AI 性能优化', '把测量数据交给 AI，并要求它先给测量方案。', '性能优化'),
    ],
  },
  {
    id: 'growth',
    no: 7,
    name: '提升',
    intro: '把提示词写清楚，读懂陌生代码，再到实战与成长。',
    dir: 'growth',
    stations: [
      s('growth', 'prompt-basics', '提示词基础结构', '提示词结构', '目标、上下文、约束、验收标准、输出格式。', '提示词实践'),
      s('growth', 'prompt-templates', '场景提示词模板', '场景模板', '写功能、修 bug、重构、测试、审查等场景的通用模板。', '提示词实践'),
      s('growth', 'prompt-iteration', '迭代与纠偏', '迭代与纠偏', '追问、先方案后动手、拆小步，以及何时停下自己想。', '提示词实践'),
      s('growth', 'prompt-context', '上下文管理', '上下文管理', 'CLAUDE.md / AGENT.md、文件范围与敏感信息。', '提示词实践'),
      s('growth', 'prompt-antipatterns', '提示词反模式', '提示词反模式', '模糊需求、一次塞太多、盲信输出。', '提示词实践'),
      s('growth', 'codebase', '读懂陌生代码库', '读懂代码库', '从入口、目录与调用链读起，让 AI 帮你画地图。'),
      s('growth', 'data-ai', '数据与 AI 应用入门', '数据与 AI', '可选方向：数据分析与调用大模型 API。'),
      s('growth', 'cases', '实战案例', '实战案例', '完整任务的复盘（建设中）。'),
      s('growth', 'cheatsheet', '速查表与反模式', '速查与反模式', '常用命令、检查清单与常见反模式（建设中）。'),
      s('growth', 'roadmap', '成长路径与资源', '成长路径', '从实习生到独立负责模块的成长路径与资源。'),
    ],
  },
]

/** 换乘关系：两条相邻线路上内容衔接的站点 */
export const transfers: Transfer[] = [
  { a: 'start/conventions', b: 'git/basics', note: '提交规范与 Git 基础衔接' },
  { a: 'frontend/miniprogram', b: 'cross/uni-app', note: '小程序可用 uni-app 跨端开发' },
  { a: 'backend/api', b: 'quality/testing', note: '接口需要测试兜底' },
  { a: 'backend/architecture', b: 'quality/devops', note: '架构落地离不开部署与监控' },
  { a: 'quality/security', b: 'growth/prompt-context', note: '敏感信息不能进提示词' },
]

export interface StationRef {
  line: Line
  station: Station
  /** 在本线路中的序号，从 0 开始 */
  index: number
  /** 全局序号，从 0 开始 */
  order: number
}

/** 按全局顺序展开的所有站点 */
export const allStations: StationRef[] = (() => {
  const out: StationRef[] = []
  for (const line of lines) {
    line.stations.forEach((station, index) => {
      out.push({ line, station, index, order: out.length })
    })
  }
  return out
})()

export const totalStations = allStations.length

/** 规范化路由：去掉 .html、末尾斜杠与 index */
export function normalizePath(path: string): string {
  let p = path.replace(/\.(md|html)$/, '').replace(/\/index$/, '').replace(/\/$/, '')
  if (!p.startsWith('/')) p = '/' + p
  return p
}

/** 根据页面相对路径（如 start/intro.md）查找站点 */
export function findStation(relativePath: string): StationRef | undefined {
  const p = normalizePath(relativePath)
  return allStations.find((r) => r.station.link === p)
}

/** 查找某站点的换乘对象 */
export function transfersOf(id: string): { ref: StationRef; note: string }[] {
  const out: { ref: StationRef; note: string }[] = []
  for (const t of transfers) {
    const other = t.a === id ? t.b : t.b === id ? t.a : null
    if (!other) continue
    const ref = allStations.find((r) => r.station.id === other)
    if (ref) out.push({ ref, note: t.note })
  }
  return out
}

/** 站点编号，例如 3-02 */
export function stationCode(ref: { line: Line; index: number }): string {
  return `${ref.line.no}-${String(ref.index + 1).padStart(2, '0')}`
}
