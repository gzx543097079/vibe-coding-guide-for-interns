import { defineConfig } from 'vitepress'

const REPO = 'https://github.com/gzx543097079/vibe-coding-guide-for-interns'
const BASE = '/vibe-coding-guide-for-interns/'

export default defineConfig({
  base: BASE,
  lang: 'zh-CN',
  title: 'Vibe Coding 开发指南',
  titleTemplate: ':title · Vibe Coding 开发指南',
  description: 'Vibe Coding 开发笔记：环境、代码、调试和交付时随手查的 108 篇笔记。',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['snippets/**'],
  // 正文还在写的章节（frontmatter status: draft）加上 is-draft 类，用于「计划覆盖」的概览版式
  transformPageData(pageData) {
    if (pageData.frontmatter.status === 'draft') {
      const cls = pageData.frontmatter.pageClass
      pageData.frontmatter.pageClass = cls ? `${cls} is-draft` : 'is-draft'
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#121417', media: '(prefers-color-scheme: dark)' }],
    // 首屏绘制前恢复侧边栏折叠状态，避免刷新时闪动
    ['script', {}, "try{if(localStorage.getItem('vcg:sidebar-collapsed')==='1')document.documentElement.classList.add('sidebar-collapsed')}catch(e){}"],
  ],
  markdown: {
    theme: { light: 'github-dark-default', dark: 'github-dark-default' },
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
      { text: '首页', link: '/' },
      { text: '目录', link: '/learn' },
      { text: '组件', link: '/lab' },
      { text: '名词', link: '/glossary' },
    ],
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
    docFooter: { prev: '上一章', next: '下一章' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '切换语言',
    skipToContentLabel: '跳到正文',
    externalLinkIcon: true,
    notFound: {
      title: '页面不存在',
      quote: '链接可能写错了，或者章节已经改名。',
      linkLabel: '回到首页',
      linkText: '回到首页',
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
