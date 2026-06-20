import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  useSalesSettings,
  type SalesSettings,
  defaultSalesSettings,
} from '@/contexts/SalesSettingsContext'

function settingsEqual(a: SalesSettings, b: SalesSettings): boolean {
  return (Object.keys(defaultSalesSettings) as (keyof SalesSettings)[]).every(
    (key) => a[key] === b[key],
  )
}

export function SalesSettingsPage() {
  const { settings, saveSettings } = useSalesSettings()
  const [draft, setDraft] = useState<SalesSettings>(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setDraft(settings)
    setSaved(false)
  }, [settings])

  const isDirty = !settingsEqual(draft, settings)

  const update = <K extends keyof SalesSettings>(key: K, value: SalesSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  return (
    <div>
      <PageHeader
        title="Sales Settings"
        description="Optional modules and payment behaviour"
      />
      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={draft.enableSalesOrders}
                onCheckedChange={(checked) => update('enableSalesOrders', checked === true)}
              />
              Enable Sales Orders
              <span className="text-muted-foreground">(optional workflow)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={draft.enableCreditNotes}
                onCheckedChange={(checked) => update('enableCreditNotes', checked === true)}
              />
              Enable Credit Notes
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={draft.enableRecurringInvoices}
                onCheckedChange={(checked) => update('enableRecurringInvoices', checked === true)}
              />
              Enable Recurring Invoices
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={draft.allowUnallocatedReceipts}
                onCheckedChange={(checked) => update('allowUnallocatedReceipts', checked === true)}
              />
              Allow unallocated receipts (customer advance → liability)
            </label>
            <p className="text-xs text-muted-foreground">
              Saving updates the Sales sub-navigation immediately. Disabled modules redirect to Overview if opened directly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Document templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Manage numbering sequences, document defaults, and print layouts for quotes, sales orders,
              invoices, and credit notes.
            </p>
            <Button render={<Link to="/sales/templates" />}>
              Manage templates
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => { saveSettings(draft); setSaved(true) }} disabled={!isDirty}>
            Save settings
          </Button>
          <Button variant="outline" onClick={() => setDraft(settings)} disabled={!isDirty}>
            Cancel
          </Button>
          <Button variant="ghost" onClick={() => setDraft(defaultSalesSettings)}>
            Reset to defaults
          </Button>
          {saved && !isDirty && (
            <span className="text-sm text-success">Saved — navigation updated.</span>
          )}
        </div>
      </div>
    </div>
  )
}
