import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { columns as col } from '@/components/shared/DataTable'
import { accounts } from '@/data/mock'
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

const typeLabels = {
  Asset: 'Assets',
  Liability: 'Liabilities',
  Equity: 'Equity',
  Revenue: 'Revenue',
  Expense: 'Expenses',
} as const

const groups = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as const

export function ChartOfAccountsPage() {
  return (
    <div>
      <PageHeader
        title="Chart of Accounts"
        description="General ledger account structure"
        action={{ label: '+ New Account' }}
      />
      {groups.map((type) => {
        const groupAccounts = accounts.filter((a) => a.type === type)
        if (groupAccounts.length === 0) return null
        return (
          <Card key={type} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{typeLabels[type]}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">{col.code}</TableHead>
                    <TableHead>{col.accountName}</TableHead>
                    <TableHead className="text-right">{col.balance}</TableHead>
                    <TableHead className="w-24 text-right">{col.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupAccounts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-sm">{a.code}</TableCell>
                      <TableCell>{a.name}</TableCell>
                      <TableCell className="text-right">
                        <MoneyDisplay amount={Math.abs(a.balance)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
