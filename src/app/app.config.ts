import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http'
import { routes } from './app.routes'
import { credentialsInterceptor } from '@/app/core/interceptors/credentials/credentials.interceptor'
import { Auth } from './core/services/auth/auth'

export const xsrfInit = () => {
  const auth = inject(Auth)

  return auth.obtainCsrfToken()
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(xsrfInit),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([credentialsInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
  ],
}
