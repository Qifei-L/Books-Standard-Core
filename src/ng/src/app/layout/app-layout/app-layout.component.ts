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
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="brand">
          <mat-icon class="brand-icon">account_balance</mat-icon>
          <span class="brand-text">Books Standard</span>
        </div>

        <mat-nav-list class="nav-list" disableRipple>
          @for (item of sidebarNav; track item.to) {
            <a mat-list-item
               [routerLink]="item.to"
               routerLinkActive="nav-active"
               [routerLinkActiveOptions]="item.to === '/' ? {exact:true} : {exact:false}">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>

        <div class="sidenav-footer">
          <span class="company-name">{{ data.companyName }}</span>
          <button mat-icon-button (click)="logout()" title="Sign out">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="main-area">
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell { height: 100vh; }
    .sidenav {
      width: 220px;
      border-right: 1px solid #e0e0e0;
      background: #fff;
      display: flex;
      flex-direction: column;
    }
    .brand {
      display: flex; align-items: center; gap: 8px;
      padding: 16px 16px 14px;
      border-bottom: 1px solid #e8eaed;
      flex-shrink: 0;
    }
    .brand-icon { color: #1565c0; font-size: 22px; width: 22px; height: 22px; }
    .brand-text { font-weight: 700; font-size: 15px; color: #1a1a2e; letter-spacing: -0.2px; }
    .nav-list { flex: 1; padding: 8px 0; }
    ::ng-deep .nav-active {
      background: #e8f0fe !important;
      color: #1967d2 !important;
      font-weight: 500 !important;
    }
    ::ng-deep .nav-active mat-icon { color: #1967d2 !important; }
    .sidenav-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 12px;
      border-top: 1px solid #e8eaed;
      flex-shrink: 0;
    }
    .company-name { font-size: 12px; color: #5f6368; font-weight: 500; }
    .main-area { background: #f8f9fa; display: flex; flex-direction: column; }
  `],
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
