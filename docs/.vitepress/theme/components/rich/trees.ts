// 文件夹树预设。每行：路径层级 depth、名称、说明；dir 表示目录，hl 表示本图重点
export interface TreeNode {
  name: string
  depth: number
  note?: string
  dir?: boolean
  hl?: boolean
}

const n = (depth: number, name: string, note?: string, extra: Partial<TreeNode> = {}): TreeNode => ({
  depth,
  name,
  note,
  dir: name.endsWith('/'),
  ...extra,
})

export const trees: Record<string, { title: string; nodes: TreeNode[] }> = {
  // 常见的 Vite 类前端项目，目录名是社区常见约定，具体以项目为准
  'web-app': {
    title: 'my-app（示意）',
    nodes: [
      n(0, 'src/', '源代码，日常改动几乎都在这里', { hl: true }),
      n(1, 'main.ts', '入口：创建应用、挂载到页面'),
      n(1, 'pages/', '页面级组件，常和路由一一对应'),
      n(1, 'components/', '可复用的界面组件'),
      n(1, 'api/', '调用后端接口的函数'),
      n(1, 'utils/', '与界面无关的小工具函数'),
      n(1, 'styles/', '全局样式与设计变量'),
      n(0, 'public/', '原样拷贝到产物的静态文件（图标、robots.txt）'),
      n(0, 'tests/', '测试；也有项目把测试放在源码旁边'),
      n(0, 'scripts/', '构建、发布等辅助脚本'),
      n(0, 'package.json', '依赖列表与 npm run 命令', { hl: true }),
      n(0, 'package-lock.json', '锁定依赖的精确版本，要提交'),
      n(0, 'tsconfig.json', 'TypeScript 编译选项'),
      n(0, 'vite.config.ts', '构建工具配置'),
      n(0, '.env.example', '环境变量模板，可以提交'),
      n(0, '.env', '真实的密钥和地址，不提交', { hl: true }),
      n(0, '.gitignore', '告诉 Git 哪些文件不进仓库'),
      n(0, 'README.md', '怎么安装、怎么运行'),
    ],
  },
  // 本指南仓库的真实结构（节选）
  'this-repo': {
    title: 'vibe-coding-guide-for-interns',
    nodes: [
      n(0, 'docs/', '站点源文件'),
      n(1, '.vitepress/', 'VitePress 配置与自定义主题'),
      n(2, 'config.mts', '站点配置：标题、侧边栏、搜索'),
      n(2, 'theme/', '自定义主题'),
      n(3, 'index.ts', '主题入口，注册全局组件'),
      n(3, 'components/', 'Vue 组件，Markdown 里可直接使用'),
      n(3, 'data/', '纯数据'),
      n(4, 'modules.ts', '模块与章节的唯一数据源', { hl: true }),
      n(3, 'styles/', '设计令牌与全局样式'),
      n(1, 'start/', '「起步」模块的章节，一章一个 .md', { hl: true }),
      n(1, 'public/', '原样发布的静态文件'),
      n(1, 'index.md', '首页'),
      n(0, 'AGENT.md', '给 AI 助手的工作约定'),
      n(0, 'PRODUCT.md', '产品定位与内容原则'),
      n(0, 'package.json', '依赖与 dev / build / preview 命令'),
      n(0, 'README.md'),
      n(0, 'LICENSE', 'MIT 协议'),
    ],
  },
}
