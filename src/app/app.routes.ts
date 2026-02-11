import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'session/:id',
    loadComponent: () =>
      import('./session/pages/session-page/session-page.component').then(m => m.SessionPageComponent)
  },
  { path: '', redirectTo: 'session/1', pathMatch: 'full' }
];
