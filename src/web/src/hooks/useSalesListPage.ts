import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  buildSalesListParams,
  clearedAdvancedQuery,
  parseSalesAdvancedQuery,
  type SalesAdvancedQuery,
} from '@/lib/salesListQuery'
import type { SalesListViewDefinition } from '@/lib/salesListViews'

export function useSalesListPage<TStatus extends string>(
  defaultStatus: TStatus,
  parseStatus: (searchParams: URLSearchParams) => TStatus,
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const advanced = parseSalesAdvancedQuery(searchParams)
  const status = parseStatus(searchParams)

  const query = { status, ...advanced }

  const applyQuery = useCallback(
    (next: Partial<{ status: TStatus } & SalesAdvancedQuery>, resetPage = false) => {
      const merged = {
        status: next.status ?? status,
        customerIds: next.customerIds ?? advanced.customerIds,
        dateField: next.dateField ?? advanced.dateField,
        datePreset: next.datePreset ?? advanced.datePreset,
        dateFrom: next.dateFrom !== undefined ? next.dateFrom : advanced.dateFrom,
        dateTo: next.dateTo !== undefined ? next.dateTo : advanced.dateTo,
        page: resetPage ? 1 : (next.page ?? advanced.page),
        pageSize: next.pageSize ?? advanced.pageSize,
      }
      setSearchParams(buildSalesListParams(merged.status, defaultStatus, merged))
    },
    [status, advanced, defaultStatus, setSearchParams],
  )

  const setStatus = useCallback(
    (nextStatus: TStatus) => applyQuery({ status: nextStatus }, true),
    [applyQuery],
  )

  const clearAdvancedFilters = useCallback(
    () => applyQuery({ ...clearedAdvancedQuery }, true),
    [applyQuery],
  )

  const applyView = useCallback(
    (view: SalesListViewDefinition) => {
      applyQuery(
        {
          status: view.status as TStatus,
          customerIds: view.customerIds,
          dateField: view.dateField,
          datePreset: view.datePreset,
          dateFrom: view.dateFrom,
          dateTo: view.dateTo,
        },
        true,
      )
    },
    [applyQuery],
  )

  const viewQuery = {
    status: query.status as string,
    customerIds: query.customerIds,
    dateField: query.dateField,
    datePreset: query.datePreset,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  }

  const applyAdvancedFilters = useCallback(
    (draft: Pick<
      SalesAdvancedQuery,
      'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'
    >) => {
      applyQuery(draft, true)
    },
    [applyQuery],
  )

  const advancedFilterProps = {
    query: {
      customerIds: query.customerIds,
      dateField: query.dateField,
      datePreset: query.datePreset,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    },
    onApplyAdvanced: applyAdvancedFilters,
    onClearAdvanced: clearAdvancedFilters,
    onCustomerIdsChange: (customerIds: string[]) => applyQuery({ customerIds }, true),
    onDateFieldChange: (dateField: SalesAdvancedQuery['dateField']) =>
      applyQuery({ dateField }, true),
    onDatePresetChange: (datePreset: SalesAdvancedQuery['datePreset']) =>
      applyQuery({ datePreset, dateFrom: null, dateTo: null }, true),
    onDateFromChange: (dateFrom: string | null) => applyQuery({ dateFrom }, true),
    onDateToChange: (dateTo: string | null) => applyQuery({ dateTo }, true),
  }

  return {
    query,
    advanced,
    status,
    applyQuery,
    setStatus,
    clearAdvancedFilters,
    applyView,
    viewQuery,
    advancedFilterProps,
  }
}
