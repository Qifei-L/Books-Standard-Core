import { defaultInvoiceDateFilter } from '@/lib/invoiceDateFilters'
import { defaultInvoiceListFilter, type InvoiceListFilter } from '@/lib/invoiceListFilters'

export interface InvoiceListViewDefinition {
  id: string
  name: string
  status: InvoiceListFilter
  customerIds: string[]
  dateField: 'issued' | 'due'
  datePreset: 'any' | 'this-month' | 'last-30' | 'this-quarter' | 'custom'
  dateFrom: string | null
  dateTo: string | null
  isSystem?: boolean
}

const emptyDate = {
  dateField: defaultInvoiceDateFilter.field,
  datePreset: defaultInvoiceDateFilter.preset,
  dateFrom: defaultInvoiceDateFilter.from,
  dateTo: defaultInvoiceDateFilter.to,
} as const

export const systemInvoiceListViews: InvoiceListViewDefinition[] = [
  {
    id: 'sys-awaiting',
    name: 'Awaiting payment',
    status: 'awaiting',
    customerIds: [],
    ...emptyDate,
    isSystem: true,
  },
  {
    id: 'sys-overdue',
    name: 'Overdue',
    status: 'overdue',
    customerIds: [],
    ...emptyDate,
    isSystem: true,
  },
  {
    id: 'sys-due-soon',
    name: 'Due soon',
    status: 'due-soon',
    customerIds: [],
    ...emptyDate,
    isSystem: true,
  },
  {
    id: 'sys-all',
    name: 'All invoices',
    status: 'all',
    customerIds: [],
    ...emptyDate,
    isSystem: true,
  },
]

const STORAGE_KEY = 'bsc_invoice_list_views'

type StoredView = Partial<InvoiceListViewDefinition> & {
  customerId?: string | null
}

function normalizeView(raw: StoredView): InvoiceListViewDefinition | null {
  if (!raw.id || !raw.name || !raw.status) return null
  const customerIds =
    raw.customerIds ??
    (raw.customerId ? [raw.customerId] : [])
  return {
    id: raw.id,
    name: raw.name,
    status: raw.status,
    customerIds,
    dateField: raw.dateField ?? 'issued',
    datePreset: raw.datePreset ?? 'any',
    dateFrom: raw.dateFrom ?? null,
    dateTo: raw.dateTo ?? null,
    isSystem: raw.isSystem,
  }
}

function loadRawSaved(): InvoiceListViewDefinition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredView[]
    return parsed.map(normalizeView).filter((v): v is InvoiceListViewDefinition => v !== null)
  } catch {
    return []
  }
}

function persistSaved(views: InvoiceListViewDefinition[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
}

export function loadSavedInvoiceListViews(): InvoiceListViewDefinition[] {
  return loadRawSaved()
}

export function saveInvoiceListView(
  name: string,
  view: Omit<InvoiceListViewDefinition, 'id' | 'name' | 'isSystem'>,
): InvoiceListViewDefinition {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('View name is required')

  const created: InvoiceListViewDefinition = {
    id: `user-${Date.now()}`,
    name: trimmed,
    ...view,
  }

  persistSaved([...loadRawSaved(), created])
  return created
}

export function deleteSavedInvoiceListView(id: string) {
  persistSaved(loadRawSaved().filter((v) => v.id !== id))
}

export function viewMatchesQuery(
  view: InvoiceListViewDefinition,
  query: Omit<InvoiceListViewDefinition, 'id' | 'name' | 'isSystem'>,
): boolean {
  const sameCustomers =
    view.customerIds.length === query.customerIds.length &&
    view.customerIds.every((id) => query.customerIds.includes(id))
  return (
    view.status === query.status &&
    sameCustomers &&
    view.dateField === query.dateField &&
    view.datePreset === query.datePreset &&
    view.dateFrom === query.dateFrom &&
    view.dateTo === query.dateTo
  )
}

export function findMatchingView(
  query: Omit<InvoiceListViewDefinition, 'id' | 'name' | 'isSystem'>,
  savedViews: InvoiceListViewDefinition[],
): InvoiceListViewDefinition | null {
  const all = [...systemInvoiceListViews, ...savedViews]
  return all.find((v) => viewMatchesQuery(v, query)) ?? null
}

export function getDefaultViewLabel(status: InvoiceListFilter): string {
  if (status === defaultInvoiceListFilter) return 'Awaiting payment'
  const system = systemInvoiceListViews.find((v) => v.status === status && v.customerIds.length === 0)
  return system?.name ?? 'Custom view'
}
