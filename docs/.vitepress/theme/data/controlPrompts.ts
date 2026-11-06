// 控件提示词：每个控件的目标、交互、动画与验收项，由 buildControlPrompt 组装成完整提示词。
// {} 内是需要使用者替换的占位符。

export interface ControlSpec {
  id: string
  name: string
  /** 草稿：还没有对应的演示，描述较粗 */
  draft?: boolean
  goal: string
  interaction: string[]
  animation: string[]
  acceptance: string[]
}

export interface PromptOptions {
  animation: boolean
  dark: boolean
  a11y: boolean
  test: boolean
  compare: boolean
}

export const defaultOptions: PromptOptions = {
  animation: true,
  dark: true,
  a11y: true,
  test: false,
  compare: false,
}

export const optionLabels: [keyof PromptOptions, string][] = [
  ['animation', '带动画'],
  ['dark', '支持深色模式'],
  ['a11y', '无障碍'],
  ['test', '附带测试'],
  ['compare', '先对比方案再动手'],
]

/** 代码标签名对应的技术栈说明 */
export const stackOf: Record<string, string> = {
  'Objective-C': 'iOS，UIKit（Objective-C）',
  'Swift (UIKit)': 'iOS，UIKit（Swift）',
  SwiftUI: 'iOS，SwiftUI',
  Java: 'Android，View 体系（Java）',
  'Kotlin (View)': 'Android，View 体系（Kotlin）',
  'Kotlin (Compose)': 'Android，Jetpack Compose（Kotlin）',
  ArkTS: '鸿蒙，ArkUI（ArkTS）',
  'ArkTS (ArkUI)': '鸿蒙，ArkUI（ArkTS）',
  'WXML + JS': '微信小程序原生（WXML + JS）',
  'uni-app (Vue)': 'uni-app（Vue）',
  'Taro (React)': 'Taro（React）',
  'Flutter (Dart)': 'Flutter（Dart）',
  'React Native (TSX)': 'React Native（TypeScript）',
  'HTML + CSS + JS': 'Web，原生 HTML / CSS / JavaScript',
  React: 'Web，React（TypeScript）',
  Vue: 'Web，Vue 3',
}

export const controls: ControlSpec[] = [
  {
    id: 'button',
    name: '按钮',
    goal: '一个提交按钮：点击后进入加载状态并防止重复提交，完成后显示结果。另有次要按钮和禁用按钮两种样式。',
    interaction: [
      '点击、回车或空格都能触发',
      '提交期间按钮禁用，显示加载指示，文字改为「提交中…」',
      '提交完成后短暂显示成功状态，再恢复可点击',
      '禁用按钮不响应任何操作',
    ],
    animation: ['按下时缩小到约 0.96 倍，松开回弹', '加载指示器匀速旋转', '状态切换时按钮尺寸不变，避免页面跳动'],
    acceptance: ['连续快速点击只触发一次提交', '加载中再次点击无效', '禁用按钮在外观上能和可用按钮区分开'],
  },
  {
    id: 'switch',
    name: '开关',
    goal: '一组设置项开关：点击开关或整行切换开/关，并把新状态回调给调用方。',
    interaction: [
      '点击开关或所在行切换状态',
      '键盘聚焦后按空格切换',
      '切换后立即生效，并通过回调（如 onChange）通知调用方',
      '支持禁用状态，并在行内说明禁用原因',
    ],
    animation: ['滑块水平位移，时长约 200～300ms，使用缓出曲线', '轨道颜色在开、关两种状态之间过渡', '按下时滑块略微拉长'],
    acceptance: ['界面状态与回调值始终一致', '禁用时点击和键盘都不会改变状态', '读屏能读出开关名称和当前开/关状态'],
  },
  {
    id: 'modal',
    name: '弹窗',
    goal: '两种弹窗：底部弹出的分享菜单，和删除前的确认对话框。',
    interaction: [
      '点击「分享」从底部弹出选项面板，点击遮罩或「取消」关闭',
      '点击「删除」弹出确认对话框，包含「取消」和「删除」两个按钮',
      '打开后焦点移入弹窗，关闭后回到触发按钮',
      '按 Esc 或系统返回键关闭',
    ],
    animation: ['底部弹窗从屏幕下方滑入，遮罩同时淡入', '对话框从略大缩放到正常尺寸并淡入', '关闭动画比打开稍快'],
    acceptance: ['弹窗打开时，背后的内容不能被点击或聚焦', '调用方能拿到用户选择的结果', '关闭后焦点回到触发按钮'],
  },
  {
    id: 'list',
    name: '列表',
    goal: '一个消息列表，支持下拉刷新和左滑删除。',
    interaction: [
      '列表滚动到顶部后继续下拉，超过阈值松手触发刷新，刷新中显示加载指示',
      '刷新完成后新数据插入列表顶部，指示器收起',
      '向左滑动某一行露出「删除」按钮，点击后删除该行',
      '另外提供不依赖手势的刷新和删除入口（如按钮或菜单）',
    ],
    animation: ['下拉时内容跟随手指移动，带阻尼', '删除时该行淡出，下方各行平滑上移', '新数据从上方淡入'],
    acceptance: ['没超过阈值就松手，不触发刷新', '横向滑动不会误触发行点击', '删除后列表数据和界面保持一致'],
  },
  {
    id: 'tabbar',
    name: '标签栏',
    goal: '底部标签栏，在「首页」「发现」「消息」「我的」四个一级页面之间切换。',
    interaction: [
      '点击标签切换页面，当前标签高亮',
      '键盘可用左右方向键在标签之间移动',
      '切换时保留各页面的状态（如滚动位置），按项目需要决定',
    ],
    animation: ['选中背景平移到新标签', '选中图标轻微放大后回弹', '页面内容按切换方向横向淡入'],
    acceptance: ['任一时刻只有一个标签处于选中状态', '选中状态对读屏可见', '反复切换不会重复创建页面或丢失状态'],
  },
  ...(
    [
      ['input', '输入框', '一个带实时校验的输入框，失焦或提交时显示错误提示。'],
      ['toast', '轻提示', '一个轻提示组件，显示一段文字后自动消失。'],
      ['loading', '加载指示器', '一个加载指示器，用于等待数据时占位。'],
      ['navbar', '导航栏', '页面顶部导航栏，包含返回按钮、标题和右侧操作。'],
      ['picker', '选择器', '一个从列表中选择一项的选择器。'],
      ['slider', '滑块', '一个可拖动选择数值的滑块。'],
      ['checkbox', '复选框与单选', '一组复选框和一组单选按钮。'],
      ['segmented', '分段控件', '在两到四个选项之间切换的分段控件。'],
      ['progress', '进度条', '显示任务进度的进度条。'],
      ['searchbar', '搜索栏', '带清除按钮和取消操作的搜索栏。'],
    ] as const
  ).map(
    ([id, name, goal]): ControlSpec => ({
      id,
      name,
      draft: true,
      goal,
      interaction: ['{补充：这个控件的主要交互方式}', '支持键盘操作'],
      animation: ['{补充：需要的动画效果}'],
      acceptance: ['{补充：可以检查的完成标准}'],
    }),
  ),
]

