// 方案对比数据：key 与 CodeTabs 的标签名一致，用于联动高亮。
// 只写通用判断，不写性能数据和排名；不确定的内容标「待核实」。

export interface Approach {
  /** 与 CodeTabs 标签一致 */
  label: string
  name: string
  scene: string
  pros: string[]
  cons: string[]
  cost: string
  eco: string
  when: string
}

export interface StackCompare {
  id: string
  title: string
  approaches: Approach[]
  verdict: string
}

export const stacks: StackCompare[] = [
  {
    id: 'ios',
    title: 'iOS 界面开发：三种写法怎么选',
    approaches: [
      {
        label: 'Objective-C',
        name: 'Objective-C + UIKit',
        scene: '维护已有的老项目，或需要和 C / C++ 代码深度混编',
        pros: ['老项目和大量历史资料都用它', '与 C / C++ 混编方便'],
        cons: ['语法冗长，空值和类型检查弱', 'Apple 的新 API 和示例多以 Swift 为先'],
        cost: '中：语法和内存管理规则需要单独学',
        eco: '仍可使用，新项目很少再选',
        when: '只在维护现有 Objective-C 代码时用',
      },
      {
        label: 'Swift (UIKit)',
        name: 'Swift + UIKit',
        scene: '大多数现有 iOS 项目，需要精细控制界面和生命周期',
        pros: ['成熟稳定，能力最全', '资料多，问题容易查到答案'],
        cons: ['布局和状态同步代码多', '同样的界面比 SwiftUI 写得长'],
        cost: '中：需要理解视图控制器生命周期和 Auto Layout',
        eco: '仍是大量项目的主体，持续维护',
        when: '项目已经是 UIKit，或要支持较老的系统版本',
      },
      {
        label: 'SwiftUI',
        name: 'SwiftUI',
        scene: '新项目、新页面，界面以声明式描述为主',
        pros: ['代码少，状态驱动界面', '预览方便，跨 Apple 平台复用'],
        cons: ['部分能力要较新的系统版本', '复杂场景有时仍需借助 UIKit'],
        cost: '低到中：入门快，状态管理需要花时间理解',
        eco: 'Apple 主推的方向，每年都有更新',
        when: '新项目且最低支持版本允许时优先考虑',
      },
    ],
    verdict: '先跟团队现有代码保持一致。新项目在最低支持系统版本允许时可以默认 SwiftUI，遇到做不了的地方再嵌入 UIKit。',
  },
  {
    id: 'android',
    title: 'Android 界面开发：三种写法怎么选',
    approaches: [
      {
        label: 'Java',
        name: 'Java + View',
        scene: '维护用 Java 写的老项目',
        pros: ['老项目和历史资料多', '语法对学过 Java 的人友好'],
        cons: ['空安全靠约定，容易出现空指针', '新的官方示例多用 Kotlin'],
        cost: '低到中：会 Java 就能上手',
        eco: '仍受支持，新代码一般改用 Kotlin',
        when: '只在维护现有 Java 代码时用',
      },
      {
        label: 'Kotlin (View)',
        name: 'Kotlin + View（XML 布局）',
        scene: '现有的 View 体系项目',
        pros: ['语法简洁，有空安全', '可以和 Java 代码共存'],
        cons: ['XML 布局和代码分离，状态同步要手写', '复杂列表要写 Adapter'],
        cost: '中：要学 Kotlin 语法和 View 体系',
        eco: '大量现有项目在用，持续维护',
        when: '项目已经是 View 体系时',
      },
      {
        label: 'Kotlin (Compose)',
        name: 'Kotlin + Jetpack Compose',
        scene: '新项目、新页面',
        pros: ['声明式写法，状态驱动界面', '不再需要 XML 布局和 Adapter'],
        cons: ['部分 API 仍标为实验性，版本间有变化', '性能问题要理解重组（recomposition）才能排查'],
        cost: '中：声明式思路和状态管理需要适应',
        eco: 'Google 推荐的现代 UI 工具包，更新频繁',
        when: '新项目默认选它',
      },
    ],
    verdict: '先用团队现有的写法。新项目默认 Kotlin + Compose；老项目可以在新页面里逐步引入 Compose。',
  },
  {
    id: 'mini',
    title: '小程序开发：原生还是框架',
    approaches: [
      {
        label: 'WXML + JS',
        name: '原生小程序',
        scene: '只做一个平台（如微信）的小程序',
        pros: ['和官方文档一一对应，排查问题直接', '没有编译层带来的额外问题'],
        cons: ['换平台要重写', '工程化能力（组件、类型）要自己补'],
        cost: '低：会 HTML / CSS / JS 就能上手',
        eco: '跟随各平台官方更新',
        when: '只做单个平台时',
      },
      {
        label: 'uni-app (Vue)',
        name: 'uni-app',
        scene: '一套代码发布到多个小程序平台、H5 和 App',
        pros: ['熟悉 Vue 就能写', '多端发布，配套组件和插件多'],
        cons: ['平台差异要用条件编译处理', '出问题时要分清是框架还是平台的原因'],
        cost: '低到中：需要会 Vue',
        eco: '由 DCloud 维护，国内使用较多',
        when: '团队用 Vue 且需要多端发布时',
      },
      {
        label: 'Taro (React)',
        name: 'Taro',
        scene: '用 React（或 Vue）开发多端小程序',
        pros: ['可以用 React 的写法和生态', '支持多个小程序平台和 H5'],
        cons: ['同样要处理平台差异', '大版本之间写法有变化，资料要看清版本'],
        cost: '中：需要会 React',
        eco: '由京东团队发起并开源维护',
        when: '团队用 React 且需要多端发布时',
      },
    ],
    verdict: '只做一个平台就用原生；需要多端时按团队熟悉的框架选：会 Vue 选 uni-app，会 React 选 Taro。',
  },
  {
    id: 'cross',
    title: '跨端框架：四个常见方案',
    approaches: [
      {
        label: 'Flutter (Dart)',
        name: 'Flutter',
        scene: '对多端界面一致性要求高的 App',
        pros: ['自绘引擎，各平台表现一致', '组件丰富，开发时可热重载'],
        cons: ['要学 Dart', '调用平台能力需要插件或写平台代码'],
        cost: '中：Dart 和 Widget 体系需要学',
        eco: '由 Google 维护',
        when: '新做 App，团队没有现成的 Web 技术栈积累时',
      },
      {
        label: 'React Native (TSX)',
        name: 'React Native',
        scene: '团队熟悉 React，想复用前端技能做 App',
        pros: ['用 React 和 TypeScript 开发', '渲染为平台原生组件'],
        cons: ['两端表现可能有差异', '部分能力依赖第三方库，要关注维护状态'],
        cost: '低到中：会 React 上手快，原生问题仍要懂一点 iOS / Android',
        eco: '由 Meta 维护，社区库很多',
        when: '团队以 React 为主时',
      },
      {
        label: 'uni-app (Vue)',
        name: 'uni-app',
        scene: '同时要小程序、H5 和 App',
        pros: ['小程序覆盖面广', '会 Vue 就能写'],
        cons: ['App 端复杂交互和性能要多验证', '平台差异靠条件编译'],
        cost: '低到中：需要会 Vue',
        eco: '由 DCloud 维护',
        when: '小程序是主要场景，App 是补充时',
      },
      {
        label: 'Taro (React)',
        name: 'Taro',
        scene: '以多端小程序为主，团队用 React',
        pros: ['React 写法', '多小程序平台支持'],
        cons: ['App 端不是它的主要方向，需求要先核实', '大版本差异要留意'],
        cost: '中：需要会 React',
        eco: '由京东团队发起并开源维护',
        when: '做多端小程序且团队用 React 时',
      },
    ],
    verdict: '先用团队已有的方案。新项目以 App 为主可以先比较 Flutter 和 React Native；以小程序为主再看 uni-app 或 Taro。',
  },
]

