import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { InvoiceStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { invoices } from '@/data/mock'
import type { Invoice } from '@/types'
import {
  collectFilterToListParam,
  invoiceCollectFilters,
  matchInvoiceCollectFilter,
  type InvoiceCollectFilter,
} from '@/lib/invoiceListFilters'
import { daysFromToday, formatDueLabel, invoiceBalance } from '@/lib/salesDates'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type InvoiceFilter = InvoiceCollectFilter

const filters = invoiceCollectFilters

function matchFilter(inv: Invoice, filter: InvoiceFilter) {
  return matchInvoiceCollectFilter(inv, filter)
}

export function InvoicesToCollectCard() {
  const [filter, setFilter] = useState<InvoiceFilter>('all')

  const rows = useMemo(
    () => invoices.filter((inv) => matchFilter(inv, filter)),
    [filter],
  )

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-base">Invoices to Collect</CardTitle>
          <p className="text-sm text-muted-foreground">Outstanding customer invoices</p>
        </div>
        <Link
          to={`/sales/invoices?status=${collectFilterToListParam(filter)}`}
          className="text-sm text-link"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                filter === f.id
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="-mx-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Business Partner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-11 text-center text-muted-foreground">
                    No invoices in this filter.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((inv) => {
                  const balance = invoiceBalance(inv.total, inv.amountPaid)
                  const days = daysFromToday(inv.dueDate)
                  const isOverdue = inv.status === 'Overdue' || days < 0
                  return (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <Link to={`/sales/invoices/${inv.id}`} className="text-link">
                          {inv.number}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">{inv.contactName}</TableCell>
                      <TableCell>{inv.dueDate.replace(/-/g, '/')}</TableCell>
                      <TableCell className={cn(isOverdue && 'text-danger')}>
                        {formatDueLabel(days, 'due')}
                      </TableCell>
                      <TableCell className="text-right">
                        <MoneyDisplay amount={balance} />
                      </TableCell>
                      <TableCell>
                        <InvoiceStatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7"
                          render={
                            <Link
                              to={
                                isOverdue
                                  ? `/sales/invoices/${inv.id}`
                                  : `/sales/payments/new?invoice=${inv.id}`
                              }
                            />
                          }
                        >
                          {isOverdue ? 'Reminder' : 'Receive'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
