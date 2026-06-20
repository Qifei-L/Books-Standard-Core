import { Link } from 'react-router-dom'
import { formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { payments } from '@/data/mock'
import { getAdvanceAmount } from '@/types'
import { useSalesSettings } from '@/contexts/SalesSettingsContext'

export function CustomerAdvancesCard() {
  const { settings } = useSalesSettings()

  if (!settings.allowUnallocatedReceipts) {
    return null
  }

  const advances = payments.filter((p) => getAdvanceAmount(p) > 0)
  const totalAvailable = advances.reduce((s, p) => s + getAdvanceAmount(p), 0)
  const primary = advances[0]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Customer Advances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm text-muted-foreground">Available to apply</span>
          <span className="text-lg font-semibold tabular-nums text-foreground">
            {formatMoney(totalAvailable)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <span className="text-muted-foreground">Unapplied advances</span>
          <span className="font-medium">{advances.length}</span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1"
            render={<Link to={primary ? `/sales/payments/${primary.id}` : '/sales/payments?tab=advance'} />}
          >
            Apply
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            render={<Link to="/sales/payments?tab=advance" />}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
