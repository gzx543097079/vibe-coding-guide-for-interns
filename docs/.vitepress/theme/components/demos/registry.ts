// 控件演示注册表：ControlDemo 按 id 取演示组件、标题、操作提示和默认外框
import type { Component } from 'vue'
import DemoButton from './DemoButton.vue'
import DemoSwitch from './DemoSwitch.vue'
import DemoModal from './DemoModal.vue'
import DemoList from './DemoList.vue'
import DemoTabBar from './DemoTabBar.vue'
import DemoCheckbox from './DemoCheckbox.vue'
import DemoInput from './DemoInput.vue'
import DemoSelect from './DemoSelect.vue'
import DemoTabs from './DemoTabs.vue'
import DemoToast from './DemoToast.vue'
import DemoSkeleton from './DemoSkeleton.vue'
import DemoProgress from './DemoProgress.vue'
import DemoAccordion from './DemoAccordion.vue'
import DemoCarousel from './DemoCarousel.vue'
import DemoSearch from './DemoSearch.vue'
import DemoLike from './DemoLike.vue'
import DemoSortable from './DemoSortable.vue'

export type Frame = 'phone' | 'browser'

export interface DemoMeta {
  name: string
  hint: string
  comp: Component
  /** 默认外框，也是验证提示词时使用的画布 */
  frame: Frame
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
}
