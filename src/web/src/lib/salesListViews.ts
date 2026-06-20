import { defaultInvoiceDateFilter } from '@/lib/invoiceDateFilters'

export type SalesListModule = 'invoices' | 'quotes' | 'payments' | 'sales-orders'

export interface SalesListViewDefinition {
  id: string
  name: string
  module: SalesListModule
  status: string
  customerIds: string[]
  dateField: 'issued' | 'due'
  datePreset: 'any' | 'this-month' | 'last-30' | 'this-quarter' | 'custom'
  dateFrom: string | null
  dateTo: string | null
  isSystem?: boolean
}

const STORAGE_KEY = 'bsc_sales_list_views'

type StoredView = Partial<SalesListViewDefinition> & {
  customerId?: string | null
  module?: SalesListModule
}

function normalizeView(raw: StoredView, fallbackModule: SalesListModule): SalesListViewDefinition | null {
  if (!raw.id || !raw.name || !raw.status) return null
  return {
    id: raw.id,
    name: raw.name,
    module: raw.module ?? fallbackModule,
    status: raw.status,
    customerIds: raw.customerIds ?? (raw.customerId ? [raw.customerId] : []),
    dateField: raw.dateField ?? 'issued',
    datePreset: raw.datePreset ?? 'any',
    dateFrom: raw.dateFrom ?? null,
    dateTo: raw.dateTo ?? null,
    isSystem: raw.isSystem,
  }
}

function loadAll(): SalesListViewDefinition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredView[]
    return parsed
      .map((v) => normalizeView(v, 'invoices'))
      .filter((v): v is SalesListViewDefinition => v !== null)
  } catch {
    return []
  }
}

function persist(views: SalesListViewDefinition[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
}

export function getSystemViews(module: SalesListModule): SalesListViewDefinition[] {
  const empty = {
    customerIds: [] as string[],
    dateField: defaultInvoiceDateFilter.field,
    datePreset: defaultInvoiceDateFilter.preset,
    dateFrom: defaultInvoiceDateFilter.from,
    dateTo: defaultInvoiceDateFilter.to,
    isSystem: true,
  }

  switch (module) {
    case 'invoices':
      return [
        { id: 'inv-awaiting', name: 'Awaiting payment', module, status: 'awaiting', ...empty },
        { id: 'inv-overdue', name: 'Overdue', module, status: 'overdue', ...empty },
        { id: 'inv-due-soon', name: 'Due soon', module, status: 'due-soon', ...empty },
        { id: 'inv-all', name: 'All invoices', module, status: 'all', ...empty },
      ]
    case 'quotes':
      return [
        { id: 'qt-open', name: 'Open quotes', module, status: 'open', ...empty },
        { id: 'qt-sent', name: 'Sent', module, status: 'Sent', ...empty },
        { id: 'qt-all', name: 'All quotes', module, status: 'all', ...empty },
      ]
    case 'payments':
      return [
        { id: 'pay-all', name: 'All payments', module, status: 'all', ...empty },
        { id: 'pay-applied', name: 'Applied / Mixed', module, status: 'applied', ...empty },
        { id: 'pay-advance', name: 'Advances only', module, status: 'advance', ...empty },
      ]
    case 'sales-orders':
      return [
        { id: 'so-all', name: 'All orders', module, status: 'all', ...empty },
        { id: 'so-submitted', name: 'Submitted', module, status: 'Submitted', ...empty },
      ]
  }
}

export function loadSavedViews(module: SalesListModule): SalesListViewDefinition[] {
  return loadAll().filter((v) => v.module === module && !v.isSystem)
}

export function saveView(
  module: SalesListModule,
  name: string,
  view: Omit<SalesListViewDefinition, 'id' | 'name' | 'module' | 'isSystem'>,
): SalesListViewDefinition {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('View name is required')
  const created: SalesListViewDefinition = {
    id: `${module}-${Date.now()}`,
    name: trimmed,
    module,
    ...view,
  }
  persist([...loadAll(), created])
  return created
}

export function deleteSavedView(id: string) {
  persist(loadAll().filter((v) => v.id !== id))
}

export function viewMatchesQuery(
  view: SalesListViewDefinition,
  query: Omit<SalesListViewDefinition, 'id' | 'name' | 'module' | 'isSystem'>,
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
  module: SalesListModule,
  query: Omit<SalesListViewDefinition, 'id' | 'name' | 'module' | 'isSystem'>,
): SalesListViewDefinition | null {
  const all = [...getSystemViews(module), ...loadSavedViews(module)]
  return all.find((v) => viewMatchesQuery(v, query)) ?? null
}

/** Migrate legacy invoice-only views storage */
export function migrateLegacyInvoiceViews() {
  const legacyKey = 'bsc_invoice_list_views'
  try {
    const raw = localStorage.getItem(legacyKey)
    if (!raw) return
    const parsed = JSON.parse(raw) as StoredView[]
    const migrated = parsed
      .map((v) =>
        normalizeView({ ...v, module: 'invoices' }, 'invoices'),
      )
      .filter((v): v is SalesListViewDefinition => v !== null)
    if (migrated.length > 0) {
      const existing = loadAll()
      persist([...existing, ...migrated.filter((m) => !existing.some((e) => e.id === m.id))])
    }
    localStorage.removeItem(legacyKey)
  } catch {
    // ignore
  }
}
