import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-tokens-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './tokens-demo.component.html',
})
export class TokensDemoComponent {
  theme = signal<'finance' | 'indigo'>('finance')

  setTheme(t: 'finance' | 'indigo') {
    this.theme.set(t)
    document.documentElement.setAttribute('data-theme', t)
  }

  invoices = [
    { number: 'INV-2025-001', customer: 'Acme 有限公司',    date: '2025-06-01', due: '2025-07-01', amount: 9900,   status: 'paid'    },
    { number: 'INV-2025-003', customer: 'Gamma 咨询',       date: '2025-04-01', due: '2025-04-15', amount: 3520,   status: 'overdue' },
    { number: 'INV-2025-004', customer: 'Beta 科技',        date: '2025-06-18', due: '2025-07-02', amount: 308000, status: 'awaiting'},
    { number: 'INV-2025-005', customer: 'Delta 贸易有限公司', date: '2025-06-20', due: '2025-07-20', amount: 12000,  status: 'draft'   },
  ]

  statusLabel(s: string) {
    return { paid: '已付款', overdue: '逾期', awaiting: '待审核', draft: '草稿' }[s] ?? s
  }

  badgeStyle(s: string): Record<string, string> {
    const map: Record<string, Record<string, string>> = {
      paid:     { background: 'color-mix(in srgb, var(--c-success) 12%, transparent)', color: 'var(--c-success)' },
      overdue:  { background: 'color-mix(in srgb, var(--c-danger)  12%, transparent)', color: 'var(--c-danger)'  },
      awaiting: { background: 'color-mix(in srgb, var(--c-warning) 12%, transparent)', color: 'var(--c-warning)' },
      draft:    { background: 'color-mix(in srgb, var(--c-text)    8%,  transparent)', color: 'var(--c-text-muted)' },
    }
    return map[s] ?? {}
  }

  tokenSwatches = [
    { name: '--c-header',        val: 'var(--c-header)'        },
    { name: '--c-action',        val: 'var(--c-action)'        },
    { name: '--c-bg-page',       val: 'var(--c-bg-page)'       },
    { name: '--c-bg-workspace',  val: 'var(--c-bg-workspace)'  },
    { name: '--c-surface',       val: 'var(--c-surface)'       },
    { name: '--c-border',        val: 'var(--c-border)'        },
    { name: '--c-border-strong', val: 'var(--c-border-strong)' },
    { name: '--c-success',       val: 'var(--c-success)'       },
    { name: '--c-warning',       val: 'var(--c-warning)'       },
    { name: '--c-danger',        val: 'var(--c-danger)'        },
  ]
}
