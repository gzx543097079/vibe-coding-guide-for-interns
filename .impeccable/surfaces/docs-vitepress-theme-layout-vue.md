---
version: 1
slug: "docs-vitepress-theme-layout-vue"
primary_target: "docs/.vitepress/theme/Layout.vue"
related_targets: ["docs/.vitepress/theme/components/site/DeskHome.vue","docs/.vitepress/theme/components/site/TaskComposer.vue","docs/.vitepress/theme/styles/website.css","docs/.vitepress/theme/styles/desk.css"]
---

# 工程交付台重构

范围：首页、工作区目录、领域工作区、任务线、交互验证台、章节阅读外壳。用户要求检查不符合操作习惯的行为，并明确「别让项目像知识库」；本轮只验证桌面端，1280～1600 像素。

## Direction contract

THESIS：把网站从知识库式浏览改成能继续手上任务的工作台。首页恢复当前任务并写出验收，阅读页保留验证与完成路径，工作区和工具按动作组织。

OWN-WORLD：深灰绿常驻工作栏、浅暖灰工作画布、任务状态绿与紧凑直角面板。信息组织、固定工作栏、粘性任务条和可操作字段承担视觉个性；不用海报标题、卡片墙、倾斜装饰或拟物终端。

STORY：访客打开首页就知道上次停在哪一步；进入章节后随时能看到当前任务、动手验证和完成标记；读完后按验证、检查、记录三步收尾；想换方向时再进入工作区目录或任务线。

FIRST VIEWPORT：工作台左侧是任务导向标题与说明，右侧是当前任务、本机进度和继续按钮；紧接着露出四个领域入口。阅读页在顶栏下方保留粘性任务条，正文末尾是三步收尾和当前工作区内翻页。

FORM：第 4 个方向，精密工程工作台，用户已委托按设计者风格重构。保留高密度清晰信息、可追踪位置、真实组件验证与全量章节地址；拒绝与任务无关的装饰外观。seed:2b41190276adc2c5。

FINISH：构建、桌面宽度视觉与交互回归、机械设计检测、独立收尾复核，以及同步后的 DESIGN.md / .impeccable/design.json 一并完成。
