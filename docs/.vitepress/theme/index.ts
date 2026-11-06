import type { Theme } from 'vitepress'
// 不引入默认主题自带的 Inter 字体，统一使用系统字体栈
import DefaultTheme from 'vitepress/theme-without-fonts'

import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import CodeTabs from './components/CodeTabs.vue'
import ControlDemo from './components/ControlDemo.vue'
import ControlGallery from './components/ControlGallery.vue'
import PromptCard from './components/PromptCard.vue'
import TechCard from './components/TechCard.vue'
import ApproachCompare from './components/ApproachCompare.vue'
import { registerRich } from './components/rich'

import './styles/tokens.css'
import './styles/base.css'
import './styles/sidebar.css'
import './styles/rich.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('CodeTabs', CodeTabs)
    app.component('ControlDemo', ControlDemo)
    app.component('ControlGallery', ControlGallery)
    app.component('PromptCard', PromptCard)
    app.component('TechCard', TechCard)
    app.component('ApproachCompare', ApproachCompare)
    registerRich(app)
  },
} satisfies Theme
