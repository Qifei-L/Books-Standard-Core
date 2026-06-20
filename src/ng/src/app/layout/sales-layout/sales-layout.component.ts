import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon'
import { salesSubNav } from '../../core/navigation'

@Component({
  selector: 'app-sales-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatTabsModule, MatIconModule],
  templateUrl: './sales-layout.component.html',
  styleUrl: './sales-layout.component.scss',
})
export class SalesLayoutComponent {
  readonly salesSubNav = salesSubNav
}
