<script setup lang="ts">
import { withBase } from 'vitepress'
import { modules } from '../data/modules'

// 404：说明原因，给出回目录、搜索和按方向直达的入口
const openPalette = () => window.dispatchEvent(new CustomEvent('vcg:palette'))
</script>

<template>
  <div class="at-nf">
    <header class="at-head">
      <div class="at-tile"><span class="n">404</span><span>不在表里</span></div>
      <div>
        <h1>这个页面不存在</h1>
        <p class="deck">链接可能写错了，或者章节已经改名。可以搜索章节标题，或者从下面的方向重新进入。</p>
      </div>
    </header>
    <div class="at-nf-actions">
      <a class="solid" :href="withBase('/')">回到整张表</a>
      <button type="button" @click="openPalette">搜索章节 <kbd>⌘ K</kbd></button>
    </div>
    <nav class="at-famindex wide" aria-label="全部方向">
      <a v-for="m in modules" :key="m.id" :data-fam="m.no" :href="withBase('/courses/' + m.id)">
        <b>{{ m.no }}</b><span>{{ m.name }}</span><small>{{ m.chapters.length }}</small>
      </a>
    </nav>
  </div>
</template>
