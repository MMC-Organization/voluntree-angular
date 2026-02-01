import { inject } from '@angular/core'
import { CanActivateFn, RedirectCommand, Router } from '@angular/router'
import { map } from 'rxjs'
import { Auth } from '../../services/auth/auth'

export const volunteerGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth)
  const router = inject(Router)

  return authService.isAuthenticated.pipe(
    map((res) => {
      if (res.userType === 'VOLUNTEER') {
        return true
      }

      return new RedirectCommand(router.parseUrl('/ong'))
    }),
  )
}
