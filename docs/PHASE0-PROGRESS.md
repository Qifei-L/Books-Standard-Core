# Phase 0 进度说明

> 最后更新：2025-06-20

本文档记录 Mock 前端已实现能力与领域规则，便于后续 Phase 1 后端对齐。

## 已实现模块

### Sales 列表页（统一壳）

以下列表页共用 **Views / Advanced Filter / Pagination / Status Tabs** 模式：

| 页面 | 路径 |
|------|------|
| Invoices | `/sales/invoices` |
| Receive Payments | `/sales/payments` |
| Quotes | `/sales/quotes` |
| Sales Orders | `/sales/sales-orders` |

相关代码：

- `hooks/useSalesListPage.ts`
- `lib/salesListQuery.ts`, `lib/salesListViews.ts`, `lib/salesModuleListFilters.ts`
- `components/sales/SalesAdvancedFilter.tsx`, `SalesListViewsMenu.tsx`, `SalesListSummary.tsx`

筛选面板采用 **Draft + Apply**：编辑条件后点 Apply 才写入 URL，避免误触。

### 发票详情

路径：`/sales/invoices/:id`

- 面包屑、KPI 条（Amount due / Total / Paid / 日期）
- **Related documents** 轻列表（无 Card）：
  - **Source**：Quote、Order 链接（有则显示）
  - **Delivery**：Shipment 状态 + Create delivery note；已关联 DN 链接
- Line items 表格（Item 代码、收入科目、Tracked 标记）
- **Payments & allocations** 表格（保留 Card + 表格，含 Record payment）

组件：`components/sales/invoice/`（统一只读发票展示）

| 组件 | 职责 |
|------|------|
| `InvoiceDocumentView` | 只读发票整体布局（组合入口） |
| `InvoiceDetailHeader` | 编号、状态、客户、到期 |
| `InvoiceKpiStrip` | Amount due / Total / Paid / 日期 |
| `InvoiceRelatedLinks` | Source + Delivery 轻列表 |
| `InvoiceLineItemsTable` | 行项目表格 + `LineItemTotals` |
| `InvoicePaymentsSection` | 收款分配表格 |

数据/helpers：`lib/invoiceDocument.ts`（allocations、amount due、KPI 配置）

新建页 `/sales/invoices/new` 行项目合计复用 `LineItemTotals`。

### Item 主数据

路径：

- `/products/items` — 列表
- `/products/items/new`, `/products/items/:id`, `/products/items/:id/edit` — 新建/详情/编辑

Item 类型：

- **Untracked** — 服务/非库存，仅挂发票收入
- **Tracked** — 库存商品，发货过 DN 才动库存与 COGS

发票新建页 `/sales/invoices/new` 支持 Item 选择器；含 Tracked 行时提示可创建 Delivery Note。

### 库存单据（两类分离）

| 类型 | 入口 | 用途 | 与发票关系 |
|------|------|------|------------|
| **Sales Delivery Note** | Sales → Delivery Notes | 客户发货，Dr COGS · Cr Inventory | 可选关联发票；有 billing status |
| **Inventory Adjustment** | Products → Adjust Stock | 盘点/损耗/期初等 | **永不**关联发票 |

路径：

- DN：`/sales/delivery-notes`, `/sales/delivery-notes/new`, `/sales/delivery-notes/:id`
- Adjustment：`/products/adjustments`, `/products/adjustments/new`, `/products/adjustments/:id`

### 领域过账规则（Mock 约定）

1. **Invoice 批准** → AR + Revenue（+ Tax）；**不过** COGS / Inventory。
2. **Sales DN 过账** → COGS + Inventory 变动；billing status 仅在 DN 侧（`not_invoiced` / `invoiced`）。
3. **Invoice shipment 状态**（软状态，仅 Tracked 行）：Not shipped / Partially / Shipped — 提示用，不阻塞开票/收款。
4. **Inventory Adjustment** 独立入口，不参与销售 billing。

### Mock 演示数据要点

| ID | 说明 |
|----|------|
| `inv1` | 有 Quote + Order 来源 |
| `inv2` | 已收款；关联 DN-001（已开票） |
| `inv4` | Tracked SUV，Awaiting，**未发货** — 测 Delivery 轻列表 |
| `dn2` | 已发货、**未开票** — 测 DN 详情 Not invoiced 提醒 |

### 其他

- Sales Overview（Action Queue、待收款等 Widget）
- 文档模板（Templates / Print preview）
- Settings 面板（Sales 功能开关）
- 主题与布局 refresh（semantic colors、ModuleSubNav）

## 待办（Phase 0 后续 / Phase 1）

- [ ] Credit Notes、Recurring Invoices 真实页面
- [ ] Overview「未开票发货单」Action Queue 卡片
- [ ] 发票列表「Needs shipment」筛选
- [ ] 后端 API + 真实过账

## 本地验证

```bash
cd src/web
npm install
npm run build
npm run dev
```

建议浏览：

- `/sales/invoices/inv1` — Source 轻列表
- `/sales/invoices/inv4` — Delivery Not shipped + Create DN
- `/sales/delivery-notes/dn2` — 未开票 DN
- `/products/adjustments` — 库存调整
