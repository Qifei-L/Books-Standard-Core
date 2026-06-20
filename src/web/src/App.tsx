import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { SalesSettingsProvider } from '@/contexts/SalesSettingsContext'
import { DocumentTemplateProvider } from '@/contexts/DocumentTemplateContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { SalesModuleLayout } from '@/components/layout/SalesModuleLayout'
import { SalesFeatureGate } from '@/components/sales/SalesFeatureGate'
import {
  purchasesSubNav,
  bankingSubNav,
  productsSubNav,
  accountingSubNav,
  reportsSubNav,
} from '@/config/navigation'
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const QuotationsPage = lazy(() => import('@/pages/QuotationsPage').then((m) => ({ default: m.QuotationsPage })))
const QuotationDetailPage = lazy(() => import('@/pages/QuotationDetailPage').then((m) => ({ default: m.QuotationDetailPage })))
const SalesOrdersPage = lazy(() => import('@/pages/SalesOrdersPage').then((m) => ({ default: m.SalesOrdersPage })))
const SalesOrderDetailPage = lazy(() => import('@/pages/SalesOrdersPage').then((m) => ({ default: m.SalesOrderDetailPage })))
const InvoicesPage = lazy(() => import('@/pages/InvoicesPage').then((m) => ({ default: m.InvoicesPage })))
const InvoiceDetailPage = lazy(() => import('@/pages/InvoiceDetailPage').then((m) => ({ default: m.InvoiceDetailPage })))
const InvoiceFormPage = lazy(() => import('@/pages/sales/InvoiceFormPage').then((m) => ({ default: m.InvoiceFormPage })))
const DeliveryNoteFormPage = lazy(() => import('@/pages/sales/DeliveryNoteFormPage').then((m) => ({ default: m.DeliveryNoteFormPage })))
const DeliveryNotesPage = lazy(() => import('@/pages/sales/DeliveryNotesPage').then((m) => ({ default: m.DeliveryNotesPage })))
const DeliveryNoteDetailPage = lazy(() => import('@/pages/sales/DeliveryNoteDetailPage').then((m) => ({ default: m.DeliveryNoteDetailPage })))
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage').then((m) => ({ default: m.PaymentsPage })))
const PaymentDetailPage = lazy(() => import('@/pages/PaymentsPage').then((m) => ({ default: m.PaymentDetailPage })))
const BillsPage = lazy(() => import('@/pages/BillsPage').then((m) => ({ default: m.BillsPage })))
const PurchasesPaymentsPage = lazy(() => import('@/pages/PurchasesPaymentsPage').then((m) => ({ default: m.PurchasesPaymentsPage })))
const BankAccountsPage = lazy(() => import('@/pages/BankAccountsPage').then((m) => ({ default: m.BankAccountsPage })))
const BankReconciliationPage = lazy(() => import('@/pages/BankReconciliationPage').then((m) => ({ default: m.BankReconciliationPage })))
const ChartOfAccountsPage = lazy(() => import('@/pages/ChartOfAccountsPage').then((m) => ({ default: m.ChartOfAccountsPage })))
const ManualJournalsPage = lazy(() => import('@/pages/ManualJournalsPage').then((m) => ({ default: m.ManualJournalsPage })))
const JournalDetailPage = lazy(() => import('@/pages/ManualJournalsPage').then((m) => ({ default: m.JournalDetailPage })))
const TrialBalancePage = lazy(() => import('@/pages/ReportsPage').then((m) => ({ default: m.TrialBalancePage })))
const ProfitAndLossPage = lazy(() => import('@/pages/ReportsPage').then((m) => ({ default: m.ProfitAndLossPage })))
const BalanceSheetPage = lazy(() => import('@/pages/ReportsPage').then((m) => ({ default: m.BalanceSheetPage })))
const PartnersPage = lazy(() => import('@/pages/PartnersPage').then((m) => ({ default: m.PartnersPage })))
const SalesOverviewPage = lazy(() => import('@/pages/sales/SalesOverviewPage').then((m) => ({ default: m.SalesOverviewPage })))
const CreditNotesPage = lazy(() => import('@/pages/sales/SalesPlaceholderPages').then((m) => ({ default: m.CreditNotesPage })))
const RecurringInvoicesPage = lazy(() => import('@/pages/sales/SalesPlaceholderPages').then((m) => ({ default: m.RecurringInvoicesPage })))
const SalesReportsPage = lazy(() => import('@/pages/sales/SalesReportsPage').then((m) => ({ default: m.SalesReportsPage })))
const SalesReportDetailPage = lazy(() => import('@/pages/sales/SalesReportsPage').then((m) => ({ default: m.SalesReportDetailPage })))
const SalesSettingsPage = lazy(() => import('@/pages/sales/SalesSettingsPage').then((m) => ({ default: m.SalesSettingsPage })))
const TemplatesPage = lazy(() => import('@/pages/sales/TemplatesPage').then((m) => ({ default: m.TemplatesPage })))
const TemplateEditPage = lazy(() => import('@/pages/sales/TemplateEditPage').then((m) => ({ default: m.TemplateEditPage })))
const TemplatePrintPage = lazy(() => import('@/pages/sales/TemplatePrintPage').then((m) => ({ default: m.TemplatePrintPage })))
const ItemsPage = lazy(() => import('@/pages/products/ItemsPage').then((m) => ({ default: m.ItemsPage })))
const ItemDetailPage = lazy(() => import('@/pages/products/ItemDetailPage').then((m) => ({ default: m.ItemDetailPage })))
const ItemFormPage = lazy(() => import('@/pages/products/ItemFormPage').then((m) => ({ default: m.ItemFormPage })))
const AdjustStockPage = lazy(() => import('@/pages/products/AdjustStockPage').then((m) => ({ default: m.AdjustStockPage })))
const AdjustmentDetailPage = lazy(() => import('@/pages/products/AdjustmentDetailPage').then((m) => ({ default: m.AdjustmentDetailPage })))
const AdjustmentFormPage = lazy(() => import('@/pages/products/AdjustmentFormPage').then((m) => ({ default: m.AdjustmentFormPage })))
const PriceListsPage = lazy(() => import('@/pages/products/PriceListsPage').then((m) => ({ default: m.PriceListsPage })))
const SettingsOpener = lazy(() => import('@/pages/SettingsOpener').then((m) => ({ default: m.SettingsOpener })))

