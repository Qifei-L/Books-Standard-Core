import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { TablePagination } from '@/components/shared/TablePagination'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { payments } from '@/data/mock'
import { formatDate, formatMoney } from '@/lib/utils'
import {
  getAdvanceAmount,
  getPaymentKind,
  type PaymentKind,
} from '@/types'
import { SoftStatusBadge } from '@/components/shared/StatusBadge'
import { useSalesSettings } from '@/contexts/SalesSettingsContext'
import { useSalesListPage } from '@/hooks/useSalesListPage'
import {
  countPaymentsByTab,
  defaultPaymentListTab,
  filterPayments,
  formatInvoiceDateFilterLabel,
  parsePaymentListTabFromParams,
  paymentListTabs,
  type PaymentListTab,
} from '@/lib/salesModuleListFilters'
import {
  getDateFilterState,
  getSalesCustomerOptions,
  paginateItems,
  salesListUrl,
  SALES_PAGE_SIZE_OPTIONS,
} from '@/lib/salesListQuery'
import {
  ActiveAdvancedFilterPills,
  SalesAdvancedFilterButton,
} from '@/components/sales/SalesAdvancedFilter'
import { SalesListSummary } from '@/components/sales/SalesListSummary'
import { SalesListViewsMenu } from '@/components/sales/SalesListViewsMenu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const kindLabels: Record<PaymentKind, string> = {
  Applied: 'Apply to invoices',
  Advance: 'Customer advance',
  Mixed: 'Mixed',
}

const kindTone: Record<PaymentKind, 'paid' | 'converted' | 'sent'> = {
  Applied: 'paid',
  Advance: 'converted',
  Mixed: 'sent',
}

function PaymentKindBadge({ kind }: { kind: PaymentKind }) {
  return <SoftStatusBadge label={kindLabels[kind]} tone={kindTone[kind]} />
}

export function PaymentsPage() {
  const { settings } = useSalesSettings()
  const allowAdvance = settings.allowUnallocatedReceipts

  const {
    query,
    status,
    setStatus,
    applyQuery,
    applyView,
    viewQuery,
    advancedFilterProps,
  } = useSalesListPage(defaultPaymentListTab, (params) =>
    parsePaymentListTabFromParams(params, allowAdvance),
  )

  const dateState = getDateFilterState(query)
  const dateLabel = formatInvoiceDateFilterLabel(dateState)
  const customerOptions = getSalesCustomerOptions()

  const visibleTabs = allowAdvance
    ? paymentListTabs
    : paymentListTabs.filter((t) => t.id !== 'advance')

  const scopedForStatusCounts = useMemo(
    () => filterPayments(payments, 'all', query),
    [query],
  )

  const statusCounts = useMemo(
    () => countPaymentsByTab(scopedForStatusCounts, query, allowAdvance),
    [scopedForStatusCounts, query, allowAdvance],
  )

  const filteredRows = useMemo(
    () => filterPayments(payments, status, query),
    [status, query],
  )

  const pagination = useMemo(
    () => paginateItems(filteredRows, query.page, query.pageSize),
    [filteredRows, query.page, query.pageSize],
  )

  const totalAmount = useMemo(
    () => filteredRows.reduce((s, p) => s + p.amount, 0),
    [filteredRows],
  )

  const summaryParts = useMemo(() => {
    const tabLabel = visibleTabs.find((t) => t.id === status)?.label.toLowerCase() ?? status
    const parts = [
      `${filteredRows.length} payment${filteredRows.length === 1 ? '' : 's'}`,
      tabLabel,
    ]
    if (dateLabel) parts.push(dateLabel.toLowerCase())
    if (
      filteredRows.length > 0 &&
      (pagination.rangeStart !== 1 || pagination.rangeEnd !== filteredRows.length)
    ) {
      parts.push(`showing ${pagination.rangeStart}–${pagination.rangeEnd}`)
    }
    if (filteredRows.length > 0) {
      parts.push(`${formatMoney(totalAmount)} received`)
    }
    return parts
  }, [filteredRows.length, status, visibleTabs, dateLabel, pagination, totalAmount])

  const customerIdSet = new Set(query.customerIds)

  const description = allowAdvance
    ? 'Apply to invoices (AR) or record unallocated amounts as customer advances (liability)'
    : 'Apply customer receipts to open invoices (accounts receivable)'

  return (
    <div className="space-y-4">
      <PageHeader
        className="mb-0"
        title="Receive Payments"
        description={description}
        action={{ label: '+ New Payment', to: '/sales/payments/new' }}
      >
        <SalesListViewsMenu module="payments" query={viewQuery} onApplyView={applyView} />
        <SalesAdvancedFilterButton
          entityLabel="payments"
          dateFieldMode="single"
          customerOptions={customerOptions}
          {...advancedFilterProps}
        />
      </PageHeader>

      <Tabs value={status} onValueChange={(v) => setStatus(v as PaymentListTab)} className="gap-4">
        <TabsList className="h-9 flex-wrap">
          {visibleTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-1.5">
              {tab.label}
              {statusCounts[tab.id] > 0 && (
                <span className="tabular-nums text-xs opacity-70">{statusCounts[tab.id]}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardContent className="p-0">
            <ActiveAdvancedFilterPills {...advancedFilterProps} />
            <SalesListSummary parts={summaryParts} />

            <div className="overflow-x-auto">
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
                  {pagination.items.length === 0 ? (
                    <EmptyTableRow colSpan={7} />
                  ) : (
                    pagination.items.map((p) => {
                      const allocated = p.allocations.reduce((s, a) => s + a.amount, 0)
                      const advance = getAdvanceAmount(p)
                      return (
                        <TableRow key={p.id}>
                          <TableCell>
                            <Link to={`/sales/payments/${p.id}`} className="text-link font-medium">
                              {p.number}
                            </Link>
                          </TableCell>
                          <TableCell className="max-w-[160px] truncate">
                            {customerIdSet.has(p.contactId) ? (
                              <span className="font-medium text-foreground">{p.contactName}</span>
                            ) : (
                              <Link
                                to={salesListUrl('/sales/payments', status, defaultPaymentListTab, [
                                  p.contactId,
                                ])}
                                className="text-link"
                                title={`Show all payments for ${p.contactName}`}
                              >
                                {p.contactName}
                              </Link>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(p.date)}</TableCell>
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
            </div>

            <TablePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              rangeStart={pagination.rangeStart}
              rangeEnd={pagination.rangeEnd}
              pageSize={pagination.pageSize}
              pageSizeOptions={SALES_PAGE_SIZE_OPTIONS}
              onPageChange={(nextPage) => applyQuery({ page: nextPage })}
              onPageSizeChange={(nextSize) => applyQuery({ pageSize: nextSize, page: 1 })}
            />
          </CardContent>
        </Card>
      </Tabs>
    </div>
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
                      <Link to={`/sales/invoices/${a.invoiceId}`} className="text-link">
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
            {allocated > 0 && (
              <div className="pl-4">Cr Accounts Receivable {formatMoney(allocated)}</div>
            )}
            {advance > 0 && (
              <div className="pl-4">Cr Customer Advances (Liability) {formatMoney(advance)}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Link to="/sales/payments" className="mt-4 inline-block text-sm text-link">
        ← Back to list
      </Link>
    </div>
  )
}
