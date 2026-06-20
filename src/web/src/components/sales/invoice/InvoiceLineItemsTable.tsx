import { Link } from 'react-router-dom'
import { ItemTypeBadge } from '@/components/products/ItemTypeBadge'
import { LineItemTotals } from '@/components/shared/DocumentDetail'
import { columns as col } from '@/components/shared/DataTable'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { getAccountLabel, getItem } from '@/lib/items'
import { formatMoney } from '@/lib/utils'
import type { Invoice } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface InvoiceLineItemsTableProps {
  invoice: Pick<Invoice, 'lines' | 'subtotal' | 'tax' | 'total'>
  amountPaid?: number
  taxLabel?: string
  title?: string
}

export function InvoiceLineItemsTable({
  invoice,
  amountPaid = 0,
  taxLabel,
  title = 'Line items',
}: InvoiceLineItemsTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">{col.code}</TableHead>
              <TableHead>{col.description}</TableHead>
              <TableHead className="text-right">{col.qty}</TableHead>
              <TableHead className="text-right">{col.unitPrice}</TableHead>
              <TableHead className="text-right">{col.amount}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.lines.map((line) => {
              const item = getItem(line.itemId)
              return (
                <TableRow key={line.id}>
                  <TableCell className="font-mono text-xs">
                    {line.itemId ? (
                      <div className="space-y-1">
                        <Link to={`/products/items/${line.itemId}`} className="text-link">
                          {line.itemCode ?? item?.code}
                        </Link>
                        {item && <ItemTypeBadge type={item.itemType} className="text-[10px]" />}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Ad-hoc</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{line.description}</div>
                    {line.revenueAccountId && (
                      <div className="text-xs text-muted-foreground">
                        {getAccountLabel(line.revenueAccountId)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{line.quantity}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(line.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <MoneyDisplay amount={line.amount} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <LineItemTotals
          subtotal={invoice.subtotal}
          tax={invoice.tax}
          total={invoice.total}
          amountPaid={amountPaid}
          taxLabel={taxLabel}
        />
      </CardContent>
    </Card>
  )
}
