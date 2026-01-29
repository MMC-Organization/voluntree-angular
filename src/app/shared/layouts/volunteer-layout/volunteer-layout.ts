import { Component, inject, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Auth } from '../../../core/services/auth/auth'
import { User } from '@/app/core/services/user/user'

@Component({
  selector: 'app-volunteer-layout',
  imports: [RouterModule],
  templateUrl: './volunteer-layout.html',
  styleUrl: './volunteer-layout.css',
})
export class VolunteerLayout {
  #user = inject(User)
  #auth = inject(Auth)
  router = inject(Router)
  userInitial = signal('V')

  constructor() {
    this.#user.userData.subscribe({
      next: (res) => {
        this.userInitial.set(res.name[0].toUpperCase())
      },
    })
  }

  logout() {
    this.#auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login'])
      },
    })
  }
}
