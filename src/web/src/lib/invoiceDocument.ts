import { payments } from '@/data/mock'
import { daysFromToday, formatDueLabel, invoiceBalance } from '@/lib/salesDates'
import { formatDate } from '@/lib/utils'
import type { Invoice } from '@/types'

export interface InvoiceAllocationRow {
  paymentId: string
  paymentNumber: string
  paymentDate: string
  amount: number
}

export function getInvoiceAllocations(invoiceId: string): InvoiceAllocationRow[] {
  return payments.flatMap((payment) =>
    payment.allocations
      .filter((a) => a.invoiceId === invoiceId)
      .map((a) => ({
        paymentId: payment.id,
        paymentNumber: payment.number,
        paymentDate: payment.date,
        amount: a.amount,
      })),
  )
}

export function getEffectiveAmountPaid(invoice: Invoice): number {
  const fromPayments = getInvoiceAllocations(invoice.id).reduce((s, a) => s + a.amount, 0)
  return Math.max(invoice.amountPaid, fromPayments)
}

export function getInvoiceAmounts(invoice: Invoice) {
  const amountPaid = getEffectiveAmountPaid(invoice)
  const amountDue = invoiceBalance(invoice.total, amountPaid)
  return { amountPaid, amountDue }
}

export function getInvoiceDueMeta(invoice: Invoice, amountDue: number) {
  const dueDays = daysFromToday(invoice.dueDate)
  const isOverdue = invoice.status === 'Overdue' || (amountDue > 0 && dueDays < 0)
  const dueLabel = amountDue > 0 ? formatDueLabel(dueDays, 'due') : null
  return { dueDays, isOverdue, dueLabel }
}

export interface InvoiceKpiConfig {
  amountDue: number
  amountPaid: number
  total: number
  invoiceDate: string
  dueDate: string
  isOverdue: boolean
}

export function getInvoiceKpiConfig(invoice: Invoice): InvoiceKpiConfig {
  const { amountPaid, amountDue } = getInvoiceAmounts(invoice)
  const { isOverdue } = getInvoiceDueMeta(invoice, amountDue)

  return {
    amountDue,
    amountPaid,
    total: invoice.total,
    invoiceDate: formatDate(invoice.date),
    dueDate: formatDate(invoice.dueDate),
    isOverdue,
  }
}
