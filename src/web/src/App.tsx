import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { QuotationsPage } from '@/pages/QuotationsPage'
import { QuotationDetailPage } from '@/pages/QuotationDetailPage'
import { SalesOrdersPage, SalesOrderDetailPage } from '@/pages/SalesOrdersPage'
import { InvoicesPage } from '@/pages/InvoicesPage'
import { InvoiceDetailPage } from '@/pages/InvoiceDetailPage'
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
import { PartnersPage, SettingsPage } from '@/pages/PartnersPage'
import { SalesOverviewPage } from '@/pages/sales/SalesOverviewPage'
import {
  CreditNotesPage,
  RecurringInvoicesPage,
} from '@/pages/sales/SalesPlaceholderPages'
import { SalesReportsPage, SalesReportDetailPage } from '@/pages/sales/SalesReportsPage'
import { SalesSettingsPage } from '@/pages/sales/SalesSettingsPage'

function RedirectQuoteDetail() {
  const { id } = useParams()
  return <Navigate to={`/sales/quotes/${id}`} replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              {/* Sales */}
              <Route path="sales/overview" element={<SalesOverviewPage />} />
              <Route path="sales/quotes" element={<QuotationsPage />} />
              <Route path="sales/quotes/:id" element={<QuotationDetailPage />} />
              <Route path="sales/sales-orders" element={<SalesOrdersPage />} />
              <Route path="sales/sales-orders/:id" element={<SalesOrderDetailPage />} />
              <Route path="sales/invoices" element={<InvoicesPage />} />
              <Route path="sales/invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="sales/payments" element={<PaymentsPage />} />
              <Route path="sales/payments/:id" element={<PaymentDetailPage />} />
              <Route path="sales/customer-advances" element={<Navigate to="/sales/payments?tab=advance" replace />} />
              <Route path="sales/credit-notes" element={<CreditNotesPage />} />
              <Route path="sales/recurring-invoices" element={<RecurringInvoicesPage />} />
              <Route path="sales/reports" element={<SalesReportsPage />} />
              <Route path="sales/reports/aged-receivables" element={<SalesReportDetailPage title="Aged Receivables" />} />
              <Route path="sales/reports/by-customer" element={<SalesReportDetailPage title="Sales by Customer" />} />
              <Route path="sales/reports/invoice-summary" element={<SalesReportDetailPage title="Invoice Summary" />} />
              <Route path="sales/reports/quote-conversion" element={<SalesReportDetailPage title="Quote Conversion" />} />
              <Route path="sales/settings" element={<SalesSettingsPage />} />
              {/* Legacy sales redirects */}
              <Route path="sales/quotations" element={<Navigate to="/sales/quotes" replace />} />
              <Route path="sales/quotations/:id" element={<RedirectQuoteDetail />} />
              {/* Purchases */}
              <Route path="purchases/bills" element={<BillsPage />} />
              <Route path="purchases/payments" element={<PurchasesPaymentsPage />} />
              {/* Banking */}
              <Route path="banking/accounts" element={<BankAccountsPage />} />
              <Route path="banking/reconciliation" element={<BankReconciliationPage />} />
              {/* Business Partners */}
              <Route path="partners" element={<PartnersPage />} />
              {/* Accounting */}
              <Route path="accounting/chart-of-accounts" element={<ChartOfAccountsPage />} />
              <Route path="accounting/manual-journals" element={<ManualJournalsPage />} />
              <Route path="accounting/manual-journals/:id" element={<JournalDetailPage />} />
              {/* Reports */}
              <Route path="reports/trial-balance" element={<TrialBalancePage />} />
              <Route path="reports/profit-and-loss" element={<ProfitAndLossPage />} />
              <Route path="reports/balance-sheet" element={<BalanceSheetPage />} />
              <Route path="settings" element={<SettingsPage />} />
              {/* Legacy redirects */}
              <Route path="contacts" element={<Navigate to="/partners" replace />} />
              <Route path="accounting/bank-accounts" element={<Navigate to="/banking/accounts" replace />} />
              <Route path="accounting/bank-reconciliation" element={<Navigate to="/banking/reconciliation" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
