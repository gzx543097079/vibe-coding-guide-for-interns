// 控件演示注册表：ControlDemo 按 id 取演示组件、标题、操作提示和默认外框
import { defineAsyncComponent, type Component } from 'vue'

// 每个演示单独成块，用到时才加载，不进全站都要下载的主题脚本
const DemoButton = defineAsyncComponent(() => import('./DemoButton.vue'))
const DemoSwitch = defineAsyncComponent(() => import('./DemoSwitch.vue'))
const DemoModal = defineAsyncComponent(() => import('./DemoModal.vue'))
const DemoList = defineAsyncComponent(() => import('./DemoList.vue'))
const DemoTabBar = defineAsyncComponent(() => import('./DemoTabBar.vue'))
const DemoCheckbox = defineAsyncComponent(() => import('./DemoCheckbox.vue'))
const DemoInput = defineAsyncComponent(() => import('./DemoInput.vue'))
const DemoSelect = defineAsyncComponent(() => import('./DemoSelect.vue'))
const DemoTabs = defineAsyncComponent(() => import('./DemoTabs.vue'))
const DemoToast = defineAsyncComponent(() => import('./DemoToast.vue'))
const DemoSkeleton = defineAsyncComponent(() => import('./DemoSkeleton.vue'))
const DemoProgress = defineAsyncComponent(() => import('./DemoProgress.vue'))
const DemoAccordion = defineAsyncComponent(() => import('./DemoAccordion.vue'))
const DemoCarousel = defineAsyncComponent(() => import('./DemoCarousel.vue'))
const DemoSearch = defineAsyncComponent(() => import('./DemoSearch.vue'))
const DemoLike = defineAsyncComponent(() => import('./DemoLike.vue'))
const DemoSortable = defineAsyncComponent(() => import('./DemoSortable.vue'))
const DemoSwipeReply = defineAsyncComponent(() => import('./DemoSwipeReply.vue'))
const DemoReaction = defineAsyncComponent(() => import('./DemoReaction.vue'))
const DemoStories = defineAsyncComponent(() => import('./DemoStories.vue'))
const DemoZoom = defineAsyncComponent(() => import('./DemoZoom.vue'))

export type Frame = 'phone' | 'browser'

export interface DemoMeta {
  name: string
  hint: string
  comp: Component
  /** 默认外框，也是验证提示词时使用的画布 */
  frame: Frame
  /** 只有手机外框：手势类效果在网页画布里没有意义 */
  phoneOnly?: boolean
}

export const demos: Record<string, DemoMeta> = {
  button: { name: '按钮 Button', hint: '按下看反馈，提交后进入加载状态', comp: DemoButton, frame: 'phone' },
  switch: { name: '开关 Switch', hint: '点击或按空格切换', comp: DemoSwitch, frame: 'phone' },
  checkbox: { name: '复选框与单选', hint: '勾选子项看「全部」的半选状态', comp: DemoCheckbox, frame: 'browser' },
  input: { name: '输入框 Input', hint: '输入不完整的邮箱后移开焦点', comp: DemoInput, frame: 'browser' },
  select: { name: '下拉选择 Select', hint: '点击展开，方向键移动，Esc 关闭', comp: DemoSelect, frame: 'browser' },
  modal: { name: '弹窗 Modal / Sheet', hint: '打开底部弹窗或对话框，Esc 关闭', comp: DemoModal, frame: 'phone' },
  toast: { name: '轻提示与 Snackbar', hint: '复制链接看轻提示，删除后可以撤销', comp: DemoToast, frame: 'phone' },
  progress: { name: '进度条与环形进度', hint: '开始上传后可以暂停和继续', comp: DemoProgress, frame: 'browser' },
  skeleton: { name: '骨架屏 Skeleton', hint: '点右上角重新加载', comp: DemoSkeleton, frame: 'browser' },
  tabbar: { name: '标签栏 TabBar', hint: '切换标签，方向键可移动', comp: DemoTabBar, frame: 'phone' },
  tabs: { name: '标签页 Tabs', hint: '点击或用左右方向键切换', comp: DemoTabs, frame: 'browser' },
  accordion: { name: '手风琴 Accordion', hint: '一次只展开一项，上下方向键移动', comp: DemoAccordion, frame: 'browser' },
  list: { name: '列表 List', hint: '向下拖动刷新，向左滑动删除；也可用顶部按钮', comp: DemoList, frame: 'phone' },
  carousel: { name: '轮播 Carousel', hint: '拖动翻页，悬停时暂停自动播放', comp: DemoCarousel, frame: 'phone' },
  search: { name: '搜索联想', hint: '输入「性能」，方向键选择后回车', comp: DemoSearch, frame: 'browser' },
  sortable: { name: '拖拽排序', hint: '拖动手柄，或聚焦手柄后按空格拿起', comp: DemoSortable, frame: 'browser' },
  like: { name: '点赞爆发', hint: '点心形，或双击图片', comp: DemoLike, frame: 'phone' },
  'swipe-reply': { name: '滑动回复', hint: '按住一条消息向左拖，过了阈值松手；也可以聚焦后按回车', comp: DemoSwipeReply, frame: 'phone', phoneOnly: true },
  reaction: { name: '长按表情回应', hint: '长按一条消息（或右键、回车），再选一个表情', comp: DemoReaction, frame: 'phone', phoneOnly: true },
  stories: { name: '快拍分段进度', hint: '点右侧下一条、左侧上一条，按住暂停', comp: DemoStories, frame: 'phone', phoneOnly: true },
  zoom: { name: '图片放大查看', hint: '点一张照片放大，按住大图向下拖动关闭', comp: DemoZoom, frame: 'phone', phoneOnly: true },
}

/** 没有对应章节的演示：从常见 App 里整理出来的手势与转场 */
export const appEffects: { id: string; title: string }[] = [
  { id: 'swipe-reply', title: '滑动回复' },
  { id: 'reaction', title: '长按表情回应' },
  { id: 'stories', title: '快拍分段进度' },
  { id: 'zoom', title: '图片放大查看' },
]
