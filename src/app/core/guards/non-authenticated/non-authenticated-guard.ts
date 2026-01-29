import { inject } from '@angular/core'
import { CanActivateFn, RedirectCommand, Router } from '@angular/router'
import { catchError, map, of } from 'rxjs'
import { Auth } from '../../services/auth/auth'

export const nonAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth)
  const router = inject(Router)

  return authService.isAuthenticated.pipe(
    map((res) => {
      console.log(res)
      return new RedirectCommand(router.parseUrl('/home'))
    }),
    catchError((err) => {
      return of(true)
    }),
  )
}
