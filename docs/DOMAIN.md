# 领域模型 — Item / 库存 / 销售单据

> Phase 0 Mock 约定，供 UI 与后续 Core 实现对齐。

## 概念分层

```
Partner (Customer)
    │
    ├── Quotation ──► Sales Order ──► Invoice ──► Payment (AR 结算)
    │                                      │
    │                                      └── (可选) Sales Delivery Note → COGS / Inventory
    │
    └── Item Master
            ├── Untracked → 仅 Revenue
            └── Tracked   → Inventory + COGS（通过 DN 或 Adjustment）
```

## Item

| 字段（Mock） | 说明 |
|--------------|------|
| `itemType` | `Untracked` \| `Tracked` |
| `code`, `name` | 物料编码与名称 |
| `unitPrice` | 默认销售单价 |
| `unitCost` | Tracked 成本价（DN / Adjustment 用） |
| `revenueAccountId` | 默认收入科目 |
| `inventoryAccountId` | Tracked 库存科目 |

## Invoice

- 行项目挂 **Item**（或 ad-hoc 行）；过账 **AR + Revenue + Tax**。
- 可选 `quotationId`、`salesOrderId` 记录来源。
- **Shipment 状态**（计算字段，仅 Tracked 行）：
  - `not_applicable` — 无 Tracked 行
  - `not_shipped` / `partially_shipped` / `shipped` — 对比已 Posted DN 数量
- 默认 **不强制** 先 DN 再开票；DN 为可选履约单据。

## Sales Delivery Note

- **用途**：对客户发货（出库）。
- **过账**：Dr COGS · Cr Inventory（Tracked 行）。
- **Billing status**（只在 DN 上）：
  - `not_invoiced` — 提醒可创建发票，不阻塞
  - `invoiced` — 已关联发票
- 可选 `invoiceId` 反向链接。

## Inventory Adjustment

- **用途**：盘点、损耗、样品、期初等内部库存修正。
- **入口**：Products → Adjust Stock（与 Sales 分离）。
- **规则**：永不关联 Invoice / DN billing。

## Payment

- 分配部分冲减 **AR**；未分配部分记 **Customer Advances**（负债）。
- 与 Invoice 多对多（allocations）。

## UI 关联展示约定

| 单据详情 | 关联展示方式 |
|----------|--------------|
| Invoice | Related 轻列表：Source (Quote/Order) + Delivery (Shipment/DN)；Payment 独立表格 |
| Quotation | LinkedDocs 横条 → Order / Invoice |
| Delivery Note | 发票链接 + billing badge |

实现见 `components/sales/InvoiceRelatedLinks.tsx`、`lib/stockDocuments.ts`。
