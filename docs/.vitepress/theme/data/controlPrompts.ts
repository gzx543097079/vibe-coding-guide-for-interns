// 控件提示词：每个控件的场景、尺寸、颜色、状态、交互、动画与验收项，由 buildControlPrompt 组装成完整提示词。
// 数值取自本站演示，是 1:1 还原的基准。{} 内是需要使用者替换的占位符。
// verify 记录「只给提示词、让独立 agent 写单文件 HTML，再与站内演示逐状态截图对比」的结果。

export type VerifyStatus = '已验证' | '部分一致' | '未验证'

export interface Verify {
  status: VerifyStatus
  /** 验证日期 YYYY-MM-DD */
  date?: string
  /** 做了几轮（改提示词后重测算一轮） */
  rounds: number
  /** 一致度说明：对比了哪些状态、还有哪些差异 */
  note: string
}

export interface ControlSpec {
  id: string
  name: string
  /** 草稿：还没有对应的演示，描述较粗 */
  draft?: boolean
  goal: string
  /** 验证用的演示画布 */
  canvas?: 'phone' | 'browser'
  scene?: string[]
  visual?: string[]
  states?: string[]
  interaction: string[]
  animation: string[]
  a11y?: string[]
  edge?: string[]
  acceptance: string[]
  verify: Verify
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
  'Kotlin (View)': 'Android，View 体系（Kotlin + XML）',
  'Kotlin (Compose)': 'Android，Jetpack Compose（Kotlin）',
  ArkTS: '鸿蒙，ArkUI（ArkTS）',
  'ArkTS (ArkUI)': '鸿蒙，ArkUI（ArkTS）',
  'WXML + JS': '微信小程序原生（WXML + WXSS + JS）',
  'uni-app (Vue)': 'uni-app（Vue）',
  'Taro (React)': 'Taro（React）',
  'Flutter (Dart)': 'Flutter（Dart）',
  'React Native (TSX)': 'React Native（TypeScript）',
  'HTML + CSS + JS': 'Web，原生 HTML / CSS / JavaScript',
  React: 'Web，React（TypeScript）',
  Vue: 'Web，Vue 3',
}
const webStacks = new Set(['HTML + CSS + JS', 'React', 'Vue'])

/** 色值表：site 是站内网页演示的配色，ios 是 iPhone 外框用的 iOS 系统色 */
export type Palette = 'site' | 'ios'
type Pair = [light: string, dark: string]
const palettes: Record<Palette, Record<string, Pair>> = {
  site: {
    bg: ['#fffefb', '#24221f'],
    ink: ['#141413', '#f3efe7'],
    ink2: ['#66635c', '#a7a196'],
    line: ['#e6dfd8', '#34312c'],
    soft: ['#f5f0e8', '#2a2824'],
    accent: ['#b3573a', '#e08b6b'],
    onAccent: ['#ffffff', '#1b1a17'],
    danger: ['#b0413a', '#e38d84'],
    success: ['oklch(0.52 0.13 150)', 'oklch(0.74 0.14 150)'],
    focus: ['2px 实线 #b3573a，向外偏移 2px', '#eb9a7c'],
  },
  ios: {
    bg: ['#ffffff', '#000000'],
    ink: ['#000000', '#ffffff'],
    ink2: ['#6e6e73', '#98989f'],
    line: ['#c6c6c8', '#38383a'],
    soft: ['#f2f2f7', '#1c1c1e'],
    accent: ['#007aff', '#0a84ff'],
    onAccent: ['#ffffff', '#ffffff'],
    danger: ['#ff3b30', '#ff453a'],
    success: ['#34c759', '#30d158'],
    focus: ['2px 实线 #007aff，向外偏移 2px', '#0a84ff'],
  },
}

/** 颜色、动效与字体令牌（浅色值在前，括号里是深色值） */
const tokenLines = (dark: boolean, palette: Palette): string[] => {
  const c = palettes[palette]
  const t = (name: string, [light, darkV]: Pair) => `- ${name}：${light}${dark ? `（深色 ${darkV}）` : ''}`
  return [
    t('背景 bg', c.bg),
    t('文字 ink', c.ink),
    t('次要文字 ink-2', c.ink2),
    t('分隔线 line', c.line),
    t('浅底 soft', c.soft),
    t('强调色 accent', c.accent),
    t('强调色上的文字 on-accent', c.onAccent),
    t('危险色 danger', c.danger),
    t('成功色 success', c.success),
    t('焦点环', c.focus),
    '- 缓动 ease：cubic-bezier(0.2, 0.8, 0.2, 1)；退出用 ease-in：cubic-bezier(0.4, 0, 1, 1)',
    '- 字体：系统无衬线字体（-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif），基础字号 14px，默认行高 1.5',
    '- 文中「color-mix(A x%, B)」指 CSS color-mix(in oklab, A x%, B)，其他平台按同样比例混色',
    '- 按钮默认无边框、透明背景、继承字体；盒模型按 border-box 计算',
  ]
}

const canvasLines: Record<'phone' | 'browser', string[]> = {
  phone: [
    '- 手机竖屏画布：248×442px，背景 bg，底部两角圆角 30px，超出部分隐藏',
    '- 顶部标题栏（除非下文另有说明）：左对齐，padding 12px 18px 10px，17px，字重 700，颜色 ink',
  ],
  browser: [
    '- 网页画布：558×322px，背景 bg，超出部分隐藏',
    '- 顶部标题栏（除非下文另有说明）：左对齐，padding 12px 18px 10px，16px，字重 700，颜色 ink，下边框 1px line',
  ],
}

const NOT_VERIFIED: Verify = { status: '未验证', rounds: 0, note: '尚未做还原验证。' }

