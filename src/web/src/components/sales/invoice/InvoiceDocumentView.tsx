import type { ReactNode } from 'react'
import type { Invoice } from '@/types'
import { InvoiceDetail } from './InvoiceDetail'

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
  return <InvoiceDetail invoice={invoice} actions={actions} taxLabel={taxLabel} />
}
