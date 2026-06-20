import { salesDeliveryNotes } from '../data/mock'
import { getItem, invoiceHasTrackedItems } from './items'
import type {
  InventoryAdjustmentReason,
  Invoice,
  InvoiceShipmentStatus,
  SalesDeliveryNote,
  SalesDeliveryNoteBillingStatus,
} from '../types'

export function getDeliveryNotesForInvoice(invoiceId: string): SalesDeliveryNote[] {
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
  const labels: Record<InvoiceShipmentStatus, string> = {
    not_applicable: 'N/A',
    not_shipped: 'Not shipped',
    partially_shipped: 'Partially shipped',
    shipped: 'Shipped',
  }
  return labels[status]
}

export function billingStatusLabel(status: SalesDeliveryNoteBillingStatus): string {
  const labels: Record<SalesDeliveryNoteBillingStatus, string> = {
    not_invoiced: 'Not invoiced',
    partially_invoiced: 'Partially invoiced',
    invoiced: 'Invoiced',
  }
  return labels[status]
}

export function adjustmentReasonLabel(reason: InventoryAdjustmentReason): string {
  const labels: Record<InventoryAdjustmentReason, string> = {
    stocktake: 'Stocktake',
    damage: 'Damage / write-off',
    sample: 'Sample',
    opening: 'Opening balance',
    other: 'Other',
  }
  return labels[reason]
}

export function countUninvoicedDeliveries(): number {
  return salesDeliveryNotes.filter(
    (d) => d.status === 'Posted' && d.billingStatus === 'not_invoiced',
  ).length
}
