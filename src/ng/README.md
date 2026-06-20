# Books Standard Core — Angular 前端

Angular 18 重构版本，与 `src/web/`（React）功能对等，同时直接实现了新的「分组 Related Documents」设计。

## 技术栈

| 层 | 选型 |
|----|------|
| 框架 | Angular 18，全 Standalone Components（无 NgModule） |
| UI 库 | Angular Material 18 |
| 路由 | Angular Router，Hash 模式（`/#/`） |
| 状态 | Injectable Service + Signals，无 NgRx |
| 样式 | Angular Material Theming（SCSS），无 Tailwind |
| 数据 | Phase 0 本地 Mock，无后端 |

## 快速启动

```bash
cd src/ng
npm install
ng serve
# 访问 http://localhost:4200
# 任意邮箱 + 任意密码登录
```

## 目录结构

```
src/app/
├── core/
│   ├── auth/          # AuthService（mock）+ AuthGuard
│   ├── data/          # mock.ts + DataService
│   ├── lib/           # invoice-document.ts / stock-documents.ts / utils.ts / items.ts
│   ├── navigation.ts  # 侧边栏 & 子导航配置
│   └── types/         # 领域类型（与 src/web 对齐）
├── shared/
│   ├── components/
│   │   ├── status-badge/            # 各状态 chip
│   │   └── document-links-section/  # 分组 Related Documents 组件
│   └── pipes/                       # FormatDate / FormatMoney
├── layout/
│   ├── app-layout/      # 主 Shell（mat-sidenav + 侧边栏）
│   ├── sales-layout/    # Sales 子导航（mat-tab-nav-bar）
│   └── module-layout/   # 通用模块子导航
└── features/
    ├── auth/            # 登录页
    ├── dashboard/       # 仪表盘
    ├── sales/           # invoices / quotes / orders / payments / delivery-notes
    ├── purchases/
    ├── banking/
    ├── products/
    ├── accounting/
    ├── reports/
    └── partners/
```

## 核心设计：分组 Related Documents

发票详情页将 Related Documents 和 Payments 合并为一个 Card，分四组展示：

```
┌─ Related Documents ────────────────────────────┐
│ QUOTATION                                      │
│   QT-2025-001   2025-06-01   Converted         │
├────────────────────────────────────────────────┤
│ SALES ORDER                                    │
│   SO-2025-001   2025-06-05   Submitted         │
├────────────────────────────────────────────────┤
│ DELIVERY NOTES              [Create DN]        │
│   （空）                                        │
├────────────────────────────────────────────────┤
│ PAYMENTS RECEIVED           [Record Payment]   │
│   （空）                                        │
└────────────────────────────────────────────────┘
```

组件：`shared/components/document-links-section/`，接受 `groups: DocumentGroup[]` 输入。

## 路由页面实现状态

| 路由 | 状态 |
|------|------|
| `/login` | ✅ 真实登录表单 |
| `/` | ✅ Dashboard（KPI + 待办） |
| `/sales/invoices` | ✅ mat-table 列表 |
| `/sales/invoices/:id` | ✅ 详情（KPI + 行项目 + 分组 Related Docs） |
| `/sales/quotes` | ✅ 列表 |
| `/sales/orders` | ✅ 列表 |
| `/sales/payments` | ✅ 列表 |
| `/sales/delivery-notes` | ✅ 列表 |
| `/products/items` | ✅ 列表 |
| `/products/adjustments` | ✅ 列表 |
| `/accounting/chart-of-accounts` | ✅ 列表 |
| `/accounting/manual-journals` | ✅ 列表 |
| `/partners` | ✅ 列表 |
| `/reports/trial-balance` | ✅ 列表 |
| `/purchases/bills` | ✅ 列表 |
| 其余详情/表单页 | 🚧 Stub（coming soon） |
