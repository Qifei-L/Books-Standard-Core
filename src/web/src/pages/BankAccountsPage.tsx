import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { bankAccounts } from '@/data/mock'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function BankAccountsPage() {
  return (
    <div>
      <PageHeader title="Bank Accounts" description="Book balance vs bank feed" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account name</TableHead>
                <TableHead className="text-right">Book balance</TableHead>
                <TableHead className="text-right">Bank feed balance</TableHead>
                <TableHead>{col.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankAccounts.length === 0 ? (
                <EmptyTableRow colSpan={4} />
              ) : (
                bankAccounts.map((ba) => {
                  const mismatch = ba.balance !== ba.feedBalance
                  return (
                    <TableRow key={ba.id}>
                      <TableCell className="font-medium">{ba.name}</TableCell>
                      <TableCell className="text-right">
                        <MoneyDisplay amount={ba.balance} />
                      </TableCell>
                      <TableCell className="text-right">
                        <MoneyDisplay amount={ba.feedBalance} />
                      </TableCell>
                      <TableCell>
                        {mismatch ? (
                          <span className="flex items-center gap-1 text-sm text-warning">
                            <AlertCircle className="size-4" />
                            Out of sync
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-success">
                            <CheckCircle2 className="size-4" />
                            In sync
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
