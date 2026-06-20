import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core'
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { DataService, type InvoiceDraft } from '../../../core/data/data.service'
import { FormatMoneyPipe } from '../../../shared/pipes/format-money.pipe'
import type { InvoiceStatus, LineItem } from '../../../core/types'

type LineFormValue = {
  id: string
  itemId: string
  itemCode: string
  revenueAccountId: string
  description: string
  quantity: number
  unitPrice: number
}

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormatMoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="min-h-full bg-desk font-sans text-ink" [formGroup]="form" (ngSubmit)="saveAndView()">
      <header class="sticky top-0 z-20 border-b border-hair bg-paper/95 backdrop-blur">
        <div class="mx-auto flex max-w-[1180px] items-center gap-3 px-6 py-3">
          <a class="btn btn-ghost h-9 px-2" [routerLink]="cancelLink()">
            <span class="text-lg leading-none">‹</span>
            Back
          </a>
          <div class="min-w-0">
            <h1 class="m-0 font-serif text-[21px] font-semibold leading-tight">
              {{ isEdit() ? 'Edit ' + (invoice()?.number ?? 'Invoice') : 'New Invoice' }}
            </h1>
            <p class="m-0 mt-0.5 text-xs text-ink-faint">
              {{ isEdit() ? 'Update customer, dates and line items' : 'Create a customer invoice' }}
            </p>
          </div>
          <div class="spacer"></div>
          <button type="button" class="btn btn-outline" (click)="saveDraft()">Save draft</button>
          <button type="submit" class="btn bg-stamp text-white hover:bg-[#1f274f]">Save & view</button>
        </div>
      </header>

      <main class="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)_320px] gap-6 px-6 py-6 max-[980px]:grid-cols-1">
        <section class="min-w-0 space-y-5">
          <div class="rounded-md border border-hair bg-paper p-5 shadow-sm">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <div class="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-faint">Invoice details</div>
                <p class="m-0 mt-1 text-sm text-ink-soft">Customer, reference and payment terms.</p>
              </div>
              <select class="select w-[150px]" formControlName="status">
                @for (status of statusOptions; track status) {
                  <option [value]="status">{{ status }}</option>
                }
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
              <label class="field col-span-2 max-[720px]:col-span-1">
                <span>Customer</span>
                <select class="control" formControlName="contactId">
                  @for (contact of data.contacts; track contact.id) {
                    @if (contact.type === 'Customer' || contact.type === 'Both') {
                      <option [value]="contact.id">{{ contact.name }}</option>
                    }
                  }
                </select>
              </label>

              @if (selectedContact(); as contact) {
                <div class="col-span-2 rounded-md border border-hair bg-white/55 px-3 py-2 text-sm text-ink-soft max-[720px]:col-span-1">
                  <span>{{ contact.email ?? 'No email' }}</span>
                  <span class="mx-2 text-ink-faint">·</span>
                  <span>Outstanding <span class="num text-ink">{{ contact.balance | formatMoney }}</span></span>
                </div>
              }

              <label class="field">
                <span>Invoice date</span>
                <input class="control num" type="date" formControlName="date">
              </label>
              <label class="field">
                <span>Due date</span>
                <input class="control num" type="date" formControlName="dueDate">
              </label>
              <label class="field">
                <span>Reference</span>
                <input class="control num" type="text" formControlName="salesOrderId" placeholder="SO-2025-001">
              </label>
              <label class="field">
                <span>Currency</span>
                <input class="control num" type="text" value="CNY" disabled>
              </label>
            </div>
          </div>

          <div class="rounded-md border border-hair bg-paper p-5 shadow-sm">
            <div class="mb-4 flex items-center justify-between gap-4">
              <div>
                <div class="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-faint">Line items</div>
                <p class="m-0 mt-1 text-sm text-ink-soft">Amounts recalculate from quantity and unit price.</p>
              </div>
              <button type="button" class="btn btn-outline" (click)="addLine()">Add line</button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full min-w-[780px] border-collapse">
                <thead>
                  <tr class="border-b border-hair-strong">
                    <th class="th w-[180px]">Item</th>
                    <th class="th">Description</th>
                    <th class="th w-[96px] text-right">Qty</th>
                    <th class="th w-[140px] text-right">Unit price</th>
                    <th class="th w-[140px] text-right">Amount</th>
                    <th class="w-10"></th>
                  </tr>
                </thead>
                <tbody formArrayName="lines">
                  @for (line of lines.controls; track line; let i = $index) {
                    <tr class="border-b border-hair align-top" [formGroupName]="i">
                      <td class="py-3 pr-3">
                        <select class="control compact" formControlName="itemId" (change)="applyItem(i)">
                          <option value="">Custom</option>
                          @for (item of data.items; track item.id) {
                            @if (item.isActive) {
                              <option [value]="item.id">{{ item.code }}</option>
                            }
                          }
                        </select>
                        <input type="hidden" formControlName="id">
                        <input type="hidden" formControlName="itemCode">
                        <input type="hidden" formControlName="revenueAccountId">
                      </td>
                      <td class="py-3 pr-3">
                        <input class="control compact" type="text" formControlName="description" placeholder="Description">
                      </td>
                      <td class="py-3 pr-3">
                        <input class="control compact num text-right" type="number" min="0" step="0.01" formControlName="quantity">
                      </td>
                      <td class="py-3 pr-3">
                        <input class="control compact num text-right" type="number" min="0" step="0.01" formControlName="unitPrice">
                      </td>
                      <td class="py-3 pr-3 text-right">
                        <span class="num inline-flex h-9 items-center font-semibold">{{ lineAmount(i) | formatMoney }}</span>
                      </td>
                      <td class="py-3 text-right">
                        <button type="button" class="icon-btn" aria-label="Remove line" (click)="removeLine(i)">×</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside class="space-y-4">
          <div class="rounded-md border border-hair bg-paper p-5 shadow-sm">
            <div class="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-faint">Summary</div>
            <div class="mt-4 space-y-2">
              <div class="sum-row"><span>Subtotal</span><span>{{ subtotal() | formatMoney }}</span></div>
              <div class="sum-row"><span>VAT</span><span>{{ tax() | formatMoney }}</span></div>
              <div class="sum-row total"><span>Total</span><span>{{ total() | formatMoney }}</span></div>
              <div class="sum-row muted"><span>Paid</span><span>−{{ amountPaid() | formatMoney }}</span></div>
              <div class="sum-row due"><span>Amount due</span><span>{{ amountDue() | formatMoney }}</span></div>
            </div>
          </div>

          <div class="rounded-md border border-hair bg-paper p-5 shadow-sm">
            <div class="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-faint">Document links</div>
            <div class="mt-4 space-y-3 text-sm">
              <label class="field">
                <span>Sales order ref</span>
                <input class="control num" type="text" formControlName="salesOrderId" placeholder="so1">
              </label>
              <p class="m-0 text-xs leading-5 text-ink-faint">
                Linked quote and delivery note flows remain visible on the invoice view after saving.
              </p>
            </div>
          </div>

          @if (isEdit() && invoice()?.status === 'Paid') {
            <div class="rounded-md border border-hair bg-white/60 p-4 text-sm text-ink-soft">
              This invoice is paid. Totals can still be edited in the mock app, but real production rules should restrict posted or paid documents.
            </div>
          }
        </aside>
      </main>
    </form>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field > span {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: #8b8f99;
    }
    .control, .select {
      width: 100%;
      height: 38px;
      border: 1px solid #d9d4c8;
      border-radius: 6px;
      background: rgba(255,255,255,.72);
      color: #26282f;
      padding: 0 11px;
      font: 500 13px 'IBM Plex Sans', sans-serif;
      outline: none;
      transition: border-color .12s, box-shadow .12s, background .12s;
    }
    .control:focus, .select:focus {
      border-color: #2b3566;
      box-shadow: 0 0 0 2px rgba(43,53,102,.12);
      background: #fff;
    }
    .control:disabled {
      color: #8b8f99;
      background: rgba(237,232,223,.5);
    }
    .compact { height: 36px; }
    .th {
      padding: 0 12px 12px 0;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: #8b8f99;
    }
    .num {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-variant-numeric: tabular-nums;
    }
    .icon-btn {
      width: 30px;
      height: 30px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: #8b8f99;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
    }
    .icon-btn:hover {
      border-color: #e7e2d6;
      background: rgba(255,255,255,.75);
      color: #b3392f;
    }
    .sum-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      color: #5a5e68;
      font-size: 14px;
    }
    .sum-row span:last-child {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-variant-numeric: tabular-nums;
      color: #26282f;
      font-weight: 500;
    }
    .sum-row.total {
      margin-top: 10px;
      padding-top: 13px;
      border-top: 1.5px solid #cfc9ba;
      font-family: 'Spectral', Georgia, serif;
      font-weight: 600;
      color: #26282f;
    }
    .sum-row.total span:last-child { color: #2b3566; font-size: 16px; }
    .sum-row.muted, .sum-row.muted span:last-child { color: #8b8f99; }
    .sum-row.due {
      margin-top: 10px;
      padding-top: 13px;
      border-top: 3px double #cfc9ba;
      color: #26282f;
      font-weight: 700;
    }
    .sum-row.due span:last-child { font-size: 18px; font-weight: 700; }
  `],
})
export class InvoiceFormComponent {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  readonly data = inject(DataService)

  id = input<string>()
  invoice = computed(() => {
    const id = this.id()
    return id ? this.data.getInvoice(id) : undefined
  })
  isEdit = computed(() => Boolean(this.id()))
  selectedContact = computed(() => this.data.contacts.find((c) => c.id === this.form.controls.contactId.value))
  amountPaid = computed(() => this.invoice()?.amountPaid ?? 0)

  readonly statusOptions: InvoiceStatus[] = ['Draft', 'Awaiting', 'Paid', 'Overdue']

  form = this.fb.nonNullable.group({
    contactId: ['', Validators.required],
    date: [this.isoToday(), Validators.required],
    dueDate: [this.isoDaysFromNow(14), Validators.required],
    status: ['Awaiting' as InvoiceStatus, Validators.required],
    salesOrderId: [''],
    quotationId: [''],
    lines: this.fb.array([this.createLineGroup()]),
  })

  constructor() {
    effect(() => {
      const invoice = this.invoice()
      if (!this.isEdit()) {
        if (!this.form.controls.contactId.value) {
          this.form.controls.contactId.setValue(this.data.contacts.find((c) => c.type !== 'Supplier')?.id ?? '')
        }
        return
      }
      if (!invoice) return
      this.form.patchValue({
        contactId: invoice.contactId,
        date: invoice.date,
        dueDate: invoice.dueDate,
        status: invoice.status,
        salesOrderId: invoice.salesOrderId ?? '',
        quotationId: invoice.quotationId ?? '',
      }, { emitEvent: false })
      this.lines.clear({ emitEvent: false })
      for (const line of invoice.lines) this.lines.push(this.createLineGroup(line), { emitEvent: false })
    })
  }

  get lines() {
    return this.form.controls.lines as FormArray
  }

  cancelLink() {
    return this.isEdit() && this.id() ? ['/sales/invoices', this.id()] : ['/sales/invoices']
  }

  addLine() {
    this.lines.push(this.createLineGroup())
  }

  removeLine(index: number) {
    if (this.lines.length === 1) return
    this.lines.removeAt(index)
  }

  applyItem(index: number) {
    const group = this.lines.at(index)
    const itemId = group.get('itemId')?.value
    const item = this.data.items.find((candidate) => candidate.id === itemId)
    if (!item) {
      group.patchValue({ itemCode: '', revenueAccountId: '' })
      return
    }
    group.patchValue({
      itemCode: item.code,
      revenueAccountId: item.salesAccountId,
      description: item.name,
      unitPrice: item.defaultUnitPrice,
    })
  }

  lineAmount(index: number) {
    const line = this.lineValue(index)
    return line.quantity * line.unitPrice
  }

  subtotal() {
    return this.lines.controls.reduce((sum, _, index) => sum + this.lineAmount(index), 0)
  }

  tax() {
    return Math.round(this.subtotal() * 0.1 * 100) / 100
  }

  total() {
    return this.subtotal() + this.tax()
  }

  amountDue() {
    return Math.max(0, this.total() - this.amountPaid())
  }

  saveDraft() {
    this.form.controls.status.setValue('Draft')
    this.saveAndView()
  }

  saveAndView() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const draft = this.toDraft()
    const saved = this.isEdit() && this.id()
      ? this.data.updateInvoice(this.id()!, draft)
      : this.data.createInvoice(draft)
    this.router.navigate(['/sales/invoices', saved.id])
  }

  private createLineGroup(line?: Partial<LineItem>) {
    return this.fb.nonNullable.group({
      id: [line?.id ?? ''],
      itemId: [line?.itemId ?? ''],
      itemCode: [line?.itemCode ?? ''],
      revenueAccountId: [line?.revenueAccountId ?? ''],
      description: [line?.description ?? '', Validators.required],
      quantity: [line?.quantity ?? 1, [Validators.required, Validators.min(0)]],
      unitPrice: [line?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
    })
  }

  private lineValue(index: number): LineFormValue {
    return this.lines.at(index).getRawValue() as LineFormValue
  }

  private toDraft(): InvoiceDraft {
    const value = this.form.getRawValue()
    return {
      contactId: value.contactId,
      date: value.date,
      dueDate: value.dueDate,
      status: value.status,
      salesOrderId: value.salesOrderId || undefined,
      quotationId: value.quotationId || undefined,
      lines: value.lines.map((line) => ({
        id: line.id,
        itemId: line.itemId || undefined,
        itemCode: line.itemCode || undefined,
        revenueAccountId: line.revenueAccountId || undefined,
        description: line.description,
        quantity: Number(line.quantity) || 0,
        unitPrice: Number(line.unitPrice) || 0,
        amount: (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0),
      })),
    }
  }

  private isoToday() {
    return new Date().toISOString().slice(0, 10)
  }

  private isoDaysFromNow(days: number) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().slice(0, 10)
  }
}
