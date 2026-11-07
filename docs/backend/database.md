---
status: draft
title: 常用数据库
description: 关系型与非关系型数据库、ORM、表设计、索引与迁移。
---

## 这是什么

<TechCard ids="mysql,postgresql,redis,mongodb,sqlite" />

## 用 AI 做这个方向时的提示词

::: tip 这一节还在补充
这个方向的专用模板还在整理，先放通用模板。更多场景见[场景提示词模板](/growth/prompt-templates)。
:::

<PromptCard id="backend-api" />

## 三问

答得上这三个问题，再把这个方向的任务交给 AI。下面是计划展开的要点。

### 必须先懂什么

- 主键、外键、索引的作用
- 事务与隔离级别的基本概念

### 怎么验证

- 在测试库中先执行迁移
- 检查 SQL 的执行计划

### AI 常错在哪

- 生成没有回滚方案的迁移
- 在生产环境直接执行破坏性语句
