import { Link, useParams } from 'react-router-dom'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import { InvoiceRelatedLinks } from '@/components/sales/InvoiceRelatedLinks'
import { InvoiceStatusBadge } from '@/components/shared/StatusBadge'
import { ItemTypeBadge } from '@/components/products/ItemTypeBadge'
import {
  DetailBreadcrumb,
  DetailKpiStrip,
  LineItemTotals,
} from '@/components/shared/DocumentDetail'
import { columns as col } from '@/components/shared/DataTable'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { invoices, payments, quotations, salesOrders } from '@/data/mock'
import { invoicesListUrl } from '@/lib/invoiceListParams'
import { getAccountLabel, getItem } from '@/lib/items'
import { daysFromToday, formatDueLabel, invoiceBalance } from '@/lib/salesDates'
import { cn, formatDate, formatMoney } from '@/lib/utils'
import type { Invoice } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function getInvoiceAllocations(invoiceId: string) {
  return payments.flatMap((payment) =>
    payment.allocations
      .filter((a) => a.invoiceId === invoiceId)
      .map((a) => ({
        paymentId: payment.id,
        paymentNumber: payment.number,
        paymentDate: payment.date,
        amount: a.amount,
      })),
  )
}

function getEffectiveAmountPaid(invoice: Invoice) {
  const fromPayments = getInvoiceAllocations(invoice.id).reduce((s, a) => s + a.amount, 0)
  return Math.max(invoice.amountPaid, fromPayments)
}

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
  const quotation = quotations.find((q) => q.id === invoice.quotationId)
  const order = salesOrders.find((so) => so.id === invoice.salesOrderId)

  const amountPaid = getEffectiveAmountPaid(invoice)
  const amountDue = invoiceBalance(invoice.total, amountPaid)
  const dueDays = daysFromToday(invoice.dueDate)
  const isOverdue = invoice.status === 'Overdue' || (amountDue > 0 && dueDays < 0)
  const dueLabel = amountDue > 0 ? formatDueLabel(dueDays, 'due') : null

  const allocations = getInvoiceAllocations(invoice.id)
  const customerFilterUrl = invoicesListUrl('all', [invoice.contactId])

  const kpiItems = [
    {
      label: 'Amount due',
      value: <MoneyDisplay amount={amountDue} />,
      valueClassName: amountDue > 0 ? 'text-danger' : undefined,
      emphasize: amountDue > 0,
    },
    {
      label: 'Total',
      value: <MoneyDisplay amount={invoice.total} />,
    },
    {
      label: 'Paid',
      value: <MoneyDisplay amount={amountPaid} />,
      valueClassName: amountPaid > 0 ? 'text-success' : undefined,
    },
    {
      label: 'Invoice date',
      value: formatDate(invoice.date),
    },
    {
      label: 'Due date',
      value: formatDate(invoice.dueDate),
      valueClassName: isOverdue ? 'text-danger' : undefined,
    },
  ]

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Sales Invoices', to: '/sales/invoices' },
          { label: invoice.number },
        ]}
      />

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
        <div className="flex shrink-0 items-center gap-2">
          <InvoiceDetailActions invoice={invoice} amountDue={amountDue} />
        </div>
      </div>

      <DetailKpiStrip items={kpiItems} />

      <InvoiceRelatedLinks invoice={invoice} quotation={quotation} order={order} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Line items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">{col.code}</TableHead>
                <TableHead>{col.description}</TableHead>
                <TableHead className="text-right">{col.qty}</TableHead>
                <TableHead className="text-right">{col.unitPrice}</TableHead>
                <TableHead className="text-right">{col.amount}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lines.map((line) => {
                const item = getItem(line.itemId)
                return (
                <TableRow key={line.id}>
                  <TableCell className="font-mono text-xs">
                    {line.itemId ? (
                      <div className="space-y-1">
                        <Link to={`/products/items/${line.itemId}`} className="text-link">
                          {line.itemCode ?? item?.code}
                        </Link>
                        {item && <ItemTypeBadge type={item.itemType} className="text-[10px]" />}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Ad-hoc</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{line.description}</div>
                    {line.revenueAccountId && (
                      <div className="text-xs text-muted-foreground">
                        {getAccountLabel(line.revenueAccountId)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{line.quantity}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(line.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <MoneyDisplay amount={line.amount} />
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
          <LineItemTotals
            subtotal={invoice.subtotal}
            tax={invoice.tax}
            total={invoice.total}
            amountPaid={amountPaid}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Payments & allocations</CardTitle>
          {amountDue > 0 && (
            <Button
              size="sm"
              variant="outline"
              render={<Link to={`/sales/payments/new?invoice=${invoice.id}`} />}
            >
              Record payment
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {allocations.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No payments recorded for this invoice.
              {amountDue > 0 && (
                <>
                  {' '}
                  <Link
                    to={`/sales/payments/new?invoice=${invoice.id}`}
                    className="text-link hover:underline"
                  >
                    Record payment
                  </Link>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment</TableHead>
                  <TableHead>{col.date}</TableHead>
                  <TableHead className="text-right">Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map((a) => (
                  <TableRow key={`${a.paymentId}-${a.amount}`}>
                    <TableCell>
                      <Link to={`/sales/payments/${a.paymentId}`} className="text-link font-medium">
                        {a.paymentNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(a.paymentDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <MoneyDisplay amount={a.amount} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell colSpan={2}>Total applied</TableCell>
                  <TableCell className="text-right">{formatMoney(amountPaid)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
