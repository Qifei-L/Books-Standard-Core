import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { DocStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { salesOrders } from '@/data/mock'
import { formatDate } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'

export function SalesOrdersPage() {
  return (
    <div>
      <PageHeader
        title="Sales Orders"
        description="Optional — convert from quotes before invoicing"
        action={{ label: '+ New Order', to: '/sales/sales-orders/new' }}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{col.number}</TableHead>
                <TableHead>{col.customer}</TableHead>
                <TableHead>{col.date}</TableHead>
                <TableHead className="text-right">{col.amount}</TableHead>
                <TableHead>{col.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesOrders.length === 0 ? (
                <EmptyTableRow colSpan={5} />
              ) : (
                salesOrders.map((so) => (
                  <TableRow key={so.id}>
                    <TableCell>
                      <Link
                        to={`/sales/sales-orders/${so.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {so.number}
                      </Link>
                    </TableCell>
                    <TableCell>{so.contactName}</TableCell>
                    <TableCell>{formatDate(so.date)}</TableCell>
                    <TableCell className="text-right">
                      <MoneyDisplay amount={so.total} />
                    </TableCell>
                    <TableCell>
                      <DocStatusBadge status={so.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function SalesOrderDetailPage() {
  const so = salesOrders[0]
  return (
    <div>
      <PageHeader title={so.number} description={`Customer: ${so.contactName}`}>
        <DocStatusBadge status={so.status} />
      </PageHeader>
      <p className="text-sm text-muted-foreground">Detail view — Phase 1</p>
      <Link to="/sales/sales-orders" className="mt-4 inline-block text-sm text-primary hover:underline">
        ← Back to list
      </Link>
    </div>
  )
}
