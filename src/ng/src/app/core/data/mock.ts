import type {
  Account, BankAccount, BankTransaction, Bill, CashFlowPoint,
  Contact, DashboardTask, Invoice, Item, JournalEntry,
  InventoryAdjustment, Payment, Quotation, SalesDeliveryNote,
  SalesOrder, TrialBalanceRow,
} from '../types'

export const companyName = '示例科技有限公司'

export const contacts: Contact[] = [
  { id: 'c1', name: 'Acme 有限公司', type: 'Customer', email: 'billing@acme.com', balance: 5600 },
  { id: 'c2', name: 'Beta 科技', type: 'Customer', email: 'ap@beta.io', balance: 0 },
  { id: 'c3', name: '办公用品供应商', type: 'Supplier', email: 'sales@office.com', balance: -1200 },
  { id: 'c4', name: 'Gamma 咨询', type: 'Both', email: 'hello@gamma.com', balance: 3200 },
]

export const accounts: Account[] = [
  // Assets
  { id: 'a1',  code: '1000', name: '工商银行',      type: 'Asset',     subtype: 'Bank',               taxRate: '免税 (0%)',    status: 'active',   balance: 45230   },
  { id: 'a10', code: '1001', name: '建设银行备用户', type: 'Asset',     subtype: 'Bank',               taxRate: '免税 (0%)',    status: 'active',   balance: 12800   },
  { id: 'a2',  code: '1100', name: '应收账款',      type: 'Asset',     subtype: 'Accounts Receivable', taxRate: '不含税',      status: 'active',   balance: 8800    },
  { id: 'a11', code: '1150', name: '预付款项',      type: 'Asset',     subtype: 'Current Asset',      taxRate: '免税 (0%)',    status: 'active',   balance: 4200    },
  { id: 'a8',  code: '1200', name: '库存商品',      type: 'Asset',     subtype: 'Inventory Asset',    taxRate: '采购税 (13%)', status: 'active',   balance: 88000   },
  { id: 'a12', code: '1500', name: '办公设备',      type: 'Asset',     subtype: 'Fixed Asset',        taxRate: '采购税 (13%)', status: 'active',   balance: 18600   },
  { id: 'a13', code: '1510', name: '电脑设备',      type: 'Asset',     subtype: 'Fixed Asset',        taxRate: '采购税 (13%)', status: 'archived', balance: 9450    },
  // Liabilities
  { id: 'a3',  code: '2000', name: '应付账款',      type: 'Liability', subtype: 'Accounts Payable',   taxRate: '不含税',      status: 'active',   balance: 3200    },
  { id: 'a14', code: '2100', name: '应交增值税',    type: 'Liability', subtype: 'Current Liability',  taxRate: '免税 (0%)',    status: 'active',   balance: 6890    },
  { id: 'a15', code: '2110', name: '应付职工薪酬',  type: 'Liability', subtype: 'Current Liability',  taxRate: '免税 (0%)',    status: 'active',   balance: 3120    },
  { id: 'a16', code: '2500', name: '长期借款',      type: 'Liability', subtype: 'Liability',          taxRate: '免税 (0%)',    status: 'active',   balance: 75000   },
  // Equity
  { id: 'a4',  code: '3000', name: '实收资本',      type: 'Equity',    subtype: 'Equity',             taxRate: '免税 (0%)',    status: 'active',   balance: 50000   },
  { id: 'a17', code: '3100', name: '未分配利润',    type: 'Equity',    subtype: 'Retained Earnings',  taxRate: '免税 (0%)',    status: 'active',   balance: 22580   },
  // Revenue
  { id: 'a5',  code: '4000', name: '销售收入',      type: 'Revenue',   subtype: 'Revenue',            taxRate: '增值税 (13%)', status: 'active',   balance: -125000 },
  { id: 'a18', code: '4100', name: '服务收入',      type: 'Revenue',   subtype: 'Revenue',            taxRate: '增值税 (6%)',  status: 'active',   balance: -38400  },
  // Expenses
  { id: 'a6',  code: '5000', name: '办公费用',      type: 'Expense',   subtype: 'Expense',            taxRate: '采购税 (13%)', status: 'active',   balance: 18200   },
  { id: 'a7',  code: '5100', name: '租金',          type: 'Expense',   subtype: 'Expense',            taxRate: '免税 (0%)',    status: 'active',   balance: 36000   },
  { id: 'a9',  code: '5200', name: '销售成本',      type: 'Expense',   subtype: 'Direct Costs',       taxRate: '采购税 (13%)', status: 'active',   balance: 42000   },
  { id: 'a19', code: '5300', name: '工资薪酬',      type: 'Expense',   subtype: 'Expense',            taxRate: '免税 (0%)',    status: 'active',   balance: 96000   },
  { id: 'a20', code: '5400', name: '差旅费',        type: 'Expense',   subtype: 'Expense',            taxRate: '采购税 (6%)',  status: 'active',   balance: 8760    },
]

