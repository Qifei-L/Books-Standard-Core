import { Link, useParams } from 'react-router-dom'
import { PageHeader, LinkedDocs } from '@/components/shared/PageHeader'
import {
  QuotationStatusBadge,
  canConvertQuotation,
  isQuotationTerminal,
} from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { invoices, quotations, salesOrders } from '@/data/mock'
import { columns as col } from '@/components/shared/DataTable'
import { formatDate, formatMoney } from '@/lib/utils'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export function QuotationDetailPage() {
  const { id } = useParams()
  const quotation = quotations.find((q) => q.id === id) ?? quotations[0]
  const linkedOrder = salesOrders.find((so) => so.id === quotation.linkedSalesOrderId)
  const linkedInvoice = invoices.find((inv) => inv.id === quotation.linkedInvoiceId)
  const terminal = isQuotationTerminal(quotation.status)
  const canConvert = canConvertQuotation(quotation.status)

  const linkedDocs = [
    ...(linkedOrder
      ? [{ label: linkedOrder.number, to: `/sales/sales-orders/${linkedOrder.id}` }]
      : []),
    ...(linkedInvoice
      ? [{ label: linkedInvoice.number, to: `/sales/invoices/${linkedInvoice.id}` }]
      : []),
  ]

  return (
    <div>
      <PageHeader title={quotation.number} description={`Customer: ${quotation.contactName}`}>
        <QuotationStatusBadge status={quotation.status} />
        {!terminal && (
          <>
            {quotation.status === 'Draft' && (
              <>
                <Button variant="outline">Save</Button>
                <Button>Send</Button>
              </>
            )}
            {quotation.status === 'Sent' && (
              <>
                <Button variant="outline">Mark Accepted</Button>
                <Button variant="destructive" size="sm">
                  Mark Declined
                </Button>
              </>
            )}
            {quotation.status === 'Accepted' && canConvert && (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button />}>
                  Convert
                  <ChevronDown className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Sales Order</DropdownMenuItem>
                  <DropdownMenuItem>Sales Invoice</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {quotation.status === 'Sent' && canConvert && (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  Convert
                  <ChevronDown className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Sales Order</DropdownMenuItem>
                  <DropdownMenuItem>Sales Invoice</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}
      </PageHeader>

      <LinkedDocs items={linkedDocs} />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Quote date</CardTitle>
          </CardHeader>
          <CardContent>{formatDate(quotation.date)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Valid till</CardTitle>
          </CardHeader>
          <CardContent>{formatDate(quotation.validTill)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay amount={quotation.total} className="text-lg" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Line items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{col.description}</TableHead>
                <TableHead className="text-right">{col.qty}</TableHead>
                <TableHead className="text-right">{col.unitPrice}</TableHead>
                <TableHead className="text-right">{col.amount}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotation.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.description}</TableCell>
                  <TableCell className="text-right">{line.quantity}</TableCell>
                  <TableCell className="text-right">{formatMoney(line.unitPrice)}</TableCell>
                  <TableCell className="text-right">
                    <MoneyDisplay amount={line.amount} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right text-muted-foreground">
                  Subtotal / Tax / Total
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatMoney(quotation.subtotal)} / {formatMoney(quotation.tax)} /{' '}
                  {formatMoney(quotation.total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {terminal && (
        <p className="mt-4 text-sm text-muted-foreground">
          This quote is closed and cannot be edited.
        </p>
      )}

      <Link to="/sales/quotes" className="mt-4 inline-block text-sm text-primary hover:underline">
        ← Back to list
      </Link>
    </div>
  )
}
