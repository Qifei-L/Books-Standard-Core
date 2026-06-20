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
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { QuotationsPage } from '@/pages/QuotationsPage'
import { QuotationDetailPage } from '@/pages/QuotationDetailPage'
import { SalesOrdersPage, SalesOrderDetailPage } from '@/pages/SalesOrdersPage'
import { InvoicesPage } from '@/pages/InvoicesPage'
import { InvoiceDetailPage } from '@/pages/InvoiceDetailPage'
import { InvoiceFormPage } from '@/pages/sales/InvoiceFormPage'
import { DeliveryNoteFormPage } from '@/pages/sales/DeliveryNoteFormPage'
import { DeliveryNotesPage } from '@/pages/sales/DeliveryNotesPage'
import { DeliveryNoteDetailPage } from '@/pages/sales/DeliveryNoteDetailPage'
import { PaymentsPage, PaymentDetailPage } from '@/pages/PaymentsPage'
import { BillsPage } from '@/pages/BillsPage'
import { PurchasesPaymentsPage } from '@/pages/PurchasesPaymentsPage'
import { BankAccountsPage } from '@/pages/BankAccountsPage'
import { BankReconciliationPage } from '@/pages/BankReconciliationPage'
import { ChartOfAccountsPage } from '@/pages/ChartOfAccountsPage'
import { ManualJournalsPage, JournalDetailPage } from '@/pages/ManualJournalsPage'
import {
  TrialBalancePage,
  ProfitAndLossPage,
  BalanceSheetPage,
} from '@/pages/ReportsPage'
import { PartnersPage } from '@/pages/PartnersPage'
import { SalesOverviewPage } from '@/pages/sales/SalesOverviewPage'
import {
  CreditNotesPage,
  RecurringInvoicesPage,
} from '@/pages/sales/SalesPlaceholderPages'
import { SalesReportsPage, SalesReportDetailPage } from '@/pages/sales/SalesReportsPage'
import { SalesSettingsPage } from '@/pages/sales/SalesSettingsPage'
import { TemplatesPage } from '@/pages/sales/TemplatesPage'
import { TemplateEditPage } from '@/pages/sales/TemplateEditPage'
import { TemplatePrintPage } from '@/pages/sales/TemplatePrintPage'
import { ItemsPage } from '@/pages/products/ItemsPage'
import { ItemDetailPage } from '@/pages/products/ItemDetailPage'
import { ItemFormPage } from '@/pages/products/ItemFormPage'
import { AdjustStockPage } from '@/pages/products/AdjustStockPage'
import { AdjustmentDetailPage } from '@/pages/products/AdjustmentDetailPage'
import { AdjustmentFormPage } from '@/pages/products/AdjustmentFormPage'
import { PriceListsPage } from '@/pages/products/PriceListsPage'
import { SettingsOpener } from '@/pages/SettingsOpener'

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
        </BrowserRouter>
        </DocumentTemplateProvider>
        </SalesSettingsProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
