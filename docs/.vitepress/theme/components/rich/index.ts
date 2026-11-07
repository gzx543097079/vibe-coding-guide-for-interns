import type { App } from 'vue'
import RPath from './RPath.vue'
import RPoints from './RPoints.vue'
import RPoint from './RPoint.vue'
import RAsk from './RAsk.vue'
import RCompare from './RCompare.vue'
import RSteps from './RSteps.vue'
import RStep from './RStep.vue'
import RTerm from './RTerm.vue'
import REditorAgent from './REditorAgent.vue'
import RFolderTree from './RFolderTree.vue'
import RTbd from './RTbd.vue'

// 章节富组件：在 Markdown 里直接使用，样式在 styles/rich.css
export function registerRich(app: App) {
  app.component('RPath', RPath)
  app.component('RPoints', RPoints)
  app.component('RPoint', RPoint)
  app.component('RAsk', RAsk)
  app.component('RCompare', RCompare)
  app.component('RSteps', RSteps)
  app.component('RStep', RStep)
  app.component('RTerm', RTerm)
  app.component('REditorAgent', REditorAgent)
  app.component('RFolderTree', RFolderTree)
  app.component('RTbd', RTbd)
}
