import { inject } from '@angular/core'
import { CanActivateFn, RedirectCommand, Router } from '@angular/router'
import { Auth } from './auth'

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth)
  const router = inject(Router)

  console.log(authService.session())

  if (!authService.session()) {
    return new RedirectCommand(router.parseUrl('/login'))
  }

  return true
}
