import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn, formatMoney } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function DetailBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />}
          {item.to ? (
            <Link to={item.to} className="text-link hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export interface DetailKpiItem {
  label: string
  value: ReactNode
  valueClassName?: string
  emphasize?: boolean
}

export function DetailKpiStrip({ items }: { items: DetailKpiItem[] }) {
  const colCount = Math.min(Math.max(items.length, 2), 6)
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <div
        className="grid min-w-[480px] divide-x divide-border"
        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className={cn('min-w-0 px-4 py-3 sm:px-5', item.emphasize && 'bg-muted/30')}
          >
            <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
            <div
              className={cn(
                'mt-0.5 truncate tabular-nums text-foreground',
                item.emphasize ? 'text-lg font-semibold' : 'text-base font-semibold',
                item.valueClassName,
              )}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface LineItemTotalsProps {
  subtotal: number
  tax: number
  total: number
  amountPaid?: number
  taxLabel?: string
}

export function LineItemTotals({
  subtotal,
  tax,
  total,
  amountPaid = 0,
  taxLabel = 'Tax',
}: LineItemTotalsProps) {
  const amountDue = Math.max(0, total - amountPaid)
  const showPaid = amountPaid > 0

  return (
    <div className="flex justify-end border-t border-border px-4 py-4">
      <dl className="w-full max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums font-medium">{formatMoney(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{taxLabel}</dt>
          <dd className="tabular-nums font-medium">{formatMoney(tax)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-1.5">
          <dt className="font-medium text-foreground">Total</dt>
          <dd className="tabular-nums font-semibold">{formatMoney(total)}</dd>
        </div>
        {showPaid && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Amount paid</dt>
            <dd className="tabular-nums font-medium text-success">{formatMoney(amountPaid)}</dd>
          </div>
        )}
        {amountDue > 0 && (
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-foreground">Amount due</dt>
            <dd className="tabular-nums font-semibold text-danger">{formatMoney(amountDue)}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}
