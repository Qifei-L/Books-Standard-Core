import { getActiveItems } from '@/lib/items'
import type { Item } from '@/types'

interface ItemPickerProps {
  value: string
  onChange: (item: Item | null) => void
  allowEmpty?: boolean
  className?: string
}

export function ItemPicker({ value, onChange, allowEmpty = true, className }: ItemPickerProps) {
  const options = getActiveItems()

  return (
    <select
      value={value}
      onChange={(e) => {
        const id = e.target.value
        if (!id) {
          onChange(null)
          return
        }
        const item = options.find((i) => i.id === id)
        if (item) onChange(item)
      }}
      className={className ?? 'h-8 w-full rounded-md border border-input bg-card px-2 text-sm text-foreground'}
    >
      {allowEmpty && <option value="">Ad-hoc line…</option>}
      {options.map((item) => (
        <option key={item.id} value={item.id}>
          {item.code} — {item.name} ({item.itemType === 'Tracked' ? 'Tracked' : 'Service'})
        </option>
      ))}
    </select>
  )
}
