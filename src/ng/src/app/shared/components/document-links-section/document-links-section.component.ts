import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
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
  totalRow?: { label: string; amount: number }
  action?: DocumentGroupAction | null
  emptyMessage?: string
}

@Component({
  selector: 'app-document-links-section',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    StatusBadgeComponent, FormatDatePipe, FormatMoneyPipe,
  ],
  templateUrl: './document-links-section.component.html',
  styleUrl: './document-links-section.component.scss',
})
export class DocumentLinksSectionComponent {
  @Input() groups: DocumentGroup[] = []
}
