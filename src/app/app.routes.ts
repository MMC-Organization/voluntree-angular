import { Routes } from '@angular/router'
import { authGuard } from './core/services/auth/auth-guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./feature/auth/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'signup/organization',
    loadComponent: () => import('./feature/auth/signup/ong/ong').then((m) => m.Ong),
  },

  {
    path: 'signup/volunteer',
    loadComponent: () =>
      import('./feature/auth/signup/volunteer/volunteer').then((m) => m.Volunteer),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./feature/activity/search/search').then((m) => m.SearchComponent),
      },
      {
        path: 'activity/create',
        loadComponent: () =>
          import('./feature/activity/create/create').then((m) => m.Create),
      },
    ],
  },
]
