import type {
  Account,
  BankAccount,
  BankTransaction,
  Bill,
  CashFlowPoint,
  Contact,
  DashboardTask,
  Invoice,
  JournalEntry,
  Payment,
  Quotation,
  SalesOrder,
  TrialBalanceRow,
} from '@/types'

export const companyName = '示例科技有限公司'

export const contacts: Contact[] = [
  { id: 'c1', name: 'Acme 有限公司', type: 'Customer', email: 'billing@acme.com', balance: 5600 },
  { id: 'c2', name: 'Beta 科技', type: 'Customer', email: 'ap@beta.io', balance: 0 },
  { id: 'c3', name: '办公用品供应商', type: 'Supplier', email: 'sales@office.com', balance: -1200 },
  { id: 'c4', name: 'Gamma 咨询', type: 'Both', email: 'hello@gamma.com', balance: 3200 },
]

export const accounts: Account[] = [
  { id: 'a1', code: '1000', name: '工商银行', type: 'Asset', balance: 45230 },
  { id: 'a2', code: '1100', name: '应收账款', type: 'Asset', balance: 8800 },
  { id: 'a3', code: '2000', name: '应付账款', type: 'Liability', balance: 3200 },
  { id: 'a4', code: '3000', name: '实收资本', type: 'Equity', balance: 50000 },
  { id: 'a5', code: '4000', name: '销售收入', type: 'Revenue', balance: -125000 },
  { id: 'a6', code: '5000', name: '办公费用', type: 'Expense', balance: 18200 },
  { id: 'a7', code: '5100', name: '租金', type: 'Expense', balance: 36000 },
]

export const quotations: Quotation[] = [
  {
    id: 'q1',
    number: 'QT-2025-001',
    contactId: 'c1',
    contactName: 'Acme 有限公司',
    date: '2025-06-01',
    validTill: '2025-06-30',
    status: 'ConvertedToInvoice',
    lines: [
      { id: 'ql1', description: '咨询服务', quantity: 10, unitPrice: 500, amount: 5000 },
      { id: 'ql2', description: '实施支持', quantity: 5, unitPrice: 800, amount: 4000 },
    ],
    subtotal: 9000,
    tax: 900,
    total: 9900,
    linkedSalesOrderId: 'so1',
    linkedInvoiceId: 'inv1',
  },
  {
    id: 'q2',
    number: 'QT-2025-002',
    contactId: 'c4',
    contactName: 'Gamma 咨询',
    date: '2025-06-10',
    validTill: '2025-07-10',
    status: 'Draft',
    lines: [{ id: 'ql3', description: '年度维护', quantity: 1, unitPrice: 12000, amount: 12000 }],
    subtotal: 12000,
    tax: 1200,
    total: 13200,
  },
  {
    id: 'q3',
    number: 'QT-2025-003',
    contactId: 'c2',
    contactName: 'Beta 科技',
    date: '2025-06-05',
    validTill: '2025-06-20',
    status: 'Sent',
    lines: [{ id: 'ql4', description: '软件定制', quantity: 1, unitPrice: 8000, amount: 8000 }],
    subtotal: 8000,
    tax: 800,
    total: 8800,
  },
  {
    id: 'q4',
    number: 'QT-2025-004',
    contactId: 'c1',
    contactName: 'Acme 有限公司',
    date: '2025-05-01',
    validTill: '2025-06-15',
    status: 'Accepted',
    lines: [{ id: 'ql5', description: '培训服务', quantity: 2, unitPrice: 2000, amount: 4000 }],
    subtotal: 4000,
    tax: 400,
    total: 4400,
    linkedSalesOrderId: undefined,
  },
  {
    id: 'q5',
    number: 'QT-2025-005',
    contactId: 'c4',
    contactName: 'Gamma 咨询',
    date: '2025-04-01',
    validTill: '2025-04-30',
    status: 'Declined',
    lines: [{ id: 'ql6', description: '咨询项目', quantity: 1, unitPrice: 15000, amount: 15000 }],
    subtotal: 15000,
    tax: 1500,
    total: 16500,
  },
  {
    id: 'q6',
    number: 'QT-2024-099',
    contactId: 'c2',
    contactName: 'Beta 科技',
    date: '2024-11-01',
    validTill: '2024-12-01',
    status: 'Expired',
    lines: [{ id: 'ql7', description: '历史报价', quantity: 1, unitPrice: 3000, amount: 3000 }],
    subtotal: 3000,
    tax: 300,
    total: 3300,
  },
]

export const salesOrders: SalesOrder[] = [
  {
    id: 'so1',
    number: 'SO-2025-001',
    contactId: 'c1',
    contactName: 'Acme 有限公司',
    date: '2025-06-05',
    status: 'Submitted',
    quotationId: 'q1',
    lines: [
      { id: 'sol1', description: '咨询服务', quantity: 10, unitPrice: 500, amount: 5000 },
      { id: 'sol2', description: '实施支持', quantity: 5, unitPrice: 800, amount: 4000 },
    ],
    total: 9900,
  },
]

