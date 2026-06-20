import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../../core/auth/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
  ],
  template: `
    <div class="login-page">
      <mat-card class="login-card" appearance="outlined">
        <mat-card-header class="login-header">
          <div class="brand-row">
            <mat-icon class="brand-icon">account_balance</mat-icon>
            <span class="brand-name">Books Standard</span>
          </div>
          <mat-card-subtitle>Sign in to continue</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" autocomplete="username" />
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password"
                     [type]="hidePass ? 'password' : 'text'"
                     autocomplete="current-password" />
              <button mat-icon-button matSuffix type="button" (click)="hidePass = !hidePass">
                <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            @if (error) {
              <p class="login-error">{{ error }}</p>
            }
            <button mat-flat-button color="primary" type="submit"
                    class="full-width submit-btn" [disabled]="form.invalid">
              Sign In
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: #f1f3f4;
    }
    .login-card { width: 380px; padding: 8px 8px 16px; }
    .login-header { flex-direction: column; padding-bottom: 12px; }
    .brand-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .brand-icon { color: #1565c0; font-size: 28px; width: 28px; height: 28px; }
    .brand-name { font-size: 20px; font-weight: 600; color: #1a1a2e; }
    .login-form { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; }
    .full-width { width: 100%; }
    .submit-btn { height: 44px; font-size: 15px; }
    .login-error { color: #c62828; font-size: 13px; margin: 0 0 8px; }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService)
  private router = inject(Router)
  private fb = inject(FormBuilder)

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })
  hidePass = true
  error = ''

  onSubmit(): void {
    if (!this.form.valid) return
    const { email, password } = this.form.value
    const ok = this.auth.login(email!, password!)
    if (ok) {
      this.router.navigate(['/'])
    } else {
      this.error = 'Invalid credentials'
    }
  }
}
