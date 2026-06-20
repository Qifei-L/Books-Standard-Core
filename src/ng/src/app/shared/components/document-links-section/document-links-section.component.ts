import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { StatusBadgeComponent } from '../status-badge/status-badge.component'
import { FormatDatePipe } from '../../pipes/format-date.pipe'
import { FormatMoneyPipe } from '../../pipes/format-money.pipe'

export interface DocumentLinkRow {
  id: string
  routerLink?: string[]
  number: string
  date: string
  status?: string
  amount?: number
}

export interface DocumentGroupAction {
  label: string
  icon?: string
  routerLink?: string[]
}

export interface DocumentGroup {
  key: string
  title: string
  rows: DocumentLinkRow[]
  showStatus?: boolean
  showAmount?: boolean
  columns?: { number?: string; amount?: string }
  totalRow?: { label: string; amount: number }
  action?: DocumentGroupAction | null
  emptyMessage?: string
}

@Component({
  selector: 'app-document-links-section',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,
    StatusBadgeComponent, FormatDatePipe, FormatMoneyPipe,
  ],
  template: `
    <mat-card appearance="outlined" class="doc-card">
      <mat-card-header>
        <mat-card-title class="card-title">Related Documents</mat-card-title>
      </mat-card-header>
      <mat-card-content class="doc-content">
        @for (group of groups; track group.key; let last = $last) {
          <div class="group">
            <div class="group-header">
              <span class="group-title">{{ group.title }}</span>
              @if (group.action) {
                <a mat-stroked-button class="action-btn"
                   [routerLink]="group.action.routerLink">
                  <mat-icon class="btn-icon">{{ group.action.icon ?? 'add' }}</mat-icon>
                  {{ group.action.label }}
                </a>
              }
            </div>

            @if (group.rows.length > 0) {
              <table class="doc-table">
                <tbody>
                  @for (row of group.rows; track row.id) {
                    <tr class="doc-row">
                      <td class="col-num">
                        @if (row.routerLink) {
                          <a [routerLink]="row.routerLink" class="doc-link">{{ row.number }}</a>
                        } @else {
                          {{ row.number }}
                        }
                      </td>
                      <td class="col-date">{{ row.date | formatDate }}</td>
                      @if (group.showStatus) {
                        <td class="col-status">
                          @if (row.status) {
                            <app-status-badge [status]="row.status" />
                          }
                        </td>
                      }
                      @if (group.showAmount) {
                        <td class="col-amount">
                          @if (row.amount != null) {
                            {{ row.amount | formatMoney }}
                          }
                        </td>
                      }
                    </tr>
                  }
                  @if (group.totalRow) {
                    <tr class="total-row">
                      <td [attr.colspan]="group.showStatus ? 2 : 1" class="total-label">
                        {{ group.totalRow.label }}
                      </td>
                      <td class="col-amount total-val">
                        {{ group.totalRow.amount | formatMoney }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <p class="empty-msg">{{ group.emptyMessage ?? 'None' }}</p>
            }
          </div>
          @if (!last) { <mat-divider /> }
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .doc-card { margin-top: 0; }
    .card-title { font-size: 14px !important; font-weight: 600; }
    .doc-content { padding: 0 !important; }

    .group { padding: 10px 16px; }
    .group-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 6px;
    }
    .group-title {
      font-size: 11px; font-weight: 600; color: #5f6368;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .action-btn {
      height: 26px; font-size: 11px; line-height: 1;
      padding: 0 8px; min-width: 0;
    }
    .btn-icon { font-size: 14px; width: 14px; height: 14px; margin-right: 2px; }

    .doc-table { width: 100%; border-collapse: collapse; }
    .doc-row:hover td { background: #f8f9fa; }
    .col-num  { padding: 5px 8px 5px 0; width: 32%; }
    .col-date { padding: 5px 8px; width: 25%; color: #5f6368; font-size: 13px; }
    .col-status { padding: 5px 8px; }
    .col-amount { padding: 5px 0 5px 8px; text-align: right; font-size: 13px; font-weight: 500; white-space: nowrap; }

    .doc-link { color: #1967d2; text-decoration: none; font-size: 13px; font-weight: 500; }
    .doc-link:hover { text-decoration: underline; }

    .empty-msg { color: #9aa0a6; font-size: 13px; margin: 0; padding: 2px 0 4px; }

    .total-row { border-top: 1px solid #e8eaed; }
    .total-label { padding: 7px 0; font-size: 13px; color: #5f6368; }
    .total-val { font-weight: 700; }
  `],
})
export class DocumentLinksSectionComponent {
  @Input() groups: DocumentGroup[] = []
}
