import { Link, useParams } from 'react-router-dom'
import { DetailBreadcrumb } from '@/components/shared/DocumentDetail'
import { PageHeader } from '@/components/shared/PageHeader'
import { columns as col } from '@/components/shared/DataTable'
import { StockDocStatusBadge } from '@/components/stock/StockStatusBadges'
import { inventoryAdjustments } from '@/data/mock'
import { adjustmentReasonLabel } from '@/lib/stockDocuments'
import { formatMoney } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function AdjustmentDetailPage() {
  const { id } = useParams()
  const adj = inventoryAdjustments.find((a) => a.id === id) ?? inventoryAdjustments[0]

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Adjust Stock', to: '/products/adjustments' },
          { label: adj.number },
        ]}
      />

      <PageHeader title={adj.number} description={adjustmentReasonLabel(adj.reason)}>
        <StockDocStatusBadge status={adj.status} />
      </PageHeader>

      <Card className="border-border">
        <CardContent className="py-3 text-sm text-muted-foreground">
          Inventory adjustment — not linked to billing. No invoice or delivery note billing status.
        </CardContent>
      </Card>

      {adj.narration && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{adj.narration}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lines</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{col.code}</TableHead>
                <TableHead>{col.description}</TableHead>
                <TableHead className="text-right">Qty change</TableHead>
                <TableHead className="text-right">Unit cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adj.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-mono text-sm">
                    <Link to={`/products/items/${line.itemId}`} className="text-link">
                      {line.itemCode}
                    </Link>
                  </TableCell>
                  <TableCell>{line.description}</TableCell>
                  <TableCell className="text-right tabular-nums">{line.quantity}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(line.unitCost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Accounting preview</CardTitle>
        </CardHeader>
        <CardContent className="font-mono text-sm text-muted-foreground">
          Adjustment posts to inventory and expense/income accounts — not sales COGS workflow.
        </CardContent>
      </Card>
    </div>
  )
}
