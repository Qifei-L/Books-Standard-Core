import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MoneyDisplay } from './MoneyDisplay'
import { formatDate, formatMoney } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface DocumentLinkRow {
  id: string
  to?: string
  number: string
  date: string
  /** Small label rendered above the document number to indicate type (e.g. "Quotation"). */
  typeLabel?: string
  status?: ReactNode
  amount?: number
}

interface DocumentLinksSectionProps {
  title: string
  action?: ReactNode
  rows: DocumentLinkRow[]
  emptyMessage?: ReactNode
  columns?: {
    /** Header label for the document-number column. Default: 'Document' */
    number?: string
    /** Header label for the amount column. Default: 'Amount' */
    amount?: string
  }
  /** Optional summary row shown at the bottom (e.g. "Total applied"). */
  totalRow?: { label: string; amount: number }
}

export function DocumentLinksSection({
  title,
  action,
  rows,
  emptyMessage = 'No documents.',
  columns = {},
  totalRow,
}: DocumentLinksSectionProps) {
  const numberLabel = columns.number ?? 'Document'
  const amountLabel = columns.amount ?? 'Amount'

  const hasStatus = rows.some((r) => r.status != null)
  const hasAmount = rows.some((r) => r.amount != null) || totalRow != null
  // colCount drives the totalRow colSpan
  const colCount = 2 + (hasStatus ? 1 : 0) + (hasAmount ? 1 : 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{numberLabel}</TableHead>
                <TableHead>Date</TableHead>
                {hasStatus && <TableHead>Status</TableHead>}
                {hasAmount && (
                  <TableHead className="text-right">{amountLabel}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.typeLabel && (
                      <div className="text-xs text-muted-foreground">{row.typeLabel}</div>
                    )}
                    {row.to ? (
                      <Link to={row.to} className="font-medium text-link hover:underline">
                        {row.number}
                      </Link>
                    ) : (
                      <span className="font-medium">{row.number}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(row.date)}
                  </TableCell>
                  {hasStatus && (
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">{row.status}</div>
                    </TableCell>
                  )}
                  {hasAmount && (
                    <TableCell className="text-right">
                      {row.amount != null ? <MoneyDisplay amount={row.amount} /> : null}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {totalRow && (
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell colSpan={colCount - 1}>{totalRow.label}</TableCell>
                  <TableCell className="text-right">
                    {formatMoney(totalRow.amount)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
