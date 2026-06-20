import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export function SalesSettingsPage() {
  return (
    <div>
      <PageHeader title="Sales Settings" description="Defaults and numbering for sales documents" />
      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Document numbering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quote-prefix">Quote prefix</Label>
              <Input id="quote-prefix" defaultValue="QT-" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-prefix">Invoice prefix</Label>
              <Input id="inv-prefix" defaultValue="INV-" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cn-prefix">Credit note prefix</Label>
              <Input id="cn-prefix" defaultValue="CN-" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-terms">Default payment terms (days)</Label>
              <Input id="payment-terms" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Default tax rate (%)</Label>
              <Input id="tax-rate" type="number" defaultValue="13" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              Enable Sales Orders
              <span className="text-muted-foreground">(optional workflow)</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              Enable Credit Notes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox />
              Enable Recurring Invoices
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              Allow unallocated receipts (customer advance → liability)
            </label>
          </CardContent>
        </Card>

        <Button className="w-fit">Save settings</Button>
        <p className="text-xs text-muted-foreground">Settings are mock-only until Phase 1 API.</p>
      </div>
    </div>
  )
}
