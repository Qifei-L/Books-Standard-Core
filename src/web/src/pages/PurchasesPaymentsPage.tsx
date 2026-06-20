import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

export function PurchasesPaymentsPage() {
  return (
    <div>
      <PageHeader
        title="Payments Made"
        description="Supplier payments and bill allocations"
        action={{ label: '+ New Payment' }}
      />
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Payments Made module — placeholder for Phase 1.
          <br />
          Record payments against purchase bills and track accounts payable.
        </CardContent>
      </Card>
    </div>
  )
}
