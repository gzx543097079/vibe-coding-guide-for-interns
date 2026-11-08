---
version: 1
slug: "docs-vitepress-theme-layout-vue"
primary_target: "docs/.vitepress/theme/Layout.vue"
related_targets: ["docs/.vitepress/theme/components/site/DeskHome.vue","docs/.vitepress/theme/components/site/TaskComposer.vue","docs/.vitepress/theme/styles/website.css","docs/.vitepress/theme/styles/desk.css"]
---

# 开发笔记：去掉模板化界面

范围：首页、目录、方向页、阅读路线、组件页、章节阅读外壳。用户看过上一版后要求「去掉 AI 味」；本轮只验证桌面端，1280～1600 像素。

## Direction contract

THESIS：把站点外壳写成一本普通开发笔记。标题短、入口像目录、动作写成自然句子；保留阅读、搜索、组件演示和本机记录这些实际功能。

OWN-WORLD：暖白纸面、墨色文字、浅色常驻顶栏和低饱和陶土色。中文标题用系统衬线字，列表和细线建立秩序；不用仪表盘、任务编号、图标方块、口号式说明或整齐三栏卡片。

STORY：访客打开首页就能翻目录、挑路线或接着读；进入章节后安静地看到正文、组件入口和读过标记；读完后有相关链接与前后篇，想换方向时随时回到目录。

FIRST VIEWPORT：首页左侧是一句介绍、三个按问题进入的入口和站点规模，右侧是继续阅读卡片；紧接着是目录网格，标题跨两列，方向列表在左列，路线与模板侧栏在右列。阅读页在顶栏下方保留粘性工具栏，正文标题下按需展开本页结构，正文末尾是「读完以后」和当前方向内翻页。

FORM：普通阅读网站，用户已明确要求去掉模板腔。保留 108 篇章节地址、正文、组件演示、全文搜索、本机完成记录与桌面画布切换；拒绝把内容重新包装成任务系统。seed:plain-notes-20261107。

FINISH：构建、桌面宽度视觉与交互回归、机械设计检测、独立收尾复核，以及同步后的 PRODUCT.md / DESIGN.md / .impeccable/design.json / HANDOFF.md 一并完成；按问题进入、阅读导航减负、组件行为与提示词分层、需求填写按需展开均须有真实浏览器回归；PR #4 保持开放等待审核。
