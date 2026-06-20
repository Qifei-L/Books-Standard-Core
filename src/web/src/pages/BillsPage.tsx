import { PageHeader } from '@/components/shared/PageHeader'
import { InvoiceStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { bills } from '@/data/mock'
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

export function BillsPage() {
  return (
    <div>
      <PageHeader
        title="Bills"
        description="Accounts payable — supplier bills"
        action={{ label: '+ New Bill' }}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{col.number}</TableHead>
                <TableHead>{col.supplier}</TableHead>
                <TableHead>{col.date}</TableHead>
                <TableHead>{col.dueDate}</TableHead>
                <TableHead className="text-right">{col.amount}</TableHead>
                <TableHead>{col.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.length === 0 ? (
                <EmptyTableRow colSpan={6} />
              ) : (
                bills.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.number}</TableCell>
                    <TableCell>{b.contactName}</TableCell>
                    <TableCell>{formatDate(b.date)}</TableCell>
                    <TableCell>{formatDate(b.dueDate)}</TableCell>
                    <TableCell className="text-right">
                      <MoneyDisplay amount={b.total} />
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={b.status} />
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
