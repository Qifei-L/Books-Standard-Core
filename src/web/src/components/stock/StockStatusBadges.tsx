import type { InvoiceShipmentStatus, SalesDeliveryNoteBillingStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const shipmentStyles: Record<InvoiceShipmentStatus, string> = {
  not_applicable: 'bg-secondary text-muted-foreground',
  not_shipped: 'bg-amber-100 text-amber-900',
  partially_shipped: 'bg-amber-100 text-amber-900',
  shipped: 'bg-success/15 text-success',
}

const billingStyles: Record<SalesDeliveryNoteBillingStatus, string> = {
  not_invoiced: 'bg-amber-100 text-amber-900',
  partially_invoiced: 'bg-amber-100 text-amber-900',
  invoiced: 'bg-success/15 text-success',
}

export function ShipmentStatusBadge({
  status,
  label,
  className,
}: {
  status: InvoiceShipmentStatus
  label: string
  className?: string
}) {
  if (status === 'not_applicable') return null
  return (
    <Badge variant="secondary" className={cn('font-normal', shipmentStyles[status], className)}>
      {label}
    </Badge>
  )
}

export function BillingStatusBadge({
  status,
  label,
  className,
}: {
  status: SalesDeliveryNoteBillingStatus
  label: string
  className?: string
}) {
  return (
    <Badge variant="secondary" className={cn('font-normal', billingStyles[status], className)}>
      {label}
    </Badge>
  )
}

export function StockDocStatusBadge({ status }: { status: 'Draft' | 'Posted' }) {
  return (
    <Badge variant="secondary" className={status === 'Posted' ? 'bg-success/15 text-success' : ''}>
      {status}
    </Badge>
  )
}
