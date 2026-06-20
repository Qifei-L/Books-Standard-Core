import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { TablePagination } from '@/components/shared/TablePagination'
import { QuotationStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { quotations } from '@/data/mock'
import { formatDate, formatMoney } from '@/lib/utils'
import { useSalesListPage } from '@/hooks/useSalesListPage'
import {
  countQuotesByTab,
  defaultQuoteListTab,
  filterQuotes,
  formatInvoiceDateFilterLabel,
  parseQuoteListTab,
  quoteListTabs,
  type QuoteListTab,
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

export function QuotationsPage() {
  const {
    query,
    status,
    setStatus,
    applyQuery,
    applyView,
    viewQuery,
    advancedFilterProps,
  } = useSalesListPage(defaultQuoteListTab, (params) =>
    parseQuoteListTab(params.get('status')),
  )

  const dateState = getDateFilterState(query)
  const dateLabel = formatInvoiceDateFilterLabel(dateState)
  const customerOptions = getSalesCustomerOptions()

  const scopedForStatusCounts = useMemo(
    () => filterQuotes(quotations, 'all', query),
    [query],
  )

  const statusCounts = useMemo(
    () => countQuotesByTab(scopedForStatusCounts, query),
    [scopedForStatusCounts, query],
  )

  const filteredRows = useMemo(
    () => filterQuotes(quotations, status, query),
    [status, query],
  )

  const pagination = useMemo(
    () => paginateItems(filteredRows, query.page, query.pageSize),
    [filteredRows, query.page, query.pageSize],
  )

  const totalAmount = useMemo(
    () => filteredRows.reduce((s, q) => s + q.total, 0),
    [filteredRows],
  )

  const summaryParts = useMemo(() => {
    const tabLabel = quoteListTabs.find((t) => t.id === status)?.label.toLowerCase() ?? status
    const parts = [
      `${filteredRows.length} quote${filteredRows.length === 1 ? '' : 's'}`,
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
      parts.push(`${formatMoney(totalAmount)} total value`)
    }
    return parts
  }, [filteredRows.length, status, dateLabel, pagination, totalAmount])

  const customerIdSet = new Set(query.customerIds)
  const showStatusColumn = status === 'all' || status === 'open'

  return (
    <div className="space-y-4">
      <PageHeader
        className="mb-0"
        title="Quotes"
        description="Draft → Sent → Accepted → Converted to Invoice"
        action={{ label: '+ New Quote', to: '/sales/quotes/new' }}
      >
        <SalesListViewsMenu module="quotes" query={viewQuery} onApplyView={applyView} />
        <SalesAdvancedFilterButton
          entityLabel="quotes"
          dateFieldMode="quote"
          customerOptions={customerOptions}
          {...advancedFilterProps}
        />
      </PageHeader>

      <Tabs value={status} onValueChange={(v) => setStatus(v as QuoteListTab)} className="gap-4">
        <TabsList className="h-9 flex-wrap">
          {quoteListTabs.map((tab) => (
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
                    <TableHead>{col.validTill}</TableHead>
                    <TableHead className="text-right">{col.amount}</TableHead>
                    {showStatusColumn && <TableHead>{col.status}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.items.length === 0 ? (
                    <EmptyTableRow colSpan={showStatusColumn ? 6 : 5} />
                  ) : (
                    pagination.items.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell>
                          <Link to={`/sales/quotes/${q.id}`} className="text-link font-medium">
                            {q.number}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate">
                          {customerIdSet.has(q.contactId) ? (
                            <span className="font-medium text-foreground">{q.contactName}</span>
                          ) : (
                            <Link
                              to={salesListUrl('/sales/quotes', status, defaultQuoteListTab, [
                                q.contactId,
                              ])}
                              className="text-link"
                              title={`Show all quotes for ${q.contactName}`}
                            >
                              {q.contactName}
                            </Link>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(q.date)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(q.validTill)}
                        </TableCell>
                        <TableCell className="text-right">
                          <MoneyDisplay amount={q.total} />
                        </TableCell>
                        {showStatusColumn && (
                          <TableCell>
                            <QuotationStatusBadge status={q.status} />
                          </TableCell>
                        )}
                      </TableRow>
                    ))
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
