import { Link, useParams, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { payments } from '@/data/mock'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import {
  getAdvanceAmount,
  getPaymentKind,
  type PaymentKind,
} from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatDate, formatMoney } from '@/lib/utils'

const kindLabels: Record<PaymentKind, string> = {
  Applied: 'Apply to invoices',
  Advance: 'Customer advance',
  Mixed: 'Mixed',
}

const kindStyles: Record<PaymentKind, string> = {
  Applied: 'bg-green-100 text-green-700',
  Advance: 'bg-violet-100 text-violet-700',
  Mixed: 'bg-blue-100 text-blue-700',
}

function PaymentKindBadge({ kind }: { kind: PaymentKind }) {
  return (
    <Badge variant="secondary" className={cn('font-normal', kindStyles[kind])}>
      {kindLabels[kind]}
    </Badge>
  )
}

function filterByTab(items: typeof payments, tab: string) {
  if (tab === 'all') return items
  if (tab === 'advance') return items.filter((p) => getAdvanceAmount(p) > 0)
  return items.filter((p) => p.allocations.length > 0)
}

export function PaymentsPage() {
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'advance' ? 'advance' : 'all'

  return (
    <div>
      <PageHeader
        title="Receive Payments"
        description="Apply to invoices (AR) or record unallocated amounts as customer advances (liability)"
        action={{ label: '+ New Payment', to: '/sales/payments/new' }}
      />

      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="applied">Applied / Mixed</TabsTrigger>
          <TabsTrigger value="advance">Advances only</TabsTrigger>
        </TabsList>
        {(['all', 'applied', 'advance'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <PaymentTable data={filterByTab(payments, tab)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function PaymentTable({ data }: { data: typeof payments }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{col.number}</TableHead>
              <TableHead>{col.customer}</TableHead>
              <TableHead>{col.date}</TableHead>
              <TableHead className="text-right">{col.amount}</TableHead>
              <TableHead className="text-right">To A/R</TableHead>
              <TableHead className="text-right">To advance</TableHead>
              <TableHead>{col.type}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <EmptyTableRow colSpan={7} />
            ) : (
              data.map((p) => {
              const allocated = p.allocations.reduce((s, a) => s + a.amount, 0)
              const advance = getAdvanceAmount(p)
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link
                      to={`/sales/payments/${p.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {p.number}
                    </Link>
                  </TableCell>
                  <TableCell>{p.contactName}</TableCell>
                  <TableCell>{formatDate(p.date)}</TableCell>
                  <TableCell className="text-right">
                    <MoneyDisplay amount={p.amount} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {allocated > 0 ? formatMoney(allocated) : '—'}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {advance > 0 ? formatMoney(advance) : '—'}
                  </TableCell>
                  <TableCell>
                    <PaymentKindBadge kind={getPaymentKind(p)} />
                  </TableCell>
                </TableRow>
              )
            })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function PaymentDetailPage() {
  const { id } = useParams()
  const payment = payments.find((p) => p.id === id) ?? payments[0]
  const allocated = payment.allocations.reduce((s, a) => s + a.amount, 0)
  const advance = getAdvanceAmount(payment)
  const kind = getPaymentKind(payment)

  return (
    <div>
      <PageHeader title={payment.number} description={`Customer: ${payment.contactName}`}>
        <PaymentKindBadge kind={kind} />
      </PageHeader>

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Date</CardTitle>
          </CardHeader>
          <CardContent>{formatDate(payment.date)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total received</CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay amount={payment.amount} className="text-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Customer advance</CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay amount={advance} className="text-lg" />
          </CardContent>
        </Card>
      </div>

      {payment.allocations.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Invoice allocation (Accounts Receivable)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Applied amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payment.allocations.map((a) => (
                  <TableRow key={a.invoiceId}>
                    <TableCell>
                      <Link
                        to={`/sales/invoices/${a.invoiceId}`}
                        className="text-primary hover:underline"
                      >
                        {a.invoiceNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <MoneyDisplay amount={a.amount} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell>Subtotal to AR</TableCell>
                  <TableCell className="text-right">{formatMoney(allocated)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {advance > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Customer advance (liability)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Unallocated amount posted to <strong>Customer Advances</strong> (预收账款) until
              applied to a future invoice.
            </p>
            <div className="flex justify-between rounded-lg border bg-violet-50 px-4 py-3">
              <span>Advance balance from this receipt</span>
              <MoneyDisplay amount={advance} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounting entry (preview)</CardTitle>
        </CardHeader>
        <CardContent className="font-mono text-sm">
          <div className="space-y-1">
            <div>Dr Bank {formatMoney(payment.amount)}</div>
            {allocated > 0 && <div className="pl-4">Cr Accounts Receivable {formatMoney(allocated)}</div>}
            {advance > 0 && (
              <div className="pl-4">Cr Customer Advances (Liability) {formatMoney(advance)}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Link to="/sales/payments" className="mt-4 inline-block text-sm text-primary hover:underline">
        ← Back to list
      </Link>
    </div>
  )
}
