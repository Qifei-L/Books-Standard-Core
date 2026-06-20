import { Link, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { DetailBreadcrumb } from '@/components/shared/DocumentDetail'
import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { ItemTypeBadge } from '@/components/products/ItemTypeBadge'
import { getItem, getAccountLabel } from '@/lib/items'
import { formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ItemDetailPage() {
  const { id } = useParams()
  const item = getItem(id) ?? getItem('i1')!

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Items', to: '/products/items' },
          { label: item.code },
        ]}
      />

      <PageHeader title={item.name} description={item.description ?? item.code}>
        <ItemTypeBadge type={item.itemType} />
        <Button variant="outline" render={<Link to={`/products/items/${item.id}/edit`} />}>
          Edit
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sales (invoice)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Code" value={item.code} mono />
            <Row label="Default price" value={<MoneyDisplay amount={item.defaultUnitPrice} />} />
            <Row label="Tax" value={item.taxRateLabel} />
            <Row label="Sales account" value={getAccountLabel(item.salesAccountId)} />
            <p className="text-xs text-muted-foreground">
              Invoice lines use this item for revenue posting (AR + sales account). COGS is not
              posted from the invoice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {item.itemType === 'Tracked' ? 'Inventory (delivery note)' : 'Delivery'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {item.itemType === 'Tracked' ? (
              <>
                <Row label="Qty on hand" value={String(item.quantityOnHand ?? 0)} />
                <Row label="Unit cost (avg)" value={formatMoney(item.unitCost ?? 0)} />
                <Row
                  label="Inventory account"
                  value={item.inventoryAccountId ? getAccountLabel(item.inventoryAccountId) : '—'}
                />
                <Row
                  label="COGS account"
                  value={item.cogsAccountId ? getAccountLabel(item.cogsAccountId) : '—'}
                />
                <p className="text-xs text-muted-foreground">
                  COGS and inventory update when a delivery note is posted — not when the invoice
                  is approved.
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Untracked service item. Optional delivery note records fulfillment only; no stock
                or COGS posting.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Posting summary</CardTitle>
        </CardHeader>
        <CardContent className="font-mono text-sm text-muted-foreground">
          {item.itemType === 'Tracked' ? (
            <div className="space-y-1">
              <div>Invoice: Dr AR · Cr {getAccountLabel(item.salesAccountId)}</div>
              <div>
                Delivery note: Dr {item.cogsAccountId ? getAccountLabel(item.cogsAccountId) : 'COGS'}{' '}
                · Cr {item.inventoryAccountId ? getAccountLabel(item.inventoryAccountId) : 'Inventory'}
              </div>
            </div>
          ) : (
            <div>Invoice: Dr AR · Cr {getAccountLabel(item.salesAccountId)}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? 'font-mono text-foreground' : 'text-foreground'}>{value}</span>
    </div>
  )
}
