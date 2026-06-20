import { Component, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { DataService } from '../../core/data/data.service'
import { FormatMoneyPipe } from '../../shared/pipes/format-money.pipe'

@Component({
  selector: 'app-trial-balance',
  standalone: true,
  imports: [MatCardModule, MatTableModule, FormatMoneyPipe],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Trial Balance</h1></div>
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="data.trialBalance" class="full-width">
          <ng-container matColumnDef="account">
            <th mat-header-cell *matHeaderCellDef>Account</th>
            <td mat-cell *matCellDef="let r">{{ r.accountName }}</td>
          </ng-container>
          <ng-container matColumnDef="debit">
            <th mat-header-cell *matHeaderCellDef class="num-h">Debit</th>
            <td mat-cell *matCellDef="let r" class="num-c">
              @if (r.debit > 0) { {{ r.debit | formatMoney }} }
            </td>
          </ng-container>
          <ng-container matColumnDef="credit">
            <th mat-header-cell *matHeaderCellDef class="num-h">Credit</th>
            <td mat-cell *matCellDef="let r" class="num-c">
              @if (r.credit > 0) { {{ r.credit | formatMoney }} }
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let r; columns: cols"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`.full-width{width:100%} .num-h,.num-c{text-align:right}`],
})
export class TrialBalanceComponent {
  readonly data = inject(DataService)
  cols = ['account', 'debit', 'credit']
}
