import type { Invoice } from '@/types'
import { SALES_OVERVIEW_TODAY } from '@/lib/salesDates'

export type InvoiceDateField = 'issued' | 'due'
export type InvoiceDatePreset = 'any' | 'this-month' | 'last-30' | 'this-quarter' | 'custom'

export interface InvoiceDateFilterState {
  field: InvoiceDateField
  preset: InvoiceDatePreset
  from: string | null
  to: string | null
}

export const defaultInvoiceDateFilter: InvoiceDateFilterState = {
  field: 'issued',
  preset: 'any',
  from: null,
  to: null,
}

export const invoiceDatePresets: { id: InvoiceDatePreset; label: string }[] = [
  { id: 'any', label: 'Any time' },
  { id: 'this-month', label: 'This month' },
  { id: 'last-30', label: 'Last 30 days' },
  { id: 'this-quarter', label: 'This quarter' },
  { id: 'custom', label: 'Custom range' },
]

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0)
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 12, 0, 0, 0)
}

function startOfQuarter(d: Date): Date {
  const q = Math.floor(d.getMonth() / 3) * 3
  return new Date(d.getFullYear(), q, 1, 12, 0, 0, 0)
}

function endOfQuarter(d: Date): Date {
  const start = startOfQuarter(d)
  return new Date(start.getFullYear(), start.getMonth() + 3, 0, 12, 0, 0, 0)
}

export function resolveDateRange(state: InvoiceDateFilterState): { from: string | null; to: string | null } {
  const today = SALES_OVERVIEW_TODAY
  switch (state.preset) {
    case 'any':
      return { from: null, to: null }
    case 'this-month':
      return { from: isoDate(startOfMonth(today)), to: isoDate(endOfMonth(today)) }
    case 'last-30': {
      const from = new Date(today)
      from.setDate(from.getDate() - 29)
      return { from: isoDate(from), to: isoDate(today) }
    }
    case 'this-quarter':
      return { from: isoDate(startOfQuarter(today)), to: isoDate(endOfQuarter(today)) }
    case 'custom':
      return { from: state.from, to: state.to }
    default:
      return { from: null, to: null }
  }
}

export function matchInvoiceDateFilter(inv: Invoice, state: InvoiceDateFilterState): boolean {
  const { from, to } = resolveDateRange(state)
  if (!from && !to) return true

  const raw = state.field === 'issued' ? inv.date : inv.dueDate
  if (from && raw < from) return false
  if (to && raw > to) return false
  return true
}

export function formatInvoiceDateFilterLabel(state: InvoiceDateFilterState): string | null {
  if (state.preset === 'any') return null
  const preset = invoiceDatePresets.find((p) => p.id === state.preset)?.label
  if (state.preset === 'custom') {
    if (state.from && state.to) return `${state.from} – ${state.to}`
    if (state.from) return `From ${state.from}`
    if (state.to) return `Until ${state.to}`
    return 'Custom range'
  }
  const field = state.field === 'issued' ? 'Issued' : 'Due'
  return preset ? `${preset} (${field})` : null
}

export function parseInvoiceDateField(raw: string | null): InvoiceDateField {
  return raw === 'due' ? 'due' : 'issued'
}

const validPresets = new Set(invoiceDatePresets.map((p) => p.id))

export function parseInvoiceDatePreset(raw: string | null): InvoiceDatePreset {
  if (raw && validPresets.has(raw as InvoiceDatePreset)) return raw as InvoiceDatePreset
  return 'any'
}

export function parseIsoDateParam(raw: string | null): string | null {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
  return raw
}
