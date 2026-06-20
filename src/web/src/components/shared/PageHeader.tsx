import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  action?: { label: string; to?: string; onClick?: () => void }
  children?: ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
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

export function LinkedDocs({ items }: { items: { label: string; to: string }[] }) {
  if (items.length === 0) return null
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border bg-accent/40 px-4 py-2 text-sm">
      <span className="text-muted-foreground">关联单据：</span>
      {items.map((item, i) => (
        <span key={item.to} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="size-3 text-muted-foreground" />}
          <Link to={item.to} className="font-medium text-primary hover:underline">
            {item.label}
          </Link>
        </span>
      ))}
    </div>
  )
}
