import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShipmentStatusBadge } from '@/components/stock/StockStatusBadges'
import {
  getDeliveryNotesForInvoice,
  getInvoiceShipmentStatus,
  shipmentStatusLabel,
} from '@/lib/stockDocuments'
import { cn, formatDate } from '@/lib/utils'
import type { Invoice, Quotation, SalesOrder } from '@/types'

interface InvoiceRelatedLinksProps {
  invoice: Invoice
  quotation?: Quotation
  order?: SalesOrder
}

function RelatedRow({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <li
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-0.5 py-1',
        className,
      )}
    >
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  )
}

export function InvoiceRelatedLinks({
  invoice,
  quotation,
  order,
}: InvoiceRelatedLinksProps) {
  const deliveryNotes = getDeliveryNotesForInvoice(invoice.id)
  const shipmentStatus = getInvoiceShipmentStatus(invoice)
  const hasSource = Boolean(quotation || order)
  const hasDelivery =
    shipmentStatus !== 'not_applicable' || deliveryNotes.length > 0

  if (!hasSource && !hasDelivery) return null

  const shipmentLabel = shipmentStatusLabel(shipmentStatus)
  const needsShipment =
    shipmentStatus === 'not_shipped' || shipmentStatus === 'partially_shipped'
  const createDnTo = `/sales/delivery-notes/new?invoice=${invoice.id}`

  return (
    <section className="border-b border-border pb-4">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Related documents
      </h2>
      <div className="space-y-3 text-sm">
        {hasSource && (
          <div>
            <div className="mb-1 text-xs text-muted-foreground">Source</div>
            <ul>
              {quotation && (
                <RelatedRow label="Quote">
                  <Link
                    to={`/sales/quotes/${quotation.id}`}
                    className="font-medium text-link hover:underline"
                  >
                    {quotation.number}
                  </Link>
                </RelatedRow>
              )}
              {order && (
                <RelatedRow label="Order">
                  <Link
                    to={`/sales/sales-orders/${order.id}`}
                    className="font-medium text-link hover:underline"
                  >
                    {order.number}
                  </Link>
                </RelatedRow>
              )}
            </ul>
          </div>
        )}

        {hasDelivery && (
          <div>
            <div className="mb-1 text-xs text-muted-foreground">Delivery</div>
            <ul>
              {shipmentStatus !== 'not_applicable' && (
                <RelatedRow label="Shipment">
                  <span className="flex flex-wrap items-center gap-2">
                    <ShipmentStatusBadge status={shipmentStatus} label={shipmentLabel} />
                    {needsShipment && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <Link to={createDnTo} className="text-link hover:underline">
                          Create delivery note
                        </Link>
                      </>
                    )}
                  </span>
                </RelatedRow>
              )}
              {deliveryNotes.map((dn) => (
                <RelatedRow key={dn.id} label="Delivery note">
                  <Link
                    to={`/sales/delivery-notes/${dn.id}`}
                    className="font-medium text-link hover:underline"
                  >
                    {dn.number}
                  </Link>
                  <span className="text-muted-foreground">· {formatDate(dn.date)}</span>
                </RelatedRow>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
