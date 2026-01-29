import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Auth } from '../../services/auth/auth'
import { switchMap } from 'rxjs'

export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth)

  if (req.url.includes('/api/auth/csrf') || ['GET', 'OPTIONS'].includes(req.method.toUpperCase()))
    return next(req)

  const hasToken = document.cookie.includes('XSRF-TOKEN=')

  if (hasToken) return next(req)

  return authService.obtainCsrfToken().pipe(switchMap(() => next(req)))
}
