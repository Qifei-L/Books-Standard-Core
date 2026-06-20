import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { DataService } from '../../../core/data/data.service'
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe'
import { FormatMoneyPipe } from '../../../shared/pipes/format-money.pipe'

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, FormatDatePipe, FormatMoneyPipe],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Receive Payments</h1>
        <button mat-flat-button color="primary"><mat-icon>add</mat-icon> Record Payment</button>
      </div>
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="data.payments" class="full-width">
          <ng-container matColumnDef="number">
            <th mat-header-cell *matHeaderCellDef>Payment #</th>
            <td mat-cell *matCellDef="let r"><a [routerLink]="r.id" class="doc-link">{{ r.number }}</a></td>
          </ng-container>
          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Contact</th>
            <td mat-cell *matCellDef="let r">{{ r.contactName }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let r">{{ r.date | formatDate }}</td>
          </ng-container>
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef class="num-h">Amount</th>
            <td mat-cell *matCellDef="let r" class="num-c">{{ r.amount | formatMoney }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let r; columns: cols" class="clickable-row" [routerLink]="r.id"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .full-width { width: 100%; }
    .num-h, .num-c { text-align: right; }
    .doc-link { color: #1967d2; text-decoration: none; font-weight: 500; font-size: 13px; }
    .doc-link:hover { text-decoration: underline; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover td { background: #f8f9fa; }
  `],
})
export class PaymentListComponent {
  readonly data = inject(DataService)
  cols = ['number', 'contact', 'date', 'amount']
}
