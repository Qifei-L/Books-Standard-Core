import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { TablePagination } from '@/components/shared/TablePagination'
import { InvoiceStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { invoices } from '@/data/mock'
import type { Invoice } from '@/types'
import { cn, formatDate, formatMoney } from '@/lib/utils'
import {
  countInvoicesByListFilter,
  invoiceListFilters,
  type InvoiceListFilter,
} from '@/lib/invoiceListFilters'
import { defaultInvoiceDateFilter, matchInvoiceDateFilter } from '@/lib/invoiceDateFilters'
import {
  buildInvoiceListParams,
  filterInvoicesByQuery,
  formatInvoiceDateFilterLabel,
  getDateFilterState,
  getInvoiceCustomerOptions,
  INVOICE_PAGE_SIZE_OPTIONS,
  invoicesListUrl,
  paginateItems,
  parseInvoiceListSearchParams,
  type InvoiceListQuery,
} from '@/lib/invoiceListParams'
import type { InvoiceListViewDefinition } from '@/lib/invoiceListViews'
import { daysFromToday, formatDueLabel, invoiceBalance } from '@/lib/salesDates'
import {
  ActiveAdvancedFilterPills,
  InvoiceAdvancedFilterButton,
} from '@/components/sales/InvoiceListFilters'
import { InvoiceListViewsMenu } from '@/components/sales/InvoiceListViewsMenu'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const filterLabels = Object.fromEntries(invoiceListFilters.map((f) => [f.id, f.label])) as Record<
  InvoiceListFilter,
  string
>

const customerOptions = getInvoiceCustomerOptions()

function summarizeRows(rows: Invoice[]) {
  let balanceTotal = 0
  let openCount = 0
  for (const inv of rows) {
    const balance = invoiceBalance(inv.total, inv.amountPaid)
    if (balance > 0) {
      balanceTotal += balance
      openCount += 1
    }
  }
  return { count: rows.length, balanceTotal, openCount }
}

function ListSummary({
  filter,
  count,
  openCount,
  balanceTotal,
  rangeStart,
  rangeEnd,
  dateLabel,
}: {
  filter: InvoiceListFilter
  count: number
  openCount: number
  balanceTotal: number
  rangeStart: number
  rangeEnd: number
  dateLabel: string | null
}) {
  const filterLabel = filterLabels[filter]
  const parts: string[] = [
    `${count} invoice${count === 1 ? '' : 's'}`,
    filterLabel.toLowerCase(),
  ]

  if (dateLabel) parts.push(dateLabel.toLowerCase())

  if (count > 0 && (rangeStart !== 1 || rangeEnd !== count)) {
    parts.push(`showing ${rangeStart}–${rangeEnd}`)
  }

  if (openCount > 0) {
    parts.push(`${formatMoney(balanceTotal)} balance due`)
  }

  return (
    <div className="border-b border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
      {parts.join(' · ')}
    </div>
  )
}

export function InvoicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = parseInvoiceListSearchParams(searchParams)
  const dateState = getDateFilterState(query)
  const dateLabel = formatInvoiceDateFilterLabel(dateState)

  const scopedForStatusCounts = useMemo(() => {
    return invoices.filter((inv) => {
      if (query.customerIds.length > 0 && !query.customerIds.includes(inv.contactId)) return false
      return matchInvoiceDateFilter(inv, dateState)
    })
  }, [query.customerIds, dateState])

  const statusCounts = useMemo(
    () => countInvoicesByListFilter(scopedForStatusCounts),
    [scopedForStatusCounts],
  )

  const filteredRows = useMemo(() => filterInvoicesByQuery(invoices, query), [query])

  const pagination = useMemo(
    () => paginateItems(filteredRows, query.page, query.pageSize),
    [filteredRows, query.page, query.pageSize],
  )

  const summary = useMemo(() => summarizeRows(filteredRows), [filteredRows])

  const applyQuery = (next: Partial<InvoiceListQuery>, resetPage = false) => {
    const merged: InvoiceListQuery = {
      status: next.status ?? query.status,
      customerIds: next.customerIds ?? query.customerIds,
      dateField: next.dateField ?? query.dateField,
      datePreset: next.datePreset ?? query.datePreset,
      dateFrom: next.dateFrom !== undefined ? next.dateFrom : query.dateFrom,
      dateTo: next.dateTo !== undefined ? next.dateTo : query.dateTo,
      page: resetPage ? 1 : (next.page ?? query.page),
      pageSize: next.pageSize ?? query.pageSize,
    }
    setSearchParams(buildInvoiceListParams(merged))
  }

  const setStatus = (status: InvoiceListFilter) => {
    applyQuery({ status }, true)
  }

  const clearAdvancedFilters = () => {
    applyQuery(
      {
        customerIds: [],
        dateField: defaultInvoiceDateFilter.field,
        datePreset: 'any',
        dateFrom: null,
        dateTo: null,
      },
      true,
    )
  }

  const applyView = (view: InvoiceListViewDefinition) => {
    applyQuery(
      {
        status: view.status,
        customerIds: view.customerIds,
        dateField: view.dateField,
        datePreset: view.datePreset,
        dateFrom: view.dateFrom,
        dateTo: view.dateTo,
      },
      true,
    )
  }

  const viewQuery = {
    status: query.status,
    customerIds: query.customerIds,
    dateField: query.dateField,
    datePreset: query.datePreset,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  }

  const applyAdvancedFilters = (draft: Pick<
    InvoiceListQuery,
    'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'
  >) => {
    applyQuery(draft, true)
  }

  const advancedFilterProps = {
    query: {
      customerIds: query.customerIds,
      dateField: query.dateField,
      datePreset: query.datePreset,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    },
    customerOptions,
    onApplyAdvanced: applyAdvancedFilters,
    onClearAdvanced: clearAdvancedFilters,
    onCustomerIdsChange: (customerIds: string[]) => applyQuery({ customerIds }, true),
    onDateFieldChange: (dateField: InvoiceListQuery['dateField']) =>
      applyQuery({ dateField }, true),
    onDatePresetChange: (datePreset: InvoiceListQuery['datePreset']) =>
      applyQuery({ datePreset, dateFrom: null, dateTo: null }, true),
    onDateFromChange: (dateFrom: string | null) => applyQuery({ dateFrom }, true),
    onDateToChange: (dateTo: string | null) => applyQuery({ dateTo }, true),
  }

  const showStatusColumn = query.status === 'all'
  const customerIdSet = new Set(query.customerIds)

  return (
    <div className="space-y-4">
      <PageHeader
        className="mb-0"
        title="Sales Invoices"
        description="Accounts receivable — customer billing"
        action={{ label: '+ New Invoice', to: '/sales/invoices/new' }}
      >
        <InvoiceListViewsMenu query={viewQuery} onApplyView={applyView} />
        <InvoiceAdvancedFilterButton {...advancedFilterProps} />
      </PageHeader>

      <Tabs value={query.status} onValueChange={(v) => setStatus(v as InvoiceListFilter)} className="gap-4">
        <TabsList className="h-9 flex-wrap">
          {invoiceListFilters.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="gap-1.5">
              {f.label}
              {statusCounts[f.id] > 0 && (
                <span className="tabular-nums text-xs opacity-70">{statusCounts[f.id]}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardContent className="p-0">
            <ActiveAdvancedFilterPills {...advancedFilterProps} />

            <ListSummary
              filter={query.status}
              count={summary.count}
              openCount={summary.openCount}
              balanceTotal={summary.balanceTotal}
              rangeStart={pagination.rangeStart}
              rangeEnd={pagination.rangeEnd}
              dateLabel={dateLabel}
            />

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{col.number}</TableHead>
                    <TableHead>{col.customer}</TableHead>
                    <TableHead>{col.date}</TableHead>
                    <TableHead>{col.dueDate}</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {showStatusColumn && <TableHead>{col.status}</TableHead>}
                    <TableHead className="w-[100px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.items.length === 0 ? (
                    <EmptyTableRow colSpan={showStatusColumn ? 7 : 6} />
                  ) : (
                    pagination.items.map((inv) => {
                      const balance = invoiceBalance(inv.total, inv.amountPaid)
                      const days = daysFromToday(inv.dueDate)
                      const isOpen = balance > 0
                      const isOverdue = inv.status === 'Overdue' || (isOpen && days < 0)
                      const isPartial = inv.amountPaid > 0 && isOpen

                      return (
                        <TableRow key={inv.id}>
                          <TableCell>
                            <Link to={`/sales/invoices/${inv.id}`} className="text-link font-medium">
                              {inv.number}
                            </Link>
                          </TableCell>
                          <TableCell className="max-w-[160px] truncate">
                            {customerIdSet.has(inv.contactId) ? (
                              <span className="font-medium text-foreground">{inv.contactName}</span>
                            ) : (
                              <Link
                                to={invoicesListUrl(query.status, [inv.contactId])}
                                className="text-link"
                                title={`Show all invoices for ${inv.contactName}`}
                              >
                                {inv.contactName}
                              </Link>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(inv.date)}</TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(inv.dueDate)}</div>
                            {isOpen && (
                              <div className={cn('text-xs', isOverdue ? 'text-danger' : 'text-muted-foreground')}>
                                {formatDueLabel(days, 'due')}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {isOpen ? (
                              <div>
                                <MoneyDisplay amount={balance} className="font-medium" />
                                {isPartial && (
                                  <div className="text-xs text-muted-foreground">
                                    of {formatMoney(inv.total)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <MoneyDisplay amount={inv.total} />
                            )}
                          </TableCell>
                          {showStatusColumn && (
                            <TableCell>
                              <InvoiceStatusBadge status={inv.status} />
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            {isOpen ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7"
                                render={
                                  <Link
                                    to={
                                      isOverdue
                                        ? `/sales/invoices/${inv.id}`
                                        : `/sales/payments/new?invoice=${inv.id}`
                                    }
                                  />
                                }
                              >
                                {isOverdue ? 'Reminder' : 'Receive'}
                              </Button>
                            ) : null}
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
              pageSizeOptions={INVOICE_PAGE_SIZE_OPTIONS}
              onPageChange={(nextPage) => applyQuery({ page: nextPage })}
              onPageSizeChange={(nextSize) => applyQuery({ pageSize: nextSize, page: 1 }, false)}
            />
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
