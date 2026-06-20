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

export interface LineItem {
  id: Id
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
