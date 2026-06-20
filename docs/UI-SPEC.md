# UI 规格说明

## 设计原则

- **视觉**：参考 Xero — 干净、白底卡片、专业 SaaS 体验
- **信息架构**：ERPNext 风格 — Dashboard / Sales / Purchases / Banking / Partners / Accounting / Reports
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
    # Invoice allocation → AR; unallocated → Customer Advances (liability)
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
Purchase Bill → Payment Made
```

### 单据详情页模式（ERPNext）

- 顶栏：状态 Badge、保存、提交、创建 ▼（生成下游单据）
- 关联条：显示 Quotation / Sales Order / Payment 链接
- Items 子表：可增删行，「从报价单获取」
- Submit 后锁定，不可直接编辑

## 页面规格（Phase 0）

### Dashboard `/`

Widget：待办任务、本期盈亏、现金流图、应收/应付摘要、银行账户余额。

### Quotes `/sales/quotes`

业务状态（策略 1，不含审批）：

`Draft` → `Sent` → `Accepted` → `Converted to Invoice`  
终态：`Declined` | `Expired` | `Converted to Invoice`

- **Accepted**：客户已接受，可转 Sales Order / Invoice  
- **Converted to Invoice**：终态，关联 `linkedInvoiceId`  
- **Sent** 可直接 Convert（视为已接受）

### Invoices `/sales/invoices`

Tab 筛选：全部 / 草稿 / 待收款 / 已收款 / 逾期。编辑页含明细行表格与税额汇总。

### Receive Payments `/sales/payments`

单一收款入口：分配发票部分冲 **AR**；未分配部分记 **Customer Advances（负债 / 预收账款）**。

Tab：All / Applied / Advances only。详情页展示分录预览。

### Bills `/purchases/bills`

供应商账单列表。

### Bank Reconciliation `/banking/reconciliation`

左右分栏：未对账流水 | 匹配建议。

### Manual Journals `/accounting/manual-journals`

借贷行表格，实时借贷平衡校验，草稿/已过账状态。

### Trial Balance `/reports/trial-balance`

日期选择 + 科目借贷合计表。

## Phase 0 交付标准

- [ ] 新导航结构全部可达
- [ ] Sales / Purchases / Banking 模块边界清晰
- [ ] Business Partners 替代原 Contacts
