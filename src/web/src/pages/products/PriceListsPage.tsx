import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function PriceListsPage() {
  return (
    <div>
      <PageHeader
        title="Price Lists"
        description="Customer-specific or tiered pricing for items"
        action={{ label: '+ New Price List' }}
      />
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <Badge variant="secondary">Phase 1</Badge>
          <p className="max-w-md text-sm text-muted-foreground">
            Define customer-specific or tiered pricing for your items.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
