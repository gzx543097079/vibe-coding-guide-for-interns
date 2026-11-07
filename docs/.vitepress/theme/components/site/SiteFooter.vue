<script setup lang="ts">
import { withBase } from 'vitepress'
import SiteIcon from './SiteIcon.vue'
</script>
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <a class="footer-brand" :href="withBase('/')"
          ><SiteIcon name="code" />Vibe Coding 开发笔记</a
        >
        <p>写代码时，随手翻两页。</p>
      </div>
      <nav aria-label="页脚导航">
        <a :href="withBase('/learn')">目录</a
        ><a :href="withBase('/growth/prompt-templates')">需求模板</a
        ><a :href="withBase('/lab')">组件演示</a
        ><a
          href="https://github.com/gzx543097079/vibe-coding-guide-for-interns"
          target="_blank"
          rel="noopener"
          >参与共建 <SiteIcon name="arrow" :size="15"
        /></a>
      </nav>
    </div>
    <div class="footer-bottom">
      <span>内容以 MIT 协议开源</span><span>108 篇，网址一直有效。</span>
    </div>
  </footer>
</template>
