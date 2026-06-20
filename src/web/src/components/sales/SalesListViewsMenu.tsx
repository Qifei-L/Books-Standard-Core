import { useMemo, useState, type MouseEvent } from 'react'
import { Bookmark, Check, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatInvoiceDateFilterLabel } from '@/lib/invoiceDateFilters'
import { getContactNames } from '@/lib/salesListQuery'
import {
  deleteSavedView,
  findMatchingView,
  getSystemViews,
  loadSavedViews,
  migrateLegacyInvoiceViews,
  saveView,
  type SalesListModule,
  type SalesListViewDefinition,
} from '@/lib/salesListViews'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SalesListViewsMenuProps {
  module: SalesListModule
  query: Omit<SalesListViewDefinition, 'id' | 'name' | 'module' | 'isSystem'>
  onApplyView: (view: SalesListViewDefinition) => void
}

function viewSubtitle(view: SalesListViewDefinition): string | null {
  const parts: string[] = []
  if (view.customerIds.length > 0) {
    parts.push(getContactNames(view.customerIds).join(', '))
  }
  const dateLabel = formatInvoiceDateFilterLabel({
    field: view.dateField,
    preset: view.datePreset,
    from: view.dateFrom,
    to: view.dateTo,
  })
  if (dateLabel) parts.push(dateLabel)
  return parts.length > 0 ? parts.join(' · ') : null
}

export function SalesListViewsMenu({ module, query, onApplyView }: SalesListViewsMenuProps) {
  const [savedViews, setSavedViews] = useState(() => {
    if (module === 'invoices') migrateLegacyInvoiceViews()
    return loadSavedViews(module)
  })

  const activeView = useMemo(
    () => findMatchingView(module, query),
    [module, query],
  )

  const triggerLabel = activeView?.name ?? 'Custom view'
  const systemViews = getSystemViews(module)

  const handleSaveCurrent = () => {
    const defaultName = activeView && !activeView.isSystem ? activeView.name : ''
    const name = window.prompt('Name this view', defaultName)
    if (!name?.trim()) return

    try {
      const created = saveView(module, name, query)
      setSavedViews(loadSavedViews(module))
      onApplyView(created)
    } catch {
      // ignore empty name
    }
  }

  const handleDelete = (id: string, e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteSavedView(id)
    setSavedViews(loadSavedViews(module))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <Bookmark className="size-3.5" />
        <span className="max-w-[8rem] truncate">{triggerLabel}</span>
        <ChevronDown className="size-3.5 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Saved views</DropdownMenuLabel>
        {systemViews.map((view) => {
          const isActive = activeView?.id === view.id
          const subtitle = viewSubtitle(view)
          return (
            <DropdownMenuItem key={view.id} onClick={() => onApplyView(view)}>
              <Check className={cn('size-4', !isActive && 'invisible')} />
              <span className="flex min-w-0 flex-col">
                <span>{view.name}</span>
                {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
              </span>
            </DropdownMenuItem>
          )
        })}

        {savedViews.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>My views</DropdownMenuLabel>
            {savedViews.map((view) => {
              const isActive = activeView?.id === view.id
              const subtitle = viewSubtitle(view)
              return (
                <DropdownMenuItem
                  key={view.id}
                  onClick={() => onApplyView(view)}
                  className="group justify-between"
                >
                  <span className="flex min-w-0 items-start gap-2">
                    <Check className={cn('mt-0.5 size-4 shrink-0', !isActive && 'invisible')} />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{view.name}</span>
                      {subtitle && (
                        <span className="text-xs text-muted-foreground">{subtitle}</span>
                      )}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="rounded p-1 text-muted-foreground opacity-0 hover:bg-secondary hover:text-foreground group-hover:opacity-100"
                    onClick={(e) => handleDelete(view.id, e)}
                    aria-label={`Delete view ${view.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </DropdownMenuItem>
              )
            })}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSaveCurrent}>
          <Plus className="size-4" />
          Save current view…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
