import { Component, OnInit, inject } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router'
import { MatTabsModule } from '@angular/material/tabs'
import {
  purchasesSubNav, bankingSubNav, productsSubNav,
  accountingSubNav, reportsSubNav, SubNavItem,
} from '../../core/navigation'

@Component({
  selector: 'app-module-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatTabsModule],
  template: `
    <div class="module-shell">
      <nav mat-tab-nav-bar color="accent" [tabPanel]="panel" class="sub-nav">
        @for (item of subNav; track item.to) {
          <a mat-tab-link
             [routerLink]="item.to"
             routerLinkActive #rla="routerLinkActive"
             [active]="rla.isActive">
            {{ item.label }}
          </a>
        }
      </nav>
      <mat-tab-nav-panel #panel class="panel">
        <router-outlet />
      </mat-tab-nav-panel>
    </div>
  `,
  styles: [`
    .module-shell { display: flex; flex-direction: column; height: 100%; }
    .sub-nav { background: #fff; border-bottom: 1px solid #e0e0e0; padding: 0 16px; }
    .panel { flex: 1; overflow-y: auto; }
  `],
})
export class ModuleLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute)
  subNav: SubNavItem[] = []

  ngOnInit(): void {
    const module = this.route.snapshot.data['module'] as string
    switch (module) {
      case 'purchases': this.subNav = purchasesSubNav; break
      case 'banking':   this.subNav = bankingSubNav;   break
      case 'products':  this.subNav = productsSubNav;  break
      case 'accounting':this.subNav = accountingSubNav; break
      case 'reports':   this.subNav = reportsSubNav;   break
    }
  }
}
