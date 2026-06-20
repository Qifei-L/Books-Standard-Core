import { Link } from 'react-router-dom'
import { SoftStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { invoices, payments, quotations } from '@/data/mock'
import { getAdvanceAmount } from '@/types'
import {
  daysFromToday,
  formatDueLabel,
  invoiceBalance,
} from './utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ActionType = 'Overdue' | 'Due soon' | 'Quote' | 'Advance'

interface ActionRow {
  id: string
  type: ActionType
  partner: string
  document: string
  documentLink: string
  statusLabel: string
  amount: number
  actionLabel: string
  actionLink: string
  sortKey: number
}

const typeTone: Record<ActionType, 'overdue' | 'partial' | 'sent' | 'info'> = {
  Overdue: 'overdue',
  'Due soon': 'partial',
  Quote: 'sent',
  Advance: 'info',
}

function buildActionQueue(): ActionRow[] {
  const rows: ActionRow[] = []

  for (const inv of invoices) {
    const balance = invoiceBalance(inv.total, inv.amountPaid)
    if (balance <= 0 || inv.status === 'Paid') continue
    const days = daysFromToday(inv.dueDate)
    if (inv.status === 'Overdue' || days < 0) {
      rows.push({
        id: `inv-overdue-${inv.id}`,
        type: 'Overdue',
        partner: inv.contactName,
        document: inv.number,
        documentLink: `/sales/invoices/${inv.id}`,
        statusLabel: formatDueLabel(days, 'due'),
        amount: balance,
        actionLabel: 'Send reminder',
        actionLink: `/sales/invoices/${inv.id}`,
        sortKey: days,
      })
    } else if (days <= 7) {
      rows.push({
        id: `inv-soon-${inv.id}`,
        type: 'Due soon',
        partner: inv.contactName,
        document: inv.number,
        documentLink: `/sales/invoices/${inv.id}`,
        statusLabel: formatDueLabel(days, 'due'),
        amount: balance,
        actionLabel: 'View',
        actionLink: `/sales/invoices/${inv.id}`,
        sortKey: days,
      })
    }
  }

  for (const q of quotations) {
    if (!['Sent', 'Accepted'].includes(q.status)) continue
    const days = daysFromToday(q.validTill)
    if (days <= 14) {
      rows.push({
        id: `quote-${q.id}`,
        type: 'Quote',
        partner: q.contactName,
        document: q.number,
        documentLink: `/sales/quotes/${q.id}`,
        statusLabel: formatDueLabel(days, 'valid'),
        amount: q.total,
        actionLabel: 'Follow up',
        actionLink: `/sales/quotes/${q.id}`,
        sortKey: 100 + days,
      })
    }
  }

  for (const p of payments) {
    const advance = getAdvanceAmount(p)
    if (advance <= 0) continue
    rows.push({
      id: `adv-${p.id}`,
      type: 'Advance',
      partner: p.contactName,
      document: p.number,
      documentLink: `/sales/payments/${p.id}`,
      statusLabel: 'Unapplied',
      amount: advance,
      actionLabel: 'Apply',
      actionLink: `/sales/payments/${p.id}`,
      sortKey: 200,
    })
  }

  return rows.sort((a, b) => a.sortKey - b.sortKey)
}

export function ActionQueueCard() {
  const rows = buildActionQueue()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Action Queue</CardTitle>
        <p className="text-sm text-muted-foreground">Items that need follow-up</p>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-muted-foreground">No items need attention right now.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Business Partner</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Due / Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <SoftStatusBadge label={row.type} tone={typeTone[row.type]} />
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate">{row.partner}</TableCell>
                  <TableCell>
                    <Link to={row.documentLink} className="text-link">
                      {row.document}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.statusLabel}</TableCell>
                  <TableCell className="text-right">
                    <MoneyDisplay amount={row.amount} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7"
                      render={<Link to={row.actionLink} />}
                    >
                      {row.actionLabel}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
