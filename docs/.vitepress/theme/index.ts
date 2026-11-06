import { h } from 'vue'
import type { Theme } from 'vitepress'
// 不引入默认主题自带的 Inter 字体，统一使用系统字体栈
import DefaultTheme from 'vitepress/theme-without-fonts'

import LineProgress from './components/LineProgress.vue'
import SidebarHere from './components/SidebarHere.vue'
import HomePage from './components/HomePage.vue'
import CodeTabs from './components/CodeTabs.vue'
import ControlDemo from './components/ControlDemo.vue'
import ControlGallery from './components/ControlGallery.vue'
import PromptCard from './components/PromptCard.vue'

import './styles/tokens.css'
import './styles/base.css'
import './styles/sidebar.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(LineProgress),
      'sidebar-nav-before': () => h(SidebarHere),
    }),
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('CodeTabs', CodeTabs)
    app.component('ControlDemo', ControlDemo)
    app.component('ControlGallery', ControlGallery)
    app.component('PromptCard', PromptCard)
  },
} satisfies Theme
