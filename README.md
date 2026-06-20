# Books Standard Core

自建轻量记账系统，替代 Xero 等云记账 SaaS。视觉参考 Xero，销售流程参考 ERPNext。

## 当前阶段：Phase 0 Mock 前端

React + shadcn/ui 实现的演示界面，使用本地 Mock 数据，无需后端。

## 快速启动

```bash
cd src/web
npm install
npm run dev
```

浏览器打开 http://localhost:5173 ，任意邮箱密码即可登录。

## 文档

- [产品说明](docs/PRODUCT.md)
- [UI 规格](docs/UI-SPEC.md)
- [API 契约草案](docs/API-CONTRACT.md)

## 技术栈

- **前端**：React 18, TypeScript, Vite, shadcn/ui, Tailwind CSS, TanStack Table, React Router
- **后端（计划）**：.NET 8, ASP.NET Core, EF Core, SQLite → PostgreSQL

## 仓库结构

```
docs/           产品与 design 文档
src/web/        React Mock 前端
src/api/        ASP.NET 后端（Phase 1，尚未实现）
```
