import { salesDeliveryNotes } from '@/data/mock'
import { getItem, invoiceHasTrackedItems } from '@/lib/items'
import type {
  InventoryAdjustmentReason,
  Invoice,
  InvoiceShipmentStatus,
  SalesDeliveryNote,
  SalesDeliveryNoteBillingStatus,
} from '@/types'

export function getSalesDeliveryNotes(): SalesDeliveryNote[] {
  return salesDeliveryNotes
}

export function getSalesDeliveryNote(id: string) {
  return salesDeliveryNotes.find((d) => d.id === id)
}

export function getDeliveryNotesForInvoice(invoiceId: string) {
  return salesDeliveryNotes.filter((d) => d.invoiceId === invoiceId && d.status === 'Posted')
}

export function getInvoiceShipmentStatus(invoice: Invoice): InvoiceShipmentStatus {
  if (!invoiceHasTrackedItems(invoice.lines)) return 'not_applicable'

  const dns = getDeliveryNotesForInvoice(invoice.id)
  if (dns.length === 0) return 'not_shipped'

  let shippedQty = 0
  let requiredQty = 0
  for (const line of invoice.lines) {
    const item = getItem(line.itemId)
    if (item?.itemType !== 'Tracked') continue
    requiredQty += line.quantity
  }
  for (const dn of dns) {
    for (const line of dn.lines) {
      const item = getItem(line.itemId)
      if (item?.itemType === 'Tracked') shippedQty += line.quantity
    }
  }

  if (shippedQty <= 0) return 'not_shipped'
  if (shippedQty < requiredQty) return 'partially_shipped'
  return 'shipped'
}

export function shipmentStatusLabel(status: InvoiceShipmentStatus): string {
  switch (status) {
    case 'not_applicable':
      return 'N/A'
    case 'not_shipped':
      return 'Not shipped'
    case 'partially_shipped':
      return 'Partially shipped'
    case 'shipped':
      return 'Shipped'
  }
}

export function billingStatusLabel(status: SalesDeliveryNoteBillingStatus): string {
  switch (status) {
    case 'not_invoiced':
      return 'Not invoiced'
    case 'partially_invoiced':
      return 'Partially invoiced'
    case 'invoiced':
      return 'Invoiced'
  }
}

export function adjustmentReasonLabel(reason: InventoryAdjustmentReason): string {
  const labels = {
    stocktake: 'Stocktake',
    damage: 'Damage / write-off',
    sample: 'Sample',
    opening: 'Opening balance',
    other: 'Other',
  }
  return labels[reason]
}

export function countUninvoicedDeliveries() {
  return salesDeliveryNotes.filter(
    (d) => d.status === 'Posted' && d.billingStatus === 'not_invoiced',
  ).length
}
