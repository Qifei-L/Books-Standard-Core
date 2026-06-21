import { Routes } from '@angular/router'
import { authGuard } from './core/auth/auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./layout/sales-layout/sales-layout.component').then((m) => m.SalesLayoutComponent),
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            loadComponent: () =>
              import('./features/sales/overview/sales-overview.component').then((m) => m.SalesOverviewComponent),
          },
          {
            path: 'invoices',
            loadComponent: () =>
              import('./features/sales/invoices/invoice-list.component').then((m) => m.InvoiceListComponent),
          },
          {
            path: 'invoices/new',
            loadComponent: () =>
              import('./features/sales/invoices/invoice-form.component').then((m) => m.InvoiceFormComponent),
          },
          {
            path: 'invoices/:id/edit',
            loadComponent: () =>
              import('./features/sales/invoices/invoice-form.component').then((m) => m.InvoiceFormComponent),
          },
          {
            path: 'invoices/:id',
            loadComponent: () =>
              import('./features/sales/invoices/invoice-detail.component').then((m) => m.InvoiceDetailComponent),
          },
          {
            path: 'quotes',
            loadComponent: () =>
              import('./features/sales/quotes/quote-list.component').then((m) => m.QuoteListComponent),
          },
          {
            path: 'quotes/:id',
            loadComponent: () =>
              import('./features/sales/quotes/quote-detail.component').then((m) => m.QuoteDetailComponent),
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./features/sales/orders/order-list.component').then((m) => m.OrderListComponent),
          },
          {
            path: 'orders/:id',
            loadComponent: () =>
              import('./features/sales/orders/order-detail.component').then((m) => m.OrderDetailComponent),
          },
          {
            path: 'payments',
            loadComponent: () =>
              import('./features/sales/payments/payment-list.component').then((m) => m.PaymentListComponent),
          },
          {
            path: 'payments/:id',
            loadComponent: () =>
              import('./features/sales/payments/payment-detail.component').then((m) => m.PaymentDetailComponent),
          },
          {
            path: 'delivery-notes',
            loadComponent: () =>
              import('./features/sales/delivery-notes/delivery-note-list.component').then((m) => m.DeliveryNoteListComponent),
          },
          {
            path: 'delivery-notes/new',
            loadComponent: () =>
              import('./features/sales/delivery-notes/delivery-note-form.component').then((m) => m.DeliveryNoteFormComponent),
          },
          {
            path: 'delivery-notes/:id',
            loadComponent: () =>
              import('./features/sales/delivery-notes/delivery-note-detail.component').then((m) => m.DeliveryNoteDetailComponent),
          },
          {
            path: 'credit-notes',
            loadComponent: () =>
              import('./features/sales/placeholder/sales-placeholder.component').then((m) => m.SalesPlaceholderComponent),
            data: { title: 'Credit Notes' },
          },
          {
            path: 'reports',
            loadComponent: () =>
              import('./features/sales/placeholder/sales-placeholder.component').then((m) => m.SalesPlaceholderComponent),
            data: { title: 'Sales Reports' },
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/sales/placeholder/sales-placeholder.component').then((m) => m.SalesPlaceholderComponent),
            data: { title: 'Sales Settings' },
          },
        ],
      },
      {
        path: 'purchases',
        loadComponent: () =>
          import('./layout/module-layout/module-layout.component').then((m) => m.ModuleLayoutComponent),
        data: { module: 'purchases' },
        children: [
          { path: '', redirectTo: 'bills', pathMatch: 'full' },
          {
            path: 'bills',
            loadComponent: () =>
              import('./features/purchases/bills.component').then((m) => m.BillsComponent),
          },
          {
            path: 'payments',
            loadComponent: () =>
              import('./features/purchases/purchase-payments.component').then((m) => m.PurchasePaymentsComponent),
          },
        ],
      },
      {
        path: 'banking',
        loadComponent: () =>
          import('./layout/module-layout/module-layout.component').then((m) => m.ModuleLayoutComponent),
        data: { module: 'banking' },
        children: [
          { path: '', redirectTo: 'accounts', pathMatch: 'full' },
          {
            path: 'accounts',
            loadComponent: () =>
              import('./features/banking/bank-accounts.component').then((m) => m.BankAccountsComponent),
          },
          {
            path: 'reconciliation',
            loadComponent: () =>
              import('./features/banking/bank-reconciliation.component').then((m) => m.BankReconciliationComponent),
          },
        ],
      },
      {
        path: 'partners',
        loadComponent: () =>
          import('./features/partners/partners.component').then((m) => m.PartnersComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./layout/module-layout/module-layout.component').then((m) => m.ModuleLayoutComponent),
        data: { module: 'products' },
        children: [
          { path: '', redirectTo: 'items', pathMatch: 'full' },
          {
            path: 'items',
            loadComponent: () =>
              import('./features/products/items/item-list.component').then((m) => m.ItemListComponent),
          },
          {
            path: 'items/:id',
            loadComponent: () =>
              import('./features/products/items/item-detail.component').then((m) => m.ItemDetailComponent),
          },
          {
            path: 'adjustments',
            loadComponent: () =>
              import('./features/products/adjustments/adjustment-list.component').then((m) => m.AdjustmentListComponent),
          },
          {
            path: 'adjustments/:id',
            loadComponent: () =>
              import('./features/products/adjustments/adjustment-detail.component').then((m) => m.AdjustmentDetailComponent),
          },
          {
            path: 'price-lists',
            loadComponent: () =>
              import('./features/products/price-lists.component').then((m) => m.PriceListsComponent),
          },
        ],
      },
      {
        path: 'accounting',
        loadComponent: () =>
          import('./layout/module-layout/module-layout.component').then((m) => m.ModuleLayoutComponent),
        data: { module: 'accounting' },
        children: [
          { path: '', redirectTo: 'chart-of-accounts', pathMatch: 'full' },
          {
            path: 'chart-of-accounts',
            loadComponent: () =>
              import('./features/accounting/chart-of-accounts.component').then((m) => m.ChartOfAccountsComponent),
          },
          {
            path: 'manual-journals',
            loadComponent: () =>
              import('./features/accounting/manual-journals.component').then((m) => m.ManualJournalsComponent),
          },
          {
            path: 'manual-journals/:id',
            loadComponent: () =>
              import('./features/accounting/journal-detail.component').then((m) => m.JournalDetailComponent),
          },
        ],
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./layout/module-layout/module-layout.component').then((m) => m.ModuleLayoutComponent),
        data: { module: 'reports' },
        children: [
          { path: '', redirectTo: 'trial-balance', pathMatch: 'full' },
          {
            path: 'trial-balance',
            loadComponent: () =>
              import('./features/reports/trial-balance.component').then((m) => m.TrialBalanceComponent),
          },
          {
            path: 'profit-and-loss',
            loadComponent: () =>
              import('./features/reports/profit-and-loss.component').then((m) => m.ProfitAndLossComponent),
          },
          {
            path: 'balance-sheet',
            loadComponent: () =>
              import('./features/reports/balance-sheet.component').then((m) => m.BalanceSheetComponent),
          },
        ],
      },
    ],
  },
  {
    path: 'tokens-demo',
    loadComponent: () =>
      import('./features/_tokens-demo/tokens-demo.component').then((m) => m.TokensDemoComponent),
  },
  { path: '**', redirectTo: '' },
]
