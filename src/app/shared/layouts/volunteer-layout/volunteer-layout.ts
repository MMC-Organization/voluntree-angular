import { Component, inject } from '@angular/core'
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

  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
