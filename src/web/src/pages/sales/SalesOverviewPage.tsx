import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { InvoiceStatusBadge } from '@/components/shared/StatusBadge'
import { columns as col } from '@/components/shared/DataTable'
import { dashboardStats, invoices, quotations } from '@/data/mock'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function SalesOverviewPage() {
  const awaiting = invoices.filter((i) => i.status === 'Awaiting' || i.status === 'Overdue')
  const openQuotes = quotations.filter((q) =>
    ['Draft', 'Sent', 'Accepted'].includes(q.status),
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Overview" description="Receivables, pipeline, and quick actions" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding AR</CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay amount={dashboardStats.receivables} className="text-2xl" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay
              amount={dashboardStats.receivablesAging.days90}
              className="text-2xl text-red-600"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{openQuotes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MTD Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay amount={dashboardStats.revenue} className="text-2xl text-green-600" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Invoices to collect</CardTitle>
          <Link to="/sales/invoices" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>{col.dueDate}</TableHead>
                <TableHead className="text-right">Amount due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awaiting.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <Link to={`/sales/invoices/${inv.id}`} className="font-medium text-primary hover:underline">
                      {inv.number}
                    </Link>
                  </TableCell>
                  <TableCell>{inv.contactName}</TableCell>
                  <TableCell>{formatDate(inv.dueDate)}</TableCell>
                  <TableCell className="text-right">
                    <MoneyDisplay amount={inv.total - inv.amountPaid} />
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={inv.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
