import {
  formatInvoiceDateFilterLabel,
  matchInvoiceDateFilter,
  type InvoiceDateField,
} from '@/lib/invoiceDateFilters'
import type { Payment, Quotation, SalesOrder } from '@/types'
import { getAdvanceAmount } from '@/types'
import type { SalesAdvancedQuery } from '@/lib/salesListQuery'
import { getDateFilterState, matchCustomerIds } from '@/lib/salesListQuery'

export type PaymentListTab = 'all' | 'applied' | 'advance'

export const defaultPaymentListTab: PaymentListTab = 'all'

export const paymentListTabs: { id: PaymentListTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'applied', label: 'Applied / Mixed' },
  { id: 'advance', label: 'Advances only' },
]

const validTabs = new Set<string>(paymentListTabs.map((t) => t.id))

export function parsePaymentListTab(
  raw: string | null,
  allowAdvance: boolean,
): PaymentListTab {
  if (raw === 'advance' && allowAdvance) return 'advance'
  if (raw && validTabs.has(raw) && raw !== 'advance') return raw as PaymentListTab
  return defaultPaymentListTab
}

/** Legacy ?tab=advance support */
export function parsePaymentListTabFromParams(
  searchParams: URLSearchParams,
  allowAdvance: boolean,
): PaymentListTab {
  const legacy = searchParams.get('tab')
  if (legacy === 'advance' && allowAdvance) return 'advance'
  return parsePaymentListTab(searchParams.get('status'), allowAdvance)
}

export function matchPaymentListTab(payment: Payment, tab: PaymentListTab): boolean {
  if (tab === 'all') return true
  if (tab === 'advance') return getAdvanceAmount(payment) > 0
  return payment.allocations.length > 0
}

export function matchPaymentDateFilter(
  payment: Payment,
  query: Pick<SalesAdvancedQuery, 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
) {
  return matchInvoiceDateFilter(
    {
      id: payment.id,
      number: payment.number,
      contactId: payment.contactId,
      contactName: payment.contactName,
      date: payment.date,
      dueDate: payment.date,
      status: 'Paid',
      lines: [],
      subtotal: payment.amount,
      tax: 0,
      total: payment.amount,
      amountPaid: payment.amount,
    },
    { ...getDateFilterState(query), field: 'issued' as InvoiceDateField },
  )
}

export function filterPayments(
  items: Payment[],
  tab: PaymentListTab,
  query: Pick<SalesAdvancedQuery, 'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
) {
  return items.filter(
    (p) =>
      matchCustomerIds(p, query.customerIds) &&
      matchPaymentListTab(p, tab) &&
      matchPaymentDateFilter(p, query),
  )
}

export function countPaymentsByTab(
  items: Payment[],
  query: Pick<SalesAdvancedQuery, 'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
  allowAdvance: boolean,
): Record<PaymentListTab, number> {
  const tabs = allowAdvance ? paymentListTabs : paymentListTabs.filter((t) => t.id !== 'advance')
  return Object.fromEntries(
    tabs.map((t) => [t.id, filterPayments(items, t.id, query).length]),
  ) as Record<PaymentListTab, number>
}

export type QuoteListTab = 'open' | 'all' | 'Draft' | 'Sent' | 'Accepted' | 'ConvertedToInvoice'

export const defaultQuoteListTab: QuoteListTab = 'open'

export const quoteListTabs: { id: QuoteListTab; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'all', label: 'All' },
  { id: 'Draft', label: 'Draft' },
  { id: 'Sent', label: 'Sent' },
  { id: 'Accepted', label: 'Accepted' },
  { id: 'ConvertedToInvoice', label: 'Converted' },
]

export function parseQuoteListTab(raw: string | null): QuoteListTab {
  if (raw && quoteListTabs.some((t) => t.id === raw)) return raw as QuoteListTab
  return defaultQuoteListTab
}

export function matchQuoteListTab(quote: Quotation, tab: QuoteListTab): boolean {
  if (tab === 'all') return true
  if (tab === 'open') return ['Draft', 'Sent', 'Accepted'].includes(quote.status)
  return quote.status === tab
}

export function getQuoteDateForFilter(quote: Quotation, field: InvoiceDateField): string {
  return field === 'due' ? quote.validTill : quote.date
}

export function matchQuoteDateFilter(
  quote: Quotation,
  query: Pick<SalesAdvancedQuery, 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
) {
  const state = getDateFilterState(query)
  return matchInvoiceDateFilter(
    {
      id: quote.id,
      number: quote.number,
      contactId: quote.contactId,
      contactName: quote.contactName,
      date: quote.date,
      dueDate: quote.validTill,
      status: 'Awaiting',
      lines: quote.lines,
      subtotal: quote.subtotal,
      tax: quote.tax,
      total: quote.total,
      amountPaid: 0,
    },
    state,
  )
}

export function filterQuotes(
  items: Quotation[],
  tab: QuoteListTab,
  query: Pick<SalesAdvancedQuery, 'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
) {
  return items.filter(
    (q) =>
      matchCustomerIds(q, query.customerIds) &&
      matchQuoteListTab(q, tab) &&
      matchQuoteDateFilter(q, query),
  )
}

export function countQuotesByTab(
  items: Quotation[],
  query: Pick<SalesAdvancedQuery, 'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
): Record<QuoteListTab, number> {
  return Object.fromEntries(
    quoteListTabs.map((t) => [t.id, filterQuotes(items, t.id, query).length]),
  ) as Record<QuoteListTab, number>
}

export type SalesOrderListTab = 'all' | 'Draft' | 'Submitted' | 'Cancelled'

export const defaultSalesOrderListTab: SalesOrderListTab = 'all'

export const salesOrderListTabs: { id: SalesOrderListTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Draft', label: 'Draft' },
  { id: 'Submitted', label: 'Submitted' },
  { id: 'Cancelled', label: 'Cancelled' },
]

export function parseSalesOrderListTab(raw: string | null): SalesOrderListTab {
  if (raw && salesOrderListTabs.some((t) => t.id === raw)) return raw as SalesOrderListTab
  return defaultSalesOrderListTab
}

export function matchSalesOrderListTab(order: SalesOrder, tab: SalesOrderListTab): boolean {
  if (tab === 'all') return true
  return order.status === tab
}

export function filterSalesOrders(
  items: SalesOrder[],
  tab: SalesOrderListTab,
  query: Pick<SalesAdvancedQuery, 'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
) {
  const state = getDateFilterState(query)
  return items.filter((so) => {
    if (!matchCustomerIds(so, query.customerIds)) return false
    if (!matchSalesOrderListTab(so, tab)) return false
    if (state.preset === 'any') return true
    return matchInvoiceDateFilter(
      {
        id: so.id,
        number: so.number,
        contactId: so.contactId,
        contactName: so.contactName,
        date: so.date,
        dueDate: so.date,
        status: 'Awaiting',
        lines: so.lines,
        subtotal: so.total,
        tax: 0,
        total: so.total,
        amountPaid: 0,
      },
      { ...state, field: 'issued' },
    )
  })
}

export function countSalesOrdersByTab(
  items: SalesOrder[],
  query: Pick<SalesAdvancedQuery, 'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
): Record<SalesOrderListTab, number> {
  return Object.fromEntries(
    salesOrderListTabs.map((t) => [t.id, filterSalesOrders(items, t.id, query).length]),
  ) as Record<SalesOrderListTab, number>
}

export { formatInvoiceDateFilterLabel }
