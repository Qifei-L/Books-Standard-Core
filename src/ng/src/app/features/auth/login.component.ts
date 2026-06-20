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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService)
  private router = inject(Router)
  private fb = inject(FormBuilder)

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })
  hidePass = true
  error = ''

  onSubmit(): void {
    if (!this.form.valid) return
    const { email, password } = this.form.value
    if (this.auth.login(email!, password!)) {
      this.router.navigate(['/'])
    } else {
      this.error = 'Invalid credentials'
    }
  }
}
