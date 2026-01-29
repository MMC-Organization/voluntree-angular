import { Component, inject, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Auth } from '../../../core/services/auth/auth'
import { User } from '@/app/core/services/user/user'

@Component({
  selector: 'app-ong-layout',
  imports: [RouterModule],
  templateUrl: './ong-layout.html',
  styleUrl: './ong-layout.css',
})
export class OngLayout {
  #auth = inject(Auth)
  #user = inject(User)
  router = inject(Router)
  userInitial = signal('O')

  constructor() {
    this.#user.userData.subscribe({
      next: (res) => {
        this.userInitial.set(res.name[0].toUpperCase())
      },
    })
  }

  logout() {
    this.#auth.logout()
    this.router.navigate(['/login'])
  }
}
