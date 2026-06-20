import { Link } from 'react-router-dom'
import { DocStatusBadge, QuotationStatusBadge } from '@/components/shared/StatusBadge'
import {
  DocumentLinksSection,
  type DocumentLinkRow,
} from '@/components/shared/DocumentLinksSection'
import {
  BillingStatusBadge,
  StockDocStatusBadge,
} from '@/components/stock/StockStatusBadges'
import { Button } from '@/components/ui/button'
import { quotations, salesOrders } from '@/data/mock'
import {
  billingStatusLabel,
  getDeliveryNotesForInvoice,
  getInvoiceShipmentStatus,
} from '@/lib/stockDocuments'
import type { Invoice, SalesDeliveryNote, SalesOrder } from '@/types'

function getSalesOrdersForInvoice(invoice: Invoice): SalesOrder[] {
  const byId = new Map<string, SalesOrder>()
  if (invoice.salesOrderId) {
    const direct = salesOrders.find((o) => o.id === invoice.salesOrderId)
    if (direct) byId.set(direct.id, direct)
  }
  if (invoice.quotationId) {
    salesOrders
      .filter((o) => o.quotationId === invoice.quotationId)
      .forEach((o) => byId.set(o.id, o))
  }
  return Array.from(byId.values())
}

function deliveryNoteAmount(dn: SalesDeliveryNote) {
  return dn.lines.reduce((sum, line) => sum + line.quantity * line.unitCost, 0)
}

interface InvoiceRelatedDocumentsProps {
  invoice: Invoice
}

export function InvoiceRelatedDocuments({ invoice }: InvoiceRelatedDocumentsProps) {
  const quotation = invoice.quotationId
    ? quotations.find((q) => q.id === invoice.quotationId)
    : undefined
  const orders = getSalesOrdersForInvoice(invoice)
  const deliveryNotes = getDeliveryNotesForInvoice(invoice.id)
  const shipmentStatus = getInvoiceShipmentStatus(invoice)
  const needsShipment =
    shipmentStatus === 'not_shipped' || shipmentStatus === 'partially_shipped'
  const createDeliveryNoteTo = `/sales/delivery-notes/new?invoice=${invoice.id}`

  const rows: DocumentLinkRow[] = [
    ...(quotation
      ? [
          {
            id: quotation.id,
            to: `/sales/quotes/${quotation.id}`,
            number: quotation.number,
            date: quotation.date,
            typeLabel: 'Quotation',
            status: <QuotationStatusBadge status={quotation.status} />,
            amount: quotation.total,
          },
        ]
      : []),
    ...orders.map((order) => ({
      id: order.id,
      to: `/sales/sales-orders/${order.id}`,
      number: order.number,
      date: order.date,
      typeLabel: 'Sales Order',
      status: <DocStatusBadge status={order.status} />,
      amount: order.total,
    })),
    ...deliveryNotes.map((dn) => ({
      id: dn.id,
      to: `/sales/delivery-notes/${dn.id}`,
      number: dn.number,
      date: dn.date,
      typeLabel: 'Delivery Note',
      status: (
        <>
          <StockDocStatusBadge status={dn.status} />
          <BillingStatusBadge
            status={dn.billingStatus}
            label={billingStatusLabel(dn.billingStatus)}
          />
        </>
      ),
      amount: deliveryNoteAmount(dn),
    })),
  ]

  return (
    <DocumentLinksSection
      title="Related documents"
      action={
        needsShipment ? (
          <Button size="sm" variant="outline" render={<Link to={createDeliveryNoteTo} />}>
            Create delivery note
          </Button>
        ) : undefined
      }
      rows={rows}
      emptyMessage="No related documents."
    />
  )
}
