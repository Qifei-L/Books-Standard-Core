import { Link, useParams } from 'react-router-dom'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import { DetailBreadcrumb } from '@/components/shared/DocumentDetail'
import { InvoiceDetail } from '@/components/sales/invoice/InvoiceDetail'
import {
  getInvoiceAllocations,
  getInvoiceAmounts,
} from '@/lib/invoiceDocument'
import { invoices } from '@/data/mock'
import type { Invoice } from '@/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function InvoiceDetailActions({ invoice, amountDue }: { invoice: Invoice; amountDue: number }) {
  const isOpen = amountDue > 0
  const receivePaymentTo = `/sales/payments/new?invoice=${invoice.id}`

  if (invoice.status === 'Draft') {
    return (
      <>
        <Button variant="outline">Save draft</Button>
        <Button>Approve & send</Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Get items from
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Quote</DropdownMenuItem>
            <DropdownMenuItem>Sales order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  if (invoice.status === 'Paid') {
    const allocations = getInvoiceAllocations(invoice.id)
    return (
      <>
        {allocations.length > 0 && (
          <Button
            variant="outline"
            render={<Link to={`/sales/payments/${allocations[0].paymentId}`} />}
          >
            View payment
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>Issue credit note</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  return (
    <>
      {isOpen && (
        <Button render={<Link to={receivePaymentTo} />}>Receive payment</Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {invoice.status === 'Overdue' && isOpen && (
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
          )}
          {invoice.status === 'Awaiting' && isOpen && (
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
          )}
          <DropdownMenuItem>Download PDF</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Void invoice</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function InvoiceDetailPage() {
  const { id } = useParams()
  const invoice = invoices.find((i) => i.id === id) ?? invoices[0]
  const { amountDue } = getInvoiceAmounts(invoice)

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Sales Invoices', to: '/sales/invoices' },
          { label: invoice.number },
        ]}
      />
      <InvoiceDetail
        invoice={invoice}
        actions={<InvoiceDetailActions invoice={invoice} amountDue={amountDue} />}
      />
    </div>
  )
}
