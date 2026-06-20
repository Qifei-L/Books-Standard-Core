import { NavLink } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { SubNavItem } from '@/config/navigation'

interface ModuleSubNavProps {
  items: SubNavItem[]
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
    isActive
      ? 'border-primary text-primary'
      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
  )

export function ModuleSubNav({ items }: ModuleSubNavProps) {
  const regularItems = items.filter((item) => !item.iconOnly)
  const iconItems = items.filter((item) => item.iconOnly)

  return (
    <nav
      aria-label="Module navigation"
      className="-mx-6 mb-6 border-b border-border bg-card px-6"
    >
      <div className="flex items-stretch gap-1 pb-px">
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {regularItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
              {item.optional && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1 py-0 text-[9px] font-normal leading-none text-muted-foreground"
                >
                  Optional
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
        {iconItems.length > 0 && (
          <div className="flex shrink-0 items-stretch gap-1 border-l border-border pl-1">
            {iconItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                aria-label={item.label}
                className={({ isActive }) =>
                  cn(
                    linkClass({ isActive }),
                    'px-2.5',
                  )
                }
              >
                <Settings className="size-4" />
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
