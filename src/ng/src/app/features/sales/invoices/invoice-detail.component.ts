import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
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
import type { Invoice } from '../../../core/types'

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDividerModule,
    StatusBadgeComponent, DocumentLinksSectionComponent,
    FormatDatePipe, FormatMoneyPipe,
  ],
  template: `
    @if (invoice) {
      <div class="page-container">
        <!-- Header -->
        <div class="inv-header">
          <div class="inv-title-row">
            <div>
              <div class="inv-number">{{ invoice.number }}</div>
              <div class="inv-contact">{{ invoice.contactName }}</div>
            </div>
            <app-status-badge [status]="invoice.status" />
          </div>
          <div class="inv-actions">
            <button mat-stroked-button>
              <mat-icon>edit</mat-icon> Edit
            </button>
            <button mat-stroked-button>
              <mat-icon>send</mat-icon> Send
            </button>
            <button mat-stroked-button>
              <mat-icon>block</mat-icon> Void
            </button>
          </div>
        </div>

        <!-- KPI strip -->
        <div class="kpi-row">
          <mat-card appearance="outlined" class="kpi-card">
            <mat-card-content>
              <div class="kpi-label">Issue Date</div>
              <div class="kpi-val">{{ invoice.date | formatDate }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="kpi-card">
            <mat-card-content>
              <div class="kpi-label">Due Date</div>
              <div class="kpi-val" [class.overdue]="amounts.amountDue > 0 && dueMeta.isOverdue">
                {{ invoice.dueDate | formatDate }}
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="kpi-card">
            <mat-card-content>
              <div class="kpi-label">Subtotal</div>
              <div class="kpi-val">{{ invoice.subtotal | formatMoney }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="kpi-card">
            <mat-card-content>
              <div class="kpi-label">Tax</div>
              <div class="kpi-val">{{ invoice.tax | formatMoney }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="kpi-card">
            <mat-card-content>
              <div class="kpi-label">Total</div>
              <div class="kpi-val kpi-total">{{ invoice.total | formatMoney }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="kpi-card">
            <mat-card-content>
              <div class="kpi-label">Amount Due</div>
              <div class="kpi-val" [class.overdue]="dueMeta.isOverdue">
                {{ amounts.amountDue | formatMoney }}
              </div>
              @if (dueMeta.dueLabel) {
                <div class="kpi-due-label" [class.overdue]="dueMeta.isOverdue">
                  {{ dueMeta.dueLabel }}
                </div>
              }
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Line items -->
        <mat-card appearance="outlined" class="section-card">
          <mat-card-header>
            <mat-card-title class="section-title">Line Items</mat-card-title>
          </mat-card-header>
          <mat-card-content class="no-pad">
            <table mat-table [dataSource]="invoice.lines" class="full-width">
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Item / Description</th>
                <td mat-cell *matCellDef="let l">
                  <div>{{ l.description }}</div>
                  @if (l.itemCode) { <div class="item-code">{{ l.itemCode }}</div> }
                </td>
              </ng-container>
              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef class="num-h">Qty</th>
                <td mat-cell *matCellDef="let l" class="num-c">{{ l.quantity }}</td>
              </ng-container>
              <ng-container matColumnDef="unitPrice">
                <th mat-header-cell *matHeaderCellDef class="num-h">Unit Price</th>
                <td mat-cell *matCellDef="let l" class="num-c">{{ l.unitPrice | formatMoney }}</td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef class="num-h">Amount</th>
                <td mat-cell *matCellDef="let l" class="num-c">{{ l.amount | formatMoney }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="lineCols"></tr>
              <tr mat-row *matRowDef="let _; columns: lineCols"></tr>
            </table>
            <!-- Totals footer -->
            <div class="line-totals">
              <span>Subtotal: <strong>{{ invoice.subtotal | formatMoney }}</strong></span>
              <span>Tax: <strong>{{ invoice.tax | formatMoney }}</strong></span>
              <span>Total: <strong>{{ invoice.total | formatMoney }}</strong></span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Related Documents (grouped) -->
        <div class="section-card">
          <app-document-links-section [groups]="docGroups" />
        </div>
      </div>
    } @else {
      <div class="page-container">
        <p class="not-found">Invoice not found.</p>
      </div>
    }
  `,
  styles: [`
    .inv-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
    .inv-title-row { display: flex; align-items: flex-start; gap: 12px; }
    .inv-number { font-size: 22px; font-weight: 700; color: #1a1a2e; }
    .inv-contact { font-size: 14px; color: #5f6368; margin-top: 2px; }
    .inv-actions { display: flex; gap: 8px; }

    .kpi-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
    .kpi-card { flex: 1 1 120px; min-width: 110px; }
    .kpi-card mat-card-content { padding: 12px 16px; }
    .kpi-label { font-size: 11px; color: #5f6368; text-transform: uppercase; letter-spacing: 0.4px; font-weight: 600; }
    .kpi-val { font-size: 16px; font-weight: 600; color: #1a1a2e; margin-top: 4px; }
    .kpi-total { color: #1565c0; }
    .kpi-due-label { font-size: 11px; margin-top: 2px; color: #5f6368; }
    .overdue { color: #c5221f !important; }

    .section-card { margin-bottom: 16px; }
    .section-title { font-size: 14px !important; font-weight: 600; }
    .no-pad { padding: 0 !important; }
    .full-width { width: 100%; }
    .num-h, .num-c { text-align: right; }
    .item-code { font-size: 11px; color: #9aa0a6; }
    .line-totals {
      display: flex; justify-content: flex-end; gap: 24px;
      padding: 10px 16px; font-size: 13px; color: #5f6368;
      border-top: 1px solid #e8eaed;
    }
    .not-found { color: #5f6368; }
  `],
})
export class InvoiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private data = inject(DataService)

  invoice: Invoice | undefined
  amounts = { amountPaid: 0, amountDue: 0 }
  dueMeta = { dueDays: 0, isOverdue: false, dueLabel: null as string | null }
  docGroups: DocumentGroup[] = []

  lineCols = ['description', 'quantity', 'unitPrice', 'amount']

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!
    const inv = this.data.getInvoice(id)
    if (!inv) return
    this.invoice = inv

    this.amounts = getInvoiceAmounts(inv)
    this.dueMeta = getInvoiceDueMeta(inv, this.amounts.amountDue)

    const quotation = inv.quotationId ? this.data.getQuotation(inv.quotationId) : null
    const salesOrder = inv.salesOrderId ? this.data.getSalesOrder(inv.salesOrderId) : null
    const deliveryNotes = getDeliveryNotesForInvoice(inv.id)
    const allocations = getInvoiceAllocations(inv.id)
    const shipmentStatus = getInvoiceShipmentStatus(inv)
    const needsShipment = shipmentStatus === 'not_shipped' || shipmentStatus === 'partially_shipped'

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
