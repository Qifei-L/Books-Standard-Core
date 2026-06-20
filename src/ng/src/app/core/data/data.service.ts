import { Injectable, signal } from '@angular/core'
import {
  accounts, bankAccounts, bankTransactions, bills, cashFlowData,
  companyName, contacts, dashboardStats, dashboardTasks,
  inventoryAdjustments, invoices, items, journalEntries,
  payments, quotations, salesDeliveryNotes, salesOrders, trialBalance,
} from './mock'
import type { Invoice, InvoiceStatus, LineItem, Payment } from '../types'

export interface InvoiceDraft {
  contactId: string
  date: string
  dueDate: string
  status: InvoiceStatus
  salesOrderId?: string
  quotationId?: string
  lines: LineItem[]
}

function invoiceAmounts(lines: LineItem[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
  const tax = Math.round(subtotal * 0.1 * 100) / 100
  return { subtotal, tax, total: subtotal + tax }
}

function nextInvoiceNumber(existing: Invoice[]) {
  const year = new Date().getFullYear()
  const max = existing
    .map((invoice) => invoice.number.match(/^INV-\d{4}-(\d+)$/)?.[1])
    .filter(Boolean)
    .map((value) => Number(value))
    .reduce((highest, value) => Math.max(highest, value), 0)
  return `INV-${year}-${String(max + 1).padStart(3, '0')}`
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly invoicesState = signal<Invoice[]>([...invoices])

  readonly companyName = companyName
  readonly contacts = contacts
  readonly accounts = accounts
  readonly items = items
  readonly quotations = quotations
  readonly salesOrders = salesOrders
  get invoices() { return this.invoicesState() }
  readonly salesDeliveryNotes = salesDeliveryNotes
  readonly inventoryAdjustments = inventoryAdjustments
  readonly payments = payments
  readonly bills = bills
  readonly journalEntries = journalEntries
  readonly bankAccounts = bankAccounts
  readonly bankTransactions = bankTransactions
  readonly trialBalance = trialBalance
  readonly dashboardTasks = dashboardTasks
  readonly dashboardStats = dashboardStats
  readonly cashFlowData = cashFlowData

  getInvoice(id: string): Invoice | undefined {
    return this.invoicesState().find((i) => i.id === id)
  }

  getPayment(id: string): Payment | undefined {
    return payments.find((p) => p.id === id)
  }

  getQuotation(id: string) {
    return quotations.find((q) => q.id === id)
  }

  getSalesOrder(id: string) {
    return salesOrders.find((o) => o.id === id)
  }

  createInvoice(draft: InvoiceDraft): Invoice {
    const contact = contacts.find((c) => c.id === draft.contactId)
    if (!contact) throw new Error(`Contact not found: ${draft.contactId}`)
    const amounts = invoiceAmounts(draft.lines)
    const invoice: Invoice = {
      id: `inv${Date.now()}`,
      number: nextInvoiceNumber(this.invoicesState()),
      contactId: contact.id,
      contactName: contact.name,
      date: draft.date,
      dueDate: draft.dueDate,
      status: draft.status,
      quotationId: draft.quotationId,
      salesOrderId: draft.salesOrderId,
      lines: draft.lines.map((line, index) => ({
        ...line,
        id: line.id || `il-${Date.now()}-${index}`,
        amount: line.quantity * line.unitPrice,
      })),
      subtotal: amounts.subtotal,
      tax: amounts.tax,
      total: amounts.total,
      amountPaid: 0,
    }
    this.invoicesState.update((current) => [invoice, ...current])
    return invoice
  }

  updateInvoice(id: string, draft: InvoiceDraft): Invoice {
    const contact = contacts.find((c) => c.id === draft.contactId)
    const current = this.getInvoice(id)
    if (!contact) throw new Error(`Contact not found: ${draft.contactId}`)
    if (!current) throw new Error(`Invoice not found: ${id}`)
    const lines = draft.lines.map((line, index) => ({
      ...line,
      id: line.id || `il-${Date.now()}-${index}`,
      amount: line.quantity * line.unitPrice,
    }))
    const amounts = invoiceAmounts(lines)
    const next: Invoice = {
      ...current,
      contactId: contact.id,
      contactName: contact.name,
      date: draft.date,
      dueDate: draft.dueDate,
      status: current.amountPaid >= amounts.total ? 'Paid' : draft.status,
      quotationId: draft.quotationId,
      salesOrderId: draft.salesOrderId,
      lines,
      subtotal: amounts.subtotal,
      tax: amounts.tax,
      total: amounts.total,
    }
    this.invoicesState.update((all) => all.map((invoice) => invoice.id === id ? next : invoice))
    return next
  }
}
