import { DetailKpiStrip } from '@/components/shared/DocumentDetail'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { getInvoiceKpiConfig } from '@/lib/invoiceDocument'
import type { Invoice } from '@/types'

interface InvoiceKpiStripProps {
  invoice: Invoice
}

export function InvoiceKpiStrip({ invoice }: InvoiceKpiStripProps) {
  const kpi = getInvoiceKpiConfig(invoice)

  return (
    <DetailKpiStrip
      items={[
        {
          label: 'Amount due',
          value: <MoneyDisplay amount={kpi.amountDue} />,
          valueClassName: kpi.amountDue > 0 ? 'text-danger' : undefined,
          emphasize: kpi.amountDue > 0,
        },
        {
          label: 'Total',
          value: <MoneyDisplay amount={kpi.total} />,
        },
        {
          label: 'Paid',
          value: <MoneyDisplay amount={kpi.amountPaid} />,
          valueClassName: kpi.amountPaid > 0 ? 'text-success' : undefined,
        },
        {
          label: 'Invoice date',
          value: kpi.invoiceDate,
        },
        {
          label: 'Due date',
          value: kpi.dueDate,
          valueClassName: kpi.isOverdue ? 'text-danger' : undefined,
        },
      ]}
    />
  )
}
