import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { columns as col } from '@/components/shared/DataTable'
import { accounts, trialBalance } from '@/data/mock'
import { formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function TrialBalancePage() {
  const totalDebit = trialBalance.reduce((s, r) => s + r.debit, 0)
  const totalCredit = trialBalance.reduce((s, r) => s + r.credit, 0)

  return (
    <div>
      <PageHeader title="Trial Balance" description="Verify debits equal credits" />
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="as-of">As of</Label>
          <Input id="as-of" type="date" defaultValue="2025-06-20" className="w-44" />
        </div>
        <Button>Update report</Button>
      </div>
      <Card>
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
              {trialBalance.map((row) => (
                <TableRow key={row.accountCode}>
                  <TableCell className="font-mono text-sm">{row.accountCode}</TableCell>
                  <TableCell>{row.accountName}</TableCell>
                  <TableCell className="text-right">
                    {row.debit > 0 ? formatMoney(row.debit) : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.credit > 0 ? formatMoney(row.credit) : '—'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">{formatMoney(totalDebit)}</TableCell>
                <TableCell className="text-right">{formatMoney(totalCredit)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProfitAndLossPage() {
  const revenue = accounts.filter((a) => a.type === 'Revenue')
  const expenses = accounts.filter((a) => a.type === 'Expense')
  const totalRev = revenue.reduce((s, a) => s + Math.abs(a.balance), 0)
  const totalExp = expenses.reduce((s, a) => s + a.balance, 0)

  return (
    <div>
      <PageHeader title="Profit & Loss" description="Revenue and expense summary" />
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h3 className="mb-2 font-medium">Revenue</h3>
            {revenue.map((a) => (
              <div key={a.id} className="flex justify-between border-b py-2 text-sm">
                <span>{a.name}</span>
                <MoneyDisplay amount={Math.abs(a.balance)} />
              </div>
            ))}
            <div className="flex justify-between pt-2 font-medium">
              <span>Total revenue</span>
              <MoneyDisplay amount={totalRev} />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Expenses</h3>
            {expenses.map((a) => (
              <div key={a.id} className="flex justify-between border-b py-2 text-sm">
                <span>{a.name}</span>
                <MoneyDisplay amount={a.balance} />
              </div>
            ))}
            <div className="flex justify-between pt-2 font-medium">
              <span>Total expenses</span>
              <MoneyDisplay amount={totalExp} />
            </div>
          </div>
          <div className="flex justify-between border-t pt-4 text-lg font-semibold">
            <span>Net profit</span>
            <MoneyDisplay amount={totalRev - totalExp} className="text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function BalanceSheetPage() {
  const assets = accounts.filter((a) => a.type === 'Asset')
  const liabilities = accounts.filter((a) => a.type === 'Liability')
  const equity = accounts.filter((a) => a.type === 'Equity')

  const section = (title: string, items: typeof accounts) => (
    <div className="mb-6">
      <h3 className="mb-2 font-medium">{title}</h3>
      {items.map((a) => (
        <div key={a.id} className="flex justify-between border-b py-2 text-sm">
          <span>
            {a.code} {a.name}
          </span>
          <MoneyDisplay amount={Math.abs(a.balance)} />
        </div>
      ))}
      <div className="flex justify-between pt-2 font-medium">
        <span>Total {title.toLowerCase()}</span>
        <MoneyDisplay amount={items.reduce((s, a) => s + Math.abs(a.balance), 0)} />
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="Balance Sheet" description="Assets = Liabilities + Equity" />
      <Card>
        <CardContent className="pt-6">
          {section('Assets', assets)}
          {section('Liabilities', liabilities)}
          {section('Equity', equity)}
        </CardContent>
      </Card>
    </div>
  )
}
