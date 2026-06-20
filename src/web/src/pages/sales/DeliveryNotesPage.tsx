import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { BillingStatusBadge, StockDocStatusBadge } from '@/components/stock/StockStatusBadges'
import { salesDeliveryNotes } from '@/data/mock'
import { billingStatusLabel } from '@/lib/stockDocuments'
import { formatDate, formatMoney } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function lineSummary(lines: (typeof salesDeliveryNotes)[0]['lines']) {
  const qty = lines.reduce((s, l) => s + l.quantity, 0)
  const cost = lines.reduce((s, l) => s + l.quantity * l.unitCost, 0)
  return { qty, cost }
}

export function DeliveryNotesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Delivery Notes"
        description="Sales shipments to customers — posts COGS · Cr Inventory. Billing status is separate from inventory."
        action={{ label: '+ New delivery note', to: '/sales/delivery-notes/new' }}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{col.number}</TableHead>
                <TableHead>{col.customer}</TableHead>
                <TableHead>{col.date}</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>{col.status}</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">COGS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesDeliveryNotes.length === 0 ? (
                <EmptyTableRow colSpan={8} />
              ) : (
                salesDeliveryNotes.map((dn) => {
                  const { qty, cost } = lineSummary(dn.lines)
                  return (
                    <TableRow key={dn.id}>
                      <TableCell>
                        <Link to={`/sales/delivery-notes/${dn.id}`} className="text-link font-medium">
                          {dn.number}
                        </Link>
                      </TableCell>
                      <TableCell>{dn.contactName ?? '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(dn.date)}</TableCell>
                      <TableCell>
                        {dn.invoiceId ? (
                          <Link to={`/sales/invoices/${dn.invoiceId}`} className="text-link">
                            {dn.invoiceNumber}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <BillingStatusBadge
                          status={dn.billingStatus}
                          label={billingStatusLabel(dn.billingStatus)}
                        />
                      </TableCell>
                      <TableCell>
                        <StockDocStatusBadge status={dn.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{qty}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(cost)}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
