import type { CustomerFilterOption } from '@/components/sales/CustomerMultiFilterPicker'
import {
  SalesAdvancedFilterButton,
  ActiveAdvancedFilterPills,
  type SalesAdvancedFilterState,
  type SalesDateFieldMode,
} from '@/components/sales/SalesAdvancedFilter'

interface InvoiceAdvancedFilterButtonProps {
  query: SalesAdvancedFilterState
  customerOptions: CustomerFilterOption[]
  onApplyAdvanced: (draft: SalesAdvancedFilterState) => void
  onClearAdvanced: () => void
}

export function InvoiceAdvancedFilterButton(props: InvoiceAdvancedFilterButtonProps) {
  return (
    <SalesAdvancedFilterButton
      entityLabel="invoices"
      dateFieldMode={'invoice' satisfies SalesDateFieldMode}
      {...props}
    />
  )
}

export { ActiveAdvancedFilterPills }
