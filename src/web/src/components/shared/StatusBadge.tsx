import type { InvoiceStatus, QuotationStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const invoiceLabels: Record<InvoiceStatus, string> = {
  Draft: 'Draft',
  Awaiting: 'Awaiting',
  Paid: 'Paid',
  Overdue: 'Overdue',
}

const invoiceStyles: Record<InvoiceStatus, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  Awaiting: 'bg-amber-100 text-amber-700',
  Paid: 'bg-green-100 text-green-700',
  Overdue: 'bg-red-100 text-red-700',
}

const quotationLabels: Record<QuotationStatus, string> = {
  Draft: 'Draft',
  Sent: 'Sent',
  Accepted: 'Accepted',
  Declined: 'Declined',
  Expired: 'Expired',
  ConvertedToInvoice: 'Converted to Invoice',
}

const quotationStyles: Record<QuotationStatus, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  Sent: 'bg-amber-100 text-amber-800',
  Accepted: 'bg-blue-100 text-blue-700',
  Declined: 'bg-red-100 text-red-700',
  Expired: 'bg-gray-100 text-gray-500',
  ConvertedToInvoice: 'bg-green-100 text-green-700',
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-normal', invoiceStyles[status])}>
      {invoiceLabels[status]}
    </Badge>
  )
}

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-normal', quotationStyles[status])}>
      {quotationLabels[status]}
    </Badge>
  )
}

export function DocStatusBadge({ status }: { status: 'Draft' | 'Submitted' | 'Posted' | 'Cancelled' }) {
  const map = {
    Draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600' },
    Submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-700' },
    Posted: { label: 'Posted', className: 'bg-green-100 text-green-700' },
    Cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' },
  }
  const { label, className } = map[status]
  return (
    <Badge variant="secondary" className={cn('font-normal', className)}>
      {label}
    </Badge>
  )
}

export function isQuotationTerminal(status: QuotationStatus): boolean {
  return status === 'Declined' || status === 'Expired' || status === 'ConvertedToInvoice'
}

export function canConvertQuotation(status: QuotationStatus): boolean {
  return status === 'Sent' || status === 'Accepted'
}
