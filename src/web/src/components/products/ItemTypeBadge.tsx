import type { ItemType } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const styles: Record<ItemType, string> = {
  Untracked: 'bg-secondary text-secondary-foreground',
  Tracked: 'bg-primary-soft text-primary',
}

const labels: Record<ItemType, string> = {
  Untracked: 'Service',
  Tracked: 'Tracked',
}

export function ItemTypeBadge({ type, className }: { type: ItemType; className?: string }) {
  return (
    <Badge variant="secondary" className={cn('font-normal', styles[type], className)}>
      {labels[type]}
    </Badge>
  )
}
