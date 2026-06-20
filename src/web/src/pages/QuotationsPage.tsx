import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { QuotationStatusBadge } from '@/components/shared/StatusBadge'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { EmptyTableRow, columns as col } from '@/components/shared/DataTable'
import { quotations } from '@/data/mock'
import { formatDate } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'

function filterQuotes(tab: string) {
  if (tab === 'all') return quotations
  if (tab === 'open') {
    return quotations.filter((q) =>
      ['Draft', 'Sent', 'Accepted'].includes(q.status),
    )
  }
  return quotations.filter((q) => q.status === tab)
}

export function QuotationsPage() {
  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Draft → Sent → Accepted → Converted to Invoice"
        action={{ label: '+ New Quote', to: '/sales/quotes/new' }}
      />
      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Draft">Draft</TabsTrigger>
          <TabsTrigger value="Sent">Sent</TabsTrigger>
          <TabsTrigger value="Accepted">Accepted</TabsTrigger>
          <TabsTrigger value="ConvertedToInvoice">Converted</TabsTrigger>
        </TabsList>
        {(['open', 'all', 'Draft', 'Sent', 'Accepted', 'ConvertedToInvoice'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <QuotesTable data={filterQuotes(tab)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function QuotesTable({ data }: { data: typeof quotations }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{col.number}</TableHead>
              <TableHead>{col.customer}</TableHead>
              <TableHead>{col.date}</TableHead>
              <TableHead>{col.validTill}</TableHead>
              <TableHead className="text-right">{col.amount}</TableHead>
              <TableHead>{col.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <EmptyTableRow colSpan={6} />
            ) : (
              data.map((q) => (
              <TableRow key={q.id} className="hover:bg-muted/50">
                <TableCell>
                  <Link
                    to={`/sales/quotes/${q.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {q.number}
                  </Link>
                </TableCell>
                <TableCell>{q.contactName}</TableCell>
                <TableCell>{formatDate(q.date)}</TableCell>
                <TableCell>{formatDate(q.validTill)}</TableCell>
                <TableCell className="text-right">
                  <MoneyDisplay amount={q.total} />
                </TableCell>
                <TableCell>
                  <QuotationStatusBadge status={q.status} />
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
