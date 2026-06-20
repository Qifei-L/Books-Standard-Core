import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
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
import { getDeliveryNotesForInvoice } from '../../../core/lib/stock-documents'

interface DocFlowRow {
  typeLabel: string
  number: string
  status: string
  date: string
  amount: number
  routerLink: string[]
}

const STAMP_MAP: Record<string, { label: string; ink: string }> = {
  Awaiting: { label: 'AWAITING PAYMENT', ink: '#a8761f' },
  Paid:     { label: 'PAID',             ink: '#3f7d52' },
  Overdue:  { label: 'OVERDUE',          ink: '#b3392f' },
  Draft:    { label: 'DRAFT',            ink: '#8b8f99' },
}

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatIconModule, MatMenuModule,
    StatusBadgeComponent,
    FormatDatePipe, FormatMoneyPipe,
  ],
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent {
  private data = inject(DataService)

  // Route param bound automatically via withComponentInputBinding()
  // Fixes the snapshot bug: navigating inv1→inv2 now re-derives all data
  id = input.required<string>()

  invoice  = computed(() => this.data.getInvoice(this.id()))
  contact  = computed(() => {
    const inv = this.invoice()
    return inv ? this.data.contacts.find(c => c.id === inv.contactId) : undefined
  })
  amounts  = computed(() => {
    const inv = this.invoice()
    return inv ? getInvoiceAmounts(inv) : { amountPaid: 0, amountDue: 0 }
  })
  dueMeta  = computed(() => {
    const inv = this.invoice()
    return inv
      ? getInvoiceDueMeta(inv, this.amounts().amountDue)
      : { dueDays: 0, isOverdue: false, dueLabel: null as string | null }
  })
  stamp    = computed(() => STAMP_MAP[this.invoice()?.status ?? ''] ?? null)

  docFlowRows = computed((): DocFlowRow[] => {
    const inv = this.invoice()
    if (!inv) return []
    const rows: DocFlowRow[] = []
    const q  = inv.quotationId  ? this.data.getQuotation(inv.quotationId)   : undefined
    const so = inv.salesOrderId ? this.data.getSalesOrder(inv.salesOrderId) : undefined
    const dns   = getDeliveryNotesForInvoice(inv.id)
    const alloc = getInvoiceAllocations(inv.id)
    if (q)  rows.push({ typeLabel: 'Quote',         number: q.number,  status: q.status,  date: q.date,  amount: q.total,  routerLink: ['/sales/quotes',  q.id] })
    if (so) rows.push({ typeLabel: 'Sales Order',   number: so.number, status: so.status, date: so.date, amount: so.total, routerLink: ['/sales/orders', so.id] })
    for (const dn of dns)    rows.push({ typeLabel: 'Delivery Note', number: dn.number, status: dn.status, date: dn.date, amount: dn.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0), routerLink: ['/sales/delivery-notes', dn.id] })
    for (const a of alloc)   rows.push({ typeLabel: 'Payment',       number: a.paymentNumber, status: 'Paid', date: a.paymentDate, amount: a.amount, routerLink: ['/sales/payments', a.paymentId] })
    return rows.sort((a, b) => a.date.localeCompare(b.date))
  })

  flowChips = computed((): string[] => {
    const inv = this.invoice()
    if (!inv) return []
    const q    = inv.quotationId  ? this.data.getQuotation(inv.quotationId) : undefined
    const so   = inv.salesOrderId ? this.data.getSalesOrder(inv.salesOrderId) : undefined
    const dns  = getDeliveryNotesForInvoice(inv.id)
    const al   = getInvoiceAllocations(inv.id)
    return [
      q  ? 'Quote 1' : null,
      so ? 'Sales Order 1' : null,
      dns.length ? `Delivery Note ${dns.length}` : null,
      al.length  ? `Payment ${al.length}` : null,
    ].filter(Boolean) as string[]
  })

  // Simple accordion state (not signals — no need, just view toggle)
  showFlow       = true
  showSupporting = false
}
