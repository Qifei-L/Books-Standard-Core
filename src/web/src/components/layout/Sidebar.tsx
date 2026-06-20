import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { sidebarNav } from '@/config/navigation'

function isSidebarActive(pathname: string, to: string, matchPrefix?: string) {
  if (to === '/') {
    return pathname === '/'
  }
  if (matchPrefix) {
    return pathname === matchPrefix || pathname.startsWith(`${matchPrefix}/`)
  }
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2.5 px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          B
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Books Standard</div>
          <div className="text-xs text-muted-foreground">Core</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {sidebarNav.map((item) => {
          const Icon = item.icon
          const active = isSidebarActive(location.pathname, item.to, item.matchPrefix)

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={() =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-secondary hover:text-foreground',
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
