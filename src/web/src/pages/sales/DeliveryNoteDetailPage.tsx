import { Link, useParams } from 'react-router-dom'
import { DetailBreadcrumb } from '@/components/shared/DocumentDetail'
import { PageHeader } from '@/components/shared/PageHeader'
import { columns as col } from '@/components/shared/DataTable'
import { BillingStatusBadge, StockDocStatusBadge } from '@/components/stock/StockStatusBadges'
import { getSalesDeliveryNote, billingStatusLabel } from '@/lib/stockDocuments'
import { getAccountLabel, getItem } from '@/lib/items'
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

export function DeliveryNoteDetailPage() {
  const { id } = useParams()
  const dn = getSalesDeliveryNote(id ?? '') ?? getSalesDeliveryNote('dn2')!

  const totalCogs = dn.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0)

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Delivery Notes', to: '/sales/delivery-notes' },
          { label: dn.number },
        ]}
      />

      <PageHeader title={dn.number} description={dn.contactName ?? 'Sales shipment'}>
        <StockDocStatusBadge status={dn.status} />
        <BillingStatusBadge
          status={dn.billingStatus}
          label={billingStatusLabel(dn.billingStatus)}
        />
        {dn.billingStatus === 'not_invoiced' && (
          <Button render={<Link to="/sales/invoices/new" />}>Create invoice</Button>
        )}
      </PageHeader>

      {dn.billingStatus === 'not_invoiced' && (
        <Card className="border-amber-200 bg-amber-50/60">
          <CardContent className="py-3 text-sm text-amber-950">
            Shipped but not invoiced — revenue and AR are not posted yet. This is normal for
            ship-first workflows; create an invoice when ready.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Date</CardTitle>
          </CardHeader>
          <CardContent>{formatDate(dn.date)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Linked invoice</CardTitle>
          </CardHeader>
          <CardContent>
            {dn.invoiceId ? (
              <Link to={`/sales/invoices/${dn.invoiceId}`} className="text-link">
                {dn.invoiceNumber}
              </Link>
            ) : (
              '—'
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">COGS total</CardTitle>
          </CardHeader>
          <CardContent className="font-semibold tabular-nums">{formatMoney(totalCogs)}</CardContent>
        </Card>
      </div>

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
                <TableHead className="text-right">{col.qty}</TableHead>
                <TableHead className="text-right">Unit cost</TableHead>
                <TableHead className="text-right">COGS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dn.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-mono text-sm">
                      <Link to={`/products/items/${line.itemId}`} className="text-link">
                        {line.itemCode}
                      </Link>
                    </TableCell>
                    <TableCell>{line.description}</TableCell>
                    <TableCell className="text-right tabular-nums">{line.quantity}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(line.unitCost)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(line.quantity * line.unitCost)}
                    </TableCell>
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
        <CardContent className="space-y-2 font-mono text-sm text-muted-foreground">
          {dn.lines.map((line) => {
            const item = getItem(line.itemId)
            const amount = line.quantity * line.unitCost
            if (!item || amount === 0) return null
            return (
              <div key={line.id}>
                Dr {item.cogsAccountId ? getAccountLabel(item.cogsAccountId) : 'COGS'}{' '}
                {formatMoney(amount)}
                <div className="pl-4">
                  Cr {item.inventoryAccountId ? getAccountLabel(item.inventoryAccountId) : 'Inventory'}{' '}
                  {formatMoney(amount)}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
