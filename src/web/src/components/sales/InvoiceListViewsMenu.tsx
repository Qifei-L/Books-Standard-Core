import type { InvoiceListViewDefinition } from '@/lib/invoiceListViews'
import { SalesListViewsMenu } from '@/components/sales/SalesListViewsMenu'

interface InvoiceListViewsMenuProps {
  query: Omit<InvoiceListViewDefinition, 'id' | 'name' | 'isSystem'>
  onApplyView: (view: InvoiceListViewDefinition) => void
}

export function InvoiceListViewsMenu({ query, onApplyView }: InvoiceListViewsMenuProps) {
  return (
    <SalesListViewsMenu
      module="invoices"
      query={query}
      onApplyView={(view) => onApplyView(view as InvoiceListViewDefinition)}
    />
  )
}