function RedirectQuoteDetail() {
  const { id } = useParams()
  return <Navigate to={`/sales/quotes/${id}`} replace />
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <SalesSettingsProvider>
        <DocumentTemplateProvider>
        <BrowserRouter>
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />

              {/* Sales */}
              <Route path="sales" element={<SalesModuleLayout />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<SalesOverviewPage />} />
                <Route path="quotes" element={<QuotationsPage />} />
                <Route path="quotes/:id" element={<QuotationDetailPage />} />
                <Route
                  path="sales-orders"
                  element={
                    <SalesFeatureGate feature="enableSalesOrders">
                      <SalesOrdersPage />
                    </SalesFeatureGate>
                  }
                />
                <Route
                  path="sales-orders/:id"
                  element={
                    <SalesFeatureGate feature="enableSalesOrders">
                      <SalesOrderDetailPage />
                    </SalesFeatureGate>
                  }
                />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="invoices/new" element={<InvoiceFormPage />} />
                <Route path="invoices/:id" element={<InvoiceDetailPage />} />
                <Route path="delivery-notes" element={<DeliveryNotesPage />} />
                <Route path="delivery-notes/new" element={<DeliveryNoteFormPage />} />
                <Route path="delivery-notes/:id" element={<DeliveryNoteDetailPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="payments/:id" element={<PaymentDetailPage />} />
                <Route path="customer-advances" element={<Navigate to="/sales/payments?tab=advance" replace />} />
                <Route
                  path="credit-notes"
                  element={
                    <SalesFeatureGate feature="enableCreditNotes">
                      <CreditNotesPage />
                    </SalesFeatureGate>
                  }
                />
                <Route
                  path="recurring-invoices"
                  element={
                    <SalesFeatureGate feature="enableRecurringInvoices">
                      <RecurringInvoicesPage />
                    </SalesFeatureGate>
                  }
                />
                <Route path="reports" element={<SalesReportsPage />} />
                <Route path="reports/aged-receivables" element={<SalesReportDetailPage title="Aged Receivables" />} />
                <Route path="reports/by-customer" element={<SalesReportDetailPage title="Sales by Customer" />} />
                <Route path="reports/invoice-summary" element={<SalesReportDetailPage title="Invoice Summary" />} />
                <Route path="reports/quote-conversion" element={<SalesReportDetailPage title="Quote Conversion" />} />
                <Route path="settings" element={<SalesSettingsPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="templates/:id/edit" element={<TemplateEditPage />} />
                <Route path="templates/:id/print" element={<TemplatePrintPage />} />
                {/* Legacy sales redirects */}
                <Route path="quotations" element={<Navigate to="/sales/quotes" replace />} />
                <Route path="quotations/:id" element={<RedirectQuoteDetail />} />
              </Route>

              {/* Purchases */}
              <Route path="purchases" element={<ModuleLayout items={purchasesSubNav} />}>
                <Route index element={<Navigate to="bills" replace />} />
                <Route path="bills" element={<BillsPage />} />
                <Route path="payments" element={<PurchasesPaymentsPage />} />
              </Route>

              {/* Banking */}
              <Route path="banking" element={<ModuleLayout items={bankingSubNav} />}>
                <Route index element={<Navigate to="accounts" replace />} />
                <Route path="accounts" element={<BankAccountsPage />} />
                <Route path="reconciliation" element={<BankReconciliationPage />} />
              </Route>

              {/* Business Partners */}
              <Route path="partners" element={<PartnersPage />} />

              {/* Products & Services */}
              <Route path="products" element={<ModuleLayout items={productsSubNav} />}>
                <Route index element={<Navigate to="items" replace />} />
                <Route path="items/new" element={<ItemFormPage />} />
                <Route path="items/:id/edit" element={<ItemFormPage />} />
                <Route path="items/:id" element={<ItemDetailPage />} />
                <Route path="items" element={<ItemsPage />} />
                <Route path="adjustments/new" element={<AdjustmentFormPage />} />
                <Route path="adjustments/:id" element={<AdjustmentDetailPage />} />
                <Route path="adjustments" element={<AdjustStockPage />} />
                <Route path="price-lists" element={<PriceListsPage />} />
              </Route>

              {/* Accounting */}
              <Route path="accounting" element={<ModuleLayout items={accountingSubNav} />}>
                <Route index element={<Navigate to="chart-of-accounts" replace />} />
                <Route path="chart-of-accounts" element={<ChartOfAccountsPage />} />
                <Route path="manual-journals" element={<ManualJournalsPage />} />
                <Route path="manual-journals/:id" element={<JournalDetailPage />} />
              </Route>

              {/* Reports */}
              <Route path="reports" element={<ModuleLayout items={reportsSubNav} />}>
                <Route index element={<Navigate to="trial-balance" replace />} />
                <Route path="trial-balance" element={<TrialBalancePage />} />
                <Route path="profit-and-loss" element={<ProfitAndLossPage />} />
                <Route path="balance-sheet" element={<BalanceSheetPage />} />
              </Route>

              <Route path="settings" element={<SettingsOpener />} />

              {/* Legacy redirects */}
              <Route path="contacts" element={<Navigate to="/partners" replace />} />
              <Route path="accounting/bank-accounts" element={<Navigate to="/banking/accounts" replace />} />
              <Route path="accounting/bank-reconciliation" element={<Navigate to="/banking/reconciliation" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        </BrowserRouter>
        </DocumentTemplateProvider>
        </SalesSettingsProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
