import type { Invoice } from '@/types'
import { daysFromToday, invoiceBalance, isPartiallyPaid } from '@/lib/salesDates'

export type InvoiceListFilter =
  | 'all'
  | 'draft'
  | 'awaiting'
  | 'paid'
  | 'overdue'
  | 'due-soon'
  | 'partially-paid'

export const invoiceListFilters: { id: InvoiceListFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'awaiting', label: 'Awaiting payment' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'due-soon', label: 'Due soon' },
  { id: 'partially-paid', label: 'Partially paid' },
  { id: 'paid', label: 'Paid' },
]

/** Open AR filters first, then archive-style filters */
export const invoiceListFilterGroups: { filters: InvoiceListFilter[] }[] = [
  { filters: ['awaiting', 'overdue', 'due-soon', 'partially-paid'] },
  { filters: ['all', 'draft', 'paid'] },
]

export const defaultInvoiceListFilter: InvoiceListFilter = 'awaiting'

const validFilters = new Set<string>(invoiceListFilters.map((f) => f.id))

export function parseInvoiceListFilter(raw: string | null): InvoiceListFilter {
  if (raw && validFilters.has(raw)) return raw as InvoiceListFilter
  return defaultInvoiceListFilter
}

export function matchInvoiceListFilter(inv: Invoice, filter: InvoiceListFilter): boolean {
  const balance = invoiceBalance(inv.total, inv.amountPaid)
  const days = daysFromToday(inv.dueDate)

  switch (filter) {
    case 'all':
      return true
    case 'draft':
      return inv.status === 'Draft'
    case 'awaiting':
      return inv.status === 'Awaiting' && inv.amountPaid === 0
    case 'paid':
      return inv.status === 'Paid' || balance <= 0
    case 'overdue':
      return inv.status === 'Overdue' || (balance > 0 && days < 0)
    case 'due-soon':
      return balance > 0 && days >= 0 && days <= 7 && inv.status !== 'Overdue'
    case 'partially-paid':
      return isPartiallyPaid(inv.total, inv.amountPaid)
    default:
      return true
  }
}

export function countInvoicesByListFilter(items: Invoice[]): Record<InvoiceListFilter, number> {
  const counts = {} as Record<InvoiceListFilter, number>
  for (const f of invoiceListFilters) {
    counts[f.id] = items.filter((inv) => matchInvoiceListFilter(inv, f.id)).length
  }
  return counts
}

/** Filters used on Sales Overview "Invoices to Collect" card */
export type InvoiceCollectFilter = 'all' | 'overdue' | 'due-soon' | 'awaiting' | 'partially-paid'

export const invoiceCollectFilters: { id: InvoiceCollectFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'due-soon', label: 'Due soon' },
  { id: 'awaiting', label: 'Awaiting payment' },
  { id: 'partially-paid', label: 'Partially paid' },
]

export function matchInvoiceCollectFilter(inv: Invoice, filter: InvoiceCollectFilter): boolean {
  const balance = invoiceBalance(inv.total, inv.amountPaid)
  if (balance <= 0) return false
  const days = daysFromToday(inv.dueDate)
  switch (filter) {
    case 'all':
      return inv.status !== 'Paid'
    case 'overdue':
      return inv.status === 'Overdue' || days < 0
    case 'due-soon':
      return days >= 0 && days <= 7 && inv.status !== 'Overdue'
    case 'awaiting':
      return inv.status === 'Awaiting' && inv.amountPaid === 0
    case 'partially-paid':
      return isPartiallyPaid(inv.total, inv.amountPaid)
    default:
      return true
  }
}

/** Map overview collect filter to list page URL status param */
export function collectFilterToListParam(filter: InvoiceCollectFilter): InvoiceListFilter {
  if (filter === 'all') return 'awaiting'
  return filter
}
