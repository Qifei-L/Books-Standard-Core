import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  CustomerFilterPicker,
  type CustomerFilterOption,
} from '@/components/sales/CustomerFilterPicker'

export type { CustomerFilterOption }

interface CustomerFilterComboboxProps {
  value: string | null
  onChange: (customerId: string | null) => void
  options: CustomerFilterOption[]
  className?: string
}

export function CustomerFilterCombobox({
  value,
  onChange,
  options,
  className,
}: CustomerFilterComboboxProps) {
  const [open, setOpen] = useState(false)

  const selectedLabel = value
    ? options.find((c) => c.id === value)?.name ?? 'All customers'
    : 'All customers'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Filter by customer"
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 w-full justify-between gap-2 px-2.5 font-normal sm:w-52',
              className,
            )}
          />
        }
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="start">
        <CustomerFilterPicker
          value={value}
          onChange={(id) => {
            onChange(id)
            setOpen(false)
          }}
          options={options}
        />
      </PopoverContent>
    </Popover>
  )
}
