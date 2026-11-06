import { defineConfig, type DefaultTheme } from 'vitepress'
import { lines } from './theme/data/metro'

const REPO = 'https://github.com/gzx543097079/vibe-coding-guide-for-interns'
const BASE = '/vibe-coding-guide-for-interns/'

// 由线路数据生成侧边栏：每条线路一个可折叠分组，线路内的子分组再嵌套一层
function buildSidebar(): DefaultTheme.SidebarItem[] {
  return lines.map((line) => {
    const items: DefaultTheme.SidebarItem[] = []
    let current: DefaultTheme.SidebarItem | null = null
    for (const st of line.stations) {
      const item: DefaultTheme.SidebarItem = {
        text: `<span class="sb-stop" aria-hidden="true"></span><span class="sb-text">${st.title}</span>`,
        link: st.link,
        docFooterText: st.title,
      }
      if (st.group) {
        if (!current || current.text !== groupText(st.group)) {
          current = { text: groupText(st.group), collapsed: false, items: [] }
          items.push(current)
        }
        current.items!.push(item)
      } else {
        current = null
        items.push(item)
      }
    }
    return {
      text: `<span class="sb-line" data-line="${line.id}" aria-hidden="true">${line.no}</span><span class="sb-text">${line.name}</span><span class="sb-count">${line.stations.length} 站</span>`,
      collapsed: false,
      items,
    }
  })
}

function groupText(name: string) {
  return `<span class="sb-sub">${name}</span>`
}

export default defineConfig({
  base: BASE,
  lang: 'zh-CN',
  title: 'Vibe Coding 开发指南',
  titleTemplate: ':title · Vibe Coding 开发指南（实习生版）',
  description: '面向实习生的 Vibe Coding 开发指南：带着判断力使用 AI 编码助手。',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['snippets/**'],
  // 默认的链接预取会读取 <a> 的 pathname，SVG 中的 <a> 没有该属性会报错，因此关闭
  router: { prefetchLinks: false },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#f4f6f7', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#14181d', media: '(prefers-color-scheme: dark)' }],
  ],
  markdown: {
    theme: { light: 'github-light-default', dark: 'github-dark-default' },
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详情',
    },
  },
  themeConfig: {
    logo: { src: '/favicon.svg', alt: '' },
    siteTitle: 'Vibe Coding 开发指南',
    nav: [
      { text: '开始阅读', link: '/start/intro' },
      { text: '控件总览', link: '/frontend/controls' },
      { text: '提示词模板', link: '/growth/prompt-templates' },
    ],
    sidebar: {
      '/': buildSidebar(),
    },
    outline: { level: [2, 3], label: '本页目录' },
    socialLinks: [{ icon: 'github', link: REPO, ariaLabel: 'GitHub 仓库' }],
    editLink: {
      pattern: `${REPO}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页',
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
    },
    docFooter: { prev: '上一站', next: '下一站' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '切换语言',
    skipToContentLabel: '跳到正文',
    externalLinkIcon: true,
    notFound: {
      title: '这一站不存在',
      quote: '链接可能写错了，或者章节已经改名。',
      linkLabel: '回到首页',
      linkText: '回到线路图',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清除查询',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到相关结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '向上',
              navigateDownKeyAriaLabel: '向下',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc',
            },
          },
        },
      },
    },
  },
})
