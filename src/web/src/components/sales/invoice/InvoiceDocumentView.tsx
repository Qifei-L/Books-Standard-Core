import type { ReactNode } from 'react'
import { InvoiceRelatedLinks } from '@/components/sales/InvoiceRelatedLinks'
import {
  getInvoiceAllocations,
  getInvoiceAmounts,
} from '@/lib/invoiceDocument'
import type { Invoice } from '@/types'
import { InvoiceDetailHeader } from './InvoiceDetailHeader'
import { InvoiceKpiStrip } from './InvoiceKpiStrip'
import { InvoiceLineItemsTable } from './InvoiceLineItemsTable'
import { InvoicePaymentsSection } from './InvoicePaymentsSection'

interface InvoiceDocumentViewProps {
  invoice: Invoice
  actions?: ReactNode
  taxLabel?: string
}

/** Read-only invoice body — shared layout for detail and any invoice preview surfaces. */
export function InvoiceDocumentView({
  invoice,
  actions,
  taxLabel,
}: InvoiceDocumentViewProps) {
  const { amountPaid, amountDue } = getInvoiceAmounts(invoice)
  const allocations = getInvoiceAllocations(invoice.id)

  return (
    <div className="space-y-4">
      <InvoiceDetailHeader invoice={invoice} amountDue={amountDue} actions={actions} />
      <InvoiceKpiStrip invoice={invoice} />
      <InvoiceRelatedLinks invoice={invoice} />
      <InvoiceLineItemsTable invoice={invoice} amountPaid={amountPaid} taxLabel={taxLabel} />
      <InvoicePaymentsSection
        invoiceId={invoice.id}
        amountDue={amountDue}
        amountPaid={amountPaid}
        allocations={allocations}
      />
    </div>
  )
}
