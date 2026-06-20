import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { DataService } from '../../core/data/data.service'
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component'
import { FormatDatePipe } from '../../shared/pipes/format-date.pipe'
import { FormatMoneyPipe } from '../../shared/pipes/format-money.pipe'

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, StatusBadgeComponent, FormatDatePipe, FormatMoneyPipe],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Bills</h1>
        <button mat-flat-button color="primary"><mat-icon>add</mat-icon> New Bill</button>
      </div>
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="data.bills" class="full-width">
          <ng-container matColumnDef="number">
            <th mat-header-cell *matHeaderCellDef>Bill #</th>
            <td mat-cell *matCellDef="let r">{{ r.number }}</td>
          </ng-container>
          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Supplier</th>
            <td mat-cell *matCellDef="let r">{{ r.contactName }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let r">{{ r.date | formatDate }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r"><app-status-badge [status]="r.status" /></td>
          </ng-container>
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef class="num-h">Total</th>
            <td mat-cell *matCellDef="let r" class="num-c">{{ r.total | formatMoney }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let r; columns: cols"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`.full-width{width:100%} .num-h,.num-c{text-align:right}`],
})
export class BillsComponent {
  readonly data = inject(DataService)
  cols = ['number', 'contact', 'date', 'status', 'total']
}
