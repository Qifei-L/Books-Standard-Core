import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon'
import { salesSubNav } from '../../core/navigation'

@Component({
  selector: 'app-sales-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatTabsModule, MatIconModule],
  template: `
    <div class="sales-shell">
      <nav mat-tab-nav-bar color="accent" [tabPanel]="panel" class="sub-nav">
        @for (item of salesSubNav; track item.to) {
          <a mat-tab-link
             [routerLink]="item.to"
             routerLinkActive #rla="routerLinkActive"
             [active]="rla.isActive">
            @if (item.iconOnly) {
              <mat-icon>settings</mat-icon>
            } @else {
              {{ item.label }}
            }
          </a>
        }
      </nav>
      <mat-tab-nav-panel #panel class="panel">
        <router-outlet />
      </mat-tab-nav-panel>
    </div>
  `,
  styles: [`
    .sales-shell { display: flex; flex-direction: column; height: 100%; }
    .sub-nav { background: #fff; border-bottom: 1px solid #e0e0e0; padding: 0 16px; }
    .panel { flex: 1; overflow-y: auto; }
  `],
})
export class SalesLayoutComponent {
  readonly salesSubNav = salesSubNav
}
