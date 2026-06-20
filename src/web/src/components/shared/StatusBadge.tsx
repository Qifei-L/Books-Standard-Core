import type { InvoiceStatus, QuotationStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/** Soft badge palette for financial document statuses */
const soft = {
  draft: 'border-transparent bg-[#F3F4F6] text-[#4B5563]',
  sent: 'border-transparent bg-primary-soft text-primary',
  accepted: 'border-transparent bg-success-soft text-success',
  converted: 'border-transparent bg-[#EDE9FE] text-[#6D28D9]',
  paid: 'border-transparent bg-success-soft text-success',
  partial: 'border-transparent bg-warning-soft text-warning',
  overdue: 'border-transparent bg-danger-soft text-danger',
  voided: 'border-transparent bg-[#F3F4F6] text-muted-foreground',
  info: 'border-transparent bg-info-soft text-info',
  danger: 'border-transparent bg-danger-soft text-danger',
} as const

const invoiceLabels: Record<InvoiceStatus, string> = {
  Draft: 'Draft',
  Awaiting: 'Awaiting',
  Paid: 'Paid',
  Overdue: 'Overdue',
}

const invoiceStyles: Record<InvoiceStatus, string> = {
  Draft: soft.draft,
  Awaiting: soft.sent,
  Paid: soft.paid,
  Overdue: soft.overdue,
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
  Draft: soft.draft,
  Sent: soft.sent,
  Accepted: soft.accepted,
  Declined: soft.danger,
  Expired: soft.voided,
  ConvertedToInvoice: soft.converted,
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
    Draft: { label: 'Draft', className: soft.draft },
    Submitted: { label: 'Submitted', className: soft.sent },
    Posted: { label: 'Posted', className: soft.paid },
    Cancelled: { label: 'Cancelled', className: soft.voided },
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

/** Reusable soft badge for ad-hoc statuses across pages */
export function SoftStatusBadge({ label, tone }: { label: string; tone: keyof typeof soft }) {
  return (
    <Badge variant="secondary" className={cn('font-normal', soft[tone])}>
      {label}
    </Badge>
  )
}
