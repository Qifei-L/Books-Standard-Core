import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Landmark,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface NavChild {
  label: string
  to: string
  optional?: boolean
}

interface NavItem {
  label: string
  to?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavChild[]
}

const navigation: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  {
    label: 'Sales',
    icon: ShoppingCart,
    children: [
      { label: 'Overview', to: '/sales/overview' },
      { label: 'Quotes', to: '/sales/quotes' },
      { label: 'Sales Orders', to: '/sales/sales-orders', optional: true },
      { label: 'Sales Invoices', to: '/sales/invoices' },
      { label: 'Receive Payments', to: '/sales/payments' },
      { label: 'Credit Notes', to: '/sales/credit-notes' },
      { label: 'Recurring Invoices', to: '/sales/recurring-invoices' },
      { label: 'Sales Reports', to: '/sales/reports' },
      { label: 'Sales Settings', to: '/sales/settings' },
    ],
  },
  {
    label: 'Purchases',
    icon: ShoppingBag,
    children: [
      { label: 'Bills', to: '/purchases/bills' },
      { label: 'Payments Made', to: '/purchases/payments' },
    ],
  },
  {
    label: 'Banking',
    icon: Landmark,
    children: [
      { label: 'Bank Accounts', to: '/banking/accounts' },
      { label: 'Bank Reconciliation', to: '/banking/reconciliation' },
    ],
  },
  { label: 'Business Partners', to: '/partners', icon: Users },
  {
    label: 'Accounting',
    icon: BookOpen,
    children: [
      { label: 'Chart of Accounts', to: '/accounting/chart-of-accounts' },
      { label: 'Manual Journals', to: '/accounting/manual-journals' },
    ],
  },
  {
    label: 'Reports',
    icon: BarChart3,
    children: [
      { label: 'Trial Balance', to: '/reports/trial-balance' },
      { label: 'Profit & Loss', to: '/reports/profit-and-loss' },
      { label: 'Balance Sheet', to: '/reports/balance-sheet' },
    ],
  },
  { label: 'Settings', to: '/settings', icon: Settings },
]

function NavGroup({ item }: { item: NavItem }) {
  const location = useLocation()
  const isChildActive = item.children?.some((c) => location.pathname.startsWith(c.to))
  const [open, setOpen] = useState(isChildActive ?? true)
  const Icon = item.icon

  if (item.to) {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-accent text-accent-foreground'
              : 'text-sidebar-foreground hover:bg-muted',
          )
        }
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        {item.label}
      </NavLink>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-muted"
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon className="size-4 shrink-0" />}
          {item.label}
        </span>
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && item.children && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-accent font-medium text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <span className="flex-1">{child.label}</span>
              {child.optional && (
                <Badge variant="secondary" className="px-1 py-0 text-[10px] font-normal text-muted-foreground">
                  Optional
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          B
        </div>
        <div>
          <div className="text-sm font-semibold">Books Standard</div>
          <div className="text-xs text-muted-foreground">Core</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => (
          <NavGroup key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  )
}
