import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { DocStatusBadge, QuotationStatusBadge } from '@/components/shared/StatusBadge'
import {
  BillingStatusBadge,
  ShipmentStatusBadge,
  StockDocStatusBadge,
} from '@/components/stock/StockStatusBadges'
import { Button } from '@/components/ui/button'
import { quotations, salesOrders } from '@/data/mock'
import {
  billingStatusLabel,
  getDeliveryNotesForInvoice,
  getInvoiceShipmentStatus,
  shipmentStatusLabel,
} from '@/lib/stockDocuments'
import { cn, formatDate } from '@/lib/utils'
import type { Invoice, SalesDeliveryNote, SalesOrder } from '@/types'

interface InvoiceRelatedDocumentsProps {
  invoice: Invoice
}

interface WorkflowStepProps {
  title: string
  count: number
  summary: ReactNode
  action?: ReactNode
  children?: ReactNode
}

function getSalesOrdersForInvoice(invoice: Invoice): SalesOrder[] {
  const byId = new Map<string, SalesOrder>()

  if (invoice.salesOrderId) {
    const direct = salesOrders.find((order) => order.id === invoice.salesOrderId)
    if (direct) byId.set(direct.id, direct)
  }

  if (invoice.quotationId) {
    salesOrders
      .filter((order) => order.quotationId === invoice.quotationId)
      .forEach((order) => byId.set(order.id, order))
  }

  return Array.from(byId.values())
}

function deliveryNoteAmount(deliveryNote: SalesDeliveryNote) {
  return deliveryNote.lines.reduce((sum, line) => sum + line.quantity * line.unitCost, 0)
}

function summarizeStatuses(statuses: string[]) {
  if (statuses.length === 0) return 'None'

  const counts = statuses.reduce<Record<string, number>>((acc, status) => {
    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([status, count]) => `${count} ${status}`)
    .join(' · ')
}

function WorkflowStep({
  title,
  count,
  summary,
  action,
  children,
}: WorkflowStepProps) {
  return (
    <div className="min-w-0 border-b border-border px-4 py-3 last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {count}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{summary}</p>
        </div>
        {action}
      </div>
      {children ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <div className="rounded-md bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          No related documents.
        </div>
      )}
    </div>
  )
}

function RelatedDocumentRow({
  to,
  number,
  date,
  status,
  amount,
  amountLabel = 'Amount',
}: {
  to?: string
  number: string
  date: string
  status: ReactNode
  amount: number
  amountLabel?: string
}) {
  const numberNode = to ? (
    <Link to={to} className="font-medium text-link hover:underline">
      {number}
    </Link>
  ) : (
    <span className="font-medium text-foreground">{number}</span>
  )

  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">{numberNode}</div>
        <div className="text-xs text-muted-foreground">{formatDate(date)}</div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex flex-wrap items-center gap-1.5">{status}</div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {amountLabel}
          </div>
          <MoneyDisplay amount={amount} />
        </div>
      </div>
    </div>
  )
}

export function InvoiceRelatedDocuments({ invoice }: InvoiceRelatedDocumentsProps) {
  const quotation = invoice.quotationId
    ? quotations.find((quote) => quote.id === invoice.quotationId)
    : undefined
  const orders = getSalesOrdersForInvoice(invoice)
  const deliveryNotes = getDeliveryNotesForInvoice(invoice.id)
  const shipmentStatus = getInvoiceShipmentStatus(invoice)
  const shipmentLabel = shipmentStatusLabel(shipmentStatus)
  const needsShipment =
    shipmentStatus === 'not_shipped' || shipmentStatus === 'partially_shipped'
  const createDeliveryNoteTo = `/sales/delivery-notes/new?invoice=${invoice.id}`

  return (
    <section className="border-b border-border pb-4">
      <div className="mb-3">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Workflow
        </h2>
      </div>

      <div className="grid rounded-lg border border-border bg-card lg:grid-cols-4">
        <WorkflowStep
          title="Quotation"
          count={quotation ? 1 : 0}
          summary={quotation ? quotation.status : 'No quotation linked'}
        >
          {quotation && (
            <RelatedDocumentRow
              to={`/sales/quotes/${quotation.id}`}
              number={quotation.number}
              date={quotation.date}
              status={<QuotationStatusBadge status={quotation.status} />}
              amount={quotation.total}
            />
          )}
        </WorkflowStep>

        <WorkflowStep
          title="Sales orders"
          count={orders.length}
          summary={summarizeStatuses(orders.map((order) => order.status))}
        >
          {orders.map((order) => (
            <RelatedDocumentRow
              key={order.id}
              to={`/sales/sales-orders/${order.id}`}
              number={order.number}
              date={order.date}
              status={<DocStatusBadge status={order.status} />}
              amount={order.total}
            />
          ))}
        </WorkflowStep>

        <WorkflowStep
          title="Delivery notes"
          count={deliveryNotes.length}
          action={
            needsShipment ? (
              <Button size="sm" variant="outline" render={<Link to={createDeliveryNoteTo} />}>
                Create
              </Button>
            ) : null
          }
          summary={
            <span className="inline-flex flex-wrap items-center gap-1.5">
              <span>Shipment:</span>
              <ShipmentStatusBadge status={shipmentStatus} label={shipmentLabel} />
              <span className={cn(shipmentStatus === 'not_applicable' && 'text-muted-foreground')}>
                {shipmentStatus === 'not_applicable' ? shipmentLabel : null}
              </span>
              <span>{summarizeStatuses(deliveryNotes.map((dn) => billingStatusLabel(dn.billingStatus)))}</span>
            </span>
          }
        >
          {deliveryNotes.map((deliveryNote) => (
            <RelatedDocumentRow
              key={deliveryNote.id}
              to={`/sales/delivery-notes/${deliveryNote.id}`}
              number={deliveryNote.number}
              date={deliveryNote.date}
              status={
                <>
                  <StockDocStatusBadge status={deliveryNote.status} />
                  <BillingStatusBadge
                    status={deliveryNote.billingStatus}
                    label={billingStatusLabel(deliveryNote.billingStatus)}
                  />
                </>
              }
              amount={deliveryNoteAmount(deliveryNote)}
            />
          ))}
        </WorkflowStep>

        <WorkflowStep
          title="Adjustments"
          count={0}
          summary="No invoice-linked adjustments"
        />
      </div>
    </section>
  )
}
