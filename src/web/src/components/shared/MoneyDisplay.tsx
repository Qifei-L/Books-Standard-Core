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
        ? 'text-danger'
        : ''
      : negative === 'green'
        ? amount > 0
          ? 'text-success'
          : ''
        : ''

  return (
    <span className={cn('tabular-nums font-medium text-foreground', color, className)}>
      {formatMoney(amount)}
    </span>
  )
}
