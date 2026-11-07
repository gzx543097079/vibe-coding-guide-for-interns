---
title: 事务与并发
description: 事务隔离级别、锁、幂等与重复提交。
---

<RPath />

事务保证一组数据库操作按数据库提供的规则一起提交或回滚。**检查后再修改**在并发下可能失效：两个请求都看到库存有余量，然后分别扣减，结果越过业务约束。

## 把条件放进数据库更新

下面是可直接运行的 Python 3 / SQLite 内存示例，不连接任何外部数据库：

```python
import sqlite3

with sqlite3.connect(':memory:') as db:
    db.execute('CREATE TABLE stock (id INTEGER PRIMARY KEY, available INTEGER NOT NULL)')
    db.execute('INSERT INTO stock VALUES (1, 1)')
    db.commit()
    with db:
        changed = db.execute(
            'UPDATE stock SET available = available - 1 WHERE id = ? AND available > 0',
            (1,)
        ).rowcount
        if changed != 1:
            raise ValueError('库存不足')
    assert db.execute('SELECT available FROM stock WHERE id = 1').fetchone()[0] == 0
```

条件更新避免在应用里先读再无条件写。它只是一个单库操作示例，不是完整的订单、支付或多库库存协议。

## 隔离级别不是越高越省事

隔离级别决定并发事务能观察到哪些变化，不同数据库的具体行为需要查文档。锁、唯一约束、条件更新和必要的重试往往一起使用；提升隔离级别可能增加等待或回滚，不能忽略代价。

## 幂等处理重复请求

请求唯一标识需要绑定用户、操作和参数语义，不能只记一个随机字符串。数据库唯一约束可以防止重复写入，但还要定义处理中、成功、失败及响应丢失后的行为。不要把所有异常都返回为「重复请求成功」。

事务中尽量不做长时间网络调用；外部支付和消息不是本地回滚就能撤销的动作。测试时用多个连接或请求制造竞争，检查最终业务不变量，而不只是看每条请求各自是否返回成功。

继续查阅：[PostgreSQL 事务隔离](https://www.postgresql.org/docs/current/transaction-iso.html)、[SQLite 事务](https://www.sqlite.org/lang_transaction.html)。
