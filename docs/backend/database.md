---
title: 常用数据库
description: 关系型与非关系型数据库、ORM、表设计、索引与迁移。
---

<RPath />

数据库选型先看**数据关系、查询方式、一致性和运维能力**。关系型数据库适合需要约束和关联的数据；文档、键值或搜索系统有各自优势，不是「非关系型就不用设计结构」。

## 表结构要表达业务约束

主键识别记录，唯一约束防止重复，外键描述引用关系，非空和检查约束保护输入边界。ORM 可以组织访问代码，但数据库仍需要约束；多个应用实例不会共享同一份内存校验。

下面的 SQLite SQL 可在独立的内存数据库中练习：

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  status TEXT NOT NULL
);
INSERT INTO orders VALUES ('demo-1', 'user-a', 1250, 'created');
SELECT id, amount_cents FROM orders WHERE user_id = 'user-a';
```

应得到一条演示订单。金额采用整数最小单位只是本例的选择，真实系统还要明确币种、精度、舍入与退款规则；不要随意用浮点数计算账务。

## 查询与索引一起设计

为实际的过滤、排序和关联模式考虑索引。索引提升部分读请求，却增加写入与存储成本；不能给每列都建一个索引再称为优化。动态输入使用参数绑定，不能拼接进 SQL。

## 数据迁移属于交付的一部分

结构变化应保存成版本化迁移，先在可恢复的测试环境验证旧数据、约束和回退条件。新增非空列时，要考虑已有记录怎样填充；删除字段前先确认调用方已经停止使用。

```text
根据当前查询方式设计订单表迁移，保留旧数据。
列出约束、索引和迁移顺序，先解释大表上的锁与耗时风险。
在测试库验证，不连接生产库，不读取真实凭据。
```

备份只有在验证能恢复之后才有实际价值。导出成功、迁移执行成功和业务数据正确，是三项不同的检查。

## 工具速查

<TechCard ids="mysql,postgresql,redis,mongodb,sqlite" />

## 相关任务模板

<PromptCard id="backend-api" />

继续查阅：[PostgreSQL 教程](https://www.postgresql.org/docs/current/tutorial.html)、[SQLite 约束](https://www.sqlite.org/lang_createtable.html)、[数据库性能](/quality/perf-database)。
