import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { TablePagination } from '@/components/shared/TablePagination'
import { DocStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { salesOrders } from '@/data/mock'
import { formatDate, formatMoney } from '@/lib/utils'
import { useSalesListPage } from '@/hooks/useSalesListPage'
import {
  countSalesOrdersByTab,
  defaultSalesOrderListTab,
  filterSalesOrders,
  formatInvoiceDateFilterLabel,
  parseSalesOrderListTab,
  salesOrderListTabs,
  type SalesOrderListTab,
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

export function SalesOrdersPage() {
  const {
    query,
    status,
    setStatus,
    applyQuery,
    applyView,
    viewQuery,
    advancedFilterProps,
  } = useSalesListPage(defaultSalesOrderListTab, (params) =>
    parseSalesOrderListTab(params.get('status')),
  )

  const dateState = getDateFilterState(query)
  const dateLabel = formatInvoiceDateFilterLabel(dateState)
  const customerOptions = getSalesCustomerOptions()

  const scopedForStatusCounts = useMemo(
    () => filterSalesOrders(salesOrders, 'all', query),
    [query],
  )

  const statusCounts = useMemo(
    () => countSalesOrdersByTab(scopedForStatusCounts, query),
    [scopedForStatusCounts, query],
  )

  const filteredRows = useMemo(
    () => filterSalesOrders(salesOrders, status, query),
    [status, query],
  )

  const pagination = useMemo(
    () => paginateItems(filteredRows, query.page, query.pageSize),
    [filteredRows, query.page, query.pageSize],
  )

  const totalAmount = useMemo(
    () => filteredRows.reduce((s, so) => s + so.total, 0),
    [filteredRows],
  )

  const summaryParts = useMemo(() => {
    const tabLabel =
      salesOrderListTabs.find((t) => t.id === status)?.label.toLowerCase() ?? status
    const parts = [
      `${filteredRows.length} order${filteredRows.length === 1 ? '' : 's'}`,
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
  const showStatusColumn = status === 'all'

  return (
    <div className="space-y-4">
      <PageHeader
        className="mb-0"
        title="Sales Orders"
        description="Optional — convert from quotes before invoicing"
        action={{ label: '+ New Order', to: '/sales/sales-orders/new' }}
      >
        <SalesListViewsMenu module="sales-orders" query={viewQuery} onApplyView={applyView} />
        <SalesAdvancedFilterButton
          entityLabel="sales orders"
          dateFieldMode="single"
          customerOptions={customerOptions}
          {...advancedFilterProps}
        />
      </PageHeader>

      <Tabs
        value={status}
        onValueChange={(v) => setStatus(v as SalesOrderListTab)}
        className="gap-4"
      >
        <TabsList className="h-9 flex-wrap">
          {salesOrderListTabs.map((tab) => (
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
                    {showStatusColumn && <TableHead>{col.status}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.items.length === 0 ? (
                    <EmptyTableRow colSpan={showStatusColumn ? 5 : 4} />
                  ) : (
                    pagination.items.map((so) => (
                      <TableRow key={so.id}>
                        <TableCell>
                          <Link
                            to={`/sales/sales-orders/${so.id}`}
                            className="text-link font-medium"
                          >
                            {so.number}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate">
                          {customerIdSet.has(so.contactId) ? (
                            <span className="font-medium text-foreground">{so.contactName}</span>
                          ) : (
                            <Link
                              to={salesListUrl('/sales/sales-orders', status, defaultSalesOrderListTab, [
                                so.contactId,
                              ])}
                              className="text-link"
                              title={`Show all orders for ${so.contactName}`}
                            >
                              {so.contactName}
                            </Link>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(so.date)}</TableCell>
                        <TableCell className="text-right">
                          <MoneyDisplay amount={so.total} />
                        </TableCell>
                        {showStatusColumn && (
                          <TableCell>
                            <DocStatusBadge status={so.status} />
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

export function SalesOrderDetailPage() {
  const so = salesOrders[0]
  return (
    <div>
      <PageHeader title={so.number} description={`Customer: ${so.contactName}`}>
        <DocStatusBadge status={so.status} />
      </PageHeader>
      <p className="text-sm text-muted-foreground">Detail view — Phase 1</p>
      <Link to="/sales/sales-orders" className="mt-4 inline-block text-sm text-link">
        ← Back to list
      </Link>
    </div>
  )
}
