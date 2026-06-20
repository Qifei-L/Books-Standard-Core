import { Injectable } from '@angular/core'
import {
  accounts, bankAccounts, bankTransactions, bills, cashFlowData,
  companyName, contacts, dashboardStats, dashboardTasks,
  inventoryAdjustments, invoices, items, journalEntries,
  payments, quotations, salesDeliveryNotes, salesOrders, trialBalance,
} from './mock'
import type { Invoice, Payment } from '../types'

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly companyName = companyName
  readonly contacts = contacts
  readonly accounts = accounts
  readonly items = items
  readonly quotations = quotations
  readonly salesOrders = salesOrders
  readonly invoices = invoices
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
    return invoices.find((i) => i.id === id)
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
}
