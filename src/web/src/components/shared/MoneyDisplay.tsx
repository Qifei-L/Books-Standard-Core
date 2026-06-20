import { cn, formatMoney } from '@/lib/utils'

export function MoneyDisplay({
  amount,
  className,
  negative,
}: {
  amount: number
  className?: string
  negative?: 'red' | 'green'
}) {
  const color =
    negative === 'red'
      ? amount < 0
        ? 'text-red-600'
        : ''
      : negative === 'green'
        ? amount > 0
          ? 'text-green-600'
          : ''
        : ''

  return (
    <span className={cn('tabular-nums font-medium', color, className)}>
      {formatMoney(amount)}
    </span>
  )
}
