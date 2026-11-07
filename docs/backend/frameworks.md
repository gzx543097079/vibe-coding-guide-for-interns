---
title: 后端语言与框架
description: Spring Boot、Express / NestJS、FastAPI / Django、Go 等。
---

<RPath />

后端接收请求，验证身份和输入，执行业务规则，读写数据并返回结果。选语言和框架时先看**已有团队能力、部署环境和业务约束**，不根据一个性能榜单推翻现有工程。

## 常见技术栈怎样定位

| 技术栈 | 常见组织方式 | 开始阅读的入口 |
| --- | --- | --- |
| Java / Kotlin 与 Spring Boot | 依赖注入、配置和业务分层 | 启动类、控制器、服务与配置 |
| Node.js 与 Express / NestJS | 路由、中间件或模块与依赖注入 | scripts、应用入口和路由模块 |
| Python 与 FastAPI / Django | 类型化接口或较完整的 Web 体系 | 应用配置、路由、模型与迁移 |
| Go 与标准库或 Web 框架 | 显式依赖、处理函数与服务组织 | main、路由注册和业务包 |

框架替你组织通用能力，不会自动提供正确的业务鉴权、事务边界或容量规划。异步写法也不保证所有调用都不阻塞。

## 用标准库理解一次请求

下面保存成 `server.py`，用 Python 3 运行；它只监听本机，不是生产服务模板：

```python
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        code = 200 if self.path == '/health' else 404
        body = json.dumps({'ok': code == 200}).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    HTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
```

另开终端访问 `http://127.0.0.1:8765/health` 应返回成功；其他路径应为 404。按 Ctrl+C 停止自己启动的服务。标准库演示帮助理解 HTTP，正式服务仍需成熟的运行环境和应用配置。

## 让 Codex 沿用现有工程

提供路由入口、一个相近接口和运行命令，要求补齐输入校验、错误响应和测试。不要同时新增框架、替换 ORM 和重做认证；先实现一个能完整验证的请求流程。

## 工具速查

<TechCard ids="spring-boot,java,nodejs,express,nestjs,python,fastapi,django,go" />

## 相关任务模板

<PromptCard id="backend-api" />

继续查阅：[Spring Boot](https://docs.spring.io/spring-boot/)、[Express](https://expressjs.com/)、[FastAPI](https://fastapi.tiangolo.com/)、[Go HTTP](https://pkg.go.dev/net/http)、[Python http.server](https://docs.python.org/3/library/http.server.html)。
