import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { contacts } from '@/data/mock'
import { invoicesListUrl } from '@/lib/invoiceListParams'
import { defaultInvoiceListFilter } from '@/lib/invoiceListFilters'
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
              {contacts.map((c) => {
                const canViewInvoices = c.type === 'Customer' || c.type === 'Both'
                return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {canViewInvoices ? (
                      <Link
                        to={invoicesListUrl(defaultInvoiceListFilter, [c.id])}
                        className="text-link"
                        title={`View invoices for ${c.name}`}
                      >
                        {c.name}
                      </Link>
                    ) : (
                      c.name
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{typeLabels[c.type]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.email ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <MoneyDisplay amount={c.balance} negative={c.balance < 0 ? 'red' : undefined} />
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
