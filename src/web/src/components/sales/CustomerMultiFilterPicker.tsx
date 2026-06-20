import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

export interface CustomerFilterOption {
  id: string
  name: string
}

interface CustomerMultiFilterPickerProps {
  value: string[]
  onChange: (customerIds: string[]) => void
  options: CustomerFilterOption[]
}

const ROW_HEIGHT = 32
const LIST_MAX_HEIGHT = 160

export function CustomerMultiFilterPicker({
  value,
  onChange,
  options,
}: CustomerMultiFilterPickerProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((c) => c.name.toLowerCase().includes(q))
  }, [options, query])

  const filteredIds = useMemo(() => filtered.map((c) => c.id), [filtered])
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => value.includes(id))

  const listHeight = Math.min(
    Math.max(filtered.length, 1) * ROW_HEIGHT + 8,
    LIST_MAX_HEIGHT,
  )

  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((x) => x !== id))
    else onChange([...value, id])
  }

  const selectAllFiltered = () => {
    onChange([...new Set([...value, ...filteredIds])])
  }

  const clearSelection = () => onChange([])

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="h-8 pl-7 text-sm focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <div className="flex items-center justify-between gap-2 px-0.5">
        <span className="text-xs text-muted-foreground">
          {value.length > 0 ? `${value.length} selected` : 'No customer filter'}
        </span>
        <div className="flex items-center gap-1">
          {query.trim() && filtered.length > 0 && !allFilteredSelected && (
            <Button variant="ghost" size="xs" className="h-6 px-2" onClick={selectAllFiltered}>
              Select all
            </Button>
          )}
          {value.length > 0 && (
            <Button variant="ghost" size="xs" className="h-6 px-2" onClick={clearSelection}>
              Clear
            </Button>
          )}
        </div>
      </div>

      <div
        className="overflow-y-auto rounded-md border border-border p-1"
        style={{ height: listHeight }}
        role="listbox"
        aria-multiselectable="true"
        aria-label="Customers"
      >
        {filtered.length === 0 ? (
          <p className="px-2 py-3 text-center text-sm text-muted-foreground">No customers found.</p>
        ) : (
          filtered.map((item) => {
            const checked = value.includes(item.id)
            return (
              <label
                key={item.id}
                role="option"
                aria-selected={checked}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                  checked ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-secondary',
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(item.id)}
                  className={cn(!checked && 'border-muted-foreground/40')}
                />
                <span className="truncate">{item.name}</span>
              </label>
            )
          })
        )}
      </div>
    </div>
  )
}
