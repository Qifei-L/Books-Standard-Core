import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedIn = signal(localStorage.getItem('bsc_auth') === 'true')

  isLoggedIn(): boolean {
    return this._loggedIn()
  }

  login(email: string, _password: string): boolean {
    if (email) {
      this._loggedIn.set(true)
      localStorage.setItem('bsc_auth', 'true')
      return true
    }
    return false
  }

  logout(): void {
    this._loggedIn.set(false)
    localStorage.removeItem('bsc_auth')
  }
}
