import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { xsrfInterceptor } from './core/interceptors/xsrf/xsrf-interceptor'; 
import { authInterceptor } from './core/interceptors/auth/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(), 
      withInterceptors([ 
        xsrfInterceptor, 
        authInterceptor  
      ]) 
    )
  ]
};
