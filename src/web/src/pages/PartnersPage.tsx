import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { contacts } from '@/data/mock'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const typeLabels = { Customer: 'Customer', Supplier: 'Supplier', Both: 'Customer / Supplier' } as const

export function PartnersPage() {
  return (
    <div>
      <PageHeader
        title="Business Partners"
        description="Customers and suppliers"
        action={{ label: '+ New Partner' }}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Outstanding Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{typeLabels[c.type]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.email ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <MoneyDisplay amount={c.balance} negative={c.balance < 0 ? 'red' : undefined} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Company and accounting preferences" />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Company name</div>
              <div className="font-medium">示例科技有限公司</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Base currency</div>
              <div className="font-medium">CNY</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Fiscal year end</div>
              <div className="font-medium">December 31</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Default tax rates</div>
              <div className="font-medium">13% / 6%</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Editing will be enabled after Phase 1 API integration.</p>
        </CardContent>
      </Card>
    </div>
  )
}
