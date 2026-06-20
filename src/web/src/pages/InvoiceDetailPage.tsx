import { Link, useParams } from 'react-router-dom'
import { PageHeader, LinkedDocs } from '@/components/shared/PageHeader'
import { InvoiceStatusBadge } from '@/components/shared/StatusBadge'
import { columns as col } from '@/components/shared/DataTable'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { invoices, quotations, salesOrders } from '@/data/mock'
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

export function InvoiceDetailPage() {
  const { id } = useParams()
  const invoice = invoices.find((i) => i.id === id) ?? invoices[0]
  const quotation = quotations.find((q) => q.id === invoice.quotationId)
  const order = salesOrders.find((so) => so.id === invoice.salesOrderId)

  const linkedDocs = [
    ...(quotation ? [{ label: quotation.number, to: `/sales/quotes/${quotation.id}` }] : []),
    ...(order ? [{ label: order.number, to: `/sales/sales-orders/${order.id}` }] : []),
  ]

  return (
    <div>
      <PageHeader title={invoice.number} description={`Customer: ${invoice.contactName}`}>
        <InvoiceStatusBadge status={invoice.status} />
        <Button variant="outline">Save draft</Button>
        <Button>Approve & send</Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Get items from
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Quote</DropdownMenuItem>
            <DropdownMenuItem>Sales order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      <LinkedDocs items={linkedDocs} />

      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Invoice date</CardTitle></CardHeader>
          <CardContent>{formatDate(invoice.date)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Due date</CardTitle></CardHeader>
          <CardContent>{formatDate(invoice.dueDate)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader>
          <CardContent><MoneyDisplay amount={invoice.total} className="text-lg" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Amount due</CardTitle></CardHeader>
          <CardContent>
            <MoneyDisplay amount={invoice.total - invoice.amountPaid} className="text-lg" negative="red" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Line items</CardTitle></CardHeader>
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
              {invoice.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.description}</TableCell>
                  <TableCell className="text-right">{line.quantity}</TableCell>
                  <TableCell className="text-right">{formatMoney(line.unitPrice)}</TableCell>
                  <TableCell className="text-right"><MoneyDisplay amount={line.amount} /></TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right text-muted-foreground">
                  Subtotal / Tax / Total
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatMoney(invoice.subtotal)} / {formatMoney(invoice.tax)} / {formatMoney(invoice.total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Link to="/sales/invoices" className="text-sm text-primary hover:underline">← Back to list</Link>
      </div>
    </div>
  )
}