export const items: Item[] = [
  { id: 'i1', code: 'CONS', name: '咨询服务', itemType: 'Untracked', salesAccountId: 'a5', defaultUnitPrice: 500, taxRateLabel: 'VAT 10%', isActive: true },
  { id: 'i2', code: 'IMPL', name: '实施支持', itemType: 'Untracked', salesAccountId: 'a5', defaultUnitPrice: 800, taxRateLabel: 'VAT 10%', isActive: true },
  { id: 'i3', code: 'TRAIN', name: '培训服务', itemType: 'Untracked', salesAccountId: 'a5', defaultUnitPrice: 2000, taxRateLabel: 'VAT 10%', isActive: true },
  { id: 'i4', code: 'SW-LIC', name: '软件许可', itemType: 'Untracked', salesAccountId: 'a5', defaultUnitPrice: 15000, taxRateLabel: 'VAT 10%', isActive: true },
  { id: 'i5', code: 'VEH-DEMO', name: '示例 SUV（库存）', description: 'Tracked inventory item — COGS posts on delivery note', itemType: 'Tracked', salesAccountId: 'a5', inventoryAccountId: 'a8', cogsAccountId: 'a9', defaultUnitPrice: 280000, unitCost: 220000, quantityOnHand: 3, taxRateLabel: 'VAT 10%', isActive: true },
  { id: 'i6', code: 'INST', name: '合同分期款', itemType: 'Untracked', salesAccountId: 'a5', defaultUnitPrice: 0, taxRateLabel: 'VAT 10%', isActive: true },
]

export const quotations: Quotation[] = [
  { id: 'q1', number: 'QT-2025-001', contactId: 'c1', contactName: 'Acme 有限公司', date: '2025-06-01', validTill: '2025-06-30', status: 'ConvertedToInvoice', lines: [{ id: 'ql1', description: '咨询服务', quantity: 10, unitPrice: 500, amount: 5000 }, { id: 'ql2', description: '实施支持', quantity: 5, unitPrice: 800, amount: 4000 }], subtotal: 9000, tax: 900, total: 9900, linkedSalesOrderId: 'so1', linkedInvoiceId: 'inv1' },
  { id: 'q2', number: 'QT-2025-002', contactId: 'c4', contactName: 'Gamma 咨询', date: '2025-06-10', validTill: '2025-07-10', status: 'Draft', lines: [{ id: 'ql3', description: '年度维护', quantity: 1, unitPrice: 12000, amount: 12000 }], subtotal: 12000, tax: 1200, total: 13200 },
  { id: 'q3', number: 'QT-2025-003', contactId: 'c2', contactName: 'Beta 科技', date: '2025-06-05', validTill: '2025-06-20', status: 'Sent', lines: [{ id: 'ql4', description: '软件定制', quantity: 1, unitPrice: 8000, amount: 8000 }], subtotal: 8000, tax: 800, total: 8800 },
  { id: 'q4', number: 'QT-2025-004', contactId: 'c1', contactName: 'Acme 有限公司', date: '2025-05-01', validTill: '2025-06-15', status: 'Accepted', lines: [{ id: 'ql5', description: '培训服务', quantity: 2, unitPrice: 2000, amount: 4000 }], subtotal: 4000, tax: 400, total: 4400 },
  { id: 'q5', number: 'QT-2025-005', contactId: 'c4', contactName: 'Gamma 咨询', date: '2025-04-01', validTill: '2025-04-30', status: 'Declined', lines: [{ id: 'ql6', description: '咨询项目', quantity: 1, unitPrice: 15000, amount: 15000 }], subtotal: 15000, tax: 1500, total: 16500 },
  { id: 'q6', number: 'QT-2024-099', contactId: 'c2', contactName: 'Beta 科技', date: '2024-11-01', validTill: '2024-12-01', status: 'Expired', lines: [{ id: 'ql7', description: '历史报价', quantity: 1, unitPrice: 3000, amount: 3000 }], subtotal: 3000, tax: 300, total: 3300 },
]

export const salesOrders: SalesOrder[] = [
  { id: 'so1', number: 'SO-2025-001', contactId: 'c1', contactName: 'Acme 有限公司', date: '2025-06-05', status: 'Submitted', quotationId: 'q1', lines: [{ id: 'sol1', description: '咨询服务', quantity: 10, unitPrice: 500, amount: 5000 }, { id: 'sol2', description: '实施支持', quantity: 5, unitPrice: 800, amount: 4000 }], total: 9900 },
]

