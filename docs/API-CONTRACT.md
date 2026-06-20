# API 契约草案

> Phase 0 不实现。供 Phase 1 前后端联调对齐。

## 约定

- Base URL：`/api`
- 认证：`Authorization: Bearer <jwt>`
- 日期：ISO `YYYY-MM-DD`
- 金额：两位小数的 number
- ID：UUID 字符串
- 错误：RFC 7807 ProblemDetails

## 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/login` | 登录 |
| GET | `/dashboard` | 首页聚合 |
| GET/POST | `/contacts` | 联系人 |
| GET/POST/PATCH | `/quotations` | 报价单 |
| POST | `/quotations/{id}/submit` | 提交报价 |
| POST | `/quotations/{id}/convert-to-order` | 转销售订单 |
| GET/POST | `/sales-orders` | 销售订单 |
| GET/POST/PATCH | `/invoices` | 发票 |
| POST | `/invoices/{id}/submit` | 提交发票 |
| GET/POST | `/payments` | 收款 |
| GET/POST | `/bills` | 账单 |
| GET/POST | `/accounts` | 科目 |
| GET/POST | `/journal-entries` | 分录 |
| POST | `/journal-entries/{id}/post` | 过账 |
| GET | `/bank-accounts/{id}/transactions` | 银行流水 |
| POST | `/bank-reconciliation/match` | 对账匹配 |
| GET | `/reports/trial-balance?asOf=` | 试算平衡 |
| GET | `/reports/profit-and-loss?from=&to=` | 损益表 |
| GET | `/reports/balance-sheet?asOf=` | 资产负债表 |

## 核心 DTO 示例

### CreateJournalEntryRequest

```json
{
  "date": "2025-06-20",
  "narration": "Office supplies",
  "lines": [
    { "accountId": "uuid", "debit": 100.00, "credit": 0 },
    { "accountId": "uuid", "debit": 0, "credit": 100.00 }
  ]
}
```

### InvoiceDto

```json
{
  "id": "uuid",
  "number": "INV-001",
  "contactId": "uuid",
  "contactName": "Acme Ltd",
  "date": "2025-06-01",
  "dueDate": "2025-06-15",
  "status": "Awaiting",
  "lines": [
    { "description": "Consulting", "quantity": 1, "unitPrice": 1000, "amount": 1000 }
  ],
  "subtotal": 1000,
  "tax": 100,
  "total": 1100
}
```

### PaymentRequest

```json
{
  "contactId": "uuid",
  "date": "2025-06-18",
  "amount": 1100,
  "allocations": [
    { "invoiceId": "uuid", "amount": 1100 }
  ]
}
```