export const controls: ControlSpec[] = [
  {
    id: 'button',
    name: '按钮',
    goal: '一个提交按钮：点击后进入加载状态并防止重复提交，完成后短暂显示成功，再恢复可点击。另有次要按钮和禁用按钮。',
    canvas: 'phone',
    scene: [
      '标题栏文字「反馈问题」',
      '表单区 padding 8px 18px，两个字段纵向排列，间距 12px。字段标签依次为「标题」「描述」，12px ink-2，标签与输入框间距 4px',
      '输入框（只读展示即可）：padding 9px 12px，圆角 10px，背景 soft，1px line 边框，13.5px ink。第一个内容「登录页按钮无响应」；第二个「点击后没有任何提示」，最小高度 64px',
      '按钮区贴在画布底部，padding 14px 18px 18px，纵向间距 10px：第一行主按钮「提交」占满宽；第二行两等分（间距 10px）：次要按钮「取消」、禁用的次要按钮「已禁用」',
    ],
    visual: [
      '按钮：高 44px，左右 padding 18px，圆角 12px，15px，字重 650，内容水平垂直居中，图标与文字间距 8px',
      '主按钮：背景 accent，文字 on-accent，阴影 0 1px 2px rgb(20 20 19 / 0.2), 0 4px 12px -2px rgb(179 87 58 / 0.3)；悬停背景 color-mix(accent 90%, ink)',
      '次要按钮：背景 soft，文字 ink，1px line 边框',
    ],
    states: [
      '按下：按钮 scale(0.96)；主按钮按下时背景 color-mix(accent 82%, ink)，阴影变为 0 1px 1px rgb(20 20 19 / 0.2)',
      '加载中：按钮禁用，透明度 0.85，光标 progress；文字前是 16px 旋转圈（2px currentColor 边框，右边框透明），文字「提交中…」',
      '成功：背景 success，文字前是 16px 对勾（viewBox 0 0 16 16，路径 M3.5 8.5 6.5 11.5 12.5 4.5，描边 2px，圆头圆角），文字「已提交」',
      '禁用：透明度 0.45，光标 not-allowed，按下不缩放',
    ],
    interaction: [
      '点击、回车或空格触发「提交」',
      '加载 1300ms 后进入成功，成功保持 1500ms 后恢复为「提交」',
      '加载期间再次点击无效；禁用按钮不响应任何操作',
    ],
    animation: [
      '按钮 transform 过渡 180ms ease，opacity 过渡 200ms',
      '旋转圈 700ms 线性无限旋转',
      '对勾出现：从 scale(0.4) + 透明 到正常，350ms ease',
    ],
    a11y: ['使用原生按钮元素', '加载时 aria-busy="true"', '用一个 aria-live="polite" 的隐藏区域播报「正在提交」「提交成功」'],
    edge: ['快速连点只触发一次提交', '三种状态下主按钮尺寸不变，页面不跳动'],
    acceptance: ['连续快速点击只触发一次提交', '加载中再次点击无效', '禁用按钮在外观上能和可用按钮区分开'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'switch',
    name: '开关',
    goal: '一组设置项开关：点击开关切换开/关，状态立即生效并回调给调用方。',
    canvas: 'phone',
    scene: [
      '标题栏文字「设置」',
      '设置列表：左右 margin 12px，圆角 14px，背景 soft；每行最小高度 54px，padding 8px 14px，行与行之间 1px line 分隔线',
      '每行左侧文字区占满剩余宽度：名称 15px 字重 550；说明 12px ink-2，行高 1.4（没有说明就只显示名称）；右侧是开关，与文字间距 12px',
      '四行：Wi-Fi（说明「已连接」，开）；蓝牙（「关闭时无法连接耳机」，关）；勿扰模式（无说明，关）；自动同步（「由管理员关闭」，关，禁用，名称用 ink-2）',
    ],
    visual: [
      '开关：50×30px，全圆角；关闭时轨道 color-mix(ink 18%, soft)',
      '开启色 oklch(0.6 0.15 150)（深色 oklch(0.68 0.15 150)）是叠在轨道上的一层，用透明度 0→1 显示',
      '滑块：26×26px 白色圆，距左、上各 2px，阴影 0 1px 2px oklch(0 0 0 / 0.2), 0 3px 8px oklch(0 0 0 / 0.14)；开启时 translateX(20px)',
    ],
    states: [
      '按下：关闭态滑块 scaleX(1.15)，变换原点左中；开启态 translateX(20px) scaleX(1.15)，变换原点右中',
      '禁用：开关整体透明度 0.45，光标 not-allowed',
      '键盘焦点：开关外 2px 焦点环',
    ],
    interaction: ['只有开关本身可点击，点击切换', '键盘聚焦后按空格切换', '切换后通过回调（如 onChange）通知调用方', '禁用时点击和键盘都不改变状态'],
    animation: ['滑块 transform 过渡 320ms ease', '开启色层 opacity 过渡 250ms ease'],
    a11y: ['button 加 role="switch" 与 aria-checked，aria-labelledby 指向该行名称'],
    edge: ['界面状态与回调值始终一致'],
    acceptance: ['界面状态与回调值始终一致', '禁用时点击和键盘都不会改变状态', '读屏能读出开关名称和当前开/关状态'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'checkbox',
    name: '复选框与单选',
    goal: '一组带「全部」父项的复选框（部分勾选时父项显示半选），和一组单选按钮。',
    canvas: 'browser',
    scene: [
      '标题栏文字「通知设置」',
      '内容区 padding 12px，两列等分，列间距 16px（手机画布改为单列，padding 4px 6px，两组间距 14px）',
      '左列分组标题「接收哪些通知」，右列分组标题「主题」。分组标题 12.5px，字重 600，ink-2，左右 padding 12px，下距 2px',
      '每个选项一行：最小高度 40px，padding 0 12px，圆角 10px，图形与文字间距 12px，文字 15px 字重 500 ink；整行可点击；悬停时行背景 soft（禁用行不变）',
      '左列：「全部」（父项），下面四个子项左 padding 改为 44px：评论（选中）、提及我（选中）、构建结果（未选）、安全提醒（必选）（选中且禁用，文字 ink-2）。初始父项为半选',
      '右列单选：跟随系统（选中）、浅色、深色',
    ],
    visual: [
      '复选框：20×20px，圆角 6px，1.5px 边框 color-mix(ink 35%, bg)，背景 bg',
      '选中和半选时，在复选框上覆盖一层与边框外沿同尺寸的 accent 填充',
      '对勾：viewBox 0 0 20 20，路径 M5 10.5 8.5 14 15 6.5，描边 on-accent 2.2px，圆头圆角；半选为居中横条 10×2.2px，圆角 1.1px，颜色 on-accent',
      '单选：20×20px 圆形，边框同复选框；选中时外圈叠一层 1.5px accent 边框，中心 8×8px accent 圆点',
      '禁用的复选框整体透明度 0.45，光标 not-allowed',
    ],
    states: ['默认', '悬停：行背景 soft', '按下：图形 scale(0.9)', '选中', '半选（只用于父项）', '禁用', '键盘焦点：图形外 2px 焦点环'],
    interaction: [
      '父项状态由可编辑的子项推导：全选→选中，部分选→半选，都不选→未选',
      '点父项：当前全选则全部取消，否则全部选中；禁用项保持不变',
      '单选组用方向键切换（平台原生行为）',
    ],
    animation: [
      '填充层 opacity 过渡 150ms ease',
      '对勾和横条：从 scale(0.5) + 透明 到 scale(1) + 不透明，transform 220ms ease，opacity 150ms ease',
      '单选圆点 scale(0)→scale(1)，220ms ease；按下缩放 transform 150ms ease',
    ],
    a11y: ['用原生复选框 / 单选输入并视觉隐藏，外观由旁边的元素绘制；label 包住整行', '父项设置 indeterminate 属性', '两组分别用 fieldset + legend'],
    edge: ['禁用项不受「全部」影响', '父项半选时再点 → 全部选中'],
    acceptance: ['父项的三种状态始终与子项一致', '只用键盘能完成全部勾选操作', '读屏能读出父项的「部分选中」状态'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'input',
    name: '输入框',
    goal: '带浮动标签的输入框：聚焦或有值时标签上移缩小；失焦时校验邮箱格式，不合法时显示错误并抖动一次；有值时显示清除按钮。',
    canvas: 'browser',
    scene: [
      '标题栏文字「注册账号」',
      '表单 padding 18px，最大宽度 360px（手机画布 padding 8px 18px，占满宽），两项纵向间距 6px，每项最小高度 78px',
      '第一项「邮箱」（邮箱类型键盘）；第二项「昵称」（最多 12 个字），下方右对齐计数「0/12」，12px ink-2，等宽数字，上距 6px',
    ],
    visual: [
      '输入框容器：高 52px，圆角 12px，1px line 边框，背景 soft；输入文字 15px ink，内边距 上 20px 右 40px 下 6px 左 14px；光标颜色 accent',
      '浮动标签：绝对定位 left 14px、top 15px，15px，行高 20px，ink-2，变换原点左上；聚焦或有值时 translateY(-9px) scale(0.78)',
      '聚焦：边框 accent，外发光 0 0 0 3px color-mix(accent 18%, transparent)，标签变 accent',
      '错误：边框 danger，外发光 0 0 0 3px color-mix(danger 16%, transparent)，标签变 danger；框下方错误文字 12.5px danger 行高 1.5，上距 6px：「邮箱格式不对，例如 name@example.com」',
      '清除按钮：24×24px 圆，绝对定位 right 12px、top 14px，背景 color-mix(ink 14%, soft)，中间 10px 叉号（描边 1.6px，ink）',
    ],
    states: ['默认：标签在框内', '聚焦且为空：标签上浮、accent', '有值且失焦：标签上浮、ink-2', '错误', '清除按钮显示 / 隐藏'],
    interaction: [
      '失焦时校验：非空且不匹配 ^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$ 即为错误；在输入框里按回车提交时也校验',
      '已经报错时，输入改正后立即清除错误，不等失焦',
      '清除按钮：清空内容、清除错误、焦点回到输入框；按下清除按钮时不让输入框失焦',
    ],
    animation: [
      '标签 transform 过渡 220ms ease',
      '错误文字出现：从透明 + translateY(-4px) 到正常，220ms ease',
      '每次校验失败整个输入框抖动一次：translateX 关键帧 0%/100% 0、20% -6px、40% 6px、60% -4px、80% 4px，360ms ease；再次失败要能重新播放',
      '清除按钮显隐：opacity 0 + scale(0.8) ↔ 正常，150ms ease',
    ],
    a11y: ['label 与输入框关联', '错误时 aria-invalid="true"，aria-describedby 指向错误文字', '昵称输入框用 aria-describedby 关联计数'],
    edge: ['空值失焦不报错', '计数达到上限后不能继续输入'],
    acceptance: ['标签在任何状态下都不和输入文字重叠', '错误出现、改正、清除三种路径都正确', '读屏能读到错误文字'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'select',
    name: '下拉选择',
    goal: '自绘的下拉选择：触发按钮显示当前值，展开选项列表，支持键盘操作和禁用选项。',
    canvas: 'browser',
    scene: [
      '标题栏文字「新建任务」',
      '内容区 padding 12px 18px（手机画布 8px 18px）。字段标签「优先级」12.5px，字重 600，ink-2，下距 6px',
      '触发按钮宽 240px（手机画布占满宽）；按钮下方说明「紧急任务会通知所有成员。」12.5px ink-2，上距 8px（列表展开时盖在说明上面）',
      '选项依次为：紧急、高、中（当前值）、低、冻结（需管理员）（禁用）',
    ],
    visual: [
      '触发按钮：高 44px，padding 0 12px 0 14px，圆角 12px，1px line 边框，背景 soft，15px 字重 500 ink，文字左对齐；右侧 16px 向下箭头（viewBox 0 0 16 16，路径 M4 6l4 4 4-4，描边 1.6px，圆头），颜色 ink-2',
      '触发按钮悬停：边框 color-mix(ink 30%, line)；展开时边框 accent，箭头旋转 180°',
      '列表框：位于触发按钮下方 6px，与按钮同宽，padding 4px，圆角 12px，1px line 边框，背景 bg，阴影 0 10px 30px -8px rgb(20 20 19 / 0.25)，层级在其他内容之上，变换原点顶部居中',
      '选项：高 34px，padding 0 10px，圆角 8px，14.5px ink，文字靠左、对勾靠右；高亮项（键盘或指针所在）背景 soft；列表获得键盘焦点时，高亮项再加内描边 2px 焦点色',
      '当前选中项字重 650，右侧 16px 对勾（路径 M3.5 8.5 6.5 11.5 12.5 4.5，描边 1.8px），颜色 accent；禁用项透明度 0.45，光标 not-allowed',
    ],
    states: ['收起', '悬停', '展开（高亮当前值）', '键盘高亮', '禁用选项'],
    interaction: [
      '点击触发按钮展开 / 收起；焦点在触发按钮上时，↓、↑、回车、空格都能展开',
      '展开时高亮当前值，焦点移到列表框，用 aria-activedescendant 指示高亮项',
      '列表中 ↑↓ 移动高亮（跳过禁用项，到头不循环），Home / End 到首尾；回车或空格选中并收起；Esc 收起并把焦点还给触发按钮；Tab 收起，不抢回焦点',
      '指针移到选项上即高亮；点击选项选中；点击组件外部收起',
    ],
    animation: [
      '列表出现：从透明 + translateY(-4px) scale(0.98) 到正常，180ms ease；收起反向，120ms ease-in',
      '箭头 transform 过渡 220ms ease',
    ],
    a11y: ['触发按钮 aria-haspopup="listbox"、aria-expanded，aria-labelledby 同时指向字段标签和当前值', '列表 role="listbox"、tabindex="-1"；选项 role="option"、aria-selected，禁用项 aria-disabled'],
    edge: ['禁用项不能被选中，键盘高亮会跳过它', '画布底部空间不够时列表不能被裁掉（本场景下列表高度 180px 以内）'],
    acceptance: ['只用键盘能完成打开、选择、关闭', '关闭后焦点回到触发按钮', '读屏能读出当前值和选项数量'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'modal',
    name: '弹窗与底部抽屉',
    goal: '两种弹窗：底部弹出的分享面板，和删除前的确认对话框。',
    canvas: 'phone',
    scene: [
      '标题栏文字「文档详情」',
      '内容区 padding 6px 18px：文档卡片 padding 16px，圆角 14px，背景 soft，里面三条占位线（高 9px，圆角 5px，颜色 color-mix(ink 14%, soft)，宽 80% / 95% / 60%，间距 10px）',
      '卡片下方 16px 两个等分按钮（间距 10px），高 42px，圆角 12px，字重 650：「分享」背景 accent 文字 on-accent；「删除」背景 soft、文字 danger、1px line 边框；按下 scale(0.96)',
      '按钮下方 12px 是结果文字：12.5px ink-2，最小高度 20px，内容「上次选择：xxx」，初始为空',
    ],
    visual: [
      '遮罩：铺满画布，rgb(20 20 19 / 0.42)',
      '底部面板：距画布左、右、下各 6px，padding 8px 14px 14px，圆角 22px，背景 bg，阴影 0 -4px 24px oklch(0 0 0 / 0.18)。顶部拖动条 36×5px，圆角 3px，颜色 line，居中，下距 10px；标题「分享到」15px 700 居中，下距 12px',
      '面板选项三列等分（间距 6px）：每项纵向居中，padding 8px 2px，圆角 12px，12px ink 文字，图标与文字间距 6px；图标底 44×44px，圆角 14px，背景 soft，里面 20px 线性图标，描边 accent 1.4px；悬停背景 soft。三项：复制链接、保存图片、发给同事',
      '面板底部「取消」：占满宽，高 44px，上距 10px，圆角 12px，背景 soft，字重 650，ink',
      '确认对话框：宽 220px，水平居中，垂直方向中心比画布中心高约 0～10px（实现为 top 50%、上边距 -78px），padding 18px 16px 12px，圆角 18px，背景 bg，阴影 0 10px 40px oklch(0 0 0 / 0.25)，文字居中；标题「删除这篇文档？」15px 700，下距 4px；说明「删除后无法恢复。」13px ink-2，下距 14px；两个等分按钮（间距 8px），高 38px，圆角 10px，字重 600：「取消」背景 soft、ink；「删除」背景 danger、文字白（深色模式文字 oklch(0.18 0.03 27)）',
    ],
    states: ['无弹窗', '底部面板打开', '对话框打开'],
    interaction: [
      '点「分享」打开底部面板；点遮罩、「取消」或按 Esc 关闭；点选项后关闭，结果行显示「上次选择：复制链接」等',
      '点「删除」打开对话框；「取消」→「上次选择：取消删除」，「删除」→「上次选择：删除」；Esc 或点遮罩关闭',
      '打开后焦点移到弹窗里第一个按钮；Tab 只在弹窗内循环；关闭后焦点回到触发按钮',
      '弹窗打开时背后的内容不能点击也不能聚焦（如 inert）',
    ],
    animation: [
      '遮罩 opacity 过渡 300ms ease',
      '底部面板进入：translateY(calc(100% + 12px)) → 0，420ms ease；退出 250ms ease-in 回到原处',
      '对话框进入：从 scale(1.12) + 透明 到正常，transform 320ms ease、opacity 200ms；退出到 scale(0.94) + 透明，180ms ease-in',
    ],
    a11y: ['面板 role="dialog"、aria-modal="true"、aria-labelledby 指向标题', '对话框 role="alertdialog"，aria-labelledby 与 aria-describedby 指向标题和说明'],
    edge: ['弹窗打开时背后内容不可点击、不可聚焦', '连续快速打开关闭不会留下遮罩'],
    acceptance: ['调用方能拿到用户的选择结果', '关闭后焦点回到触发按钮', '只用键盘能完成全部操作'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'toast',
    name: '轻提示与 Snackbar',
    goal: '两种反馈：自动消失的轻提示（Toast），和带「撤销」操作的 Snackbar。',
    canvas: 'phone',
    scene: [
      '标题栏文字「相册」',
      '照片网格：3 列，间距 6px，padding 4px 18px；6 个正方形色块，圆角 10px，颜色 oklch(0.88 0.05 H)（深色 oklch(0.38 0.06 H)），H 依次为 30、150、250、85、330、200',
      '网格下方按钮区 padding 14px 18px，两个等分按钮（间距 10px），高 42px，圆角 12px，字重 650，按下 scale(0.96)：「复制链接」背景 accent 文字 on-accent；「删除一张」背景 soft、文字 danger、1px line 边框；照片删光后它禁用（透明度 0.45）',
    ],
    visual: [
      'Toast：底边距画布底部 96px，水平居中；胶囊形 padding 9px 16px，圆角 999px，背景 rgb(20 20 19 / 0.86)，文字 #fffefb（深色模式背景 rgb(243 239 231 / 0.92)，文字 #1b1a17），14px 字重 550 行高 1.4；文字前 16px 对勾图标（描边 1.9px），间距 6px；不接收点击',
      'Snackbar：距画布左、右、下各 10px；最小高度 48px，padding 0 6px 0 16px，圆角 14px，背景 #141413、文字 #fffefb（深色模式背景 #f3efe7、文字 #1b1a17），阴影 0 8px 24px -8px rgb(20 20 19 / 0.4)；左侧文字 14px 占满剩余宽度；右侧「撤销」按钮高 36px，padding 0 12px，圆角 10px，14px 字重 650，颜色 #f0b49c（深色模式 #9c4a30），悬停背景 rgb(255 255 255 / 0.1)（深色模式 rgb(20 20 19 / 0.08)）',
    ],
    states: ['无提示', 'Toast 显示', 'Snackbar 显示', '两者同时显示（Toast 在 Snackbar 上方）'],
    interaction: [
      '点「复制链接」显示 Toast「链接已复制」，2000ms 后消失；再次触发时替换内容并重新计时',
      '点「删除一张」移除最后一张照片，显示 Snackbar「已删除 1 张照片」，4000ms 后消失',
      '指针悬停或焦点在 Snackbar 内时暂停计时，离开后按剩余时间（至少 1000ms）继续',
      '点「撤销」把照片放回原位、关闭 Snackbar，并显示 Toast「已撤销」；新的 Snackbar 直接替换旧的',
    ],
    animation: [
      'Toast 进入：从透明 + translateY(8px) scale(0.96) 到正常，220ms ease；离开到透明 + translateY(-4px)，160ms ease-in',
      'Snackbar 进入：translateY(calc(100% + 16px)) → 0，320ms ease；离开反向，200ms ease-in；替换时新旧同时动画',
      '照片删除：到透明 + scale(0.9)，200ms ease-in；放回：从透明 + scale(0.9) 到正常，220ms ease',
    ],
    a11y: ['Toast 和 Snackbar 的容器都是 role="status"、aria-live="polite"', '「撤销」是可聚焦的按钮'],
    edge: ['Snackbar 显示期间再删一张，计时重新开始', '撤销后照片回到原来的位置'],
    acceptance: ['Toast 和 Snackbar 都会按时消失', '悬停或聚焦时 Snackbar 不会消失', '读屏能读到提示内容'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'progress',
    name: '进度条与环形进度',
    goal: '确定进度的线性进度条、不确定进度条、环形进度和旋转加载指示器，以及控制上传的按钮。',
    canvas: 'browser',
    scene: [
      '标题栏文字「上传文件」',
      '内容区 padding 14px 18px，最大宽度 420px（手机画布 padding 8px 18px），纵向间距 14px，依次四块：',
      '① 文件行：「设计稿.fig」14px 字重 600 ink、「4.2 MB」12px ink-2（间距 8px，基线对齐，行高 20px），最右侧百分比 12.5px 字重 600 ink-2 等宽数字；文字行下方 8px 是确定进度条',
      '② 「录屏.mp4」与「处理中」（样式同上，无百分比），下方 8px 是不确定进度条',
      '③ 一行：左侧环形进度，右侧两行文字（「总进度」14px 600；下一行 14px 旋转圈 +「同步中」12.5px ink-2，间距 6px），环与文字间距 14px，两行间距 4px',
      '④ 按钮行（间距 10px）：主按钮背景 accent 文字 on-accent，最小宽度 96px，文字随状态为「开始上传 / 暂停 / 继续 / 重新上传」；次要按钮「重置」背景 soft、1px line 边框、ink，空闲时禁用（透明度 0.45）。按钮高 38px，padding 0 16px，圆角 10px，字重 650，按下 scale(0.96)',
    ],
    visual: [
      '进度轨道：高 6px，圆角 3px，背景 color-mix(ink 10%, bg)，超出隐藏',
      '确定进度：填充铺满轨道，用 scaleX(进度) 表示，变换原点左侧；颜色 accent，完成后 success',
      '不确定进度：宽 40% 的 accent 色段（圆角 3px）',
      '环形进度：外径 56px，环宽 5px，轨道色同上，进度色同确定进度的填充色，从 12 点方向顺时针增长；中间圆背景 bg，显示百分比 13px 字重 650 等宽数字 ink',
      '旋转圈：14px，2px accent 边框，右边框透明',
      '完成时：文件行百分比文字变为「完成」，进度条和环变为 success',
    ],
    states: ['空闲（0%）', '上传中', '暂停', '完成'],
    interaction: [
      '点「开始上传」：每 500ms 依次前进到 12、27、41、58、73、86、100；到 100 进入完成',
      '上传中点「暂停」停止前进；「继续」从当前值接着走',
      '完成后点「重新上传」从 0 重新开始；「重置」随时归零回到空闲',
    ],
    animation: [
      '确定进度条和环形进度的变化都用 transform 过渡 320ms ease（环形可用左右两个半圆遮罩，各旋转 0～180°）',
      '不确定进度：translateX(-100%) → translateX(250%)，1200ms ease-in-out 无限循环',
      '旋转圈 700ms 线性无限旋转',
    ],
    a11y: ['进度条和环形进度 role="progressbar"，aria-valuemin=0、aria-valuemax=100、aria-valuenow，并各有 aria-label', '不确定进度不设 aria-valuenow'],
    edge: ['暂停后再继续不会跳过或重复步进', '不改宽度来表示进度，避免引起重排'],
    acceptance: ['百分比文字、进度条、环形三者数值一致', '完成后颜色和文字正确切换', '读屏能读到当前进度'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'skeleton',
    name: '骨架屏',
    goal: '数据加载时显示与真实布局一致的占位块，带光泽扫过，加载完成后内容淡入替换。',
    canvas: 'browser',
    scene: [
      '标题栏：左侧「动态」，右侧 34×34px 圆角 10px 的刷新图标按钮（18px 图标，accent 色，悬停背景 soft，加载中禁用、透明度 0.5）；标题栏 padding 10px 12px 8px 18px，下边框 1px line（手机画布字号 17px，网页 16px）',
      '列表 3 行，每行 padding 14px 18px，高 76px（手机画布最小高度 84px），下边框 1px line，头像与文字间距 12px',
      '真实内容：左侧 40px 圆形头像，显示姓名首字 15px 700，背景 oklch(0.92 0.05 H)、文字 oklch(0.38 0.12 H)（深色 oklch(0.34 0.06 H) / oklch(0.9 0.08 H)），H 依次 30、250、150；右侧文字区（上 padding 2px）：第一行姓名 14px 粗体 + 时间 12px ink-2（间距 8px，行高 18px）；第二行正文 13.5px 行高 1.5 ink-2，与第一行间距 4px',
      '三条内容：林夕 / 10 分钟前 / 登录页的按钮加了加载状态，连点不会重复提交了。；周拓 / 1 小时前 / 分页接口的 pageSize 上限改成 100，超出直接报错。；陈一 / 昨天 / 周五前把单元测试覆盖率补到 80%。',
    ],
    visual: [
      '骨架：头像位置 40px 圆；文字区三条（间距 8px）：宽 40% 高 12px 圆角 6px；宽 90% 高 10px 圆角 5px；宽 70% 高 10px 圆角 5px',
      '占位块颜色 color-mix(ink 9%, bg)，每块超出隐藏',
      '光泽层：与块同尺寸，linear-gradient(90deg, transparent, rgb(255 255 255 / 0.55), transparent)（深色模式中间色 rgb(255 255 255 / 0.07)）',
    ],
    states: ['已加载（初始）', '加载中（骨架）', '内容淡入'],
    interaction: ['点刷新按钮进入加载中，显示骨架，1600ms 后显示内容'],
    animation: [
      '光泽：translateX(-100%) → translateX(100%)，1400ms ease-in-out 无限循环',
      '内容出现：每行头像和文字从透明 + translateY(4px) 到正常，320ms ease，第 n 行（从 0 开始）延迟 n×60ms',
    ],
    a11y: ['列表 aria-busy 随加载状态变化', '骨架块 aria-hidden="true"', '用 aria-live="polite" 区域播报「正在加载」'],
    edge: ['骨架与真实内容的高度一致，替换时页面不跳动', '加载中重复点击刷新无效'],
    acceptance: ['骨架和真实内容的布局对齐', '减少动态效果时没有光泽和位移', '读屏不会读出骨架块'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'tabbar',
    name: '底部标签栏',
    goal: '底部标签栏，在「首页」「发现」「消息」「我的」四个一级页面之间切换。',
    canvas: 'phone',
    scene: [
      '画布没有标题栏：标签栏在画布底部，上方是页面内容区',
      '页面内容 padding 12px 18px：标题为当前标签名，22px 字重 750，字距 -0.01em，下距 14px；下面是占位块（背景 soft，1px line 边框，圆角 14px，默认高 64px，横向换行排列，间距 10px）',
      '各页面占位块：首页 3 块，宽 100% / 70% / 86%；发现 4 块，两列（每块宽 calc(50% - 5px)），高 92px；消息 3 块，宽 92%，高 52px；我的：第一块 64×64px 圆形，后两块宽 100%',
      '四个标签及图标路径（viewBox 0 0 16 16，无填充，描边 currentColor，圆头圆角）：首页 M2.5 7.5 8 3l5.5 4.5V13a.5.5 0 0 1-.5.5h-3v-3.5h-4v3.5H3a.5.5 0 0 1-.5-.5z；发现 M8 1.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8zM10.6 5.4 9.3 9.3 5.4 10.6l1.3-3.9z；消息 M2.5 3.5h11v7.5h-6l-3 2.5V11h-2z；我的 M8 2.5a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM2.8 13.5c.6-2.6 2.7-4 5.2-4s4.6 1.4 5.2 4',
    ],
    visual: [
      '标签栏：4 列等分，padding 6px 8px 4px，上边框 1px line，背景 color-mix(bg 92%, soft)',
      '每个标签：图标 22px 在上（描边 1.35px，选中时 1.7px），文字 11px 字重 600 在下，间距 1px，padding 6px 0 2px，圆角 10px；未选中 ink-2，选中 accent',
      '选中胶囊：宽 56px、高 34px、圆角 17px，颜色 color-mix(accent 16%, transparent)，顶部与标签栏顶部距离 6px，水平居中在当前标签那一列，通过 translateX 移动',
    ],
    states: ['四个标签各自的选中态', '键盘焦点：标签内侧 2px 焦点环（向内偏移 2px）'],
    interaction: ['点击标签切换页面，当前标签高亮', '←/→ 循环切换，Home / End 到首尾，切换时焦点跟随；只有当前标签可 Tab 聚焦'],
    animation: [
      '选中胶囊 transform 过渡 400ms ease',
      '新选中的图标播放一次 450ms ease 回弹：0% scale(0.8) translateY(2px)，60% scale(1.12) translateY(-1px)，100% 原样',
      '内容切换（先出后进）：旧内容 160ms ease-in 到透明并横移 12px（向前切换往左、向后切换往右）；新内容 transform 320ms ease、opacity 250ms，从透明并横移 18px（向前切换从右侧、向后切换从左侧）进入',
    ],
    a11y: ['标签栏 role="tablist"、aria-label「主导航」；标签 role="tab"、aria-selected、aria-controls；内容 role="tabpanel"、aria-labelledby'],
    edge: ['点当前标签不触发动画', '反复切换不会重复创建页面或丢失状态'],
    acceptance: ['任一时刻只有一个标签处于选中状态', '选中状态对读屏可见', '反复切换不会重复创建页面或丢失状态'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'tabs',
    name: '标签页',
    goal: '页面内的标签页：选中下划线指示器滑动到新标签，内容区淡入切换。',
    canvas: 'browser',
    scene: [
      '标题栏文字「vibe-guide」，本控件的标题栏 padding 12px 18px 6px、没有下边框（网页 16px，手机 17px，字重 700）',
      '标签行：padding 0 8px，下边框 1px line；四个标签：概览、提交、分支、设置；网页画布按文字宽度排（每个 padding 0 14px），手机画布四等分',
      '面板 padding 14px 18px：标题 15px 字重 700 ink，下距 8px；正文每行 14px 行高 1.6 ink-2，行距 6px',
      '内容：概览 → 标题「最近 7 天」，正文「12 次提交，2 个 PR 等待审查。」「构建全部通过，平均耗时 3 分 20 秒。」；提交 → 「main 分支」，「fix: 修复分页参数越界」「feat: 登录页支持记住账号」；分支 → 「活跃分支」，「feat/search-suggest：领先 main 4 个提交」「fix/upload-retry：已合并，可删除」；设置 → 「仓库设置」，「默认分支：main」「合并方式：Merge commit」',
    ],
    visual: [
      '标签：高 40px，14.5px 字重 550，ink-2；悬停文字 ink；选中文字 ink、字重 650',
      '指示条：高 3px，圆角 3px 3px 0 0，accent，压在标签行下边框上（bottom -1px），左右与当前标签按钮（含 padding）对齐',
    ],
    states: ['四个标签各自的选中态', '悬停', '键盘焦点：焦点环向内偏移 4px'],
    interaction: ['点击切换', '←/→ 循环切换，Home / End 到首尾，切换即激活并聚焦；只有当前标签 tabindex=0'],
    animation: [
      '指示条用一个固定 100px 宽的元素，transform: translateX(标签左偏移) scaleX(标签宽 / 100)，变换原点左侧，过渡 320ms ease；首次定位不做动画',
      '内容切换：新内容从透明 + translateY(4px) 到正常，220ms ease；旧内容同时 120ms 淡出并脱离布局（不占位）',
    ],
    a11y: ['标签行 role="tablist"、aria-label「仓库」；标签 role="tab"、aria-selected、aria-controls；面板 role="tabpanel"、tabindex="0"、aria-labelledby'],
    edge: ['容器宽度变化时指示条重新对齐', '选中后字重变化导致宽度变化，指示条以切换后的宽度为准'],
    acceptance: ['指示条始终与当前标签对齐', '只用键盘能切换全部标签', '读屏能读出当前选中的标签'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'accordion',
    name: '手风琴',
    goal: '可折叠的问答列表，一次只展开一项；展开动画只用位移和透明度。',
    canvas: 'browser',
    scene: [
      '标题栏文字「常见问题」',
      '列表容器：margin 14px 18px，最大宽度 460px（手机画布 margin 4px 12px），1px line 边框，圆角 14px，超出隐藏；项与项之间 1px line 分隔，每项背景 bg',
      '四项，默认展开第一项：「构建失败先看哪里？」→「先看 CI 日志里第一条报错，再在本地用同样的命令复现。」；「提交信息怎么写？」→「一行说清改了什么，必要时在正文写原因和影响范围。」；「可以直接推送到 main 吗？」→「不可以。从 main 拉功能分支，提 PR 审查后再合并。」；「依赖升级要注意什么？」→「看更新日志里的破坏性变更，升级后跑一遍完整测试。」',
    ],
    visual: [
      '标题按钮：占满宽，最小高度 48px，padding 0 14px 0 16px，14.5px 字重 600 ink，文字左对齐；右侧 16px 向下箭头（路径 M4 6l4 4 4-4，描边 1.6px），ink-2；悬停背景 soft；焦点环向内偏移 3px',
      '内容：padding 0 16px 14px，13.5px 行高 1.6 ink-2',
    ],
    states: ['某一项展开', '全部收起', '悬停', '键盘焦点'],
    interaction: ['点标题展开该项并收起其他项；再点已展开的项则收起（允许全部收起）', '↑↓ 在标题之间循环移动焦点，Home / End 到首尾'],
    animation: [
      '高度不做动画（瞬间变化），用 FLIP：切换前记录每一项的位置，切换后让每一项从旧位置 translateY 回到 0，320ms ease',
      '展开的内容从透明 + translateY(-6px) 到正常，220ms ease',
      '箭头 rotate(180deg)，过渡 220ms ease',
    ],
    a11y: ['标题放在 h3 内的 button 里，aria-expanded、aria-controls', '内容 role="region"、aria-labelledby 指向标题；收起的内容不显示（display: none）'],
    edge: ['快速连续点击不会让位置错乱', '减少动态效果时直接切换，不做位移'],
    acceptance: ['任一时刻最多一项展开', '只用键盘能展开和收起每一项', '读屏能读出每项的展开状态'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'list',
    name: '下拉刷新与左滑删除',
    goal: '消息列表：下拉超过阈值松手刷新，向左滑动某一行露出删除按钮；另有不依赖手势的入口。',
    canvas: 'phone',
    scene: [
      '标题栏：左侧「消息」，右侧 34×34px 圆角 10px 刷新图标按钮（18px 图标，accent，悬停背景 soft，刷新中禁用、透明度 0.5）；padding 10px 12px 8px 18px，下边框 1px line，层级高于列表',
      '列表 5 行，每行下边框 1px line；行内容是一行横排的四个元素（padding 10px 8px 10px 16px，元素间距 12px，垂直居中，背景 bg）：① 36×36px 圆角 12px 头像，显示标题首字 14px 700，背景 oklch(0.92 0.05 H)、文字 oklch(0.38 0.12 H)（深色 oklch(0.34 0.06 H) / oklch(0.9 0.08 H)）；② 文字列占满剩余宽度：标题 14px 650 在上，副标题 12.5px ink-2 在下，单行超出省略；③ 时间 11.5px ink-2 等宽数字，单独一列，顶部对齐（不和标题放在同一行容器里）；④「更多」按钮 28×28px 圆角 8px，图标为横排三个半径 1.4 的实心圆点（viewBox 0 0 16 16，圆心 x=3/8/13，y=8，14px），ink-2，悬停背景 soft',
      '数据（标题 / 副标题 / H / 时间，时间跟着条目走）：构建通知 / main 分支构建通过 / 150 / 09:12；代码审查 / 你的 PR 有 2 条新评论 / 258 / 昨天；导师 / 下午三点对一下需求 / 30 / 昨天；测试环境 / 部署完成 / 200 / 周一；周报提醒 / 周五下班前提交 / 78 / 周一',
      '每行背后右侧是 80px 宽的「删除」按钮（背景 danger，文字白、深色模式 oklch(0.18 0.03 27)，字重 650），平时被行内容盖住',
      '列表上方有 44px 高的刷新指示区：箭头 18px + 文字 12.5px ink-2，间距 8px，居中；位置 translateY(pull - 44px)，透明度 min(pull / 40, 1)',
    ],
    visual: [
      '指示文字：下拉刷新；pull ≥ 64 时「松开刷新」且箭头旋转 180°；刷新中换成 16px 旋转圈（2px accent 边框，右边框透明，没有轨道色）+「正在刷新」',
      '图标（viewBox 0 0 16 16，无填充，描边 currentColor，圆头圆角）：刷新按钮 M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3（描边 1.6）；下拉箭头 M8 3v10M4 9l4 4 4-4（描边 1.7，18px）',
    ],
    states: ['默认', '下拉中', '松开刷新', '刷新中', '某行露出删除按钮'],
    interaction: [
      '在列表上纵向拖动（鼠标）：pull = min(dy × 0.55, 96)，列表整体 translateY(pull)；松手时 pull ≥ 64 触发刷新，否则回弹',
      '刷新：pull 固定为 52，1000ms 后在顶部插入一条新消息（时间显示「刚刚」，依次为 Issue 指派 / 新任务：修复分页参数 / 302、依赖更新 / 有 1 个安全补丁待合并 / 355、构建通知 / feat 分支构建失败 / 30），超过 6 行时移除最后一行，pull 回到 0',
      '横向拖动某一行：位移限制在 -96～0px，松手时小于 -40px 停在 -80px 露出删除，否则回到 0；拖动方向在移动超过 6px 时确定',
      '点「更多」切换该行的露出状态；用键盘打开时焦点移到删除按钮；点「删除」移除该行；点刷新按钮直接刷新',
      '触摸设备上纵向滑动交给页面滚动，刷新改用顶部按钮',
    ],
    animation: [
      '指示区与列表 transform 过渡 380ms ease、opacity 300ms（拖动过程中无过渡）；箭头旋转 250ms ease',
      '行横向滑动 transform 过渡 320ms ease；旋转圈 700ms 线性无限',
      '新行进入：从透明 + translateY(-16px) 到正常，transform 450ms ease、opacity 350ms',
      '删除行：到透明 + translateX(-40%)，transform 300ms ease-in、opacity 250ms；其余行位移 400ms ease',
    ],
    a11y: ['「更多」按钮 aria-label「构建通知：显示删除按钮」并有 aria-expanded', '删除按钮只在露出时可 Tab 聚焦', '刷新中用 aria-live 播报「正在刷新」'],
    edge: ['没超过阈值就松手不触发刷新', '横向滑动不会误触发纵向下拉', '刷新中不能再次下拉'],
    acceptance: ['没超过阈值就松手，不触发刷新', '横向滑动不会误触发行点击', '删除后列表数据和界面保持一致'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'carousel',
    name: '轮播',
    goal: '横向轮播：可拖动翻页，带左右按钮、圆点指示器和可暂停的自动播放。',
    canvas: 'phone',
    scene: [
      '标题栏文字「精选」',
      '轮播区 padding 4px 16px 0；视口高 160px，圆角 16px，超出隐藏；4 张幻灯片，每张占满视口宽，内容靠左下，padding 16px 18px：标题 20px 字重 750 行高 1.3，副标题 13px 透明度 0.85 上距 2px',
      '幻灯片背景 oklch(0.9 0.05 H)、文字 oklch(0.32 0.1 H)（深色 oklch(0.36 0.06 H) / oklch(0.92 0.06 H)）。内容（标题 / 副标题 / H）：本周精选 / 5 篇提示词实践 / 30；上手指南 / 从环境安装开始 / 150；控件专题 / 17 个常用控件 / 250；排错手册 / 读报错的顺序 / 330',
      '视口下方 10px 居中一行：4 个圆点 + 间距 8px + 暂停按钮；再下方 10px 居中提示「拖动或用左右方向键切换。」12.5px ink-2',
    ],
    visual: [
      '左右按钮：32px 圆，垂直居中，距视口边 8px，背景 color-mix(bg 88%, transparent)，16px 箭头 ink（描边 1.8px），阴影 0 2px 8px -2px rgb(20 20 19 / 0.25)；在第一张时隐藏「上一张」（透明且不可点），最后一张隐藏「下一张」',
      '圆点：每个点击区 20×24px，中间 6×6px 圆点，颜色 ink，未选中透明度 0.22，选中透明度 1 且 scale(1.35)',
      '暂停按钮：24px 圆，1px line 边框，12px 图标 ink-2（播放中显示暂停图标，暂停后显示播放图标），悬停图标 ink',
    ],
    states: ['第 1～4 张', '拖动中', '自动播放 / 暂停'],
    interaction: [
      '轨道位置 translateX(-当前序号 × 100% + 拖动位移)',
      '拖动跟手（无过渡）；在第一张向右或最后一张向左拖时位移乘 0.35；松手时位移超过视口宽 20% 翻页，否则回弹；拖动不循环',
      '自动播放每 4000ms 下一张，最后一张之后回到第一张；指针悬停、焦点在轮播内、拖动中或点了暂停时停止；系统开启减少动态效果时默认暂停',
      '点圆点跳到对应页；焦点在轮播内时 ←/→ 切换',
    ],
    animation: ['轨道 transform 过渡 420ms ease', '圆点 transform、opacity 过渡 220ms ease', '左右按钮按下 scale(0.92)，显隐 opacity 150ms ease'],
    a11y: [
      '外层 section aria-roledescription="carousel"、aria-label「精选内容」',
      '每张 role="group"、aria-roledescription="slide"、aria-label「1 / 4」，非当前页 aria-hidden',
      '自动播放时轨道 aria-live="off"，停止后 "polite"；圆点 aria-label「第 1 张：本周精选」，当前页 aria-current；暂停按钮 aria-label 随状态变化',
    ],
    edge: ['拖动距离很短时视为点击，不翻页', '在按钮上按下不触发拖动'],
    acceptance: ['自动播放可以暂停，且悬停、聚焦时不会自动翻页', '只用键盘能切换每一张', '读屏能读出当前是第几张'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'search',
    name: '搜索联想',
    goal: '搜索框联想：防抖后显示匹配建议并高亮匹配部分，方向键选择，空查询显示最近搜索，无结果显示空状态。',
    canvas: 'browser',
    scene: [
      '标题栏文字「搜索」',
      '内容区 padding 14px 18px，最大宽度 420px（手机画布 padding 4px 16px）',
      '数据：Git 基础、GitHub 与 PR 协作、改写历史、分支模型与发布、提示词基础、提示词反模式、前端性能、后端性能、数据库性能、代码审查、调试与排错、安全与规范；最近搜索：分支模型、性能、MCP',
      '搜索框下方（被下拉面板盖住的位置）有一行结果文字 12.5px ink-2，上距 10px，最小高度 20px：选中后显示「已打开：xxx」',
    ],
    visual: [
      '搜索框：高 44px，圆角 12px，1px line 边框，背景 soft；左侧 12px 处 18px 放大镜图标（ink-2）；输入文字 15px ink，padding 0 40px 0 38px，占位文字「搜索文档」ink-2，光标 accent',
      '聚焦时边框 accent，外发光 0 0 0 3px color-mix(accent 18%, transparent)；有内容时右侧 10px 处显示 24px 圆形清除按钮（背景 color-mix(ink 14%, soft)，10px 叉号）',
      '下拉面板：绝对定位，顶边在搜索框底边下方 6px，左右与搜索框对齐，盖在下面的结果行之上（不推开结果行），padding 4px，圆角 12px，1px line 边框，背景 bg，阴影 0 10px 30px -8px rgb(20 20 19 / 0.25)，层级最高',
      '空查询：面板顶部「最近搜索」12px 字重 600 ink-2，padding 6px 10px 4px；下面三条，左侧 14px 时钟图标',
      '有查询：最多 6 条建议，左侧 14px 放大镜图标；选项高 36px，padding 0 10px，圆角 8px，图标与文字间距 10px，文字 14.5px ink，图标 ink-2，匹配部分字重 750；高亮项背景 soft',
      '无结果：「没有找到「xx」，换个关键词试试。」13.5px ink-2，padding 12px 10px',
    ],
    states: ['未聚焦', '聚焦且为空（最近搜索）', '有建议', '键盘高亮', '无结果', '已选中'],
    interaction: [
      '聚焦时打开面板，失焦时关闭',
      '输入后 150ms 防抖再更新建议（不区分大小写的包含匹配），并清除高亮',
      '↓↑ 循环移动高亮（初始没有高亮，↓ 到第一项、↑ 到最后一项）；面板关着时按 ↓ 先打开',
      '回车：有高亮项则选它，否则用输入的文字；选中后输入框填入该文字、面板关闭、结果行更新',
      'Esc：面板开着先关闭，否则清空输入；点击建议即选中（按下时不让输入框失焦）；清除按钮清空并保持聚焦',
    ],
    animation: ['面板出现：从透明 + translateY(-4px) 到正常，160ms ease；关闭：100ms ease-in 淡出'],
    a11y: ['输入框 role="combobox"、aria-autocomplete="list"、aria-expanded、aria-controls、aria-activedescendant', '列表 role="listbox"，每项 role="option"、aria-selected'],
    edge: ['快速输入只按最后一次结果显示', '匹配不区分大小写，高亮按原文大小写显示'],
    acceptance: ['只用键盘能完成搜索和选择', '无结果时有明确提示', '读屏能读出当前高亮的建议'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'sortable',
    name: '拖拽排序',
    goal: '待办列表拖拽排序：拖动手柄移动行，其他行让位；也能只用键盘排序，并播报位置。',
    canvas: 'browser',
    scene: [
      '标题栏文字「今日待办」',
      '列表：margin 14px 18px，最大宽度 420px（手机画布 margin 4px 12px），1px line 边框，圆角 14px，背景 soft',
      '5 行：整理需求文档、评审登录页 PR、修复分页参数、补充单元测试、更新周报',
    ],
    visual: [
      '行：高 49px，背景 bg，padding 0 14px 0 6px，元素间距 6px；底部 1px 分隔线用 inset 阴影 0 -1px 0 line 画（最后一行没有）；首行上方圆角 13px，末行下方圆角 13px',
      '手柄按钮：32×32px，圆角 8px，6 个点的图标（16px，点半径 1.2，两列三行），ink-2；悬停背景 soft、图标 ink；光标 grab',
      '文字 15px ink',
      '拿起的行：scale(1.03)，圆角 10px，层级置顶，浮起阴影 0 8px 24px -6px rgb(20 20 19 / 0.28), 0 0 0 1px line（阴影画在伪元素上，用透明度 200ms 渐显）',
      '键盘拿起时手柄 aria-pressed="true"，背景 color-mix(accent 14%, transparent)，图标 accent',
    ],
    states: ['默认', '悬停手柄', '指针拖动中', '键盘拿起', '落下'],
    interaction: [
      '按住手柄拖动：被拖的行 translateY 跟随指针（无过渡）；目标位置 = 起始位置 + round(位移 / 行高)，限制在列表范围内；起始与目标之间的行各让出一个行高（translateY ±49px）',
      '松手：被拖的行用 200ms 动画移到目标格，然后真正调整顺序（这一帧去掉过渡，避免跳动）',
      '键盘：手柄上按空格或回车拿起；↑↓ 移动目标位置（被拿起的行移动到目标格，其他行让位）；再按空格或回车放下；Esc 或手柄失焦则取消，回到原位；放下后焦点留在该行手柄',
    ],
    animation: ['其他行让位和被拿起行（键盘移动、松手落位）的位移都是 200ms ease', '只用 transform 和 opacity'],
    a11y: [
      '手柄 aria-label「拖动排序：整理需求文档」',
      '用 aria-live="assertive" 区域播报：拿起「已拿起「X」，当前位置 3 / 5。用上下方向键移动，空格放下，Esc 取消。」；移动「「X」移到第 2 位」；放下「已放下「X」，位置 1 / 5」；取消「已取消，「X」回到第 3 位」',
    ],
    edge: ['拖出列表范围时目标位置停在首尾', '只能从手柄开始拖动，点文字不拖'],
    acceptance: ['落下后数据顺序与界面一致', '只用键盘能完成排序和取消', '读屏能听到每一步的位置变化'],
    verify: NOT_VERIFIED,
  },
  {
    id: 'like',
    name: '点赞爆发',
    goal: '点赞微交互：心形回弹、粒子飞散、计数滚动；双击图片也能点赞。',
    canvas: 'phone',
    scene: [
      '标题栏文字「动态」',
      '帖子区 padding 4px 16px：头部是 36px 圆形头像（背景 oklch(0.92 0.05 30)，文字「林」oklch(0.38 0.12 30) 字重 700；深色 oklch(0.34 0.06 30) / oklch(0.9 0.08 30)）和右侧两行文字（「林夕」14px 粗体、「10 分钟前」12px ink-2，行高 1.3），间距 10px',
      '正文「新版控件演示上线了，双击图片也能点赞。」14px 行高 1.6，上下各 10px',
      '图片占位：高 150px，圆角 14px，背景 oklch(0.9 0.04 250)（深色 oklch(0.34 0.05 250)），纯色块，平时里面什么都没有（不放图标）；双击时大心形出现在它的中心',
      '操作行上距 8px，间距 6px：点赞按钮；评论（不是按钮，只是文字：20px 气泡图标，viewBox 0 0 24 24，路径 M4.5 5.5h15v10h-8l-4 3.5v-3.5h-3z，描边 1.6px、圆角拐角，后面「24」，14px 字重 600 ink-2，padding 0 8px，间距 6px）',
    ],
    visual: [
      '点赞按钮：高 36px，padding 0 10px 0 8px，圆角 18px，图标与数字间距 6px，颜色 ink-2，悬停背景 soft；已赞时颜色 like：#d93f4c（深色 #ff6b78）',
      '心形 22px，viewBox 0 0 24 24，路径 M12 20.5c-5.3-3.5-8.5-6.6-8.5-10A4.5 4.5 0 0 1 12 7.3a4.5 4.5 0 0 1 8.5 3.2c0 3.4-3.2 6.5-8.5 10z；未赞为 1.6px 描边，已赞为填充',
      '计数：14px 字重 600 等宽数字，高与行高 20px，最小宽 28px，超出隐藏；初始 128、未赞',
      '双击图片时中心出现 64px 白色心形，带 drop-shadow 0 4px 12px rgb(20 20 19 / 0.3)',
    ],
    states: ['未赞', '已赞', '点赞动画中', '取消动画中'],
    interaction: ['点击按钮切换赞 / 取消，计数 +1 / -1', '双击图片：只点赞（已赞时不取消），并播放大心形'],
    animation: [
      '点赞：心形 450ms ease，关键帧 0% scale(1)、25% scale(0.7)、60% scale(1.25)、100% scale(1)',
      '同时 8 个 5px 圆点从心形中心向 0°、45° … 315° 方向飞出 18px，scale 1→0.4、透明度 1→0，500ms ease，延迟 120ms；第奇数个用 like 色，第偶数个用 accent',
      '取消：心形 200ms ease，50% 时 scale(0.85)，没有粒子',
      '计数滚动 260ms ease：增加时旧数字向上移出（translateY(-100%) + 透明），新数字从下方移入；减少时方向相反',
      '大心形 700ms ease：0% scale(0) 透明，30% scale(1.1) 不透明，45% scale(1)，80% 不透明，100% 透明',
      '减少动态效果：没有粒子和大心形，只切换颜色',
    ],
    a11y: ['按钮 aria-pressed，aria-label「点赞，129 人已赞」随计数更新；数字本身 aria-hidden'],
    edge: ['连续快速点击时每次都重新播放动画，计数不出错', '双击图片不会取消已有的赞'],
    acceptance: ['计数与状态始终一致', '读屏能读出是否已赞和人数', '减少动态效果时没有飞散粒子'],
    verify: NOT_VERIFIED,
  },
  ...(
    [
      ['navbar', '导航栏', '页面顶部导航栏，包含返回按钮、标题和右侧操作。'],
      ['slider', '滑块', '一个可拖动选择数值的滑块。'],
      ['segmented', '分段控件', '在两到四个选项之间切换的分段控件。'],
      ['datepicker', '日期选择', '一个按月份浏览、选择单个日期的日期选择器。'],
      ['infinite', '无限滚动', '滚动到底部自动加载下一页的列表。'],
      ['transition', '页面转场', '列表进入详情页的共享元素转场。'],
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
      verify: NOT_VERIFIED,
    }),
  ),
]

/**
 * 还原验证记录：把网页写法（HTML + CSS + JS、默认选项）的提示词原样交给独立 agent，
 * 只给提示词、不给演示源码，产出单文件 HTML，再用无头 Chrome 与站内演示逐状态截图对比（浅色全部状态 + 深色默认态）。
 * 所有控件都存在约 1px 的整体纵向偏移（站内画布高度带小数），不计入差异。
 * 中间帧由「触发后暂停全部动画并拨到同一时刻」得到，受操作延迟影响，多数接近结束态；动画时长和缓动没有逐项数值比对。
 */
const D = '2026-11-06'
const verifyLog: Record<string, Verify> = {
  button: { status: '已验证', date: D, rounds: 2, note: '对比默认、悬停、按下、加载、成功、深色 6 个状态。第一轮字段标签文案缺失，补进提示词后第二轮一致。' },
  switch: { status: '已验证', date: D, rounds: 1, note: '对比默认、按下、打开中间帧与结束、深色 5 个状态，一致。' },
  checkbox: { status: '已验证', date: D, rounds: 1, note: '对比半选、悬停、勾选中间帧、全选、全不选、单选切换、深色 8 个状态，一致。' },
  input: { status: '已验证', date: D, rounds: 1, note: '对比默认、聚焦、抖动中、错误、改正后、深色 7 个状态，一致。' },
  select: { status: '已验证', date: D, rounds: 1, note: '对比收起、悬停、展开、键盘高亮、选中后、深色 7 个状态，一致（复测前修正了站内演示的焦点环颜色）。' },
  modal: { status: '已验证', date: D, rounds: 1, note: '对比默认、底部面板、选择结果、确认对话框、深色 7 个状态，一致；面板图标由实现方自绘，细节略有不同。' },
  toast: { status: '已验证', date: D, rounds: 1, note: '对比默认、Toast、Snackbar（含进入中间帧）、深色 6 个状态，一致。' },
  progress: { status: '已验证', date: D, rounds: 1, note: '对比空闲、58%、暂停、完成、深色 5 个状态，外观一致；暂停态两边因计时先后停在不同步数（58% 与 73%），属于测试时序差异。' },
  skeleton: { status: '已验证', date: D, rounds: 1, note: '对比已加载、骨架光泽帧、内容淡入中间帧、加载完成、深色 5 个状态，一致。' },
  tabbar: { status: '已验证', date: D, rounds: 2, note: '对比默认、切换中间帧与结束、切到「我的」、深色 5 个状态。第一轮图标形状不同，补上图标路径后第二轮一致。' },
  tabs: { status: '已验证', date: D, rounds: 1, note: '对比默认、悬停、切换中间帧与结束、深色 5 个状态，一致；标签文字有 1～2px 水平偏移。' },
  accordion: { status: '已验证', date: D, rounds: 1, note: '对比默认、悬停、展开中间帧与结束、全部收起、深色 6 个状态，一致。' },
  list: { status: '部分一致', date: D, rounds: 2, note: '对比默认、刷新中、刷新完成、露出删除、深色 5 个状态。第一轮行内布局和时间列不同，第二轮已一致；仍有差异：独立实现在刷新中同时显示箭头和旋转圈，副标题截断宽度略窄。拖动手势没有截图比对。' },
  carousel: { status: '已验证', date: D, rounds: 1, note: '对比默认、翻页中间帧与结束、跳到第 4 张、深色 5 个状态，一致；拖动手感和自动播放节奏没有截图比对。' },
  search: { status: '已验证', date: D, rounds: 2, note: '对比默认、最近搜索、联想、键盘高亮、选中、无结果、深色 7 个状态。第一轮面板把结果行推开，改写面板定位后第二轮一致。' },
  sortable: { status: '已验证', date: D, rounds: 1, note: '对比默认、悬停手柄、键盘拿起、移动中间帧与结束、放下、指针拖动中、深色 8 个状态，一致（复测前修正了站内演示放下后焦点落错行）。' },
  like: { status: '已验证', date: D, rounds: 2, note: '对比默认、悬停、点赞中间帧与结束、取消、双击大心形、深色 7 个状态。第一轮图片里多了图标、评论图标不同，补充后第二轮一致；粒子飞散帧在截图里很小，没有单独比对。' },
}
for (const c of controls) c.verify = verifyLog[c.id] ?? c.verify

export function getControl(id: string): ControlSpec | undefined {
  return controls.find((c) => c.id === id)
}

/** 组装完整提示词。view 不传时用站内配色和控件自己的验证画布 */
export function buildControlPrompt(
  id: string,
  stackLabel: string | undefined,
  o: PromptOptions,
  view: { palette?: Palette; canvas?: 'phone' | 'browser' } = {},
): string {
  const palette = view.palette ?? 'site'
  const c = getControl(id)
  if (!c) return ''
  const stack = (stackLabel && stackOf[stackLabel]) || '{技术栈，例如：iOS，SwiftUI}'
  const lines: string[] = []
  const list = (items: string[] | undefined) => (items ?? []).map((x) => `- ${x}`)
  const section = (title: string, items: string[] | undefined) => {
    if (items?.length) lines.push(`【${title}】`, ...list(items), '')
  }

  lines.push('【目标】', `实现${c.name}控件。${c.goal}`, '')
  lines.push('【技术栈】', stack, '')
  lines.push(
    '【上下文】',
    '- 项目现有技术栈与版本：{项目技术栈与版本}',
    '- 控件放在：{文件路径}',
    '- 可以复用的已有组件或样式：{组件路径}',
    '',
  )

  if (!c.draft && c.canvas) {
    const native = !stackLabel || !webStacks.has(stackLabel)
    lines.push(
      '【参考规格】',
      '- 下面的尺寸、颜色、时长和文案来自一个参考演示，按它 1:1 还原；接入项目时颜色换成项目里对应的主题变量',
      ...(native ? ['- 原生平台把 px 按 1:1 换成 pt / dp / vp；颜色、时长、缓动保持不变'] : []),
      '',
    )
    lines.push('【颜色与动效令牌】', ...tokenLines(o.dark, palette), '')
    lines.push('【画布与场景】', ...canvasLines[view.canvas ?? c.canvas], ...list(c.scene), '')
    section('尺寸与样式', c.visual)
    section('状态', c.states)
  }

  lines.push('【交互】', ...list(c.interaction), '')
  if (o.animation) {
    lines.push('【动画】', ...list(c.animation), '- 动画只改变 transform 和 opacity；系统开启「减少动态效果」时去掉位移和缩放动画', '')
  } else {
    lines.push('【动画】', '- 不需要动画，状态直接切换', '')
  }
  if (o.a11y) section('无障碍', c.a11y)
  section('边界情况', c.edge)

  lines.push(
    '【约束】',
    '- 不引入新的第三方依赖；确实需要时先说明理由，等我确认',
    '- 遵循项目现有的代码规范和目录约定',
    '- 只做实现这个控件所需的最小改动，不顺手修改其他文件',
  )
  if (o.dark) lines.push('- 浅色和深色模式都要适配，深色值见上文括号')
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
  const text = lines.join('\n')
  // 正文里唯一写死的强调色：主按钮的投影，跟着色值表换
  return palette === 'ios' ? text.replaceAll('rgb(179 87 58 / 0.3)', 'rgb(0 122 255 / 0.3)') : text
}
