import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
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
import type { Invoice } from '../../../core/types'

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    StatusBadgeComponent, DocumentLinksSectionComponent,
    FormatDatePipe, FormatMoneyPipe,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss',
})
export class InvoiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private data  = inject(DataService)

  invoice: Invoice | undefined
  amounts  = { amountPaid: 0, amountDue: 0 }
  dueMeta  = { dueDays: 0, isOverdue: false, dueLabel: null as string | null }
  docGroups: DocumentGroup[] = []
  lineCols = ['description', 'quantity', 'unitPrice', 'amount']

  ngOnInit(): void {
    const id  = this.route.snapshot.paramMap.get('id')!
    const inv = this.data.getInvoice(id)
    if (!inv) return
    this.invoice = inv

    this.amounts = getInvoiceAmounts(inv)
    this.dueMeta = getInvoiceDueMeta(inv, this.amounts.amountDue)

    const quotation    = inv.quotationId   ? this.data.getQuotation(inv.quotationId)   : null
    const salesOrder   = inv.salesOrderId  ? this.data.getSalesOrder(inv.salesOrderId) : null
    const deliveryNotes = getDeliveryNotesForInvoice(inv.id)
    const allocations   = getInvoiceAllocations(inv.id)
    const shipStatus    = getInvoiceShipmentStatus(inv)
    const needsShipment = shipStatus === 'not_shipped' || shipStatus === 'partially_shipped'

    this.docGroups = [
      {
        key: 'quotation',
        title: 'Quotation',
        showStatus: true,
        rows: quotation
          ? [{ id: quotation.id, number: quotation.number, date: quotation.date,
               routerLink: ['/sales/quotes', quotation.id], status: quotation.status }]
          : [],
        emptyMessage: 'No linked quotation',
      },
      {
        key: 'order',
        title: 'Sales Order',
        showStatus: true,
        rows: salesOrder
          ? [{ id: salesOrder.id, number: salesOrder.number, date: salesOrder.date,
               routerLink: ['/sales/orders', salesOrder.id], status: salesOrder.status }]
          : [],
        emptyMessage: 'No linked sales order',
      },
      {
        key: 'delivery',
        title: 'Delivery Notes',
        showStatus: true,
        rows: deliveryNotes.map((dn) => ({
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
