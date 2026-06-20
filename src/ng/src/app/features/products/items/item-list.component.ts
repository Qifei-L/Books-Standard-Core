import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { DataService } from '../../../core/data/data.service'
import { FormatMoneyPipe } from '../../../shared/pipes/format-money.pipe'

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, FormatMoneyPipe],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Items</h1>
        <button mat-flat-button color="primary"><mat-icon>add</mat-icon> New Item</button>
      </div>
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="data.items" class="full-width">
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Code</th>
            <td mat-cell *matCellDef="let r"><a [routerLink]="r.id" class="doc-link">{{ r.code }}</a></td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let r">{{ r.name }}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let r">{{ r.itemType }}</td>
          </ng-container>
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef class="num-h">Unit Price</th>
            <td mat-cell *matCellDef="let r" class="num-c">{{ r.defaultUnitPrice | formatMoney }}</td>
          </ng-container>
          <ng-container matColumnDef="qty">
            <th mat-header-cell *matHeaderCellDef class="num-h">On Hand</th>
            <td mat-cell *matCellDef="let r" class="num-c">{{ r.quantityOnHand ?? '—' }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let r; columns: cols" class="clickable-row" [routerLink]="r.id"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .full-width{width:100%} .num-h,.num-c{text-align:right}
    .doc-link{color:#1967d2;text-decoration:none;font-weight:500;font-size:13px}
    .doc-link:hover{text-decoration:underline}
    .clickable-row{cursor:pointer} .clickable-row:hover td{background:#f8f9fa}
  `],
})
export class ItemListComponent {
  readonly data = inject(DataService)
  cols = ['code', 'name', 'type', 'price', 'qty']
}
