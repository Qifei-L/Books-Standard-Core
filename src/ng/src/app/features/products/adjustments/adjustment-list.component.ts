import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { DataService } from '../../../core/data/data.service'
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component'
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe'

@Component({
  selector: 'app-adjustment-list',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, StatusBadgeComponent, FormatDatePipe],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Inventory Adjustments</h1>
        <button mat-flat-button color="primary"><mat-icon>add</mat-icon> New Adjustment</button>
      </div>
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="data.inventoryAdjustments" class="full-width">
          <ng-container matColumnDef="number">
            <th mat-header-cell *matHeaderCellDef>Ref #</th>
            <td mat-cell *matCellDef="let r"><a [routerLink]="r.id" class="doc-link">{{ r.number }}</a></td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let r">{{ r.date | formatDate }}</td>
          </ng-container>
          <ng-container matColumnDef="reason">
            <th mat-header-cell *matHeaderCellDef>Reason</th>
            <td mat-cell *matCellDef="let r">{{ r.reason }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r"><app-status-badge [status]="r.status" /></td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let r; columns: cols" class="clickable-row" [routerLink]="r.id"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .full-width{width:100%}
    .doc-link{color:#1967d2;text-decoration:none;font-weight:500;font-size:13px}
    .doc-link:hover{text-decoration:underline}
    .clickable-row{cursor:pointer} .clickable-row:hover td{background:#f8f9fa}
  `],
})
export class AdjustmentListComponent {
  readonly data = inject(DataService)
  cols = ['number', 'date', 'reason', 'status']
}
