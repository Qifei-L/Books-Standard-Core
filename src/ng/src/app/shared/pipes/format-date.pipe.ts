import { Pipe, PipeTransform } from '@angular/core'
import { formatDate } from '../../core/lib/utils'

@Pipe({ name: 'formatDate', standalone: true })
export class FormatDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '—'
    return formatDate(value)
  }
}
