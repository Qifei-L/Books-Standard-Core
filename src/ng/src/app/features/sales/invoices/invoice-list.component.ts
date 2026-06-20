import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { DataService } from '../../../core/data/data.service'
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component'
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe'
import { FormatMoneyPipe } from '../../../shared/pipes/format-money.pipe'
import { getInvoiceAmounts } from '../../../core/lib/invoice-document'
import type { Invoice } from '../../../core/types'

interface InvoiceRow extends Invoice {
  amountDue: number
}

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    StatusBadgeComponent, FormatDatePipe, FormatMoneyPipe,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Sales Invoices</h1>
        <button mat-flat-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon> New Invoice
        </button>
      </div>

      <mat-card appearance="outlined" class="table-card">
        <table mat-table [dataSource]="rows" class="full-width">
          <!-- Number -->
          <ng-container matColumnDef="number">
            <th mat-header-cell *matHeaderCellDef>Invoice #</th>
            <td mat-cell *matCellDef="let row">
              <a [routerLink]="row.id" class="doc-link">{{ row.number }}</a>
            </td>
          </ng-container>

          <!-- Contact -->
          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Contact</th>
            <td mat-cell *matCellDef="let row">{{ row.contactName }}</td>
          </ng-container>

          <!-- Date -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let row">{{ row.date | formatDate }}</td>
          </ng-container>

          <!-- Due Date -->
          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Due Date</th>
            <td mat-cell *matCellDef="let row">{{ row.dueDate | formatDate }}</td>
          </ng-container>

          <!-- Status -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <app-status-badge [status]="row.status" />
            </td>
          </ng-container>

          <!-- Total -->
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef class="num-header">Total</th>
            <td mat-cell *matCellDef="let row" class="num-cell">
              {{ row.total | formatMoney }}
            </td>
          </ng-container>

          <!-- Amount Due -->
          <ng-container matColumnDef="amountDue">
            <th mat-header-cell *matHeaderCellDef class="num-header">Amount Due</th>
            <td mat-cell *matCellDef="let row" class="num-cell">
              @if (row.amountDue > 0) {
                <strong>{{ row.amountDue | formatMoney }}</strong>
              } @else {
                <span class="zero">—</span>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols"
              class="clickable-row"
              [routerLink]="row.id"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .table-card { overflow: hidden; }
    .full-width { width: 100%; }
    .num-header, .num-cell { text-align: right; }
    .doc-link { color: #1967d2; text-decoration: none; font-weight: 500; font-size: 13px; }
    .doc-link:hover { text-decoration: underline; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover td { background: #f8f9fa; }
    .zero { color: #9aa0a6; }
  `],
})
export class InvoiceListComponent {
  private data = inject(DataService)

  cols = ['number', 'contact', 'date', 'dueDate', 'status', 'total', 'amountDue']

  rows: InvoiceRow[] = this.data.invoices.map((inv) => ({
    ...inv,
    amountDue: getInvoiceAmounts(inv).amountDue,
  }))
}
