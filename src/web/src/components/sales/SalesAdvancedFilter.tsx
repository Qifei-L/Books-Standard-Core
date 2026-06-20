import { useState } from 'react'
import { ListFilter, X } from 'lucide-react'
import {
  formatInvoiceDateFilterLabel,
  invoiceDatePresets,
  type InvoiceDateField,
  type InvoiceDatePreset,
} from '@/lib/invoiceDateFilters'
import { countAdvancedFilters, getContactNames, type SalesAdvancedQuery } from '@/lib/salesListQuery'
import type { CustomerFilterOption } from '@/components/sales/CustomerMultiFilterPicker'
import { CustomerMultiFilterPicker } from '@/components/sales/CustomerMultiFilterPicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export type SalesAdvancedFilterState = Pick<
  SalesAdvancedQuery,
  'customerIds' | 'dateField' | 'datePreset' | 'dateFrom' | 'dateTo'
>

export type SalesDateFieldMode = 'invoice' | 'quote' | 'single'

const dateFieldLabels: Record<SalesDateFieldMode, { issued: string; due: string }> = {
  invoice: { issued: 'Issued', due: 'Due date' },
  quote: { issued: 'Issued', due: 'Valid till' },
  single: { issued: 'Date', due: 'Date' },
}

function advancedFiltersEqual(a: SalesAdvancedFilterState, b: SalesAdvancedFilterState) {
  return (
    a.dateField === b.dateField &&
    a.datePreset === b.datePreset &&
    a.dateFrom === b.dateFrom &&
    a.dateTo === b.dateTo &&
    a.customerIds.length === b.customerIds.length &&
    a.customerIds.every((id) => b.customerIds.includes(id))
  )
}

function formatFilterTriggerSummary(
  query: SalesAdvancedFilterState,
  dateFieldMode: SalesDateFieldMode,
): string | null {
  const parts: string[] = []
  if (query.customerIds.length === 1) {
    parts.push(getContactNames(query.customerIds)[0] ?? '1 customer')
  } else if (query.customerIds.length > 1) {
    parts.push(`${query.customerIds.length} customers`)
  }

  const dateLabel = formatInvoiceDateFilterLabel({
    field: dateFieldMode === 'single' ? 'issued' : query.dateField,
    preset: query.datePreset,
    from: query.dateFrom,
    to: query.dateTo,
  })
  if (dateLabel) parts.push(dateLabel)

  return parts.length > 0 ? parts.join(' · ') : null
}

interface SalesAdvancedFilterButtonProps {
  entityLabel: string
  dateFieldMode: SalesDateFieldMode
  query: SalesAdvancedFilterState
  customerOptions: CustomerFilterOption[]
  onApplyAdvanced: (draft: SalesAdvancedFilterState) => void
  onClearAdvanced: () => void
}