export function getControl(id: string): ControlSpec | undefined {
  return controls.find((c) => c.id === id)
}

/** 组装完整提示词 */
export function buildControlPrompt(id: string, stackLabel: string | undefined, o: PromptOptions): string {
  const c = getControl(id)
  if (!c) return ''
  const stack = (stackLabel && stackOf[stackLabel]) || '{技术栈，例如：iOS，SwiftUI}'
  const lines: string[] = []
  const list = (items: string[]) => items.map((x) => `- ${x}`)

  lines.push('【目标】', `实现${c.name}控件。${c.goal}`, '')
  lines.push('【技术栈】', stack, '')
  lines.push(
    '【上下文】',
    '- 项目现有技术栈与版本：{项目技术栈与版本}',
    '- 控件放在：{文件路径}',
    '- 可以复用的已有组件或样式：{组件路径}',
    '',
  )
  lines.push('【交互与动画】', ...list(c.interaction))
  if (o.animation) {
    lines.push(...list(c.animation), '- 动画只改变位移和透明度；系统开启「减少动态效果」时去掉位移动画')
  } else {
    lines.push('- 不需要动画，状态直接切换')
  }
  lines.push('')
  lines.push(
    '【约束】',
    '- 不引入新的第三方依赖；确实需要时先说明理由，等我确认',
    '- 遵循项目现有的代码规范和目录约定',
    '- 只做实现这个控件所需的最小改动，不顺手修改其他文件',
  )
  if (o.dark) lines.push('- 颜色使用项目的主题变量，浅色和深色模式都要适配')
  if (o.a11y) lines.push('- 优先使用平台自带的语义控件；自绘时补全无障碍属性，保证键盘和读屏可用')
  lines.push('')
  lines.push('【验收标准】', ...list(c.acceptance))
  if (o.dark) lines.push('- 深色模式下文字、图标和背景对比清晰')
  if (o.a11y) lines.push('- 只用键盘（或读屏）能完成全部操作')
  if (o.test) lines.push('- 附带单元测试或组件测试，覆盖主要状态切换，测试可以在本地运行通过')
  lines.push('')
  lines.push('【输出格式】')
  if (o.compare) {
    lines.push(
      '- 先不要写代码。列出至少两种实现方案（例如平台自带控件和自绘实现），分别说明优点、缺点和适用场景，给出你推荐的方案和理由，等我确认后再写代码',
    )
  }
  lines.push('- 先用三到五句话说明实现方案和涉及的文件', '- 再给出完整代码或 diff', '- 最后说明怎么运行和验证')
  if (c.draft) lines.push('', '（这是草稿模板，请先补全 {补充：…} 部分）')
  return lines.join('\n')
}
