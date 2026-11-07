// 网站导览的数据只引用现有章节，不另建一份课程正文。
export const courseVisuals: Record<
  string,
  { color: string; surface: string; phrase: string }
> = {
  start: { color: '#27624e', surface: '#e4eee8', phrase: '从准备好环境开始' },
  ai: {
    color: '#254cec',
    surface: '#e7edff',
    phrase: '与 AI 一起，把事情做成',
  },
  git: { color: '#a94c34', surface: '#f8e7e0', phrase: '让每次改动有迹可循' },
  frontend: {
    color: '#2358ba',
    surface: '#e5efff',
    phrase: '做出看得见、用得好的界面',
  },
  controls: {
    color: '#6b3caf',
    surface: '#eee7f8',
    phrase: '让细节有反馈，让操作有回应',
  },
  cross: {
    color: '#087169',
    surface: '#def0ec',
    phrase: '一次构建，理解不同平台',
  },
  backend: {
    color: '#8c4d22',
    surface: '#f6eadc',
    phrase: '让数据与业务可靠运转',
  },
  quality: {
    color: '#4d5e26',
    surface: '#eaf0df',
    phrase: '写完之后，还要交付得好',
  },
  growth: {
    color: '#9b3d64',
    surface: '#f6e5ed',
    phrase: '从完成任务到独立负责',
  },
}

export const learningPaths = [
  {
    id: 'first-project',
    title: '完成你的第一个项目',
    description: '从环境、AI 协作到版本管理，建立完整开发习惯。',
    icon: 'start',
    modules: ['start', 'ai', 'git', 'quality'],
    outcome: '能够拆解一个小需求，用 Codex 实现、检查，并提交可审查的 PR。',
  },
  {
    id: 'interface',
    title: '做出好用的界面',
    description: '理解前端基础，动手体验组件，再走向多端开发。',
    icon: 'frontend',
    modules: ['frontend', 'controls', 'cross'],
    outcome: '能够解释组件状态与数据流，检查键盘交互，并理解各目标端的差异。',
  },
  {
    id: 'delivery',
    title: '构建可靠的服务',
    description: '打通接口、数据与交付，学习在系统边界上做判断。',
    icon: 'backend',
    modules: ['backend', 'quality', 'growth'],
    outcome: '能够定义 API、考虑权限与并发，设计验证方法和可恢复的交付流程。',
  },
]