export function SalesAdvancedFilterButton({
  entityLabel,
  dateFieldMode,
  query,
  customerOptions,
  onApplyAdvanced,
  onClearAdvanced,
}: SalesAdvancedFilterButtonProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<SalesAdvancedFilterState>(query)

  const labels = dateFieldLabels[dateFieldMode]
  const showFieldToggle = dateFieldMode !== 'single'
  const activeCount = countAdvancedFilters(query)
  const triggerSummary = formatFilterTriggerSummary(query, dateFieldMode)
  const draftDirty = !advancedFiltersEqual(draft, query)
  const draftActiveCount = countAdvancedFilters(draft)

  const patchDraft = (patch: Partial<SalesAdvancedFilterState>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  const handleApply = () => {
    onApplyAdvanced(draft)
    setOpen(false)
  }

  const handleCancel = () => {
    setDraft(query)
    setOpen(false)
  }

  const handleClearAll = () => {
    onClearAdvanced()
    setOpen(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(query)
    } else if (draftDirty) {
      setDraft(query)
    }
    setOpen(next)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        aria-label={`Filter ${entityLabel} by customer and date`}
        render={<Button variant="outline" size="sm" className="max-w-[14rem] gap-1.5" />}
      >
        <ListFilter className="size-3.5 shrink-0" />
        <span className="truncate">
          {triggerSummary ? (
            <>
              <span className="text-muted-foreground">Filter · </span>
              {triggerSummary}
            </>
          ) : (
            'Filter'
          )}
        </span>
        {activeCount > 0 && !triggerSummary && (
          <Badge variant="secondary" className="h-5 min-w-5 px-1.5 tabular-nums">
            {activeCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border px-4 py-2.5">
          <h3 className="text-sm font-medium text-foreground">Filter {entityLabel}</h3>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Customers</Label>
            <CustomerMultiFilterPicker
              value={draft.customerIds}
              onChange={(customerIds) => patchDraft({ customerIds })}
              options={customerOptions}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Date</Label>
            {showFieldToggle && (
              <div className="flex gap-1">
                {(['issued', 'due'] as const).map((field) => (
                  <Button
                    key={field}
                    type="button"
                    variant={draft.dateField === field ? 'default' : 'outline'}
                    size="xs"
                    onClick={() => patchDraft({ dateField: field })}
                  >
                    {field === 'issued' ? labels.issued : labels.due}
                  </Button>
                ))}
              </div>
            )}
            <Select
              value={draft.datePreset}
              onValueChange={(value) =>
                patchDraft({
                  datePreset: value as InvoiceDatePreset,
                  dateFrom: null,
                  dateTo: null,
                })
              }
            >
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {invoiceDatePresets.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div
              className={cn(
                'grid grid-cols-2 gap-2 overflow-hidden transition-all duration-150',
                draft.datePreset === 'custom' ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">From</Label>
                <Input
                  type="date"
                  value={draft.dateFrom ?? ''}
                  onChange={(e) => patchDraft({ dateFrom: e.target.value || null })}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">To</Label>
                <Input
                  type="date"
                  value={draft.dateTo ?? ''}
                  onChange={(e) => patchDraft({ dateTo: e.target.value || null })}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5">
          {draftActiveCount > 0 || activeCount > 0 ? (
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleClearAll}>
              Clear all
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" className="h-8" onClick={handleApply} disabled={!draftDirty}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ActiveAdvancedFilterPillsProps {
  query: SalesAdvancedFilterState
  onCustomerIdsChange: (customerIds: string[]) => void
  onDatePresetChange: (preset: InvoiceDatePreset) => void
  onDateFromChange: (from: string | null) => void
  onDateToChange: (to: string | null) => void
  onClearAdvanced: () => void
}

export function ActiveAdvancedFilterPills({
  query,
  onCustomerIdsChange,
  onDatePresetChange,
  onDateFromChange,
  onDateToChange,
  onClearAdvanced,
}: ActiveAdvancedFilterPillsProps) {
  const activeCount = countAdvancedFilters(query)
  if (activeCount === 0) return null

  const customerNames = getContactNames(query.customerIds)
  const dateLabel = formatInvoiceDateFilterLabel({
    field: query.dateField,
    preset: query.datePreset,
    from: query.dateFrom,
    to: query.dateTo,
  })

  const removeCustomer = (id: string) => {
    onCustomerIdsChange(query.customerIds.filter((x) => x !== id))
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
      <span className="text-xs text-muted-foreground">Active:</span>
      {customerNames.map((name, i) => (
        <FilterPill
          key={query.customerIds[i]}
          label={name}
          onRemove={() => removeCustomer(query.customerIds[i])}
        />
      ))}
      {dateLabel && (
        <FilterPill
          label={dateLabel}
          onRemove={() => {
            onDatePresetChange('any')
            onDateFromChange(null)
            onDateToChange(null)
          }}
        />
      )}
      <button type="button" onClick={onClearAdvanced} className="text-xs text-link hover:underline">
        Clear all
      </button>
    </div>
  )
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card py-0.5 pr-1 pl-2.5 text-xs font-medium text-foreground">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
        aria-label={`Remove ${label} filter`}
      >
        <X className="size-3" />
      </button>
    </span>
  )
}

export type AdvancedQuery = SalesAdvancedFilterState

export type { InvoiceDateField }
