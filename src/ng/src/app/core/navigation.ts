export interface SidebarItem {
  label: string
  to: string
  /** Angular Material icon name */
  icon: string
  matchPrefix?: string
}

export interface SubNavItem {
  label: string
  to: string
  optional?: boolean
  iconOnly?: boolean
}

export const sidebarNav: SidebarItem[] = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Sales', to: '/sales', icon: 'shopping_cart', matchPrefix: '/sales' },
  { label: 'Purchases', to: '/purchases', icon: 'shopping_bag', matchPrefix: '/purchases' },
  { label: 'Banking', to: '/banking', icon: 'account_balance', matchPrefix: '/banking' },
  { label: 'Business Partners', to: '/partners', icon: 'people' },
  { label: 'Products & Services', to: '/products', icon: 'inventory_2', matchPrefix: '/products' },
  { label: 'Accounting', to: '/accounting', icon: 'menu_book', matchPrefix: '/accounting' },
  { label: 'Reports', to: '/reports', icon: 'bar_chart', matchPrefix: '/reports' },
]

export const salesSubNav: SubNavItem[] = [
  { label: 'Overview', to: '/sales/overview' },
  { label: 'Quotes', to: '/sales/quotes' },
  { label: 'Sales Orders', to: '/sales/orders' },
  { label: 'Sales Invoices', to: '/sales/invoices' },
  { label: 'Receive Payments', to: '/sales/payments' },
  { label: 'Delivery Notes', to: '/sales/delivery-notes' },
  { label: 'Credit Notes', to: '/sales/credit-notes' },
  { label: 'Sales Reports', to: '/sales/reports' },
  { label: 'Settings', to: '/sales/settings', iconOnly: true },
]

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
  { label: 'Price Lists', to: '/products/price-lists' },
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
