import { inject } from '@angular/core'
import { CanActivateFn, RedirectCommand, Router } from '@angular/router'
import { Auth } from './auth'

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth)
  const router = inject(Router)

  const res = await authService.isAuthenticated()

  if (!res) {
    return new RedirectCommand(router.parseUrl('/login'))
  }

  return true
}
