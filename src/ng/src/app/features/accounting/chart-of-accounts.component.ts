import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { DataService } from '../../core/data/data.service'
import { FormatMoneyPipe } from '../../shared/pipes/format-money.pipe'

type StatusTab = 'all' | 'active' | 'archived'

const CATEGORY_ORDER = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as const
const CATEGORY_LABEL: Record<string, string> = {
  Asset:     'Assets',
  Liability: 'Liabilities',
  Equity:    'Equity',
  Revenue:   'Revenue',
  Expense:   'Expenses',
}

@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormatMoneyPipe],
  templateUrl: './chart-of-accounts.component.html',
})
export class ChartOfAccountsComponent {
  private data = inject(DataService)

  search    = signal('')
  statusTab = signal<StatusTab>('all')
  typeFilter = signal('all')
  collapsed = signal<Set<string>>(new Set())

  subtypes = computed(() => {
    const all = this.data.accounts.map(a => a.subtype)
    return [...new Set(all)].sort()
  })

  filtered = computed(() => {
    const q   = this.search().toLowerCase()
    const tab = this.statusTab()
    const typ = this.typeFilter()
    return this.data.accounts.filter(a => {
      if (tab !== 'all' && a.status !== tab) return false
      if (typ !== 'all' && a.subtype !== typ) return false
      if (q && !a.code.toLowerCase().includes(q) && !a.name.toLowerCase().includes(q)) return false
      return true
    })
  })

  groups = computed(() => {
    const rows = this.filtered()
    return CATEGORY_ORDER
      .map(cat => ({
        key:      cat,
        label:    CATEGORY_LABEL[cat],
        accounts: rows.filter(a => a.type === cat).sort((a, b) => a.code.localeCompare(b.code)),
      }))
      .filter(g => g.accounts.length > 0)
  })

  total    = computed(() => this.data.accounts.length)
  active   = computed(() => this.data.accounts.filter(a => a.status === 'active').length)
  archived = computed(() => this.data.accounts.filter(a => a.status === 'archived').length)

  allCollapsed = computed(() => this.groups().every(g => this.collapsed().has(g.key)))

  isCollapsed(key: string) { return this.collapsed().has(key) }

  toggleGroup(key: string) {
    this.collapsed.update(s => {
      const next = new Set(s)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  toggleAll() {
    if (this.allCollapsed()) {
      this.collapsed.set(new Set())
    } else {
      this.collapsed.set(new Set(this.groups().map(g => g.key)))
    }
  }

  setSearch(v: string)    { this.search.set(v) }
  setTab(t: StatusTab)    { this.statusTab.set(t) }
  setType(v: string)      { this.typeFilter.set(v) }
}