/** 其余方向的对比还没写 */
export const pendingCompares = [
  'Web：原生 HTML / React / Vue',
  '鸿蒙：ArkTS 声明式开发与其他方案',
  '前端状态管理方案',
  '后端框架选型',
  '数据库选型：关系型与非关系型',
]

/** 标签对应的实现家族，同一家族共用控件差异说明 */
const family: Record<string, string> = {
  'Objective-C': 'uikit',
  'Swift (UIKit)': 'uikit',
  SwiftUI: 'swiftui',
  Java: 'view',
  'Kotlin (View)': 'view',
  'Kotlin (Compose)': 'compose',
  ArkTS: 'arkts',
  'ArkTS (ArkUI)': 'arkts',
  'WXML + JS': 'mini',
  'uni-app (Vue)': 'uniapp',
  'Taro (React)': 'taro',
  'Flutter (Dart)': 'flutter',
  'React Native (TSX)': 'rn',
  'HTML + CSS + JS': 'html',
  React: 'react',
  Vue: 'vue',
}

const notes: Record<string, Record<string, string>> = {
  button: {
    uikit: 'UIButton；iOS 15 起可用 UIButton.Configuration 配置样式和加载指示。',
    swiftui: 'Button 配合 buttonStyle；加载状态要自己把文字换成 ProgressView。',
    view: 'Button 或 MaterialButton；加载状态通常自己放 ProgressBar。',
    compose: 'Button 的 enabled 控制禁用；加载时在内容里放 CircularProgressIndicator。',
    arkts: 'Button 组件，enabled() 控制禁用；加载状态自己组合 LoadingProgress。',
    mini: '原生 button 自带 loading 和 disabled 属性。',
    uniapp: '沿用小程序 button 的 loading / disabled 属性。',
    taro: '用 @tarojs/components 的 Button，属性和小程序一致。',
    flutter: 'FilledButton 等按钮，onPressed 传 null 即为禁用。',
    rn: '常用 Pressable 自己画，按下样式由 style 函数的 pressed 参数控制。',
    html: '原生 button 元素自带键盘操作和禁用语义，只需要写样式。',
    react: '包装原生 button，loading 由组件状态控制。',
    vue: '包装原生 button，loading 由响应式状态控制。',
  },
  switch: {
    uikit: 'UISwitch，监听 valueChanged 事件。',
    swiftui: 'Toggle，绑定一个 Bool 状态。',
    view: 'SwitchCompat 或 Material 组件库里的开关。',
    compose: 'Switch(checked, onCheckedChange)。',
    arkts: 'Toggle 组件，type 设为 ToggleType.Switch。',
    mini: '原生 switch 组件，bindchange 里从 e.detail.value 取值。',
    uniapp: 'switch 组件，监听 @change。',
    taro: 'Switch 组件，监听 onChange。',
    flutter: 'Switch，或带标题的一整行 SwitchListTile。',
    rn: '核心库的 Switch，value + onValueChange。',
    html: '没有原生开关元素，常用 button 加 role="switch" 自己画。',
    react: '做成受控组件，状态由父组件传入。',
    vue: '用 defineModel 做成 v-model 组件。',
  },
  modal: {
    uikit: 'UIAlertController 做对话框和操作表；iOS 15 起可用 sheetPresentationController 做半屏弹窗。',
    swiftui: '.alert、.confirmationDialog、.sheet 修饰符；presentationDetents 需要 iOS 16。',
    view: 'AlertDialog / MaterialAlertDialogBuilder；底部弹窗用 BottomSheetDialog。',
    compose: 'AlertDialog；底部弹窗用 ModalBottomSheet（标为实验性 API）。',
    arkts: 'AlertDialog、ActionSheet，或 bindSheet 半模态（所需 API 版本待核实）。',
    mini: 'wx.showModal / wx.showActionSheet 样式由系统决定；要自定义样式就自己写组件。',
    uniapp: 'uni.showModal / uni.showActionSheet，或用组件库的弹层。',
    taro: 'Taro.showModal / Taro.showActionSheet。',
    flutter: 'showDialog / showModalBottomSheet。',
    rn: 'Alert.alert 调系统对话框；自定义弹层用 Modal 组件。',
    html: '原生 dialog 元素的 showModal() 自带背景遮挡和 Esc 关闭。',
    react: '包装 dialog 元素或用组件库，注意关闭后把焦点还给触发按钮。',
    vue: '包装 dialog 元素或用组件库，注意关闭后把焦点还给触发按钮。',
  },
  list: {
    uikit: 'UITableView；UIRefreshControl 下拉刷新，trailingSwipeActions 做左滑操作。',
    swiftui: 'List 加 .refreshable（iOS 15 起）和 .onDelete / .swipeActions。',
    view: 'RecyclerView + SwipeRefreshLayout；滑动删除用 ItemTouchHelper。',
    compose: 'LazyColumn；下拉刷新用 PullToRefreshBox，滑动删除的 API 在不同版本间有变化。',
    arkts: 'List 外面套 Refresh；ListItem 的 swipeAction 做滑动操作。',
    mini: '页面级 onPullDownRefresh，或 scroll-view 的下拉刷新属性；滑动删除没有原生组件。',
    uniapp: 'onPullDownRefresh 生命周期；滑动删除用扩展组件或自己写。',
    taro: 'usePullDownRefresh；滑动删除需要自己写或用组件库。',
    flutter: 'ListView.builder + RefreshIndicator；滑动删除用 Dismissible。',
    rn: 'FlatList 自带 refreshing / onRefresh；滑动删除要用第三方手势库。',
    html: '网页一般提供刷新按钮；数据很多时考虑虚拟滚动。',
    react: '列表用 key 保持稳定；数据很多时考虑虚拟列表。',
    vue: '列表用 key 保持稳定，删除动画可用 TransitionGroup。',
  },
  tabbar: {
    uikit: 'UITabBarController 管理多个子页面。',
    swiftui: 'TabView 加 .tabItem。',
    view: 'BottomNavigationView 配合 Fragment 或 Navigation 组件。',
    compose: 'Scaffold 的 bottomBar 里放 NavigationBar。',
    arkts: 'Tabs 组件，barPosition 设为 BarPosition.End。',
    mini: '在 app.json 里配置 tabBar（list 需要 2 到 5 项），跳转用 wx.switchTab。',
    uniapp: '在 pages.json 里配置 tabBar。',
    taro: '在 app.config 里配置 tabBar。',
    flutter: 'Scaffold 的 bottomNavigationBar 放 NavigationBar。',
    rn: '常用 @react-navigation/bottom-tabs。',
    html: '用 role="tablist" 的按钮组，或直接用导航链接。',
    react: '一般和 React Router 等路由库一起用。',
    vue: '一般和 Vue Router 一起用。',
  },
}

export function getStack(id: string): StackCompare | undefined {
  return stacks.find((s) => s.id === id)
}

/** 某个控件在给定标签下的实现说明 */
export function controlNote(control: string, label: string): string | undefined {
  const f = family[label]
  return f ? notes[control]?.[f] : undefined
}
