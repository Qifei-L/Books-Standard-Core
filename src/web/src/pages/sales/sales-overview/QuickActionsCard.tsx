import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSalesSettings } from '@/contexts/SalesSettingsContext'

export function QuickActionsCard() {
  const { settings } = useSalesSettings()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button className="col-span-2" render={<Link to="/sales/invoices/new" />}>
          Create Invoice
        </Button>
        <Button variant="outline" render={<Link to="/sales/payments/new" />}>
          Receive Payment
        </Button>
        {settings.allowUnallocatedReceipts && (
          <Button variant="outline" render={<Link to="/sales/payments/new?advance=1" />}>
            Receive Advance
          </Button>
        )}
        {settings.enableCreditNotes && (
          <Button
            variant="outline"
            className={settings.allowUnallocatedReceipts ? undefined : 'col-span-2'}
            render={<Link to="/sales/credit-notes" />}
          >
            Create Credit Note
          </Button>
        )}
        <Button variant="outline" render={<Link to="/sales/quotes/new" />}>
          New Quote
        </Button>
        {settings.enableSalesOrders && (
          <Button variant="outline" render={<Link to="/sales/sales-orders/new" />}>
            New Sales Order
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
