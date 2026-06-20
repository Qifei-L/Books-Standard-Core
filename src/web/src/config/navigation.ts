import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Landmark,
  Users,
  Package,
  BookOpen,
  BarChart3,
} from 'lucide-react'
import type { SalesSettings } from '@/contexts/SalesSettingsContext'

export interface SubNavItem {
  label: string
  to: string
  optional?: boolean
  /** Render as icon-only control (e.g. module settings) */
  iconOnly?: boolean
  /** Hide when this module flag is false */
  moduleKey?: keyof Pick<
    SalesSettings,
    'enableSalesOrders' | 'enableCreditNotes' | 'enableRecurringInvoices'
  >
}

export interface SidebarItem {
  label: string
  to: string
  icon: LucideIcon
  /** Path prefix used to highlight sidebar when on nested routes */
  matchPrefix?: string
}

export const sidebarNav: SidebarItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Sales', to: '/sales', icon: ShoppingCart, matchPrefix: '/sales' },
  { label: 'Purchases', to: '/purchases', icon: ShoppingBag, matchPrefix: '/purchases' },
  { label: 'Banking', to: '/banking', icon: Landmark, matchPrefix: '/banking' },
  { label: 'Business Partners', to: '/partners', icon: Users },
  { label: 'Products & Services', to: '/products', icon: Package, matchPrefix: '/products' },
  { label: 'Accounting', to: '/accounting', icon: BookOpen, matchPrefix: '/accounting' },
  { label: 'Reports', to: '/reports', icon: BarChart3, matchPrefix: '/reports' },
]

export const salesSubNavBase: SubNavItem[] = [
  { label: 'Overview', to: '/sales/overview' },
  { label: 'Quotes', to: '/sales/quotes' },
  { label: 'Sales Orders', to: '/sales/sales-orders', optional: true, moduleKey: 'enableSalesOrders' },
  { label: 'Sales Invoices', to: '/sales/invoices' },
  { label: 'Receive Payments', to: '/sales/payments' },
  { label: 'Delivery Notes', to: '/sales/delivery-notes', optional: true },
  { label: 'Credit Notes', to: '/sales/credit-notes', moduleKey: 'enableCreditNotes' },
  { label: 'Recurring Invoices', to: '/sales/recurring-invoices', moduleKey: 'enableRecurringInvoices' },
  { label: 'Sales Reports', to: '/sales/reports' },
  { label: 'Sales Settings', to: '/sales/settings', iconOnly: true },
]

export function buildSalesSubNav(settings: Pick<
  SalesSettings,
  'enableSalesOrders' | 'enableCreditNotes' | 'enableRecurringInvoices'
>): SubNavItem[] {
  return salesSubNavBase.filter((item) => {
    if (!item.moduleKey) return true
    return settings[item.moduleKey]
  })
}

export const purchasesSubNav: SubNavItem[] = [
  { label: 'Bills', to: '/purchases/bills' },
  { label: 'Payments Made', to: '/purchases/payments' },
]

export const bankingSubNav: SubNavItem[] = [
  { label: 'Bank Accounts', to: '/banking/accounts' },
  { label: 'Bank Reconciliation', to: '/banking/reconciliation' },
]

export const productsSubNav: SubNavItem[] = [
  { label: 'Items', to: '/products/items' },
  { label: 'Adjust Stock', to: '/products/adjustments' },
  { label: 'Price Lists', to: '/products/price-lists', optional: true },
]

export const accountingSubNav: SubNavItem[] = [
  { label: 'Chart of Accounts', to: '/accounting/chart-of-accounts' },
  { label: 'Manual Journals', to: '/accounting/manual-journals' },
]

export const reportsSubNav: SubNavItem[] = [
  { label: 'Trial Balance', to: '/reports/trial-balance' },
  { label: 'Profit & Loss', to: '/reports/profit-and-loss' },
  { label: 'Balance Sheet', to: '/reports/balance-sheet' },
]
