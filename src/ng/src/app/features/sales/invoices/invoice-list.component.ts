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

interface InvoiceRow extends Invoice { amountDue: number }

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    StatusBadgeComponent, FormatDatePipe, FormatMoneyPipe,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent {
  private data = inject(DataService)

  cols = ['number', 'contact', 'date', 'dueDate', 'status', 'total', 'amountDue']

  rows: InvoiceRow[] = this.data.invoices.map((inv) => ({
    ...inv,
    amountDue: getInvoiceAmounts(inv).amountDue,
  }))
}
