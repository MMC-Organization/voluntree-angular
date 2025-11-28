import { Routes } from '@angular/router'
import { authGuard } from './core/auth/auth-guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./feature/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./feature/choice/choice').then((m) => m.Choice),
  },
  {
    path: 'signup/organization',
    loadComponent: () => import('./feature/ong/ong').then((m) => m.Ong),
  },

  {
    path: 'signup/volunteer',
    loadComponent: () => import('./feature/volunteer/volunteer').then((m) => m.Volunteer),
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
        loadComponent: () => import('./feature/search/search').then((m) => m.SearchComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./feature/create-activity/create-activity').then((m) => m.CreateActivity),
      },
      {
        path: 'search',
        loadComponent: () => import('./feature/search/search').then((m) => m.SearchComponent),
      },
    ],
  },
]
