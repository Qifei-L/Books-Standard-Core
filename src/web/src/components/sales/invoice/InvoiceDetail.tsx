import type { ReactNode } from 'react'
import {
  getInvoiceAllocations,
  getInvoiceAmounts,
} from '@/lib/invoiceDocument'
import type { Invoice } from '@/types'
import { InvoiceDetailHeader } from './InvoiceDetailHeader'
import { InvoiceKpiStrip } from './InvoiceKpiStrip'
import { InvoiceLineItemsTable } from './InvoiceLineItemsTable'
import { InvoicePaymentsSection } from './InvoicePaymentsSection'
import { InvoiceRelatedDocuments } from './InvoiceRelatedDocuments'

interface InvoiceDetailProps {
  invoice: Invoice
  actions?: ReactNode
  taxLabel?: string
}

export function InvoiceDetail({ invoice, actions, taxLabel }: InvoiceDetailProps) {
  const { amountPaid, amountDue } = getInvoiceAmounts(invoice)
  const allocations = getInvoiceAllocations(invoice.id)

  return (
    <div className="space-y-4">
      <InvoiceDetailHeader invoice={invoice} amountDue={amountDue} actions={actions} />
      <InvoiceKpiStrip invoice={invoice} />
      <InvoiceRelatedDocuments invoice={invoice} />
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
