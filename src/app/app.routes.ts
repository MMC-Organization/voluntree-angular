import { Routes } from '@angular/router'
import { authGuard } from './core/guards/auth-guard/auth-guard'
import { homeRedirectGuard } from './core/guards/home-redirect/home-redirect-guard'
import { nonAuthenticatedGuard } from './core/guards/non-authenticated/non-authenticated-guard'
import { organizationGuard } from './core/guards/organization/organization-guard'
import { volunteerGuard } from './core/guards/volunteer/volunteer-guard'

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [nonAuthenticatedGuard],
    loadComponent: () => import('./feature/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    canActivate: [nonAuthenticatedGuard],
    loadComponent: () => import('./feature/auth/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'signup/organization',
    canActivate: [nonAuthenticatedGuard],
    loadComponent: () => import('./feature/auth/signup/ong/ong').then((m) => m.Ong),
  },
  {
    path: 'signup/volunteer',
    canActivate: [nonAuthenticatedGuard],
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
        canActivate: [homeRedirectGuard],
        loadComponent: () =>
          import('./shared/components/redirect/redirect').then((m) => m.Redirect),
      },
      {
        path: 'volunteer',
        canActivate: [volunteerGuard],
        loadComponent: () =>
          import('./shared/layouts/volunteer-layout/volunteer-layout').then(
            (m) => m.VolunteerLayout
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./feature/activity/search/search').then((m) => m.SearchComponent),
          },
          {
            path: 'profile',
            loadComponent: () => import('./feature/volunteer/profile/profile').then(m => m.VolProfile)
          },
          {
  path: 'activities',
  loadComponent: () =>
    import('./feature/volunteer/subscriptions/subscriptions').then((m) => m.VolunteerSubscriptions),
}
        ],
      },
      {
        path: 'ong',
        canActivate: [organizationGuard],
        loadComponent: () =>
          import('./shared/layouts/ong-layout/ong-layout').then((m) => m.OngLayout),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./feature/ong/dashboard/dashboard').then((m) => m.OngDashboard),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./feature/ong/profile/profile').then((m) => m.OngProfile),
          },
          {
            path: 'activity/create',
            loadComponent: () =>
              import('./feature/activity/create/create').then((m) => m.Create),
          },
          {
            path: 'activity/edit/:id',
            loadComponent: () =>
              import('./feature/activity/edit/edit').then((m) => m.EditActivityComponent),
          },
          {
            path: 'activity/:id',
            loadComponent: () =>
              import('./feature/activity/detail/detail').then((m) => m.ActivityDetailComponent),
          },
        ],
      },
    ],
  },
]