export const invoices: Invoice[] = [
  {
    id: 'inv1',
    number: 'INV-2025-001',
    contactId: 'c1',
    contactName: 'Acme 有限公司',
    date: '2025-06-08',
    dueDate: '2025-06-22',
    status: 'Awaiting',
    quotationId: 'q1',
    salesOrderId: 'so1',
    lines: [
      { id: 'il1', description: '咨询服务', quantity: 10, unitPrice: 500, amount: 5000 },
      { id: 'il2', description: '实施支持', quantity: 5, unitPrice: 800, amount: 4000 },
    ],
    subtotal: 9000,
    tax: 900,
    total: 9900,
    amountPaid: 0,
  },
  {
    id: 'inv2',
    number: 'INV-2025-002',
    contactId: 'c2',
    contactName: 'Beta 科技',
    date: '2025-05-15',
    dueDate: '2025-05-29',
    status: 'Paid',
    lines: [{ id: 'il3', description: '软件许可', quantity: 1, unitPrice: 15000, amount: 15000 }],
    subtotal: 15000,
    tax: 1500,
    total: 16500,
    amountPaid: 16500,
  },
  {
    id: 'inv3',
    number: 'INV-2025-003',
    contactId: 'c4',
    contactName: 'Gamma 咨询',
    date: '2025-04-01',
    dueDate: '2025-04-15',
    status: 'Overdue',
    lines: [{ id: 'il4', description: '培训服务', quantity: 2, unitPrice: 1600, amount: 3200 }],
    subtotal: 3200,
    tax: 320,
    total: 3520,
    amountPaid: 0,
  },
]

export const payments: Payment[] = [
  {
    id: 'pay1',
    number: 'PAY-2025-001',
    contactId: 'c2',
    contactName: 'Beta 科技',
    date: '2025-05-20',
    amount: 16500,
    allocations: [{ invoiceId: 'inv2', invoiceNumber: 'INV-2025-002', amount: 16500 }],
  },
  {
    id: 'pay2',
    number: 'PAY-2025-002',
    contactId: 'c1',
    contactName: 'Acme 有限公司',
    date: '2025-06-10',
    amount: 5000,
    allocations: [],
    advanceAmount: 5000,
  },
  {
    id: 'pay3',
    number: 'PAY-2025-003',
    contactId: 'c1',
    contactName: 'Acme 有限公司',
    date: '2025-06-15',
    amount: 11000,
    allocations: [{ invoiceId: 'inv1', invoiceNumber: 'INV-2025-001', amount: 9900 }],
    advanceAmount: 1100,
  },
]

export const bills: Bill[] = [
  {
    id: 'b1',
    number: 'BILL-001',
    contactName: '办公用品供应商',
    date: '2025-06-01',
    dueDate: '2025-06-15',
    total: 1200,
    status: 'Awaiting',
  },
  {
    id: 'b2',
    number: 'BILL-002',
    contactName: '办公用品供应商',
    date: '2025-05-01',
    dueDate: '2025-05-01',
    total: 800,
    status: 'Overdue',
  },
]

export const journalEntries: JournalEntry[] = [
  {
    id: 'je1',
    date: '2025-06-18',
    narration: '采购办公用品',
    status: 'Posted',
    lines: [
      { id: 'jl1', accountId: 'a6', accountCode: '5000', accountName: '办公费用', debit: 500, credit: 0 },
      { id: 'jl2', accountId: 'a1', accountCode: '1000', accountName: '工商银行', debit: 0, credit: 500 },
    ],
  },
  {
    id: 'je2',
    date: '2025-06-19',
    narration: '调整分录草稿',
    status: 'Draft',
    lines: [
      { id: 'jl3', accountId: 'a7', accountCode: '5100', accountName: '租金', debit: 3000, credit: 0 },
      { id: 'jl4', accountId: 'a1', accountCode: '1000', accountName: '工商银行', debit: 0, credit: 3000 },
    ],
  },
]

export const bankAccounts: BankAccount[] = [
  { id: 'ba1', name: '工商银行 - 基本户', balance: 45230, feedBalance: 45100 },
  { id: 'ba2', name: '建设银行 - 备用', balance: 12800, feedBalance: 12800 },
]

export const bankTransactions: BankTransaction[] = [
  { id: 'bt1', bankAccountId: 'ba1', date: '2025-06-18', description: '办公用品采购', amount: -500, reconciled: false },
  { id: 'bt2', bankAccountId: 'ba1', date: '2025-06-17', description: 'Beta 科技付款', amount: 16500, reconciled: true },
  { id: 'bt3', bankAccountId: 'ba1', date: '2025-06-16', description: 'Acme 部分付款', amount: 5000, reconciled: false },
  { id: 'bt4', bankAccountId: 'ba1', date: '2025-06-15', description: '银行手续费', amount: -25, reconciled: false },
]

export const trialBalance: TrialBalanceRow[] = accounts.map((a) => ({
  accountCode: a.code,
  accountName: a.name,
  debit: a.balance > 0 && a.type !== 'Revenue' ? a.balance : 0,
  credit: a.balance < 0 || a.type === 'Revenue' ? Math.abs(a.balance) : a.balance <= 0 ? Math.abs(a.balance) : 0,
}))

export const dashboardTasks: DashboardTask[] = [
  { id: 't1', type: 'reconcile', title: '3 笔银行流水待对账', link: '/banking/reconciliation' },
  { id: 't2', type: 'invoice', title: '2 张发票待收款', link: '/sales/invoices' },
  { id: 't3', type: 'bill', title: '1 张账单已逾期', link: '/purchases/bills' },
]

export const cashFlowData: CashFlowPoint[] = [
  { month: '1月', cashIn: 42000, cashOut: 28000 },
  { month: '2月', cashIn: 38000, cashOut: 31000 },
  { month: '3月', cashIn: 51000, cashOut: 35000 },
  { month: '4月', cashIn: 45000, cashOut: 42000 },
  { month: '5月', cashIn: 62000, cashOut: 38000 },
  { month: '6月', cashIn: 48000, cashOut: 33000 },
]

export const dashboardStats = {
  revenue: 125000,
  expenses: 54200,
  netProfit: 70800,
  receivables: 13420,
  payables: 2000,
  receivablesAging: { current: 9900, days30: 0, days60: 0, days90: 3520 },
}
