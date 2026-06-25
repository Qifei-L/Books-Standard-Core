import { Component, inject } from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon'
import { sidebarNav } from '../../core/navigation'
import { AuthService } from '../../core/auth/auth.service'
import { DataService } from '../../core/data/data.service'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatIconModule,
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {
  private auth = inject(AuthService)
  private router = inject(Router)
  readonly data = inject(DataService)
  readonly sidebarNav = sidebarNav

  logout(): void {
    this.auth.logout()
    this.router.navigate(['/login'])
  }
}
