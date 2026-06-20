import { Link } from 'react-router-dom'
import { DocumentLinksSection } from '@/components/shared/DocumentLinksSection'
import type { InvoiceAllocationRow } from '@/lib/invoiceDocument'
import { Button } from '@/components/ui/button'

interface InvoicePaymentsSectionProps {
  invoiceId: string
  amountDue: number
  amountPaid: number
  allocations: InvoiceAllocationRow[]
}

export function InvoicePaymentsSection({
  invoiceId,
  amountDue,
  amountPaid,
  allocations,
}: InvoicePaymentsSectionProps) {
  const recordPaymentTo = `/sales/payments/new?invoice=${invoiceId}`

  const rows = allocations.map((a) => ({
    id: `${a.paymentId}-${a.amount}`,
    to: `/sales/payments/${a.paymentId}`,
    number: a.paymentNumber,
    date: a.paymentDate,
    amount: a.amount,
  }))

  return (
    <DocumentLinksSection
      title="Payments & allocations"
      action={
        amountDue > 0 ? (
          <Button size="sm" variant="outline" render={<Link to={recordPaymentTo} />}>
            Record payment
          </Button>
        ) : undefined
      }
      rows={rows}
      emptyMessage={
        amountDue > 0 ? (
          <>
            No payments recorded for this invoice.{' '}
            <Link to={recordPaymentTo} className="text-link hover:underline">
              Record payment
            </Link>
          </>
        ) : (
          'No payments recorded for this invoice.'
        )
      }
      columns={{ number: 'Payment', amount: 'Applied' }}
      totalRow={rows.length > 0 ? { label: 'Total applied', amount: amountPaid } : undefined}
    />
  )
}
