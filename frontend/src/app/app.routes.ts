import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth').then(m => m.AuthComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats').then(m => m.StatsComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
