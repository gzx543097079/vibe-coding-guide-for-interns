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
  /** 难度级别：基础 / 进阶 / 精通 */
  level: Level
}

export type Tag = '通用' | '前端' | '后端'
export type Level = '基础' | '进阶' | '精通'
/** 级别顺序：侧栏、首页和导航都按这个顺序排列 */
export const levels: Level[] = ['基础', '进阶', '精通']

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
): Chapter => ({ id: `${dir}/${slug}`, title, short, link: `/${dir}/${slug}`, summary, group, tag, level: '基础' })
/** 标记章节级别（默认是基础） */
const at = (level: Level, c: Chapter): Chapter => ({ ...c, level })

const rawModules: Module[] = [
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
    id: 'ai',
    no: 2,
    name: 'AI 与 Agent',
    intro: '大模型和 AI Agent 怎么工作，怎么把它们稳妥地用在工程里。',
    dir: 'ai',
    tag: '通用',
    chapters: [
      s('ai', 'llm', '大模型是什么', '大模型', '大模型怎么生成文字：预训练、对话微调与「预测下一个 token」。', 'AI 基础'),
      s('ai', 'tokens', 'token 与上下文', 'token 与上下文', 'token 怎么计数，上下文窗口装下什么、装不下会怎样。', 'AI 基础'),
      s('ai', 'prompting', '提示词基础', '提示词基础', '把目标、上下文、约束和验收标准写清楚。', 'AI 基础'),
      s('ai', 'hallucination', '幻觉与局限', '幻觉与局限', '模型为什么会编造 API、版本和引用，以及怎么发现。', 'AI 基础'),
      s('ai', 'tools', '常用 AI 工具选择', '工具选择', '对话助手、编辑器补全、命令行 Agent 各适合什么场景。', 'AI 基础'),
      s('ai', 'agent-loop', 'Agent 循环', 'Agent 循环', '读取上下文、计划、调用工具、观察结果，再决定下一步。', 'Agent 基础'),
      s('ai', 'tool-use', '工具调用', '工具调用', '模型如何用结构化参数调用函数、读写文件、运行命令。', 'Agent 基础'),
      s('ai', 'mcp', 'MCP 协议', 'MCP', 'Model Context Protocol：把外部工具和数据源接入 AI 应用的开放协议。', 'Agent 基础'),
      s('ai', 'rules-files', '规则文件与 Skills', '规则文件', '用 AGENT.md、CLAUDE.md 和 skills 把项目约定交给 Agent。', 'Agent 基础'),
      s('ai', 'permissions', '权限与安全', '权限与安全', '控制 Agent 能读写哪些文件、能执行哪些命令。', 'Agent 基础'),
      at('进阶', s('ai', 'decomposition', '任务拆解', '任务拆解', '把大需求拆成能单独验证、可以回滚的小步。')),
      at('进阶', s('ai', 'context', '上下文管理', '上下文管理', '给 Agent 恰好够用的信息：文件范围、会话切分与压缩。')),
      at('进阶', s('ai', 'multi-agent', '多 Agent 与子 Agent', '多 Agent', '把检索、审查等子任务交给子 Agent，主 Agent 负责整合。')),
      at('进阶', s('ai', 'hooks', 'Hooks 与自动化', 'Hooks', '在工具调用前后自动运行格式化、检查和测试。')),
      at('进阶', s('ai', 'evals', '评测与验收', '评测与验收', '怎么判断 Agent 的产出可以合并：测试、审查与评测集。')),
      at('精通', s('ai', 'collaboration', '复杂工程协作', '复杂工程协作', '多人、多仓库、长周期任务里如何让 Agent 稳定产出。')),
      at('精通', s('ai', 'cost', '成本与效率', '成本与效率', 'token 用量、模型选择与等待时间之间的权衡。')),
      at('精通', s('ai', 'team-standards', '团队规范', '团队规范', '团队层面的 AI 使用约定：规则文件、审查要求与数据边界。')),
      at('精通', s('ai', 'toolchain', '自建工具链', '自建工具链', '为团队编写 MCP 服务、skills 和 hooks。')),
      at('精通', s('ai', 'compliance', '风险与合规', '风险与合规', '数据安全、许可证、隐私与审计。')),
    ],
  },
  {
    id: 'git',
    no: 3,
    name: 'Git 与协作',
    intro: '用 Git 保存每一步改动，用 PR 把改动交给同事审查。',
    dir: 'git',
    tag: '通用',
    chapters: [
      s('git', 'basics', 'Git 基础', 'Git 基础', 'init、add、commit、branch、merge、rebase 与冲突处理。'),
      s('git', 'github', 'GitHub 与 PR 协作', 'GitHub 与 PR', '分支策略、PR 描述、Code Review 与 Issue。'),
      s('git', 'ai-git', 'AI 辅助下的 Git 实践', 'AI 辅助 Git', '小步提交、随时能回滚，不让 AI 改范围之外的文件。'),
      at('进阶', s('git', 'history', '改写历史', '改写历史', 'rebase -i、cherry-pick、reflog：整理提交、找回丢失的改动。')),
      at('进阶', s('git', 'workflow', '分支模型与发布', '分支与发布', 'trunk-based 与 GitFlow 的取舍，tag 与语义化版本。')),
      at('精通', s('git', 'internals', 'Git 内部原理', '内部原理', '对象、引用、暂存区与打包文件。')),
      at('精通', s('git', 'large-repo', '大仓库与 monorepo', '大仓库', '子模块、稀疏检出、Git LFS 与 monorepo 协作。')),
    ],
  },
  {
    id: 'frontend',
    no: 4,
    name: '前端与客户端',
    intro: 'Web、iOS、Android、鸿蒙和小程序：各端的基础知识和常用控件。',
    dir: 'frontend',
    tag: '前端',
    chapters: [
      s('frontend', 'web', 'Web 前端', 'Web 前端', 'HTML / CSS / JS、React / Vue、构建工具与 DevTools。'),
      s('frontend', 'ui', 'UI 控件与组件', 'UI 控件', '控件的状态、组件化思想与各平台控件的对应关系；具体控件见「UI 控件与提示词」模块。'),
      s('frontend', 'ios', 'iOS', 'iOS', 'Swift / SwiftUI 与 Xcode 的基本工作流。'),
      s('frontend', 'android', 'Android', 'Android', 'Kotlin / Compose 与 Android Studio 的基本工作流。'),
      s('frontend', 'harmonyos', '鸿蒙 HarmonyOS', '鸿蒙', 'ArkTS / ArkUI 与 DevEco Studio 的基本工作流。'),
      s('frontend', 'miniprogram', '小程序', '小程序', '微信、支付宝、抖音小程序，以及 uni-app / Taro 跨端。'),
      at('进阶', s('frontend', 'state', '状态管理', '状态管理', '组件状态、全局状态与服务端状态怎么划分。')),
      at('进阶', s('frontend', 'a11y-i18n', '无障碍与国际化', '无障碍与国际化', '语义、键盘操作、读屏，以及多语言与本地化。')),
      at('精通', s('frontend', 'architecture', '前端架构', '前端架构', '组件库、设计系统、微前端与工程化。')),
      at('精通', s('frontend', 'rendering', '渲染原理', '渲染原理', '浏览器和原生平台的渲染流程，以及卡顿从哪里来。')),
    ],
  },
  {
    id: 'controls',
    no: 5,
    name: 'UI 控件与提示词',
    intro: '常用控件与动效：可操作的演示、网页与手机多平台代码，以及经过还原验证的提示词。',
    dir: 'controls',
    tag: '前端',
    chapters: [
      s('controls', 'overview', '控件总览', '控件总览', '全部控件、验证状态与复制提示词入口。'),
      s('controls', 'button', '按钮 Button', '按钮', '按压反馈、加载与成功状态、防重复提交。', '基础输入'),
      s('controls', 'switch', '开关 Switch', '开关', '即时生效的二元设置，滑块位移与禁用说明。', '基础输入'),
      s('controls', 'checkbox', '复选框与单选', '复选与单选', '全选与半选、对勾缩放、单选圆点。', '基础输入'),
      s('controls', 'input', '输入框 Input', '输入框', '浮动标签、失焦校验与错误抖动、清除按钮。', '基础输入'),
      s('controls', 'select', '下拉选择 Select', '下拉选择', '自绘列表框的键盘操作、禁用项与系统选择器。', '基础输入'),
      s('controls', 'modal', '弹窗与底部抽屉', '弹窗与抽屉', '底部分享面板与确认对话框，焦点管理。', '反馈与浮层'),
      s('controls', 'toast', '轻提示与 Snackbar', '轻提示', '自动消失的轻提示与带撤销操作的 Snackbar。', '反馈与浮层'),
      s('controls', 'progress', '进度条与环形进度', '进度', '确定与不确定进度、环形进度和加载指示器。', '反馈与浮层'),
      s('controls', 'skeleton', '骨架屏 Skeleton', '骨架屏', '与真实布局一致的占位块、光泽扫过与内容淡入。', '反馈与浮层'),
      s('controls', 'tabbar', '底部标签栏 TabBar', '标签栏', '应用一级导航，选中背景平移与图标回弹。', '导航与切换'),
      s('controls', 'tabs', '标签页 Tabs', '标签页', '滑动下划线指示器与内容切换。', '导航与切换'),
      s('controls', 'accordion', '手风琴 Accordion', '手风琴', '一次展开一项，只用位移和透明度做展开动画。', '导航与切换'),
      at('进阶', s('controls', 'list', '下拉刷新与左滑删除', '刷新与滑删', '列表手势：下拉阈值、横向滑动露出删除按钮。', '列表与手势')),
      at('进阶', s('controls', 'carousel', '轮播 Carousel', '轮播', '拖动翻页、自动播放与暂停、圆点指示器。', '列表与手势')),
      at('进阶', s('controls', 'search', '搜索联想', '搜索联想', '防抖联想、匹配高亮、方向键选择与空结果。', '列表与手势')),
      at('进阶', s('controls', 'sortable', '拖拽排序', '拖拽排序', '指针拖动与键盘排序，位置播报。', '列表与手势')),
      at('进阶', s('controls', 'like', '点赞爆发', '点赞', '心形回弹、粒子飞散与数字滚动的微交互。', '动效与微交互')),
    ],
  },
  {
    id: 'cross',
    no: 6,
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
      at('进阶', s('cross', 'native-bridge', '原生能力桥接', '原生桥接', '调用相机、定位、支付等原生能力，以及插件开发。')),
      at('进阶', s('cross', 'release', '多端构建与发布', '构建与发布', '各端打包、签名、上架与热更新的限制。')),
      at('精通', s('cross', 'engine', '跨端运行时原理', '运行时原理', '自绘引擎、原生组件桥接与 JS 引擎的工作方式。')),
      at('精通', s('cross', 'maintenance', '跨端项目的长期维护', '长期维护', '框架升级、依赖治理与平台差异的长期成本。')),
    ],
  },
  {
    id: 'backend',
    no: 7,
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
      at('进阶', s('backend', 'transactions', '事务与并发', '事务与并发', '事务隔离级别、锁、幂等与重复提交。')),
      at('进阶', s('backend', 'auth', '权限模型', '权限模型', 'RBAC、数据权限与接口安全。')),
      at('精通', s('backend', 'distributed', '分布式基础', '分布式基础', '一致性、超时、重试与分布式事务的取舍。')),
      at('精通', s('backend', 'scale', '高可用与容量规划', '高可用', '冗余、降级、限流与容量评估。')),
    ],
  },
  {
    id: 'quality',
    no: 8,
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
      at('进阶', s('quality', 'perf-overview', '性能优化总览', '性能总览', '先测量再优化，指标与工具的思路。', '性能优化')),
      at('进阶', s('quality', 'perf-frontend', '前端性能', '前端性能', '加载、渲染、Lighthouse 与 DevTools Performance。', '性能优化', '前端')),
      at('进阶', s('quality', 'perf-mobile', '移动端性能', '移动端性能', 'iOS、Android、鸿蒙、小程序与跨端框架的性能排查。', '性能优化', '前端')),
      at('进阶', s('quality', 'perf-backend', '后端性能', '后端性能', '慢查询、缓存、N+1、并发与连接池、压测入门。', '性能优化', '后端')),
      at('进阶', s('quality', 'perf-database', '数据库性能', '数据库性能', '执行计划 EXPLAIN 与索引设计。', '性能优化', '后端')),
      at('进阶', s('quality', 'perf-ai', '用 AI 做性能优化', 'AI 性能优化', '把测量数据交给 AI，并要求它先给测量方案。', '性能优化')),
      at('进阶', s('quality', 'observability', '可观测性', '可观测性', '日志、指标与链路追踪。')),
      at('精通', s('quality', 'incident', '线上故障处理', '故障处理', '止血、定位与复盘。')),
      at('精通', s('quality', 'release-strategy', '发布策略', '发布策略', '灰度、回滚与特性开关。')),
    ],
  },
  {
    id: 'growth',
    no: 9,
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
      s('growth', 'roadmap', '成长路径与资源', '成长路径', '从完成任务到独立负责模块的成长路径与资源。'),
      at('进阶', s('growth', 'design-doc', '技术方案与设计文档', '技术方案', '写清背景、目标、方案对比与风险。')),
      at('进阶', s('growth', 'refactor', '重构遗留代码', '重构遗留代码', '先补测试，再小步重构。')),
      at('精通', s('growth', 'ownership', '独立负责模块', '负责模块', '从需求、设计、上线到维护的完整负责。')),
      at('精通', s('growth', 'decisions', '技术选型与决策', '技术决策', '选型维度与决策记录（ADR）。')),
    ],
  },
]

/** 模块内章节按级别稳定排序；同一子分组须属于同一级别，排序后仍然连续 */
export const modules: Module[] = rawModules.map((m) => ({
  ...m,
  chapters: [...m.chapters].sort((a, b) => levels.indexOf(a.level) - levels.indexOf(b.level)),
}))

/** 各级别的章节数 */
export function levelCounts(m: Module): { level: Level; count: number }[] {
  return levels.map((level) => ({ level, count: m.chapters.filter((c) => c.level === level).length })).filter((x) => x.count > 0)
}

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
