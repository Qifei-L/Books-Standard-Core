import { Component, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-sales-placeholder',
  standalone: true,
  template: `<p class="placeholder-msg">{{ title }} — coming soon</p>`,
  styles: [`.placeholder-msg { padding: 32px 24px; color: #5f6368; font-size: 14px; }`],
})
export class SalesPlaceholderComponent {
  private route = inject(ActivatedRoute)
  title = (this.route.snapshot.data['title'] as string) || 'Page'
}
