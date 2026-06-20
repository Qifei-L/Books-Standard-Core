# Books Standard Core — 产品说明

## 背景

Xero 等云记账 SaaS 订阅费用较高。本项目旨在自建轻量记账系统，先服务个人 / 小微企业，后续扩展为多用户 SaaS。

## 目标

| 阶段 | 目标 |
|------|------|
| **Phase 0（当前）** | Xero 风格 Mock 前端，假数据，可演示完整交互 |
| **Phase 1** | C# 账本 Core + API + SQLite |
| **Phase 2** | 前后端联调，PostgreSQL 生产部署 |
| **Phase 3** | 银行 Feed、税务、多用户、权限 |

## 设计参考

- **Xero**：视觉、首页 Widget、银行对账、报表、小微记账体验
- **ERPNext Sales**：销售流程（报价 → 订单 → 发票 → 收款）、Submit 工作流、单据关联

## Phase 0 当前能力（摘要）

详见 [Phase 0 进度](PHASE0-PROGRESS.md) 与 [领域模型](DOMAIN.md)。

- Sales 四列表统一 Views / Filter / Pagination
- Item 主数据 + 发票 Item 选择
- Sales Delivery Note 与 Inventory Adjustment **分离**
- Invoice 详情：Related 轻列表（Quote / Order / DN）+ Payments 表格

## 非目标（v0.1）

- 真实银行 Feed / 支付网关
- 多国税务申报（GST/VAT/BAS）
- 工资单（Payroll）
- 移动端原生 App

## 技术架构（方案 A：前后端分离）

```
Web (React + shadcn)  ──HTTP/JSON──►  Api (ASP.NET Core)
                                           │
                                    Core + EF Core
                                           │
                                    SQLite → PostgreSQL
```

| 层 | 技术 |
|----|------|
| 前端 | React 18, TypeScript, Vite, shadcn/ui, Tailwind, TanStack Table |
| 后端（后续） | .NET 8, ASP.NET Core Web API |
| 领域层 | Books.Standard.Core |
| ORM | EF Core |
| 鉴权（后续） | JWT Bearer |

## 仓库结构

```
Books-Standard-Core/
├── docs/           # 产品、UI、API 文档
├── src/web/        # React Mock 前端
└── src/api/        # ASP.NET 后端（Phase 1+）
```

## Phase 1 后端要点

- **Core**：`JournalEntry` 借贷必平；已过账不可改，只能冲销
- **金额**：C# `decimal` 或 `long`（分），禁止 `float`
- **数据库**：开发 SQLite，生产 PostgreSQL，EF Migrations
- **事务边界**：Application 层 `SaveChanges`
