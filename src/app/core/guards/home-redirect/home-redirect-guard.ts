import { inject } from '@angular/core'
import { CanActivateFn, RedirectCommand, Router } from '@angular/router'
import { map } from 'rxjs'
import { Auth } from '../../services/auth/auth'

export const homeRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth)
  const router = inject(Router)

  return authService.isAuthenticated.pipe(
    map((res) => {
      if (res.userType === 'ORGANIZATION') {
        return new RedirectCommand(router.parseUrl('/ong'))
      }

      return new RedirectCommand(router.parseUrl('/volunteer'))
    }),
  )
}
