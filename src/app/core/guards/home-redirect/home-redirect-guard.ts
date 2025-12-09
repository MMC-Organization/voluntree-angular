import { inject } from '@angular/core'
import { CanActivateFn, RedirectCommand, Router } from '@angular/router'
import { Auth } from '../../services/auth/auth'

export const homeRedirectGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth)
  const router = inject(Router)

  const userType = await authService.getClaims()

  if (userType?.data?.claims.user_metadata?.['cnpj']) {
    return new RedirectCommand(router.parseUrl('/ong'))
  }

  return new RedirectCommand(router.parseUrl('/volunteer'))
}
