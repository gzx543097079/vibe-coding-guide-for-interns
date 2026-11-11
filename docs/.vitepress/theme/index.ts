import { defineAsyncComponent } from 'vue'
import type { Theme } from 'vitepress'
// 不引入默认主题自带的 Inter 字体，统一使用系统字体栈
import DefaultTheme from 'vitepress/theme-without-fonts'
import { registerRich } from './components/rich'
import { registerAi } from './components/ai'

import Layout from './Layout.vue'
import AtlasHome from './components/atlas/AtlasHome.vue'

import './styles/tokens.css'
import './styles/base.css'
import './styles/rich.css'
import './styles/ai-rich.css'
import './styles/website.css'
import './styles/kb.css'
import './styles/atlas.css'
import LearnPage from './components/atlas/AtlasList.vue'
import CoursePage from './components/atlas/AtlasFamily.vue'
import PathsPage from './components/atlas/AtlasPaths.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 只有部分页面用到的组件按需加载：演示、提示词数据、名词表不进全站都要下载的主题脚本
    registerRich(app)
    registerAi(app)
    app.component('HomePage', AtlasHome)
    app.component('CodeTabs', defineAsyncComponent(() => import('./components/CodeTabs.vue')))
    app.component('ControlDemo', defineAsyncComponent(() => import('./components/ControlDemo.vue')))
    app.component('ControlGallery', defineAsyncComponent(() => import('./components/ControlGallery.vue')))
    app.component('PromptCard', defineAsyncComponent(() => import('./components/PromptCard.vue')))
    app.component('TechCard', defineAsyncComponent(() => import('./components/TechCard.vue')))
    app.component('ApproachCompare', defineAsyncComponent(() => import('./components/ApproachCompare.vue')))
    app.component('LearnPage', LearnPage)
    app.component('CoursePage', CoursePage)
    app.component('PathsPage', PathsPage)
    app.component('LabPage', defineAsyncComponent(() => import('./components/site/LabPage.vue')))
    app.component('GlossaryPage', defineAsyncComponent(() => import('./components/site/GlossaryPage.vue')))
  },
} satisfies Theme
