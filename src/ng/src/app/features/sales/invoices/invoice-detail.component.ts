import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatMenuModule } from '@angular/material/menu'
import { MatDividerModule } from '@angular/material/divider'
import { DataService } from '../../../core/data/data.service'
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component'
import {
  DocumentLinksSectionComponent,
  DocumentGroup,
} from '../../../shared/components/document-links-section/document-links-section.component'
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
import type { Invoice, Contact, Quotation, SalesOrder } from '../../../core/types'

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
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatExpansionModule, MatMenuModule, MatDividerModule,
    StatusBadgeComponent, DocumentLinksSectionComponent,
    FormatDatePipe, FormatMoneyPipe,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss',
})
export class InvoiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private data  = inject(DataService)

  invoice:   Invoice   | undefined
  contact:   Contact   | undefined
  quotation: Quotation | undefined
  salesOrder: SalesOrder | undefined

  amounts  = { amountPaid: 0, amountDue: 0 }
  dueMeta  = { dueDays: 0, isOverdue: false, dueLabel: null as string | null }

  deliveryNotes:  ReturnType<typeof getDeliveryNotesForInvoice> = []
  paymentCount = 0
  docGroups: DocumentGroup[] = []
  docFlowRows: DocFlowRow[] = []

  lineCols     = ['description', 'quantity', 'unitPrice', 'amount']
  flowCols     = ['typeLabel', 'number', 'status', 'date', 'amount']

  ngOnInit(): void {
    const id  = this.route.snapshot.paramMap.get('id')!
    const inv = this.data.getInvoice(id)
    if (!inv) return
    this.invoice = inv

    this.contact    = this.data.contacts.find((c) => c.id === inv.contactId)
    this.quotation  = inv.quotationId  ? this.data.getQuotation(inv.quotationId)   : undefined
    this.salesOrder = inv.salesOrderId ? this.data.getSalesOrder(inv.salesOrderId) : undefined

    this.amounts = getInvoiceAmounts(inv)
    this.dueMeta = getInvoiceDueMeta(inv, this.amounts.amountDue)

    this.deliveryNotes = getDeliveryNotesForInvoice(inv.id)
    const allocations  = getInvoiceAllocations(inv.id)
    this.paymentCount  = allocations.length

    const shipStatus    = getInvoiceShipmentStatus(inv)
    const needsShipment = shipStatus === 'not_shipped' || shipStatus === 'partially_shipped'

    // Flat document flow table — sorted chronologically
    const flowRows: DocFlowRow[] = []

    if (this.quotation) {
      flowRows.push({
        typeLabel: 'Quote',
        number: this.quotation.number,
        status: this.quotation.status,
        date: this.quotation.date,
        amount: this.quotation.total,
        routerLink: ['/sales/quotes', this.quotation.id],
      })
    }
    if (this.salesOrder) {
      flowRows.push({
        typeLabel: 'Sales Order',
        number: this.salesOrder.number,
        status: this.salesOrder.status,
        date: this.salesOrder.date,
        amount: this.salesOrder.total,
        routerLink: ['/sales/orders', this.salesOrder.id],
      })
    }
    for (const dn of this.deliveryNotes) {
      const total = dn.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0)
      flowRows.push({
        typeLabel: 'Delivery Note',
        number: dn.number,
        status: dn.status,
        date: dn.date,
        amount: total,
        routerLink: ['/sales/delivery-notes', dn.id],
      })
    }
    for (const a of allocations) {
      flowRows.push({
        typeLabel: 'Payment',
        number: a.paymentNumber,
        status: 'Paid',
        date: a.paymentDate,
        amount: a.amount,
        routerLink: ['/sales/payments', a.paymentId],
      })
    }
    flowRows.sort((a, b) => a.date.localeCompare(b.date))
    this.docFlowRows = flowRows

    this.docGroups = [
      {
        key: 'quotation',
        title: 'Quotation',
        showStatus: true,
        rows: this.quotation
          ? [{ id: this.quotation.id, number: this.quotation.number,
               date: this.quotation.date, routerLink: ['/sales/quotes', this.quotation.id],
               status: this.quotation.status }]
          : [],
        emptyMessage: 'No linked quotation',
      },
      {
        key: 'order',
        title: 'Sales Order',
        showStatus: true,
        rows: this.salesOrder
          ? [{ id: this.salesOrder.id, number: this.salesOrder.number,
               date: this.salesOrder.date, routerLink: ['/sales/orders', this.salesOrder.id],
               status: this.salesOrder.status }]
          : [],
        emptyMessage: 'No linked sales order',
      },
      {
        key: 'delivery',
        title: 'Delivery Notes',
        showStatus: true,
        rows: this.deliveryNotes.map((dn) => ({
          id: dn.id, number: dn.number, date: dn.date,
          routerLink: ['/sales/delivery-notes', dn.id], status: dn.status,
        })),
        emptyMessage: 'No delivery notes',
        action: needsShipment
          ? { label: 'Create Delivery Note', icon: 'add', routerLink: ['/sales/delivery-notes/new'] }
          : null,
      },
      {
        key: 'payments',
        title: 'Payments Received',
        showAmount: true,
        rows: allocations.map((a) => ({
          id: a.paymentId, number: a.paymentNumber, date: a.paymentDate,
          routerLink: ['/sales/payments', a.paymentId], amount: a.amount,
        })),
        totalRow: this.amounts.amountPaid > 0
          ? { label: 'Total applied', amount: this.amounts.amountPaid }
          : undefined,
        emptyMessage: 'No payments received',
        action: this.amounts.amountDue > 0
          ? { label: 'Record Payment', icon: 'add', routerLink: ['/sales/payments/new'] }
          : null,
      },
    ]
  }
}
