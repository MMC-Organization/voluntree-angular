import { Routes } from '@angular/router'
import { authGuard } from './core/auth/auth-guard'
import { SearchComponent } from './feature/search/search';

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
    path: 'ong',
    loadComponent: () => import('./feature/ong/ong').then((m) => m.Ong),
  },

  {
    path: 'voluntario',
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
        loadComponent: () => import('./feature/login/login').then((m) => m.Login),
      },
      {
        path: 'busca',
        component: SearchComponent
      }
    ],
  },
]