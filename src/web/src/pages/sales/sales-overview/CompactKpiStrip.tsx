import { cn, formatMoney } from '@/lib/utils'
import { dashboardStats, invoices, quotations } from '@/data/mock'
import { daysFromToday, invoiceBalance } from './utils'

function dueInSevenDaysTotal() {
  return invoices
    .filter((inv) => inv.status !== 'Paid' && inv.status !== 'Draft')
    .filter((inv) => {
      const d = daysFromToday(inv.dueDate)
      return d >= 0 && d <= 7
    })
    .reduce((s, inv) => s + invoiceBalance(inv.total, inv.amountPaid), 0)
}

function openQuotesCount() {
  return quotations.filter((q) => ['Draft', 'Sent', 'Accepted'].includes(q.status)).length
}

interface KpiItemProps {
  label: string
  value: React.ReactNode
  valueClassName?: string
}

function KpiItem({ label, value, valueClassName }: KpiItemProps) {
  return (
    <div className="min-w-0 px-4 py-3 sm:px-5">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={cn('mt-0.5 truncate text-base font-semibold tabular-nums text-foreground', valueClassName)}>
        {value}
      </div>
    </div>
  )
}

export function CompactKpiStrip() {
  const overdue = dashboardStats.receivablesAging.days90
  const dueSoon = dueInSevenDaysTotal()

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <div className="grid min-w-[640px] grid-cols-5 divide-x divide-border">
        <KpiItem label="Outstanding AR" value={formatMoney(dashboardStats.receivables)} />
        <KpiItem label="Overdue" value={formatMoney(overdue)} valueClassName="text-danger" />
        <KpiItem label="Due in 7 days" value={formatMoney(dueSoon)} valueClassName="text-primary" />
        <KpiItem label="Open Quotes" value={openQuotesCount()} />
        <KpiItem label="MTD Revenue" value={formatMoney(dashboardStats.revenue)} valueClassName="text-success" />
      </div>
    </div>
  )
}
