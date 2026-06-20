import { Component, inject } from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { sidebarNav } from '../../core/navigation'
import { AuthService } from '../../core/auth/auth.service'
import { DataService } from '../../core/data/data.service'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatListModule, MatIconModule, MatButtonModule,
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
