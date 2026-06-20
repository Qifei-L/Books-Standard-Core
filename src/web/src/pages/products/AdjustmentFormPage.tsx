import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DetailBreadcrumb } from '@/components/shared/DocumentDetail'
import { PageHeader } from '@/components/shared/PageHeader'
import { ItemPicker } from '@/components/sales/ItemPicker'
import { getItem } from '@/lib/items'
import type { InventoryAdjustmentReason, Item } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const reasons: { id: InventoryAdjustmentReason; label: string }[] = [
  { id: 'stocktake', label: 'Stocktake' },
  { id: 'damage', label: 'Damage / write-off' },
  { id: 'sample', label: 'Sample' },
  { id: 'opening', label: 'Opening balance' },
  { id: 'other', label: 'Other' },
]

export function AdjustmentFormPage() {
  const navigate = useNavigate()
  const [date, setDate] = useState('2025-06-20')
  const [reason, setReason] = useState<InventoryAdjustmentReason>('stocktake')
  const [itemId, setItemId] = useState('i5')
  const [qtyChange, setQtyChange] = useState('-1')
  const [notes, setNotes] = useState('')

  const item = getItem(itemId)

  const post = () => navigate('/products/adjustments')

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Adjust Stock', to: '/products/adjustments' },
          { label: 'New adjustment' },
        ]}
      />

      <PageHeader
        title="New Stock Adjustment"
        description="Correct on-hand quantity — no customer, no invoice, no billing status"
      >
        <Button variant="outline" render={<Link to="/products/adjustments" />}>
          Cancel
        </Button>
        <Button onClick={post}>Post adjustment</Button>
      </PageHeader>

      <Card className="border-border bg-muted/20">
        <CardContent className="py-3 text-sm text-muted-foreground">
          This is not a sales delivery. For customer shipments use{' '}
          <Link to="/sales/delivery-notes/new" className="text-link">
            Delivery notes
          </Link>
          .
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Adjustment</CardTitle>
        </CardHeader>
        <CardContent className="grid max-w-xl gap-4">
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Reason">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as InventoryAdjustmentReason)}
              className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
            >
              {reasons.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tracked item">
            <ItemPicker
              value={itemId}
              onChange={(selected: Item | null) => selected && setItemId(selected.id)}
              allowEmpty={false}
            />
          </Field>
          <Field label="Quantity change (+ in / − out)">
            <Input
              type="number"
              value={qtyChange}
              onChange={(e) => setQtyChange(e.target.value)}
              className="max-w-[120px]"
            />
          </Field>
          <Field label="Notes">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </Field>
          {item && (
            <p className="text-xs text-muted-foreground">
              Current on hand: {item.quantityOnHand ?? 0} · Unit cost: {item.unitCost ?? 0}
            </p>
          )}
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
