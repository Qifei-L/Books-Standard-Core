import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export interface CustomerFilterOption {
  id: string
  name: string
}

interface CustomerFilterPickerProps {
  value: string | null
  onChange: (customerId: string | null) => void
  options: CustomerFilterOption[]
}

export function CustomerFilterPicker({ value, onChange, options }: CustomerFilterPickerProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const items: { id: string | null; name: string }[] = [
      { id: null, name: 'All customers' },
      ...options.map((c) => ({ id: c.id, name: c.name })),
    ]
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => item.name.toLowerCase().includes(q))
  }, [options, query])

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="h-8 pl-7 text-sm"
        />
      </div>
      <div className="max-h-40 overflow-y-auto rounded-md border border-border p-1">
        {filtered.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">No customers found.</p>
        ) : (
          filtered.map((item) => {
            const isSelected = item.id === value
            return (
              <button
                key={item.id ?? 'all'}
                type="button"
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                  isSelected
                    ? 'bg-primary-soft text-primary'
                    : 'text-foreground hover:bg-secondary',
                )}
                onClick={() => onChange(item.id)}
              >
                <Check className={cn('size-4 shrink-0', !isSelected && 'invisible')} />
                <span className="truncate">{item.name}</span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
