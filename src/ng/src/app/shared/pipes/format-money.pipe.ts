import { Pipe, PipeTransform } from '@angular/core'
import { formatMoney } from '../../core/lib/utils'

@Pipe({ name: 'formatMoney', standalone: true })
export class FormatMoneyPipe implements PipeTransform {
  transform(value: number | null | undefined, currency = 'CNY'): string {
    if (value == null) return '—'
    return formatMoney(value, currency)
  }
}
