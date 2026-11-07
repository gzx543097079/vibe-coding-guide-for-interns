---
version: 1
slug: "docs-vitepress-theme-layout-vue"
primary_target: "docs/.vitepress/theme/Layout.vue"
related_targets: ["docs/.vitepress/theme/components/HomePage.vue","docs/.vitepress/theme/styles/website.css"]
---

# 学习平台与工具实验室重设计

范围：首页、课程中心、模块课程页、学习路线、组件实验室、章节阅读外壳。用户确认学习平台与工具网站结合；本轮只验证桌面端，1280～1600 像素。

## Direction contract

THESIS：把开发指南变成能发现课程、选择路线、操作组件和持续学习的网站；首页与阅读页不再共享全站 108 章侧栏。

OWN-WORLD：社区技术公开课的节目册与作品展。冷白、深蓝黑、钴蓝组成清晰的大区域，薄荷色标记可操作状态；无衬线字体、大标题、宽内容舞台、实操面板和可筛选的课程构成统一语言。

STORY：访客先理解学习目标，选择课程或进入实验室；打开章节后知道所在课程和下一步；阅读记录只保存在本地。

FIRST VIEWPORT：首页为横向导航，左侧大标题与两个明确入口，右侧是能真正切换状态的组件预览；下方首个课程专题在首屏露出。阅读页采用当前课程侧栏、安静正文、页内目录与完成操作。

FORM：第 4 个方向，社区技术公开课节目册。用户选择「1+3」，将学习平台与工具实验室结合；保留高密度清晰信息、分阶段深入与可追踪位置，拒绝与主题无关的拟物外观。seed:7bd0a83090bda7fb。

FINISH：unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
