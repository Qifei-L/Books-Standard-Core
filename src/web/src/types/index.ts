export type Id = string
export type Money = number
export type DateISO = string

export type DocStatus = 'Draft' | 'Submitted' | 'Cancelled'
export type InvoiceStatus = 'Draft' | 'Awaiting' | 'Paid' | 'Overdue'
export type QuotationStatus =
  | 'Draft'
  | 'Sent'
  | 'Accepted'
  | 'Declined'
  | 'Expired'
  | 'ConvertedToInvoice'

export interface Quotation {
  id: Id
  number: string
  contactId: Id
  contactName: string
  date: DateISO
  validTill: DateISO
  status: QuotationStatus
  lines: LineItem[]
  subtotal: Money
  tax: Money
  total: Money
  linkedSalesOrderId?: Id
  linkedInvoiceId?: Id
}

export interface Contact {
  id: Id
  name: string
  type: 'Customer' | 'Supplier' | 'Both'
  email?: string
  balance: Money
}

export interface Account {
  id: Id
  code: string
  name: string
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
  balance: Money
}

export type ItemType = 'Untracked' | 'Tracked'

export interface Item {
  id: Id
  code: string
  name: string
  description?: string
  itemType: ItemType
  salesAccountId: Id
  defaultUnitPrice: Money
  taxRateLabel: string
  /** Tracked only — stock asset account */
  inventoryAccountId?: Id
  /** Tracked only — COGS account (posted via delivery note) */
  cogsAccountId?: Id
  /** Tracked only — average unit cost for display */
  unitCost?: Money
  quantityOnHand?: number
  isActive: boolean
}

export type StockDocumentStatus = 'Draft' | 'Posted'

/** Sales shipment to customer — may link to invoice; posts COGS */
export type SalesDeliveryNoteBillingStatus = 'not_invoiced' | 'partially_invoiced' | 'invoiced'

export interface StockMovementLine {
  id: Id
  itemId: Id
  itemCode: string
  description: string
  quantity: number
  unitCost: Money
}

export interface SalesDeliveryNote {
  id: Id
  number: string
  date: DateISO
  contactId?: Id
  contactName?: string
  invoiceId?: Id
  invoiceNumber?: string
  billingStatus: SalesDeliveryNoteBillingStatus
  status: StockDocumentStatus
  lines: StockMovementLine[]
}

export type InventoryAdjustmentReason =
  | 'stocktake'
  | 'damage'
  | 'sample'
  | 'opening'
  | 'other'

/** Stock correction — never links to invoice; adjustment GL (not sales COGS flow in UI) */
export interface InventoryAdjustment {
  id: Id
  number: string
  date: DateISO
  reason: InventoryAdjustmentReason
  narration?: string
  status: StockDocumentStatus
  lines: StockMovementLine[]
}

export type InvoiceShipmentStatus = 'not_applicable' | 'not_shipped' | 'partially_shipped' | 'shipped'

export interface LineItem {
  id: Id
  itemId?: Id
  itemCode?: string
  revenueAccountId?: Id
  description: string
  quantity: number
  unitPrice: Money
  amount: Money
}

export interface SalesOrder {
  id: Id
  number: string
  contactId: Id
  contactName: string
  date: DateISO
  status: DocStatus
  quotationId?: Id
  lines: LineItem[]
  total: Money
}

export interface Invoice {
  id: Id
  number: string
  contactId: Id
  contactName: string
  date: DateISO
  dueDate: DateISO
  status: InvoiceStatus
  quotationId?: Id
  salesOrderId?: Id
  lines: LineItem[]
  subtotal: Money
  tax: Money
  total: Money
  amountPaid: Money
}

export interface Payment {
  id: Id
  number: string
  contactId: Id
  contactName: string
  date: DateISO
  amount: Money
  allocations: { invoiceId: Id; invoiceNumber: string; amount: Money }[]
  /** Unallocated portion posted to Customer Advances (liability). Computed if omitted. */
  advanceAmount?: Money
}

export type PaymentKind = 'Applied' | 'Advance' | 'Mixed'

export function getPaymentKind(payment: Payment): PaymentKind {
  const allocated = payment.allocations.reduce((s, a) => s + a.amount, 0)
  const advance = payment.advanceAmount ?? payment.amount - allocated
  if (allocated > 0 && advance > 0) return 'Mixed'
  if (advance > 0 && allocated === 0) return 'Advance'
  return 'Applied'
}

export function getAdvanceAmount(payment: Payment): Money {
  const allocated = payment.allocations.reduce((s, a) => s + a.amount, 0)
  return payment.advanceAmount ?? Math.max(0, payment.amount - allocated)
}

export interface Bill {
  id: Id
  number: string
  contactName: string
  date: DateISO
  dueDate: DateISO
  total: Money
  status: InvoiceStatus
}

export interface JournalLine {
  id: Id
  accountId: Id
  accountCode: string
  accountName: string
  debit: Money
  credit: Money
}

export interface JournalEntry {
  id: Id
  date: DateISO
  narration: string
  status: 'Draft' | 'Posted'
  lines: JournalLine[]
}

export interface BankAccount {
  id: Id
  name: string
  balance: Money
  feedBalance: Money
}

export interface BankTransaction {
  id: Id
  bankAccountId: Id
  date: DateISO
  description: string
  amount: Money
  reconciled: boolean
}

export interface TrialBalanceRow {
  accountCode: string
  accountName: string
  debit: Money
  credit: Money
}

export interface DashboardTask {
  id: Id
  type: 'reconcile' | 'invoice' | 'bill'
  title: string
  link: string
}

export interface CashFlowPoint {
  month: string
  cashIn: Money
  cashOut: Money
}
