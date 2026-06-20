import { formatMoney } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardStats } from '@/data/mock'

const buckets = [
  { key: 'current' as const, label: 'Current' },
  { key: 'days30' as const, label: '1–30 days' },
  { key: 'days60' as const, label: '31–60 days' },
  { key: 'days90' as const, label: '60+ days' },
]

export function ARAgingCard() {
  const aging = dashboardStats.receivablesAging
  const max = Math.max(aging.current, aging.days30, aging.days60, aging.days90, 1)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">AR Aging</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {buckets.map(({ key, label }) => {
          const amount = aging[key]
          const pct = Math.round((amount / max) * 100)
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="tabular-nums font-medium text-foreground">{formatMoney(amount)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
