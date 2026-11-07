import type { App } from 'vue'
import AiLoop from './AiLoop.vue'
import AiContext from './AiContext.vue'
import AiMcpFlow from './AiMcpFlow.vue'
import AiPromptBuilder from './AiPromptBuilder.vue'
import AiNextToken from './AiNextToken.vue'
import AiPermEval from './AiPermEval.vue'
import AiRulesLayers from './AiRulesLayers.vue'
import AiToolPicker from './AiToolPicker.vue'

// 「AI 与 Agent」模块的可视化组件，样式在 styles/ai-rich.css
export function registerAi(app: App) {
  app.component('AiLoop', AiLoop)
  app.component('AiContext', AiContext)
  app.component('AiMcpFlow', AiMcpFlow)
  app.component('AiPromptBuilder', AiPromptBuilder)
  app.component('AiNextToken', AiNextToken)
  app.component('AiPermEval', AiPermEval)
  app.component('AiRulesLayers', AiRulesLayers)
  app.component('AiToolPicker', AiToolPicker)
}
