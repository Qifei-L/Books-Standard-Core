# Books Standard Core

自建轻量记账系统，替代 Xero 等云记账 SaaS。视觉参考 Xero，销售流程参考 ERPNext。

## 当前阶段：Phase 0 Mock 前端

两套独立前端实现，共享同一套 Mock 数据和领域模型：

| 实现 | 目录 | 技术栈 | 端口 |
|------|------|--------|------|
| React（原始） | `src/web/` | React 18 + shadcn/ui + Tailwind + Vite | 5173 |
| Angular（重构） | `src/ng/` | Angular 18 + Angular Material | 4200 |

均使用本地 Mock 数据，无需后端，任意邮箱+密码即可登录。

## 快速启动

**React 版本**
```bash
cd src/web
npm install
npm run dev
# 访问 http://localhost:5173
```

**Angular 版本**
```bash
cd src/ng
npm install
ng serve
# 访问 http://localhost:4200
```

## 文档

- [产品说明](docs/PRODUCT.md)
- [UI 规格](docs/UI-SPEC.md)
- [领域模型](docs/DOMAIN.md)
- [Phase 0 进度](docs/PHASE0-PROGRESS.md)
- [API 契约草案](docs/API-CONTRACT.md)

## 技术栈

**前端 React（src/web）**
- React 18, TypeScript, Vite
- shadcn/ui, Tailwind CSS, TanStack Table, React Router

**前端 Angular（src/ng）**
- Angular 18（Standalone Components）
- Angular Material 18, Angular Router（Hash 模式）

**后端（计划，Phase 1）**
- .NET 8, ASP.NET Core, EF Core, SQLite → PostgreSQL

## 仓库结构

```
docs/           产品与设计文档
src/web/        React Mock 前端（Phase 0 原始实现）
src/ng/         Angular Mock 前端（Phase 0 重构）
src/api/        ASP.NET 后端（Phase 1，尚未实现）
```
