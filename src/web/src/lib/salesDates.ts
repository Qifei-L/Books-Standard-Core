/** Mock "today" aligned with demo invoice/quote dates */
export const SALES_OVERVIEW_TODAY = new Date('2025-06-20T12:00:00')

export function daysFromToday(dateIso: string): number {
  const target = new Date(dateIso)
  target.setHours(12, 0, 0, 0)
  const ms = target.getTime() - SALES_OVERVIEW_TODAY.getTime()
  return Math.round(ms / 86400000)
}

export function formatDueLabel(days: number, kind: 'due' | 'valid'): string {
  if (kind === 'due') {
    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
  }
  if (days < 0) return `Expired ${Math.abs(days)} days ago`
  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires tomorrow'
  return `Expires in ${days} days`
}

export function invoiceBalance(total: number, amountPaid: number) {
  return Math.max(0, total - amountPaid)
}

export function isPartiallyPaid(total: number, amountPaid: number) {
  return amountPaid > 0 && amountPaid < total
}
