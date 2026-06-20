import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { bankAccounts, bankTransactions, invoices } from '@/data/mock'
import { formatDate, formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { SoftStatusBadge } from '@/components/shared/StatusBadge'

export function BankReconciliationPage() {
  const [selected, setSelected] = useState<string[]>([])
  const account = bankAccounts[0]
  const unreconciled = bankTransactions.filter((t) => !t.reconciled && t.bankAccountId === account.id)

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div>
      <PageHeader title="银行对账" description="Xero 风格 — 左右分栏匹配流水" />

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
        <div>
          <div className="text-sm text-muted-foreground">账户</div>
          <div className="font-medium">{account.name}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">对账单余额</div>
          <MoneyDisplay amount={account.feedBalance} />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Xero 账面余额</div>
          <MoneyDisplay amount={account.balance} />
        </div>
        <SoftStatusBadge label={`${unreconciled.length} 笔待对账`} tone="partial" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">未对账流水</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unreconciled.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary/80"
              >
                <Checkbox
                  checked={selected.includes(tx.id)}
                  onCheckedChange={() => toggle(tx.id)}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{tx.description}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(tx.date)}</div>
                </div>
                <MoneyDisplay
                  amount={tx.amount}
                  negative={tx.amount < 0 ? 'red' : 'green'}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">匹配建议</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selected.length === 0 ? (
              <p className="text-sm text-muted-foreground">请在左侧选择流水以查看匹配建议</p>
            ) : (
              <>
                <div className="rounded-lg border border-primary/30 bg-accent/50 p-4">
                  <div className="text-sm text-muted-foreground">建议匹配</div>
                  <div className="mt-1 font-medium">发票 {invoices[0].number}</div>
                  <div className="text-sm">{invoices[0].contactName}</div>
                  <div className="mt-2"><MoneyDisplay amount={invoices[0].total} /></div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">匹配</Button>
                  <Button variant="outline" className="flex-1">创建交易</Button>
                  <Button variant="ghost" className="flex-1">转账</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  已选 {selected.length} 笔，合计 {formatMoney(
                    unreconciled
                      .filter((t) => selected.includes(t.id))
                      .reduce((s, t) => s + t.amount, 0),
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Button disabled={selected.length === 0}>
          对账选中项 ({selected.length})
        </Button>
      </div>
    </div>
  )
}
