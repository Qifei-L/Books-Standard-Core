import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider'
import { DataService } from '../../core/data/data.service'
import { FormatMoneyPipe } from '../../shared/pipes/format-money.pipe'

const TASK_ICONS: Record<string, string> = {
  reconcile: 'account_balance',
  invoice: 'receipt',
  bill: 'description',
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatListModule, MatDividerModule,
    FormatMoneyPipe,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Dashboard</h1>
      </div>

      <div class="kpi-row">
        @for (kpi of kpis; track kpi.label) {
          <mat-card class="kpi-card" appearance="outlined">
            <mat-card-content>
              <div class="kpi-label">{{ kpi.label }}</div>
              <div class="kpi-val">{{ kpi.value | formatMoney }}</div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <mat-card appearance="outlined" class="tasks-card">
        <mat-card-header>
          <mat-card-title>To-do</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (task of tasks; track task.id; let last = $last) {
              <a mat-list-item [routerLink]="task.link" class="task-item">
                <mat-icon matListItemIcon class="task-icon">{{ icon(task.type) }}</mat-icon>
                <span matListItemTitle>{{ task.title }}</span>
                <mat-icon matListItemMeta>chevron_right</mat-icon>
              </a>
              @if (!last) { <mat-divider /> }
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    h1 { margin: 0; font-size: 22px; font-weight: 600; color: #1a1a2e; }
    .kpi-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; margin-bottom: 24px; }
    .kpi-card mat-card-content { padding: 14px 16px !important; }
    .kpi-label { font-size: 11px; color: #5f6368; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-val { font-size: 20px; font-weight: 700; color: #1a1a2e; margin-top: 6px; }
    .tasks-card { max-width: 480px; }
    .task-item { text-decoration: none; }
    .task-icon { color: #1565c0; }
  `],
})
export class DashboardComponent {
  private data = inject(DataService)

  readonly tasks = this.data.dashboardTasks

  readonly kpis = [
    { label: 'Revenue', value: this.data.dashboardStats.revenue },
    { label: 'Expenses', value: this.data.dashboardStats.expenses },
    { label: 'Net Profit', value: this.data.dashboardStats.netProfit },
    { label: 'Receivables', value: this.data.dashboardStats.receivables },
    { label: 'Payables', value: this.data.dashboardStats.payables },
  ]

  icon(type: string): string {
    return TASK_ICONS[type] ?? 'info'
  }
}
