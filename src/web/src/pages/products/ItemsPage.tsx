import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { ItemTypeBadge } from '@/components/products/ItemTypeBadge'
import { items } from '@/data/mock'
import { getAccountLabel } from '@/lib/items'
import type { ItemType } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ItemTab = 'all' | ItemType

function filterItems(tab: ItemTab) {
  if (tab === 'all') return items
  return items.filter((i) => i.itemType === tab)
}

export function ItemsPage() {
  const [tab, setTab] = useState<ItemTab>('all')
  const rows = useMemo(() => filterItems(tab), [tab])

  const counts = useMemo(
    () => ({
      all: items.length,
      Untracked: items.filter((i) => i.itemType === 'Untracked').length,
      Tracked: items.filter((i) => i.itemType === 'Tracked').length,
    }),
    [],
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Items"
        description="Products and services for quotes, invoices, and bills — sales account on invoice; COGS on delivery note (tracked only)"
        action={{ label: '+ New Item', to: '/products/items/new' }}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ItemTab)} className="gap-4">
        <TabsList className="h-9">
          <TabsTrigger value="all" className="gap-1.5">
            All
            <span className="tabular-nums text-xs opacity-70">{counts.all}</span>
          </TabsTrigger>
          <TabsTrigger value="Untracked" className="gap-1.5">
            Service
            <span className="tabular-nums text-xs opacity-70">{counts.Untracked}</span>
          </TabsTrigger>
          <TabsTrigger value="Tracked" className="gap-1.5">
            Tracked
            <span className="tabular-nums text-xs opacity-70">{counts.Tracked}</span>
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">{col.code}</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sales account</TableHead>
                    <TableHead className="text-right">Default price</TableHead>
                    <TableHead className="text-right">On hand</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <EmptyTableRow colSpan={6} />
                  ) : (
                    rows.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">
                          <Link to={`/products/items/${item.id}`} className="text-link font-medium">
                            {item.code}
                          </Link>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <ItemTypeBadge type={item.itemType} />
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {getAccountLabel(item.salesAccountId)}
                        </TableCell>
                        <TableCell className="text-right">
                          <MoneyDisplay amount={item.defaultUnitPrice} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {item.itemType === 'Tracked' ? (item.quantityOnHand ?? 0) : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
