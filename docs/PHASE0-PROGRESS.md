# Phase 0 进度说明

> 最后更新：2026-06-20

本文档记录 Mock 前端已实现能力与领域规则，便于后续 Phase 1 后端对齐。

---

## Angular 版本（src/ng）— 当前主力

Angular 18 重构版，在 React 版基础上同步实现了新的 UI 设计。

### 已完成

#### 基础脚手架
- Angular 18 Standalone Components + Angular Material 18
- Hash 路由（`/#/`），所有路由 lazy load
- AppLayout（mat-sidenav 侧边栏）、SalesLayout / ModuleLayout（tab 子导航）
- AuthService（mock，localStorage）+ AuthGuard

#### 核心数据层
- 领域类型完整移植（`core/types/index.ts`）
- Mock 数据完整移植（`core/data/mock.ts`）
- DataService、业务逻辑函数（invoice-document、stock-documents、items、utils）

#### 共享组件
- **StatusBadgeComponent** — 所有单据状态 chip（Draft/Awaiting/Paid/Overdue 等）
- **DocumentLinksSectionComponent** — 分组 Related Documents（见下方设计说明）
- **FormatDatePipe / FormatMoneyPipe**

#### 已实现页面（含真实业务逻辑）

| 页面 | 路由 |
|------|------|
| 登录 | `/login` |
| 仪表盘（KPI + 待办） | `/` |
| 发票列表 | `/sales/invoices` |
| **发票详情（新设计）** | `/sales/invoices/:id` |
| 报价单列表 | `/sales/quotes` |
| 销售订单列表 | `/sales/orders` |
| 收款列表 | `/sales/payments` |
| 发货单列表 | `/sales/delivery-notes` |
| 往来单位 | `/partners` |
| 商品列表 | `/products/items` |
| 库存调整列表 | `/products/adjustments` |
| 科目表 | `/accounting/chart-of-accounts` |
| 手工凭证列表 | `/accounting/manual-journals` |
| 账单列表 | `/purchases/bills` |
| 试算表 | `/reports/trial-balance` |

其余详情页 / 表单页为 stub（路由可达，内容待实现）。

### 核心设计变更：分组 Related Documents

**新设计**（Angular 版直接实现，React 版 stub）：发票详情 Related Documents 与 Payments 合并为一个 Card，按文档类型分四组：

```
┌─ Related Documents ─────────────────────────────┐
│ QUOTATION                                       │
│   QT-2025-001   2025-06-01   Converted          │
├─────────────────────────────────────────────────┤
│ SALES ORDER                                     │
│   SO-2025-001   2025-06-05   Submitted          │
├─────────────────────────────────────────────────┤
│ DELIVERY NOTES              [Create DN]         │
│   （无记录）                                     │
├─────────────────────────────────────────────────┤
│ PAYMENTS RECEIVED           [Record Payment]    │
│   PAY-001       2025-06-10               ¥500   │
│                       Total applied    ¥1,000   │
└─────────────────────────────────────────────────┘
```

- 有记录时显示行；无记录时显示「None」
- 操作按钮（Create DN / Record Payment）仅在需要时出现
- 通用组件 `DocumentLinksSectionComponent`，接受 `groups: DocumentGroup[]`

### 本地验证

```bash
cd src/ng && ng serve
```

推荐浏览：
- `/#/sales/invoices/inv1` — 有 Quote + Order 来源，Awaiting payment
- `/#/sales/invoices/inv2` — 已付清，有关联 DN
- `/#/sales/invoices/inv4` — Tracked 商品，Awaiting，未发货

---

## React 版本（src/web）— 参考实现

### 已实现模块

#### Sales 列表页（统一壳）

以下列表页共用 **Views / Advanced Filter / Pagination / Status Tabs** 模式：

| 页面 | 路径 |
|------|------|
| Invoices | `/sales/invoices` |
| Receive Payments | `/sales/payments` |
| Quotes | `/sales/quotes` |
| Sales Orders | `/sales/sales-orders` |

- `hooks/useSalesListPage.ts`
- `lib/salesListQuery.ts`, `lib/salesListViews.ts`, `lib/salesModuleListFilters.ts`
- 筛选面板采用 **Draft + Apply**：编辑条件后点 Apply 才写入 URL

#### 发票详情（`/sales/invoices/:id`）

- 面包屑、KPI 条（Amount due / Total / Paid / 日期）
- Related documents 轻列表（Source + Delivery 分开展示）
- Line items 表格
- Payments & allocations 表格（Card 样式，含 Record payment）

共享组件 `DocumentLinksSection`（通用 Card+Table）已在 React 版中实现。

#### Item 主数据 / 库存单据

| 类型 | 入口 | 用途 |
|------|------|------|
| Sales Delivery Note | Sales → Delivery Notes | 客户发货，动 COGS/库存 |
| Inventory Adjustment | Products → Adjust Stock | 盘点/损耗/期初 |

---

## 领域过账规则（Mock 约定，Phase 1 对齐）

1. **Invoice 批准** → AR + Revenue（+ Tax）；**不过** COGS / Inventory
2. **Sales DN 过账** → COGS + Inventory 变动；billing status 在 DN 侧
3. **Invoice shipment 状态**（软状态，仅 Tracked 行）：Not shipped / Partially / Shipped — 提示用，不阻塞
4. **Inventory Adjustment** 独立入口，不参与销售 billing

## Mock 演示数据要点

| ID | 说明 |
|----|------|
| `inv1` | 有 Quote（q1）+ Order（so1）来源，Awaiting |
| `inv2` | 已收款；关联 DN-001（已开票） |
| `inv3` | 逾期（Overdue），无关联单据 |
| `inv4` | Tracked SUV，Awaiting，未发货 — 测 Create DN 按钮 |
| `dn2` | 已发货、未开票 — 测 DN 详情 Not invoiced 提醒 |

## 待办（Phase 0 后续 / Phase 1）

- [ ] Angular：发票详情页 / 表单页（详情已实现，表单 stub）
- [ ] Angular：Quote / Order / DN / Payment 详情页
- [ ] Credit Notes、Recurring Invoices 真实页面
- [ ] 发票列表「Needs shipment」筛选
- [ ] Overview Action Queue 卡片
- [ ] 后端 API + 真实过账（Phase 1）
