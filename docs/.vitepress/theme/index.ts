import type { Theme } from 'vitepress'
// 不引入默认主题自带的 Inter 字体，统一使用系统字体栈
import DefaultTheme from 'vitepress/theme-without-fonts'
import { registerRich } from './components/rich'
import { registerAi } from './components/ai'

import Layout from './Layout.vue'
import KnowledgeHome from './components/site/KnowledgeHome.vue'
import CodeTabs from './components/CodeTabs.vue'
import ControlDemo from './components/ControlDemo.vue'
import ControlGallery from './components/ControlGallery.vue'
import PromptCard from './components/PromptCard.vue'
import TechCard from './components/TechCard.vue'
import ApproachCompare from './components/ApproachCompare.vue'

import './styles/tokens.css'
import './styles/base.css'
import './styles/rich.css'
import './styles/ai-rich.css'
import './styles/website.css'
import './styles/desk.css'
import './styles/kb.css'
import LearnPage from './components/site/LearnPage.vue'
import CoursePage from './components/site/CoursePage.vue'
import PathsPage from './components/site/PathsPage.vue'
import LabPage from './components/site/LabPage.vue'
import GlossaryPage from './components/site/GlossaryPage.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    registerRich(app)
    registerAi(app)
    app.component('HomePage', KnowledgeHome)
    app.component('CodeTabs', CodeTabs)
    app.component('ControlDemo', ControlDemo)
    app.component('ControlGallery', ControlGallery)
    app.component('PromptCard', PromptCard)
    app.component('TechCard', TechCard)
    app.component('ApproachCompare', ApproachCompare)
    app.component('LearnPage', LearnPage)
    app.component('CoursePage', CoursePage)
    app.component('PathsPage', PathsPage)
    app.component('LabPage', LabPage)
    app.component('GlossaryPage', GlossaryPage)
  },
} satisfies Theme
