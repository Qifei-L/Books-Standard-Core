import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DocStatusBadge } from '@/components/shared/StatusBadge'
import { columns as col } from '@/components/shared/DataTable'
import { journalEntries } from '@/data/mock'
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
import { cn } from '@/lib/utils'

export function ManualJournalsPage() {
  return (
    <div>
      <PageHeader
        title="Manual Journals"
        description="Double-entry — debits must equal credits"
        action={{ label: '+ New Journal', to: '/accounting/manual-journals/new' }}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{col.date}</TableHead>
                <TableHead>{col.narration}</TableHead>
                <TableHead className="text-right">{col.debitTotal}</TableHead>
                <TableHead className="text-right">{col.creditTotal}</TableHead>
                <TableHead>{col.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalEntries.map((je) => {
                const debit = je.lines.reduce((s, l) => s + l.debit, 0)
                const credit = je.lines.reduce((s, l) => s + l.credit, 0)
                return (
                  <TableRow key={je.id}>
                    <TableCell>{formatDate(je.date)}</TableCell>
                    <TableCell>
                      <Link
                        to={`/accounting/manual-journals/${je.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {je.narration}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">{formatMoney(debit)}</TableCell>
                    <TableCell className="text-right">{formatMoney(credit)}</TableCell>
                    <TableCell>
                      <DocStatusBadge status={je.status === 'Posted' ? 'Posted' : 'Draft'} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function JournalDetailPage() {
  const { id } = useParams()
  const entry = journalEntries.find((j) => j.id === id) ?? journalEntries[0]

  const { debitTotal, creditTotal, balanced } = useMemo(() => {
    const debitTotal = entry.lines.reduce((s, l) => s + l.debit, 0)
    const creditTotal = entry.lines.reduce((s, l) => s + l.credit, 0)
    return { debitTotal, creditTotal, balanced: debitTotal === creditTotal }
  }, [entry.lines])

  return (
    <div>
      <PageHeader title="Manual Journal" description={entry.narration}>
        <DocStatusBadge status={entry.status === 'Posted' ? 'Posted' : 'Draft'} />
        {entry.status === 'Draft' && (
          <>
            <Button variant="outline">Save draft</Button>
            <Button disabled={!balanced}>Post</Button>
          </>
        )}
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{formatDate(entry.date)}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">{col.code}</TableHead>
                <TableHead>{col.accountName}</TableHead>
                <TableHead className="text-right">{col.debit}</TableHead>
                <TableHead className="text-right">{col.credit}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entry.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-mono">{line.accountCode}</TableCell>
                  <TableCell>{line.accountName}</TableCell>
                  <TableCell className="text-right">
                    {line.debit > 0 ? formatMoney(line.debit) : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {line.credit > 0 ? formatMoney(line.credit) : '—'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-medium">
                <TableCell colSpan={2} className="text-right">
                  Total
                </TableCell>
                <TableCell className="text-right">{formatMoney(debitTotal)}</TableCell>
                <TableCell className="text-right">{formatMoney(creditTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!balanced && (
        <p className="mt-2 text-sm text-destructive">
          Out of balance by {formatMoney(Math.abs(debitTotal - creditTotal))}
        </p>
      )}
      {balanced && entry.status === 'Draft' && (
        <p className={cn('mt-2 text-sm text-green-600')}>Debits and credits balance</p>
      )}

      <Link
        to="/accounting/manual-journals"
        className="mt-4 inline-block text-sm text-primary hover:underline"
      >
        ← Back to list
      </Link>
    </div>
  )
}
