import { Component, inject, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Auth } from '../../../core/services/auth/auth'

@Component({
  selector: 'app-volunteer-layout',
  imports: [RouterModule],
  templateUrl: './volunteer-layout.html',
  styleUrl: './volunteer-layout.css',
})
export class VolunteerLayout {
  authService = inject(Auth)
  router = inject(Router)
  userInitial = signal('V')

  constructor() {
    this.authService.getClaims().then(({ data, error }) => {
      if (error || !data) return null

      return this.userInitial.set((data.claims.user_metadata?.['name'][0] as string).toUpperCase())
    })
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
