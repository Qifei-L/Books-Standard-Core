import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SalesPlaceholderPageProps {
  title: string
  description: string
  actionLabel?: string
  phase?: string
}

export function SalesPlaceholderPage({
  title,
  description,
  actionLabel = '+ New',
  phase = 'Phase 1',
}: SalesPlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} action={{ label: actionLabel }} />
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <Badge variant="secondary">{phase}</Badge>
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground">Mock UI placeholder — backend integration pending.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function CreditNotesPage() {
  return (
    <SalesPlaceholderPage
      title="Credit Notes"
      description="Issue credit notes for returns, discounts, or invoice corrections."
      actionLabel="+ New Credit Note"
    />
  )
}

export function RecurringInvoicesPage() {
  return (
    <SalesPlaceholderPage
      title="Recurring Invoices"
      description="Automate repeating invoices for subscriptions, rent, or retainers."
      actionLabel="+ New Schedule"
    />
  )
}
