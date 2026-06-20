# UI 规格说明

## 设计原则

- **视觉**：参考 Xero — 干净、白底卡片、专业 SaaS 体验
- **信息架构**：ERPNext 风格 — Dashboard / Sales / Purchases / Banking / Partners / Products / Accounting / Reports
- **实现**：React + shadcn/ui + Tailwind

## 视觉规范

| 项 | 值 |
|----|-----|
| 主色 | `#13B5EA`（Xero 蓝） |
| 页面背景 | `#F5F6F8` |
| 侧栏宽度 | 240px |

## 导航结构

```yaml
Dashboard: /
Sales:
  - Overview: /sales/overview
  - Quotes: /sales/quotes
  - Sales Orders (optional): /sales/sales-orders
  - Sales Invoices: /sales/invoices
  - Receive Payments: /sales/payments
  - Delivery Notes (optional): /sales/delivery-notes
  - Credit Notes: /sales/credit-notes
  - Recurring Invoices: /sales/recurring-invoices
  - Sales Reports: /sales/reports
  - Sales Settings: /sales/settings
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
  - Price Lists (optional): /products/price-lists
Accounting:
  - Chart of Accounts: /accounting/chart-of-accounts
  - Manual Journals: /accounting/manual-journals
Reports:
  - Trial Balance: /reports/trial-balance
  - Profit & Loss: /reports/profit-and-loss
  - Balance Sheet: /reports/balance-sheet
Settings: /settings
```

## ERPNext 销售流程

```
Partner → Quotation → Sales Order → Invoice → Payment Received
                              ↘ (可选) Sales Delivery Note → COGS / Inventory
Products → Inventory Adjustment（独立，不挂发票）
```

### 单据详情页模式

**Invoice 详情**（`/sales/invoices/:id`）：

1. 面包屑 + 标题 + 状态 Badge + 操作按钮
2. KPI 条：Amount due / Total / Paid / 日期
3. **Related documents**（轻列表，无 Card）：
   - Source：Quote、Order（有则显示）
   - Delivery：Shipment 状态、Create delivery note、DN 链接
4. Line items 表格 + 税额汇总
5. Payments & allocations 表格（含 Record payment）

**其他单据**：Quote 等仍可用页头 `LinkedDocs` 横条显示下游链接。

## 列表页模式（Sales）

Invoices / Payments / Quotes / Sales Orders 共用：

- Status tabs（URL 驱动）
- Saved views 下拉
- Advanced filter（Draft + Apply）
- 分页
- 摘要行（选中视图 + 筛选条件摘要）

## 页面规格（Phase 0）

### Dashboard `/`

Widget：待办任务、本期盈亏、现金流图、应收/应付摘要、银行账户余额。

### Quotes `/sales/quotes`

业务状态（策略 1，不含审批）：

`Draft` → `Sent` → `Accepted` → `Converted to Invoice`  
终态：`Declined` | `Expired` | `Converted to Invoice`

### Invoices `/sales/invoices`

Tab 筛选：全部 / 草稿 / 待收款 / 已收款 / 逾期。  
详情见上文 Related 轻列表 + Payments 表格。  
新建页含 Item 选择器与 Tracked 行 DN 提示。

### Delivery Notes `/sales/delivery-notes`

客户发货单；billing status（Not invoiced / Invoiced）；COGS 预览。  
可从 Invoice Related 区「Create delivery note」带 `?invoice=` 预填。

### Products → Adjust Stock `/products/adjustments`

盘点/调整；与发票、DN billing 无关。

### Receive Payments `/sales/payments`

单一收款入口：分配发票部分冲 **AR**；未分配部分记 **Customer Advances**。

Tab：All / Applied / Advances only。

### Bills `/purchases/bills`

供应商账单列表。

### Bank Reconciliation `/banking/reconciliation`

左右分栏：未对账流水 | 匹配建议。

### Manual Journals `/accounting/manual-journals`

借贷行表格，实时借贷平衡校验，草稿/已过账状态。

### Trial Balance `/reports/trial-balance`

日期选择 + 科目借贷合计表。

## Phase 0 交付标准

- [x] 新导航结构（含 Products、Delivery Notes）可达
- [x] Sales 列表统一壳
- [x] Item + 库存单据 UI
- [x] Invoice Related 轻列表
- [ ] Credit Notes / Recurring 真实页面
- [ ] 全部模块与后端 API 联调（Phase 1）
