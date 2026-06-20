import { contacts } from '@/data/mock'
import {
  defaultInvoiceDateFilter,
  type InvoiceDateField,
  type InvoiceDateFilterState,
  type InvoiceDatePreset,
  parseInvoiceDateField,
  parseInvoiceDatePreset,
  parseIsoDateParam,
} from '@/lib/invoiceDateFilters'

export const DEFAULT_SALES_PAGE_SIZE = 25
export const SALES_PAGE_SIZE_OPTIONS = [25, 50, 100] as const

export interface SalesAdvancedQuery {
  customerIds: string[]
  dateField: InvoiceDateField
  datePreset: InvoiceDatePreset
  dateFrom: string | null
  dateTo: string | null
  page: number
  pageSize: number
}

export function getSalesCustomerOptions() {
  return contacts.filter((c) => c.type === 'Customer' || c.type === 'Both')
}

export function parseCustomerIds(searchParams: URLSearchParams): string[] {
  const multi = searchParams.get('customers')
  if (multi) {
    return multi
      .split(',')
      .map((id) => id.trim())
      .filter((id) => contacts.some((c) => c.id === id))
  }
  const single = searchParams.get('customer')
  if (single && contacts.some((c) => c.id === single)) return [single]
  return []
}

export function getContactName(contactId: string): string | null {
  return contacts.find((c) => c.id === contactId)?.name ?? null
}

export function getContactNames(contactIds: string[]): string[] {
  return contactIds.map((id) => getContactName(id)).filter((n): n is string => Boolean(n))
}

function parsePositiveInt(raw: string | null, fallback: number, allowed?: readonly number[]): number {
  if (!raw) return fallback
  const n = parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) return fallback
  if (allowed && !allowed.includes(n as (typeof allowed)[number])) return fallback
  return n
}

export function parseSalesAdvancedQuery(searchParams: URLSearchParams): SalesAdvancedQuery {
  return {
    customerIds: parseCustomerIds(searchParams),
    dateField: parseInvoiceDateField(searchParams.get('dateField')),
    datePreset: parseInvoiceDatePreset(searchParams.get('datePreset')),
    dateFrom: parseIsoDateParam(searchParams.get('from')),
    dateTo: parseIsoDateParam(searchParams.get('to')),
    page: parsePositiveInt(searchParams.get('page'), 1),
    pageSize: parsePositiveInt(searchParams.get('pageSize'), DEFAULT_SALES_PAGE_SIZE, SALES_PAGE_SIZE_OPTIONS),
  }
}

export function getDateFilterState(
  query: Pick<SalesAdvancedQuery, 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'>,
): InvoiceDateFilterState {
  return {
    field: query.dateField,
    preset: query.datePreset,
    from: query.dateFrom,
    to: query.dateTo,
  }
}

export function countAdvancedFilters(
  query: Pick<SalesAdvancedQuery, 'customerIds' | 'datePreset'>,
): number {
  let count = 0
  if (query.customerIds.length > 0) count += 1
  if (query.datePreset !== 'any') count += 1
  return count
}

export function buildSalesListParams(
  status: string,
  defaultStatus: string,
  query: SalesAdvancedQuery,
): Record<string, string> {
  const params: Record<string, string> = {}
  if (status !== defaultStatus) params.status = status
  if (query.customerIds.length > 0) params.customers = query.customerIds.join(',')
  if (query.datePreset !== 'any') {
    params.datePreset = query.datePreset
    if (query.dateField !== defaultInvoiceDateFilter.field) params.dateField = query.dateField
    if (query.datePreset === 'custom') {
      if (query.dateFrom) params.from = query.dateFrom
      if (query.dateTo) params.to = query.dateTo
    }
  }
  if (query.page > 1) params.page = String(query.page)
  if (query.pageSize !== DEFAULT_SALES_PAGE_SIZE) params.pageSize = String(query.pageSize)
  return params
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const end = start + pageSize
  return {
    items: items.slice(start, end),
    total,
    totalPages,
    page: safePage,
    pageSize,
    rangeStart: total === 0 ? 0 : start + 1,
    rangeEnd: Math.min(end, total),
  }
}

export function matchCustomerIds<T extends { contactId: string }>(item: T, customerIds: string[]) {
  if (customerIds.length === 0) return true
  return customerIds.includes(item.contactId)
}

export function salesListUrl(
  basePath: string,
  status: string,
  defaultStatus: string,
  customerIds: string[] = [],
): string {
  const params = buildSalesListParams(status, defaultStatus, {
    customerIds,
    dateField: defaultInvoiceDateFilter.field,
    datePreset: 'any',
    dateFrom: null,
    dateTo: null,
    page: 1,
    pageSize: DEFAULT_SALES_PAGE_SIZE,
  })
  const qs = new URLSearchParams(params).toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export const clearedAdvancedQuery: Omit<SalesAdvancedQuery, 'page' | 'pageSize'> = {
  customerIds: [],
  dateField: defaultInvoiceDateFilter.field,
  datePreset: 'any',
  dateFrom: null,
  dateTo: null,
}
