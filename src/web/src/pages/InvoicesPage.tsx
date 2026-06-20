import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { InvoiceStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { invoices } from '@/data/mock'
import { formatDate } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'

function InvoiceTable({ data }: { data: typeof invoices }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{col.number}</TableHead>
          <TableHead>{col.customer}</TableHead>
          <TableHead>{col.date}</TableHead>
          <TableHead>{col.dueDate}</TableHead>
          <TableHead className="text-right">{col.amount}</TableHead>
          <TableHead>{col.status}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <EmptyTableRow colSpan={6} />
        ) : (
          data.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>
                <Link
                  to={`/sales/invoices/${inv.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {inv.number}
                </Link>
              </TableCell>
              <TableCell>{inv.contactName}</TableCell>
              <TableCell>{formatDate(inv.date)}</TableCell>
              <TableCell>{formatDate(inv.dueDate)}</TableCell>
              <TableCell className="text-right">
                <MoneyDisplay amount={inv.total} />
              </TableCell>
              <TableCell>
                <InvoiceStatusBadge status={inv.status} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export function InvoicesPage() {
  return (
    <div>
      <PageHeader
        title="Sales Invoices"
        description="Accounts receivable — customer billing"
        action={{ label: '+ New Invoice', to: '/sales/invoices/new' }}
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="awaiting">Awaiting payment</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card><CardContent className="p-0"><InvoiceTable data={invoices} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="draft">
          <Card><CardContent className="p-0"><InvoiceTable data={invoices.filter((i) => i.status === 'Draft')} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="awaiting">
          <Card><CardContent className="p-0"><InvoiceTable data={invoices.filter((i) => i.status === 'Awaiting')} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="paid">
          <Card><CardContent className="p-0"><InvoiceTable data={invoices.filter((i) => i.status === 'Paid')} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="overdue">
          <Card><CardContent className="p-0"><InvoiceTable data={invoices.filter((i) => i.status === 'Overdue')} /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
