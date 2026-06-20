import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

const reports = [
  {
    title: 'Aged Receivables',
    description: 'Outstanding invoices by aging bucket',
    to: '/sales/reports/aged-receivables',
  },
  {
    title: 'Sales by Customer',
    description: 'Revenue breakdown by business partner',
    to: '/sales/reports/by-customer',
  },
  {
    title: 'Invoice Summary',
    description: 'Issued, paid, and overdue invoice totals',
    to: '/sales/reports/invoice-summary',
  },
  {
    title: 'Quote Conversion',
    description: 'Quotes won, lost, and conversion rate',
    to: '/sales/reports/quote-conversion',
  },
]

export function SalesReportsPage() {
  return (
    <div>
      <PageHeader title="Sales Reports" description="Operational sales analytics" />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Link key={report.to} to={report.to}>
            <Card className="transition-colors hover:bg-secondary/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{report.title}</CardTitle>
                <ChevronRight className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function SalesReportDetailPage({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} description="Report preview — Phase 1" />
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Report data will connect to the API in Phase 1.
        </CardContent>
      </Card>
      <Link to="/sales/reports" className="mt-4 inline-block text-sm text-link">
        ← Back to Sales Reports
      </Link>
    </div>
  )
}
