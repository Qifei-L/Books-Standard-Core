import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DetailBreadcrumb, LineItemTotals } from '@/components/shared/DocumentDetail'
import { PageHeader } from '@/components/shared/PageHeader'
import { ItemPicker } from '@/components/sales/ItemPicker'
import { TrackedItemsNotice } from '@/components/sales/TrackedItemsNotice'
import { ItemTypeBadge } from '@/components/products/ItemTypeBadge'
import { contacts, accounts } from '@/data/mock'
import {
  applyItemToLine,
  getAccountLabel,
  getItem,
  invoiceHasTrackedItems,
  lineHasTrackedItem,
  recalcLineAmount,
} from '@/lib/items'
import type { Item, LineItem } from '@/types'
import { formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'

const TAX_RATE = 0.1

interface DraftLine extends LineItem {
  key: string
}

function newAdHocLine(): DraftLine {
  return {
    key: crypto.randomUUID(),
    id: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    amount: 0,
    revenueAccountId: 'a5',
  }
}

function itemToDraftLine(item: Item, key?: string): DraftLine {
  const base = applyItemToLine(item, 1)
  return { key: key ?? crypto.randomUUID(), id: '', ...base }
}

export function InvoiceFormPage() {
  const navigate = useNavigate()
  const [contactId, setContactId] = useState(contacts[0]?.id ?? '')
  const [invoiceDate, setInvoiceDate] = useState('2025-06-20')
  const [dueDate, setDueDate] = useState('2025-07-04')
  const [lines, setLines] = useState<DraftLine[]>([itemToDraftLine(getItem('i1')!)])
  const [noticeOpen, setNoticeOpen] = useState(false)

  const customerOptions = contacts.filter((c) => c.type === 'Customer' || c.type === 'Both')
  const revenueAccounts = accounts.filter((a) => a.type === 'Revenue')

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.amount, 0), [lines])
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE * 100) / 100, [subtotal])
  const total = subtotal + tax
  const trackedCount = lines.filter(lineHasTrackedItem).length
  const hasTracked = invoiceHasTrackedItems(lines)

  const updateLine = (key: string, patch: Partial<DraftLine>) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.key !== key) return line
        const next = { ...line, ...patch }
        if ('quantity' in patch || 'unitPrice' in patch) {
          next.amount = recalcLineAmount(next)
        }
        return next
      }),
    )
  }

  const selectItem = (key: string, item: Item | null) => {
    if (!item) {
      updateLine(key, {
        itemId: undefined,
        itemCode: undefined,
        description: '',
        revenueAccountId: 'a5',
      })
      return
    }
    const applied = applyItemToLine(item, lines.find((l) => l.key === key)?.quantity ?? 1)
    setLines((prev) =>
      prev.map((line) =>
        line.key === key ? { ...line, ...applied } : line,
      ),
    )
  }

  const removeLine = (key: string) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.key !== key)))
  }

  const addLine = () => {
    setLines((prev) => [...prev, newAdHocLine()])
  }

  const requestApprove = () => {
    if (hasTracked) setNoticeOpen(true)
    else navigate('/sales/invoices')
  }

  const approveOnly = () => {
    setNoticeOpen(false)
    navigate('/sales/invoices')
  }

  return (
    <div className="space-y-4">
      <DetailBreadcrumb
        items={[
          { label: 'Sales Invoices', to: '/sales/invoices' },
          { label: 'New invoice' },
        ]}
      />

      <PageHeader
        title="New Invoice"
        description="Lines post revenue from items — tracked items need a delivery note for COGS"
      >
        <Button variant="outline" render={<Link to="/sales/invoices" />}>
          Cancel
        </Button>
        <Button variant="outline" onClick={() => navigate('/sales/invoices')}>
          Save draft
        </Button>
        <Button onClick={requestApprove}>Approve & send</Button>
      </PageHeader>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Invoice details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
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
          <Field label="Invoice date">
            <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
          </Field>
          <Field label="Due date">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Line items</CardTitle>
          <Button variant="outline" size="sm" onClick={addLine}>
            <Plus className="size-3.5" />
            Add line
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-20 text-right">Qty</TableHead>
                  <TableHead className="w-28 text-right">Unit price</TableHead>
                  <TableHead className="w-28 text-right">Amount</TableHead>
                  <TableHead className="w-[160px]">Revenue account</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line) => {
                  const item = getItem(line.itemId)
                  return (
                    <TableRow key={line.key}>
                      <TableCell className="align-top pt-3">
                        <ItemPicker
                          value={line.itemId ?? ''}
                          onChange={(item) => selectItem(line.key, item)}
                        />
                        {item && (
                          <div className="mt-1">
                            <ItemTypeBadge type={item.itemType} className="text-[10px]" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="align-top pt-3">
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(line.key, { description: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell className="align-top pt-3">
                        <Input
                          type="number"
                          min={0}
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(line.key, { quantity: Number(e.target.value) || 0 })
                          }
                          className="h-8 text-right text-sm tabular-nums"
                        />
                      </TableCell>
                      <TableCell className="align-top pt-3">
                        <Input
                          type="number"
                          min={0}
                          value={line.unitPrice}
                          onChange={(e) =>
                            updateLine(line.key, { unitPrice: Number(e.target.value) || 0 })
                          }
                          className="h-8 text-right text-sm tabular-nums"
                        />
                      </TableCell>
                      <TableCell className="align-top pt-3 text-right tabular-nums text-sm">
                        {formatMoney(line.amount)}
                      </TableCell>
                      <TableCell className="align-top pt-3">
                        <select
                          value={line.revenueAccountId ?? 'a5'}
                          onChange={(e) =>
                            updateLine(line.key, { revenueAccountId: e.target.value })
                          }
                          className="h-8 w-full rounded-md border border-input bg-card px-1 text-xs"
                          title={getAccountLabel(line.revenueAccountId ?? 'a5')}
                        >
                          {revenueAccounts.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.code}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="align-top pt-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => removeLine(line.key)}
                          aria-label="Remove line"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <LineItemTotals
            subtotal={subtotal}
            tax={tax}
            total={total}
            taxLabel="Tax (10%)"
          />
        </CardContent>
      </Card>

      {hasTracked && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="py-3 text-sm text-amber-950">
            This invoice includes tracked items. By default no delivery note will be created —
            approve will post revenue only. You will be prompted before approving.
          </CardContent>
        </Card>
      )}

      <TrackedItemsNotice
        open={noticeOpen}
        onOpenChange={setNoticeOpen}
        trackedCount={trackedCount}
        onApproveOnly={approveOnly}
        onCreateDeliveryNote={() => {
          setNoticeOpen(false)
          navigate('/sales/delivery-notes/new')
        }}
      />
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
