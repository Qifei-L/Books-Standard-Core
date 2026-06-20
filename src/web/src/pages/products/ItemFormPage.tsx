import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { DetailBreadcrumb } from '@/components/shared/DocumentDetail'
import { PageHeader } from '@/components/shared/PageHeader'
import { ItemTypeBadge } from '@/components/products/ItemTypeBadge'
import { accounts } from '@/data/mock'
import { getItem, getAccountLabel } from '@/lib/items'
import type { ItemType } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const revenueAccounts = accounts.filter((a) => a.type === 'Revenue')
const assetAccounts = accounts.filter((a) => a.type === 'Asset')
const expenseAccounts = accounts.filter((a) => a.type === 'Expense')

export function ItemFormPage() {
  const { id } = useParams()

  return <ItemForm key={id ?? 'new'} id={id} />
}

function ItemForm({ id }: { id?: string }) {
  const navigate = useNavigate()
  const isNew = !id
  const existing = !isNew ? getItem(id) : undefined

  const [code, setCode] = useState(existing?.code ?? '')
  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [itemType, setItemType] = useState<ItemType>(existing?.itemType ?? 'Untracked')
  const [salesAccountId, setSalesAccountId] = useState(existing?.salesAccountId ?? 'a5')
  const [defaultUnitPrice, setDefaultUnitPrice] = useState(String(existing?.defaultUnitPrice ?? 0))
  const [taxRateLabel, setTaxRateLabel] = useState(existing?.taxRateLabel ?? 'VAT 10%')
  const [inventoryAccountId, setInventoryAccountId] = useState(existing?.inventoryAccountId ?? 'a8')
  const [cogsAccountId, setCogsAccountId] = useState(existing?.cogsAccountId ?? 'a9')
  const [unitCost, setUnitCost] = useState(String(existing?.unitCost ?? 0))
  const [quantityOnHand, setQuantityOnHand] = useState(String(existing?.quantityOnHand ?? 0))

  const save = () => {
    navigate(isNew ? '/products/items' : `/products/items/${id}`)
  }

  if (!isNew && !existing) {
    return <Navigate to="/products/items" replace />
  }

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Items', to: '/products/items' },
          { label: isNew ? 'New item' : (existing?.code ?? 'Edit') },
        ]}
      />

      <PageHeader
        title={isNew ? 'New Item' : `Edit ${existing?.name}`}
        description="Sales account posts on invoice; tracked items use delivery note for COGS"
      >
        <ItemTypeBadge type={itemType} />
      </PageHeader>

      <div className="grid max-w-3xl gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Basic</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Code">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CONS" />
            </Field>
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Consulting" />
            </Field>
            <Field label="Type" className="sm:col-span-2">
              <div className="flex gap-2">
                {(['Untracked', 'Tracked'] as const).map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={itemType === t ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setItemType(t)}
                  >
                    {t === 'Untracked' ? 'Service / untracked' : 'Tracked inventory'}
                  </Button>
                ))}
              </div>
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sales (invoice)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Default unit price">
              <Input
                type="number"
                min={0}
                value={defaultUnitPrice}
                onChange={(e) => setDefaultUnitPrice(e.target.value)}
              />
            </Field>
            <Field label="Tax rate label">
              <Input value={taxRateLabel} onChange={(e) => setTaxRateLabel(e.target.value)} />
            </Field>
            <Field label="Sales account" className="sm:col-span-2">
              <select
                value={salesAccountId}
                onChange={(e) => setSalesAccountId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
              >
                {revenueAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} {a.name}
                  </option>
                ))}
              </select>
            </Field>
          </CardContent>
        </Card>

        {itemType === 'Tracked' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Inventory (delivery note)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Qty on hand">
                <Input
                  type="number"
                  min={0}
                  value={quantityOnHand}
                  onChange={(e) => setQuantityOnHand(e.target.value)}
                />
              </Field>
              <Field label="Unit cost (average)">
                <Input type="number" min={0} value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
              </Field>
              <Field label="Inventory account">
                <select
                  value={inventoryAccountId}
                  onChange={(e) => setInventoryAccountId(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
                >
                  {assetAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} {a.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="COGS account">
                <select
                  value={cogsAccountId}
                  onChange={(e) => setCogsAccountId(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
                >
                  {expenseAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} {a.name}
                    </option>
                  ))}
                </select>
              </Field>
              <p className="sm:col-span-2 text-xs text-muted-foreground">
                Preview: DN posts Dr {getAccountLabel(cogsAccountId)} · Cr{' '}
                {getAccountLabel(inventoryAccountId)}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button onClick={save}>{isNew ? 'Create item' : 'Save changes'}</Button>
          <Button variant="outline" render={<Link to={isNew ? '/products/items' : `/products/items/${id}`} />}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
