import { Component, inject, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Auth } from '../../../core/services/auth/auth'

@Component({
  selector: 'app-ong-layout',
  imports: [RouterModule],
  templateUrl: './ong-layout.html',
  styleUrl: './ong-layout.css',
})
export class OngLayout {
  authService = inject(Auth)
  router = inject(Router)
  userInitial = signal('O')

  constructor() {
    this.loadUserData()
  }

  private async loadUserData() {
    const { data, error } = await this.authService.getClaims()
    if (error || !data) return

    const name = data.claims.user_metadata?.['name'] as string
    if (name) {
      this.userInitial.set(name[0].toUpperCase())
    }
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
