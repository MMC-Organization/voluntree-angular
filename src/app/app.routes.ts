import { Routes } from '@angular/router'
import { authGuard } from './core/auth/auth-guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./feature/login/login').then((m) => m.Login),
  },
  {
    path: 'choice',
    loadComponent: () => import('./feature/choice/choice').then((m) => m.Choice),
  },
  {
    path: 'ong',
    loadComponent: () => import('./feature/ong/ong').then((m) => m.Ong),
  },

  {
    path: 'voluntario',
    loadComponent: () => import('./feature/voluntario/voluntario').then((m) => m.Voluntario),
  },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./feature/login/login').then((m) => m.Login),
      },
    ],
  },
]
