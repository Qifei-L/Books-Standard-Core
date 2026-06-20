import { Component, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { DataService } from '../../core/data/data.service'
import { FormatMoneyPipe } from '../../shared/pipes/format-money.pipe'

@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  imports: [MatCardModule, MatTableModule, FormatMoneyPipe],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Chart of Accounts</h1></div>
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="data.accounts" class="full-width">
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Code</th>
            <td mat-cell *matCellDef="let r">{{ r.code }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let r">{{ r.name }}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let r">{{ r.type }}</td>
          </ng-container>
          <ng-container matColumnDef="balance">
            <th mat-header-cell *matHeaderCellDef class="num-h">Balance</th>
            <td mat-cell *matCellDef="let r" class="num-c">{{ r.balance | formatMoney }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let r; columns: cols"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`.full-width{width:100%} .num-h,.num-c{text-align:right}`],
})
export class ChartOfAccountsComponent {
  readonly data = inject(DataService)
  cols = ['code', 'name', 'type', 'balance']
}
