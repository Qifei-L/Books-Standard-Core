import { Link } from 'react-router-dom'
import { columns as col } from '@/components/shared/DataTable'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import type { InvoiceAllocationRow } from '@/lib/invoiceDocument'
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Payments & allocations</CardTitle>
        {amountDue > 0 && (
          <Button size="sm" variant="outline" render={<Link to={recordPaymentTo} />}>
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
                <Link to={recordPaymentTo} className="text-link hover:underline">
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
  )
}
