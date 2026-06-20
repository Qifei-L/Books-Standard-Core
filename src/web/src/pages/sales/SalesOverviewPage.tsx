import { PageHeader } from '@/components/shared/PageHeader'
import { CompactKpiStrip } from './sales-overview/CompactKpiStrip'
import { ActionQueueCard } from './sales-overview/ActionQueueCard'
import { InvoicesToCollectCard } from './sales-overview/InvoicesToCollectCard'
import { QuickActionsCard } from './sales-overview/QuickActionsCard'
import { ARAgingCard } from './sales-overview/ARAgingCard'
import { CustomerAdvancesCard } from './sales-overview/CustomerAdvancesCard'
import { RecentActivityCard } from './sales-overview/RecentActivityCard'

export function SalesOverviewPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Sales Overview"
        description="Receivables, follow-ups, and sales actions"
      />

      <CompactKpiStrip />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px] xl:items-start">
        <div className="space-y-4">
          <ActionQueueCard />
          <InvoicesToCollectCard />
          <RecentActivityCard />
        </div>

        <div className="space-y-4">
          <QuickActionsCard />
          <ARAgingCard />
          <CustomerAdvancesCard />
        </div>
      </div>
    </div>
  )
}
