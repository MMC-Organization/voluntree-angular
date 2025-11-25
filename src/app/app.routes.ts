import { Routes } from '@angular/router';

import { SearchComponent } from './feature/search/search.component';
//import { authGuard } from './core/auth/auth-guard'; 

export const routes: Routes = [
  
  {
    path: 'busca',
    component: SearchComponent
  },
  {
    path: '', 
    redirectTo: 'busca', 
    pathMatch: 'full'
  }
];