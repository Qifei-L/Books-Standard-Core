import { Component, Input } from '@angular/core'

const LABEL_MAP: Record<string, string> = {
  Draft:              'Draft',
  Awaiting:           'Awaiting',
  Paid:               'Paid',
  Overdue:            'Overdue',
  Sent:               'Sent',
  Accepted:           'Accepted',
  Declined:           'Declined',
  Expired:            'Expired',
  ConvertedToInvoice: 'Converted',
  Submitted:          'Submitted',
  Cancelled:          'Cancelled',
  Posted:             'Posted',
  not_invoiced:       'Not Invoiced',
  partially_invoiced: 'Partial',
  invoiced:           'Invoiced',
}

// Tailwind classes for each colour variant
const CLASS_MAP: Record<string, string> = {
  Draft:              'border-slate-200  bg-slate-100  text-slate-600',
  Awaiting:           'border-blue-200   bg-blue-50    text-blue-700',
  Paid:               'border-green-200  bg-green-50   text-green-700',
  Overdue:            'border-red-200    bg-red-50     text-red-700',
  Sent:               'border-blue-200   bg-blue-50    text-blue-700',
  Accepted:           'border-green-200  bg-green-50   text-green-700',
  Declined:           'border-red-200    bg-red-50     text-red-700',
  Expired:            'border-orange-200 bg-orange-50  text-orange-700',
  ConvertedToInvoice: 'border-purple-200 bg-purple-50  text-purple-700',
  Submitted:          'border-blue-200   bg-blue-50    text-blue-700',
  Cancelled:          'border-red-200    bg-red-50     text-red-700',
  Posted:             'border-green-200  bg-green-50   text-green-700',
  not_invoiced:       'border-orange-200 bg-orange-50  text-orange-700',
  partially_invoiced: 'border-blue-200   bg-blue-50    text-blue-700',
  invoiced:           'border-green-200  bg-green-50   text-green-700',
}

const BASE = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap'

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span [class]="classes">{{ label }}</span>`,
})
export class StatusBadgeComponent {
  @Input() status = ''

  get label(): string { return LABEL_MAP[this.status] ?? this.status }
  get classes(): string {
    return `${BASE} ${CLASS_MAP[this.status] ?? 'border-slate-200 bg-slate-100 text-slate-600'}`
  }
}
