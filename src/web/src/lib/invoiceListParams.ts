import {
  defaultInvoiceDateFilter,
  formatInvoiceDateFilterLabel,
  matchInvoiceDateFilter,
} from '@/lib/invoiceDateFilters'
import {
  defaultInvoiceListFilter,
  matchInvoiceListFilter,
  parseInvoiceListFilter,
  type InvoiceListFilter,
} from '@/lib/invoiceListFilters'
import {
  buildSalesListParams,
  DEFAULT_SALES_PAGE_SIZE,
  getContactName,
  getContactNames,
  getDateFilterState,
  getSalesCustomerOptions,
  paginateItems,
  parseCustomerIds,
  parseSalesAdvancedQuery,
  SALES_PAGE_SIZE_OPTIONS,
  salesListUrl,
  countAdvancedFilters,
} from '@/lib/salesListQuery'
import type { Invoice } from '@/types'

export const DEFAULT_INVOICE_PAGE_SIZE = DEFAULT_SALES_PAGE_SIZE
export const INVOICE_PAGE_SIZE_OPTIONS = SALES_PAGE_SIZE_OPTIONS

export interface InvoiceListQuery {
  status: InvoiceListFilter
  customerIds: string[]
  dateField: ReturnType<typeof parseSalesAdvancedQuery>['dateField']
  datePreset: ReturnType<typeof parseSalesAdvancedQuery>['datePreset']
  dateFrom: string | null
  dateTo: string | null
  page: number
  pageSize: number
}

export const getInvoiceCustomerOptions = getSalesCustomerOptions
export const parseInvoiceCustomerIds = parseCustomerIds
export { getContactName, getContactNames, getDateFilterState, paginateItems, formatInvoiceDateFilterLabel, matchInvoiceDateFilter }

export const countAdvancedInvoiceFilters = countAdvancedFilters

export function parseInvoiceListSearchParams(searchParams: URLSearchParams): InvoiceListQuery {
  const advanced = parseSalesAdvancedQuery(searchParams)
  return {
    status: parseInvoiceListFilter(searchParams.get('status')),
    ...advanced,
  }
}

export function buildInvoiceListParams(query: InvoiceListQuery): Record<string, string> {
  return buildSalesListParams(query.status, defaultInvoiceListFilter, query)
}

export function invoicesListUrl(
  status: InvoiceListFilter = defaultInvoiceListFilter,
  customerIds: string[] = [],
): string {
  return salesListUrl('/sales/invoices', status, defaultInvoiceListFilter, customerIds)
}

export function filterInvoicesByQuery(
  items: Invoice[],
  query: Pick<
    InvoiceListQuery,
    'status' | 'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'
  >,
): Invoice[] {
  const dateState = getDateFilterState(query)
  return items.filter((inv) => {
    if (query.customerIds.length > 0 && !query.customerIds.includes(inv.contactId)) return false
    if (!matchInvoiceListFilter(inv, query.status)) return false
    if (!matchInvoiceDateFilter(inv, dateState)) return false
    return true
  })
}

export { defaultInvoiceDateFilter }
