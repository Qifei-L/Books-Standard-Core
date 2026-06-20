import { TableCell, TableRow } from '@/components/ui/table'

export function EmptyTableRow({
  colSpan,
  message = 'No records found.',
}: {
  colSpan: number
  message?: string
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center text-sm text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  )
}

/** Standard list columns used across modules */
export const columns = {
  number: 'Number',
  customer: 'Customer',
  supplier: 'Supplier',
  date: 'Date',
  dueDate: 'Due date',
  validTill: 'Valid till',
  amount: 'Amount',
  status: 'Status',
  description: 'Description',
  qty: 'Qty',
  unitPrice: 'Unit price',
  code: 'Code',
  account: 'Account',
  accountName: 'Account name',
  debit: 'Debit',
  credit: 'Credit',
  debitTotal: 'Debit total',
  creditTotal: 'Credit total',
  narration: 'Narration',
  type: 'Type',
  email: 'Email',
  balance: 'Balance',
  actions: 'Actions',
} as const
