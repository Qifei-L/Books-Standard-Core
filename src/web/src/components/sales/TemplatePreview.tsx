import { Card, CardContent } from '@/components/ui/card'
import { cn, formatDate } from '@/lib/utils'
import {
  formatTemplateNumber,
  salesDocTypeLabels,
  type DocumentTemplate,
} from '@/contexts/DocumentTemplateContext'

export interface TemplatePreviewCompany {
  companyName: string
  baseCurrency: string
  fiscalYearEnd: string
}

interface TemplatePreviewProps {
  template: DocumentTemplate
  company: TemplatePreviewCompany
  compact?: boolean
  unsaved?: boolean
  showLabel?: boolean
  className?: string
}

export function TemplatePreview({
  template,
  company,
  compact = false,
  unsaved = false,
  showLabel = true,
  className,
}: TemplatePreviewProps) {
  const sampleNumber = formatTemplateNumber(template)
  const today = formatDate(new Date().toISOString().slice(0, 10))
  const taxRate = template.defaults.taxRatePercent ?? 0
  const subtotal = 1000
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between gap-2 px-0.5">
          <span className="text-sm font-medium text-foreground">Live preview</span>
          {unsaved && (
            <span className="text-xs font-medium text-warning">Unsaved changes</span>
          )}
        </div>
      )}
      <Card className={cn('overflow-hidden print:shadow-none', compact && 'text-[11px]')}>
        <CardContent
          className={cn(
            'space-y-6',
            compact ? 'p-4' : 'min-h-[640px] space-y-8 p-8 md:p-12',
          )}
        >
          <div
            className={cn(
              'flex items-start justify-between gap-4 border-b border-border pb-4',
              !compact && 'gap-6 pb-6',
            )}
          >
            <div className="min-w-0">
              {template.print.showLogo && (
                <div
                  className={cn(
                    'mb-2 flex items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground',
                    compact ? 'size-8 text-sm' : 'mb-3 size-12 text-lg',
                  )}
                >
                  B
                </div>
              )}
              <div className={cn('font-semibold text-foreground', compact ? 'text-sm' : 'text-lg')}>
                {company.companyName}
              </div>
              <div className="text-muted-foreground">
                {company.baseCurrency} · {company.fiscalYearEnd} FY
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className={cn('font-semibold text-foreground', compact ? 'text-sm' : 'text-xl')}>
                {template.print.headerTitle}
              </div>
              <div className="mt-0.5 font-mono text-info">{sampleNumber}</div>
              <div className="mt-1 text-muted-foreground">Date: {today}</div>
              {template.docType === 'Quote' && template.defaults.quoteValidityDays != null && (
                <div className="mt-0.5 text-muted-foreground">
                  Valid: {template.defaults.quoteValidityDays} days
                </div>
              )}
              {(template.docType === 'Invoice' || template.docType === 'SalesOrder') &&
                template.defaults.paymentTermsDays != null && (
                  <div className="mt-0.5 text-muted-foreground">
                    Due: Net {template.defaults.paymentTermsDays}
                  </div>
                )}
            </div>
          </div>

          <div className={cn('grid gap-3', !compact && 'gap-4 sm:grid-cols-2')}>
            <div>
              <div className="font-medium text-muted-foreground">Bill to</div>
              <div className="mt-0.5 text-foreground">Sample Customer Ltd.</div>
              <div className="text-muted-foreground">billing@sample.com</div>
            </div>
            <div className={cn(!compact && 'sm:text-right')}>
              <div className="font-medium text-muted-foreground">Document type</div>
              <div className="mt-0.5 text-foreground">{salesDocTypeLabels[template.docType]}</div>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary text-left text-muted-foreground">
                <th className={cn('font-medium', compact ? 'px-2 py-1.5' : 'px-3 py-2')}>
                  Description
                </th>
                <th className={cn('text-right font-medium', compact ? 'px-2 py-1.5' : 'px-3 py-2')}>
                  Qty
                </th>
                <th className={cn('text-right font-medium', compact ? 'px-2 py-1.5' : 'px-3 py-2')}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className={compact ? 'px-2 py-2' : 'px-3 py-3'}>Sample line item</td>
                <td className={cn('text-right', compact ? 'px-2 py-2' : 'px-3 py-3')}>1</td>
                <td className={cn('text-right', compact ? 'px-2 py-2' : 'px-3 py-3')}>¥1,000.00</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className={cn('space-y-0.5', compact ? 'w-36' : 'w-48')}>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>¥{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                <span>¥{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
                <span>Total</span>
                <span>¥{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {(template.defaults.termsAndConditions || template.print.footerNotes) && (
            <div className="space-y-2 border-t border-border pt-4 text-muted-foreground">
              {template.defaults.termsAndConditions && (
                <div>
                  <div className="font-medium text-foreground">Terms</div>
                  <p className="mt-0.5 line-clamp-4 whitespace-pre-wrap">
                    {template.defaults.termsAndConditions}
                  </p>
                </div>
              )}
              {template.print.footerNotes && (
                <div>
                  <div className="font-medium text-foreground">Notes</div>
                  <p className="mt-0.5 line-clamp-3 whitespace-pre-wrap">{template.print.footerNotes}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {!compact && (
        <p className="text-center text-xs text-muted-foreground">
          Mock print preview — PDF generation in Phase 2
        </p>
      )}
    </div>
  )
}
