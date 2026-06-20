import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: { label: string; to?: string; onClick?: () => void }
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, description, action, children, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-4', className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {action &&
          (action.to ? (
            <Button render={<Link to={action.to} />} nativeButton={false}>
              {action.label}
            </Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          ))}
      </div>
    </div>
  )
}

export function LinkedDocs({
  items,
  label = 'Related documents',
}: {
  items: { label: string; to: string }[]
  label?: string
}) {
  if (items.length === 0) return null
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-primary-soft px-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      {items.map((item, i) => (
        <span key={item.to} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="size-3 text-muted-foreground" />}
          <Link to={item.to} className="text-link">
            {item.label}
          </Link>
        </span>
      ))}
    </div>
  )
}
