import { Component, Input } from '@angular/core'

const LABEL_MAP: Record<string, string> = {
  Draft: 'Draft',
  Awaiting: 'Awaiting',
  Paid: 'Paid',
  Overdue: 'Overdue',
  Sent: 'Sent',
  Accepted: 'Accepted',
  Declined: 'Declined',
  Expired: 'Expired',
  ConvertedToInvoice: 'Converted',
  Submitted: 'Submitted',
  Cancelled: 'Cancelled',
  Posted: 'Posted',
  not_invoiced: 'Not Invoiced',
  partially_invoiced: 'Partial',
  invoiced: 'Invoiced',
}

const CLASS_MAP: Record<string, string> = {
  Draft: 'gray',
  Awaiting: 'blue',
  Paid: 'green',
  Overdue: 'red',
  Sent: 'blue',
  Accepted: 'green',
  Declined: 'red',
  Expired: 'orange',
  ConvertedToInvoice: 'purple',
  Submitted: 'blue',
  Cancelled: 'red',
  Posted: 'green',
  not_invoiced: 'orange',
  partially_invoiced: 'blue',
  invoiced: 'green',
}

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span [class]="'badge badge-' + color">{{ label }}</span>`,
  styles: [`
    .badge {
      display: inline-block; padding: 2px 8px; border-radius: 10px;
      font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px;
      white-space: nowrap;
    }
    .badge-gray   { background: #f1f3f4; color: #5f6368; }
    .badge-blue   { background: #e8f0fe; color: #1967d2; }
    .badge-green  { background: #e6f4ea; color: #137333; }
    .badge-red    { background: #fce8e6; color: #c5221f; }
    .badge-orange { background: #fef7e0; color: #b06000; }
    .badge-purple { background: #f3e8fd; color: #7b1fa2; }
  `],
})
export class StatusBadgeComponent {
  @Input() status = ''

  get color(): string { return CLASS_MAP[this.status] ?? 'gray' }
  get label(): string { return LABEL_MAP[this.status] ?? this.status }
}