export const invoices: Invoice[] = [
  { id: 'inv1', number: 'INV-2025-001', contactId: 'c1', contactName: 'Acme 有限公司', date: '2025-06-08', dueDate: '2025-06-22', status: 'Awaiting', quotationId: 'q1', salesOrderId: 'so1', lines: [{ id: 'il1', itemId: 'i1', itemCode: 'CONS', revenueAccountId: 'a5', description: '咨询服务', quantity: 10, unitPrice: 500, amount: 5000 }, { id: 'il2', itemId: 'i2', itemCode: 'IMPL', revenueAccountId: 'a5', description: '实施支持', quantity: 5, unitPrice: 800, amount: 4000 }], subtotal: 9000, tax: 900, total: 9900, amountPaid: 0 },
  { id: 'inv2', number: 'INV-2025-002', contactId: 'c2', contactName: 'Beta 科技', date: '2025-05-15', dueDate: '2025-05-29', status: 'Paid', lines: [{ id: 'il3', itemId: 'i4', itemCode: 'SW-LIC', revenueAccountId: 'a5', description: '软件许可', quantity: 1, unitPrice: 15000, amount: 15000 }], subtotal: 15000, tax: 1500, total: 16500, amountPaid: 16500 },
  { id: 'inv3', number: 'INV-2025-003', contactId: 'c4', contactName: 'Gamma 咨询', date: '2025-04-01', dueDate: '2025-04-15', status: 'Overdue', lines: [{ id: 'il4', itemId: 'i3', itemCode: 'TRAIN', revenueAccountId: 'a5', description: '培训服务', quantity: 2, unitPrice: 1600, amount: 3200 }], subtotal: 3200, tax: 320, total: 3520, amountPaid: 0 },
  { id: 'inv4', number: 'INV-2025-004', contactId: 'c2', contactName: 'Beta 科技', date: '2025-06-18', dueDate: '2025-07-02', status: 'Awaiting', lines: [{ id: 'il5', itemId: 'i5', itemCode: 'VEH-DEMO', revenueAccountId: 'a5', description: '示例 SUV（库存）', quantity: 1, unitPrice: 280000, amount: 280000 }], subtotal: 280000, tax: 28000, total: 308000, amountPaid: 0 },
]

export const salesDeliveryNotes: SalesDeliveryNote[] = [
  { id: 'dn1', number: 'DN-2025-001', date: '2025-05-18', contactId: 'c2', contactName: 'Beta 科技', invoiceId: 'inv2', invoiceNumber: 'INV-2025-002', billingStatus: 'invoiced', status: 'Posted', lines: [{ id: 'dnl1', itemId: 'i4', itemCode: 'SW-LIC', description: '软件许可', quantity: 1, unitCost: 0 }] },
  { id: 'dn2', number: 'DN-2025-002', date: '2025-06-19', contactId: 'c2', contactName: 'Beta 科技', billingStatus: 'not_invoiced', status: 'Posted', lines: [{ id: 'dnl2', itemId: 'i5', itemCode: 'VEH-DEMO', description: '示例 SUV（库存）', quantity: 1, unitCost: 220000 }] },
]

export const inventoryAdjustments: InventoryAdjustment[] = [
  { id: 'adj1', number: 'ADJ-2025-001', date: '2025-06-01', reason: 'stocktake', narration: 'Annual count — 1 unit variance', status: 'Posted', lines: [{ id: 'adjl1', itemId: 'i5', itemCode: 'VEH-DEMO', description: '示例 SUV（库存）', quantity: -1, unitCost: 220000 }] },
]

export const payments: Payment[] = [
  { id: 'pay1', number: 'PAY-2025-001', contactId: 'c2', contactName: 'Beta 科技', date: '2025-05-20', amount: 16500, allocations: [{ invoiceId: 'inv2', invoiceNumber: 'INV-2025-002', amount: 16500 }] },
  { id: 'pay2', number: 'PAY-2025-002', contactId: 'c1', contactName: 'Acme 有限公司', date: '2025-06-10', amount: 5000, allocations: [], advanceAmount: 5000 },
  { id: 'pay3', number: 'PAY-2025-003', contactId: 'c1', contactName: 'Acme 有限公司', date: '2025-06-15', amount: 11000, allocations: [{ invoiceId: 'inv1', invoiceNumber: 'INV-2025-001', amount: 9900 }], advanceAmount: 1100 },
]

export const bills: Bill[] = [
  { id: 'b1', number: 'BILL-001', contactName: '办公用品供应商', date: '2025-06-01', dueDate: '2025-06-15', total: 1200, status: 'Awaiting' },
  { id: 'b2', number: 'BILL-002', contactName: '办公用品供应商', date: '2025-05-01', dueDate: '2025-05-01', total: 800, status: 'Overdue' },
]

export const journalEntries: JournalEntry[] = [
  { id: 'je1', date: '2025-06-18', narration: '采购办公用品', status: 'Posted', lines: [{ id: 'jl1', accountId: 'a6', accountCode: '5000', accountName: '办公费用', debit: 500, credit: 0 }, { id: 'jl2', accountId: 'a1', accountCode: '1000', accountName: '工商银行', debit: 0, credit: 500 }] },
  { id: 'je2', date: '2025-06-19', narration: '调整分录草稿', status: 'Draft', lines: [{ id: 'jl3', accountId: 'a7', accountCode: '5100', accountName: '租金', debit: 3000, credit: 0 }, { id: 'jl4', accountId: 'a1', accountCode: '1000', accountName: '工商银行', debit: 0, credit: 3000 }] },
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
  revenue: 125000, expenses: 54200, netProfit: 70800,
  receivables: 13420, payables: 2000,
  receivablesAging: { current: 9900, days30: 0, days60: 0, days90: 3520 },
}
