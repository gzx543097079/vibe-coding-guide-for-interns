import { defineConfig } from 'vitepress'
import { totalChapters } from './theme/data/modules'

const REPO = 'https://github.com/gzx543097079/vibe-coding-guide-for-interns'
const BASE = '/vibe-coding-guide-for-interns/'
const SITE = 'https://gzx543097079.github.io'
const NAME = 'Vibe Coding 开发指南'
const DESCRIPTION = `Vibe Coding 开发笔记：环境、代码、调试和交付时随手查的 ${totalChapters} 篇笔记。`

export default defineConfig({
  base: BASE,
  lang: 'zh-CN',
  title: 'Vibe Coding 开发指南',
  titleTemplate: ':title · Vibe Coding 开发指南',
  description: DESCRIPTION,
  sitemap: { hostname: SITE + BASE },
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
  // 每页的分享卡片信息和规范地址
  transformHead({ pageData }) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = SITE + BASE + path
    const home = pageData.relativePath === 'index.md'
    const title = home || !pageData.title ? NAME : `${pageData.title} · ${NAME}`
    const description = pageData.description || pageData.frontmatter.description || DESCRIPTION
    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: home ? 'website' : 'article' }],
      ['meta', { property: 'og:site_name', content: NAME }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: `${SITE}${BASE}og.png` }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ]
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#121417', media: '(prefers-color-scheme: dark)' }],
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
