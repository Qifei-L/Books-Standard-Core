# UI 规格说明

## 设计原则

- **视觉**：参考 Xero — 干净、白底卡片、专业 SaaS 体验
- **信息架构**：ERPNext 风格 — Dashboard / Sales / Purchases / Banking / Partners / Products / Accounting / Reports
- **React 实现**：shadcn/ui + Tailwind
- **Angular 实现**：Angular Material 18

## 视觉规范

| 项 | React 版 | Angular 版 |
|----|---------|-----------|
| 主色 | `#13B5EA`（Xero 蓝） | Material Indigo |
| 页面背景 | `#F5F6F8` | `#f8f9fa` |
| 侧栏宽度 | 240px | 220px |

## 导航结构

```yaml
Dashboard: /
Sales:
  - Overview: /sales/overview
  - Quotes: /sales/quotes
  - Sales Orders: /sales/orders
  - Sales Invoices: /sales/invoices
  - Receive Payments: /sales/payments
  - Delivery Notes: /sales/delivery-notes
  - Credit Notes: /sales/credit-notes
  - Sales Reports: /sales/reports
  - Settings: /sales/settings
Purchases:
  - Bills: /purchases/bills
  - Payments Made: /purchases/payments
Banking:
  - Bank Accounts: /banking/accounts
  - Bank Reconciliation: /banking/reconciliation
Business Partners: /partners
Products & Services:
  - Items: /products/items
  - Adjust Stock: /products/adjustments
  - Price Lists: /products/price-lists
Accounting:
  - Chart of Accounts: /accounting/chart-of-accounts
  - Manual Journals: /accounting/manual-journals
Reports:
  - Trial Balance: /reports/trial-balance
  - Profit & Loss: /reports/profit-and-loss
  - Balance Sheet: /reports/balance-sheet
```

## ERPNext 销售流程

```
Partner → Quotation → Sales Order → Invoice → Payment Received
                             ↘ (可选) Sales Delivery Note → COGS / Inventory
Products → Inventory Adjustment（独立，不挂发票）
```

## 发票详情页设计

### 当前设计（Angular 版，分组 Related Documents）

```
1. 页头：发票号 + 状态 Badge + 操作按钮（Edit / Send / Void）
2. KPI 条：Issue Date / Due Date / Subtotal / Tax / Total / Amount Due
3. Line items 表格 + 税额汇总
4. Related Documents（一个 Card，四组）：
   ┌─ QUOTATION ──────────────────────────────┐
   │  QT-xxx   日期   状态 Badge              │
   ├─ SALES ORDER ────────────────────────────┤
   │  SO-xxx   日期   状态 Badge              │
   ├─ DELIVERY NOTES ──────── [Create DN]     │
   │  DN-xxx   日期   状态 Badge              │
   ├─ PAYMENTS RECEIVED ──── [Record Payment] │
   │  PAY-xxx  日期          ¥ 金额           │
   │                 Total applied  ¥ 合计    │
   └──────────────────────────────────────────┘
```

- 每组为空时显示「None」
- 操作按钮仅在有意义时出现（未发货时显示 Create DN；有余额时显示 Record Payment）
- 通用组件 `DocumentLinksSectionComponent`，接受 `groups: DocumentGroup[]`

### 旧设计（React 版，分开展示）

```
1. 面包屑 + 标题 + 状态 Badge + 操作按钮
2. KPI 条：Amount due / Total / Paid / 日期
3. Related documents（轻列表，无 Card）：
   - Source：Quote、Order 链接（有则显示）
   - Delivery：Shipment 状态 + Create delivery note + DN 链接
4. Line items 表格 + 税额汇总
5. Payments & allocations（独立 Card + 表格，含 Record payment）
```

## 列表页模式（Sales）

Invoices / Payments / Quotes / Sales Orders 共用：

- Status tabs（URL 驱动）
- Saved views 下拉
- Advanced filter（Draft + Apply）
- 分页
- 摘要行（选中视图 + 筛选条件摘要）

## 页面规格（Phase 0）

### Dashboard `/`

Widget：待办任务、KPI（Revenue / Expenses / Net Profit / Receivables / Payables）

### Quotes `/sales/quotes`

业务状态：`Draft` → `Sent` → `Accepted` → `ConvertedToInvoice`  
终态：`Declined` | `Expired` | `ConvertedToInvoice`

### Invoices `/sales/invoices`

Tab 筛选：全部 / 草稿 / 待收款 / 已收款 / 逾期。  
详情见上方发票详情页设计。

### Delivery Notes `/sales/delivery-notes`

客户发货单；billing status（not_invoiced / invoiced）；COGS 预览。  
可从 Invoice Related 区「Create delivery note」带 `?invoice=` 预填。

### Products → Adjust Stock `/products/adjustments`

盘点/调整；与发票、DN billing 无关。

### Receive Payments `/sales/payments`

分配发票部分冲 **AR**；未分配部分记 **Customer Advances**。

### Bills `/purchases/bills`

供应商账单列表。

### Bank Reconciliation `/banking/reconciliation`

左右分栏：未对账流水 | 匹配建议。

### Manual Journals `/accounting/manual-journals`

借贷行表格，实时借贷平衡校验，草稿/已过账状态。

### Trial Balance `/reports/trial-balance`

日期选择 + 科目借贷合计表。

## Phase 0 交付标准

- [x] 导航结构（含 Products、Delivery Notes）可达
- [x] Sales 列表统一壳（React）
- [x] Item + 库存单据 UI（React）
- [x] Invoice Related Documents + Payments（React，分开展示）
- [x] Angular 重构：登录 / 侧边栏 / 子导航 / 发票列表
- [x] Angular 重构：发票详情（分组 Related Documents 新设计）
- [ ] Credit Notes / Recurring 真实页面
- [ ] Angular 其余详情页 / 表单页
- [ ] 全部模块与后端 API 联调（Phase 1）
