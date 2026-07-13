import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
 
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'Login — ELITE Dashboard',
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import('./features/solicitudes/solicitudes.component').then(m => m.SolicitudesComponent),
    canActivate: [authGuard],
    title: 'Solicitudes — ELITE Dashboard',
  },
  {
    path: 'solicitudes/:id',
    loadComponent: () =>
      import('./features/detalle/detalle.component').then(m => m.DetalleComponent),
    canActivate: [authGuard],
    title: 'Detalle — ELITE Dashboard',
  },
  { path: '',      redirectTo: 'solicitudes', pathMatch: 'full' },
  { path: '**',   redirectTo: 'solicitudes' },
];