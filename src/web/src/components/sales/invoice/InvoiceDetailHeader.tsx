import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { InvoiceStatusBadge } from '@/components/shared/StatusBadge'
import { invoicesListUrl } from '@/lib/invoiceListParams'
import { getInvoiceDueMeta } from '@/lib/invoiceDocument'
import { cn } from '@/lib/utils'
import type { Invoice } from '@/types'

interface InvoiceDetailHeaderProps {
  invoice: Invoice
  amountDue: number
  actions?: ReactNode
}

export function InvoiceDetailHeader({
  invoice,
  amountDue,
  actions,
}: InvoiceDetailHeaderProps) {
  const { isOverdue, dueLabel } = getInvoiceDueMeta(invoice, amountDue)
  const customerFilterUrl = invoicesListUrl('all', [invoice.contactId])

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {invoice.number}
          </h1>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          <Link to={customerFilterUrl} className="text-link font-medium text-foreground">
            {invoice.contactName}
          </Link>
          {dueLabel && (
            <>
              <span className="mx-1.5 text-border">·</span>
              <span className={cn(isOverdue && 'text-danger')}>{dueLabel}</span>
            </>
          )}
        </p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
