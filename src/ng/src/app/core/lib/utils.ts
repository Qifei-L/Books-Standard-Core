export function formatMoney(amount: number, currency = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN')
}

export function daysFromToday(dateISO: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateISO)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export function formatDueLabel(days: number, prefix = 'due'): string {
  if (days === 0) return `Due today`
  if (days > 0) return `${prefix} in ${days}d`
  return `${Math.abs(days)}d overdue`
}

export function invoiceBalance(total: number, amountPaid: number): number {
  return Math.max(0, total - amountPaid)
}
