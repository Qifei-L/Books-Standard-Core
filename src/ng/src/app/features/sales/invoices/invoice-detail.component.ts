import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { DataService } from '../../../core/data/data.service'
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component'
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe'
import { FormatMoneyPipe } from '../../../shared/pipes/format-money.pipe'
import {
  getInvoiceAllocations,
  getInvoiceAmounts,
  getInvoiceDueMeta,
} from '../../../core/lib/invoice-document'
import {
  getDeliveryNotesForInvoice,
  getInvoiceShipmentStatus,
} from '../../../core/lib/stock-documents'
import type { Invoice, Contact } from '../../../core/types'

interface DocFlowRow {
  typeLabel: string
  number: string
  status: string
  date: string
  amount: number
  routerLink: string[]
}

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule, MatMenuModule,
    StatusBadgeComponent,
    FormatDatePipe, FormatMoneyPipe,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss',
})
export class InvoiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private data  = inject(DataService)

  invoice:    Invoice  | undefined
  contact:    Contact  | undefined

  amounts  = { amountPaid: 0, amountDue: 0 }
  dueMeta  = { dueDays: 0, isOverdue: false, dueLabel: null as string | null }

  deliveryNotes:  ReturnType<typeof getDeliveryNotesForInvoice> = []
  paymentCount = 0
  docFlowRows: DocFlowRow[] = []

  // accordion open/close state
  showFlow       = true
  showSupporting = false

  ngOnInit(): void {
    const id  = this.route.snapshot.paramMap.get('id')!
    const inv = this.data.getInvoice(id)
    if (!inv) return
    this.invoice = inv

    this.contact = this.data.contacts.find((c) => c.id === inv.contactId)
    const quotation  = inv.quotationId  ? this.data.getQuotation(inv.quotationId)   : undefined
    const salesOrder = inv.salesOrderId ? this.data.getSalesOrder(inv.salesOrderId) : undefined

    this.amounts = getInvoiceAmounts(inv)
    this.dueMeta = getInvoiceDueMeta(inv, this.amounts.amountDue)

    this.deliveryNotes = getDeliveryNotesForInvoice(inv.id)
    const allocations  = getInvoiceAllocations(inv.id)
    this.paymentCount  = allocations.length

    const shipStatus    = getInvoiceShipmentStatus(inv)
    const needsShipment = shipStatus === 'not_shipped' || shipStatus === 'partially_shipped'
    void needsShipment  // referenced by future "Create DN" action

    const rows: DocFlowRow[] = []

    if (quotation) {
      rows.push({ typeLabel: 'Quote', number: quotation.number, status: quotation.status,
                  date: quotation.date, amount: quotation.total,
                  routerLink: ['/sales/quotes', quotation.id] })
    }
    if (salesOrder) {
      rows.push({ typeLabel: 'Sales Order', number: salesOrder.number, status: salesOrder.status,
                  date: salesOrder.date, amount: salesOrder.total,
                  routerLink: ['/sales/orders', salesOrder.id] })
    }
    for (const dn of this.deliveryNotes) {
      rows.push({ typeLabel: 'Delivery Note', number: dn.number, status: dn.status,
                  date: dn.date, amount: dn.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0),
                  routerLink: ['/sales/delivery-notes', dn.id] })
    }
    for (const a of allocations) {
      rows.push({ typeLabel: 'Payment', number: a.paymentNumber, status: 'Paid',
                  date: a.paymentDate, amount: a.amount,
                  routerLink: ['/sales/payments', a.paymentId] })
    }
    rows.sort((a, b) => a.date.localeCompare(b.date))
    this.docFlowRows = rows

    // flow chip counts (for collapsed accordion header)
    this._flowChips = [
      quotation  ? 'Quote 1' : null,
      salesOrder ? 'Sales Order 1' : null,
      this.deliveryNotes.length ? `Delivery Note ${this.deliveryNotes.length}` : null,
      this.paymentCount ? `Payment ${this.paymentCount}` : null,
    ].filter(Boolean) as string[]
  }

  _flowChips: string[] = []
}
