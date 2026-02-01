<<<<<<< HEAD
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { routes } from './app.routes';
import { credentialsInterceptor } from '@/app/core/interceptors/credentials/credentials.interceptor';
import { xsrfInterceptor } from '@/app/core/interceptors/xsrf/xsrf-interceptor';

=======
import {
  ApplicationConfig,
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
import { xsrfInterceptor } from './core/interceptors/xsrf/xsrf-interceptor'
>>>>>>> c84448ae7ba1b8b467af7075ef66b5cd13ab2e77

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
<<<<<<< HEAD
      withInterceptors([xsrfInterceptor, credentialsInterceptor]),
=======
      withInterceptors([credentialsInterceptor, xsrfInterceptor]),
>>>>>>> c84448ae7ba1b8b467af7075ef66b5cd13ab2e77
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
  ],
}
