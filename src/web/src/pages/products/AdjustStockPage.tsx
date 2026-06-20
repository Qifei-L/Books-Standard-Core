import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { StockDocStatusBadge } from '@/components/stock/StockStatusBadges'
import { inventoryAdjustments } from '@/data/mock'
import { adjustmentReasonLabel } from '@/lib/stockDocuments'
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

export function AdjustStockPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Adjust Stock"
        description="Stocktake, damage, samples — inventory only. Never links to an invoice."
        action={{ label: '+ New adjustment', to: '/products/adjustments/new' }}
      />

      <Card className="border-border bg-muted/20">
        <CardContent className="py-3 text-sm text-muted-foreground">
          Use <strong className="text-foreground">Adjust Stock</strong> for corrections. Use{' '}
          <Link to="/sales/delivery-notes" className="text-link">
            Sales delivery notes
          </Link>{' '}
          when goods leave for a customer (COGS on sale).
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{col.number}</TableHead>
                <TableHead>{col.date}</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>{col.status}</TableHead>
                <TableHead className="text-right">Net qty</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryAdjustments.length === 0 ? (
                <EmptyTableRow colSpan={6} />
              ) : (
                inventoryAdjustments.map((adj) => {
                  const netQty = adj.lines.reduce((s, l) => s + l.quantity, 0)
                  const value = adj.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0)
                  return (
                    <TableRow key={adj.id}>
                      <TableCell>
                        <Link to={`/products/adjustments/${adj.id}`} className="text-link font-medium">
                          {adj.number}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(adj.date)}</TableCell>
                      <TableCell>{adjustmentReasonLabel(adj.reason)}</TableCell>
                      <TableCell>
                        <StockDocStatusBadge status={adj.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{netQty}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(Math.abs(value))}</TableCell>
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
