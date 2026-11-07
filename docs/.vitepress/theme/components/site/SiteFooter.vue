<script setup lang="ts">
import { withBase } from 'vitepress'
import SiteIcon from './SiteIcon.vue'
</script>
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <a class="footer-brand" :href="withBase('/')"
          ><SiteIcon name="code" />Vibe Coding 工程交付台</a
        >
        <p>从当前任务出发，验证每一个结果。</p>
      </div>
      <nav aria-label="页脚导航">
        <a :href="withBase('/learn')">全部工作区</a
        ><a :href="withBase('/growth/prompt-templates')">任务简报</a
        ><a :href="withBase('/lab')">交互验证台</a
        ><a
          href="https://github.com/gzx543097079/vibe-coding-guide-for-interns"
          target="_blank"
          rel="noopener"
          >参与共建 <SiteIcon name="arrow" :size="15"
        /></a>
      </nav>
    </div>
    <div class="footer-bottom">
      <span>内容以 MIT 协议开源</span><span>108 篇章节地址与示例代码保持可用。</span>
    </div>
  </footer>
</template>
