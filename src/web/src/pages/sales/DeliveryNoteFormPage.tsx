import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { DetailBreadcrumb } from '@/components/shared/DocumentDetail'
import { PageHeader } from '@/components/shared/PageHeader'
import { ItemPicker } from '@/components/sales/ItemPicker'
import { contacts, invoices } from '@/data/mock'
import { getItem } from '@/lib/items'
import type { Item } from '@/types'
import { formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function DeliveryNoteFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const invoiceId = searchParams.get('invoice')
  const linkedInvoice = invoiceId ? invoices.find((i) => i.id === invoiceId) : undefined

  const [date, setDate] = useState('2025-06-20')
  const [contactId, setContactId] = useState(linkedInvoice?.contactId ?? contacts[1]?.id ?? '')
  const [itemId, setItemId] = useState(linkedInvoice?.lines.find((l) => {
    const item = getItem(l.itemId)
    return item?.itemType === 'Tracked'
  })?.itemId ?? 'i5')
  const [quantity, setQuantity] = useState(1)

  const item = getItem(itemId)
  const unitCost = item?.unitCost ?? 0
  const cogsTotal = quantity * unitCost

  const customerOptions = contacts.filter((c) => c.type === 'Customer' || c.type === 'Both')

  const onItemChange = (selected: Item | null) => {
    if (selected) setItemId(selected.id)
  }

  const post = () => {
    navigate(invoiceId ? `/sales/invoices/${invoiceId}` : '/sales/delivery-notes')
  }

  const breadcrumbTail = linkedInvoice
    ? [{ label: linkedInvoice.number, to: `/sales/invoices/${linkedInvoice.id}` }]
    : []

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Delivery Notes', to: '/sales/delivery-notes' },
          ...breadcrumbTail,
          { label: 'New delivery note' },
        ]}
      />

      <PageHeader
        title="New Delivery Note"
        description="Sales shipment — posts Dr COGS · Cr Inventory. Does not post revenue (use invoice for billing)."
      >
        <Button variant="outline" render={<Link to={invoiceId ? `/sales/invoices/${invoiceId}` : '/sales/delivery-notes'} />}>
          Cancel
        </Button>
        <Button onClick={post}>Post delivery</Button>
      </PageHeader>

      {linkedInvoice && (
        <Card className="border-primary/20 bg-primary-soft/40">
          <CardContent className="py-3 text-sm">
            Linked to invoice{' '}
            <Link to={`/sales/invoices/${linkedInvoice.id}`} className="text-link font-medium">
              {linkedInvoice.number}
            </Link>
            . Billing status will update when invoice exists; COGS posts on this delivery note.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Shipment</CardTitle>
        </CardHeader>
        <CardContent className="grid max-w-xl gap-4">
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Customer">
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
            >
              {customerOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tracked item">
            <ItemPicker
              value={itemId}
              onChange={onItemChange}
              allowEmpty={false}
            />
            {item?.itemType !== 'Tracked' && (
              <p className="mt-1 text-xs text-amber-700">
                Only tracked items post inventory. Service items belong on invoices only.
              </p>
            )}
          </Field>
          <Field label="Quantity">
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="max-w-[120px]"
            />
          </Field>
          <p className="text-sm text-muted-foreground">
            COGS preview: <span className="font-medium tabular-nums text-foreground">{formatMoney(cogsTotal)}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
